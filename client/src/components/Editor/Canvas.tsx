import { forwardRef, useEffect, useRef } from "react";
import { Layer } from "@shared/schema";

interface CanvasProps {
  className?: string;
  layers?: Layer[];
  width?: number;
  height?: number;
  onCanvasClick?: (x: number, y: number) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className = "", layers = [], width = 800, height = 600, onCanvasClick }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    useEffect(() => {
      // Set up canvas click handler
      const canvas = canvasRef.current;
      if (canvas && onCanvasClick) {
        const handleClick = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          onCanvasClick(x, y);
        };
        
        canvas.addEventListener('click', handleClick);
        return () => {
          canvas.removeEventListener('click', handleClick);
        };
      }
    }, [onCanvasClick]);
    
    // Forward the ref
    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(canvasRef.current);
      } else if (ref) {
        ref.current = canvasRef.current;
      }
    }, [ref]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`max-w-full max-h-[70vh] object-contain ${className}`}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
