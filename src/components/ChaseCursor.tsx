import { useEffect, useRef } from "react";
import "./ChaseCursor.css";

type ChaseCursorProps = {
    x: number;
    y: number;
};

export default function ChaseCursor({ x, y }: ChaseCursorProps) {
    const cursorRef = useRef<HTMLDivElement>(null);

    const currentX = useRef(x);
    const currentY = useRef(y);

    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            currentX.current += (x - currentX.current) * 0.18;
            currentY.current += (y - currentY.current) * 0.18;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(
          ${currentX.current}px,
          ${currentY.current}px,
          0
        )`;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [x, y]);

    return <div ref={cursorRef} className="chase-cursor" />;
}