import { useCallback, useState } from "react";
import Blob from "./components/Blob";
import ChaseCursor from "./components/ChaseCursor";
import "./App.css";

type Pointer = {
  x: number;
  y: number;
  type: "mouse" | "touch";
};

export default function App() {
  const [pointer, setPointer] = useState<Pointer>({
    x: -1000,
    y: -1000,
    type: "mouse",
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      setPointer({
        x: event.clientX,
        y: event.clientY,
        type: event.pointerType === "touch" ? "touch" : "mouse",
      });
    },
    []
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      setPointer({
        x: event.clientX,
        y: event.clientY,
        type: event.pointerType === "touch" ? "touch" : "mouse",
      });
    },
    []
  );

  return (
    <main
      className="playground"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <div className="background-text" aria-hidden="true">
        <span>DON'T TOUCH</span>
        <span>THE BLOB</span>
      </div>

      <Blob pointer={pointer} />

      <ChaseCursor x={pointer.x} y={pointer.y} />
    </main>
  );
}