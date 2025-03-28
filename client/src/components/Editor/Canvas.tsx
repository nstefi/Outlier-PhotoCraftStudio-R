import { forwardRef } from "react";

interface CanvasProps {
  className?: string;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className = "" }, ref) => {
    return (
      <canvas
        ref={ref}
        className={`max-w-full max-h-[70vh] object-contain ${className}`}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
