import { useEffect, useRef, useState } from "react";
import "./Blob.css";

type Pointer = {
    x: number;
    y: number;
    type: "mouse" | "touch";
};

type Position = {
    x: number;
    y: number;
};

type BlobProps = {
    pointer: Pointer;
};

const BLOB_SIZE = 72;
const PADDING = 20;

const SAFE_DISTANCE = 180;
const MOUSE_ESCAPE_DISTANCE = 220;

const TOUCH_LEAD_DISTANCE = 120;
const TOUCH_ESCAPE_DISTANCE = 180;

export default function Blob({ pointer }: BlobProps) {
    const [position, setPosition] = useState<Position>({
        x: window.innerWidth / 2 - BLOB_SIZE / 2,
        y: window.innerHeight / 2 - BLOB_SIZE / 2,
    });

    const positionRef = useRef(position);

    const previousPointerRef = useRef({
        x: pointer.x,
        y: pointer.y,
    });

    positionRef.current = position;

    useEffect(() => {
        const current = positionRef.current;

        const blobCenterX = current.x + BLOB_SIZE / 2;
        const blobCenterY = current.y + BLOB_SIZE / 2;

        const deltaX = blobCenterX - pointer.x;
        const deltaY = blobCenterY - pointer.y;

        const distance = Math.hypot(deltaX, deltaY);

        /*
         * DESKTOP
         *
         * The blob simply runs away from the cursor.
         */
        if (pointer.type === "mouse") {
            if (distance >= SAFE_DISTANCE || distance === 0) {
                return;
            }

            const angle = Math.atan2(deltaY, deltaX);

            moveTo(
                current.x + Math.cos(angle) * MOUSE_ESCAPE_DISTANCE,
                current.y + Math.sin(angle) * MOUSE_ESCAPE_DISTANCE
            );

            return;
        }

        /*
         * MOBILE
         *
         * The blob always tries to stay away from the finger.
         */
        const previous = previousPointerRef.current;

        const movementX = pointer.x - previous.x;
        const movementY = pointer.y - previous.y;

        const movementDistance = Math.hypot(movementX, movementY);

        previousPointerRef.current = {
            x: pointer.x,
            y: pointer.y,
        };

        /*
         * Finger is moving:
         *
         * Place the blob ahead of the finger's
         * movement direction.
         */
        if (movementDistance > 2) {
            const directionX = movementX / movementDistance;
            const directionY = movementY / movementDistance;

            moveTo(
                pointer.x +
                directionX * TOUCH_LEAD_DISTANCE -
                BLOB_SIZE / 2,
                pointer.y +
                directionY * TOUCH_LEAD_DISTANCE -
                BLOB_SIZE / 2
            );

            return;
        }

        /*
         * Finger is stationary:
         *
         * Move the blob directly away from
         * wherever the finger touched.
         */
        if (distance > 0) {
            const angle = Math.atan2(deltaY, deltaX);

            moveTo(
                current.x + Math.cos(angle) * TOUCH_ESCAPE_DISTANCE,
                current.y + Math.sin(angle) * TOUCH_ESCAPE_DISTANCE
            );
        }

        function moveTo(x: number, y: number) {
            const nextX = Math.max(
                PADDING,
                Math.min(window.innerWidth - BLOB_SIZE - PADDING, x)
            );

            const nextY = Math.max(
                PADDING,
                Math.min(window.innerHeight - BLOB_SIZE - PADDING, y)
            );

            setPosition({
                x: nextX,
                y: nextY,
            });
        }
    }, [pointer]);

    const blobCenterX = position.x + BLOB_SIZE / 2;
    const blobCenterY = position.y + BLOB_SIZE / 2;

    const eyeAngle = Math.atan2(
        pointer.y - blobCenterY,
        pointer.x - blobCenterX
    );

    const pupilOffsetX = Math.cos(eyeAngle) * 3;
    const pupilOffsetY = Math.sin(eyeAngle) * 3;

    return (
        <div
            className="blob"
            style={{
                left: position.x,
                top: position.y,
            }}
            aria-label="A suspicious blob"
        >
            <div className="blob__body">
                <div className="blob__eye">
                    <div
                        className="blob__pupil"
                        style={{
                            transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                        }}
                    />
                </div>

                <div className="blob__eye">
                    <div
                        className="blob__pupil"
                        style={{
                            transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}