import { forwardRef, useEffect, useRef, useState } from "react";
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
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPositionRef = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
      // Set up canvas interaction handlers for drag and drop
      const canvas = canvasRef.current;
      if (canvas && onCanvasClick) {
        const handleMouseDown = (e: MouseEvent) => {
          setIsDragging(true);
          const rect = canvas.getBoundingClientRect();
          dragStartPositionRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
          
          // Change cursor to indicate dragging
          canvas.style.cursor = 'grabbing';
          
          // Prevent text selection during drag
          e.preventDefault();
        };
        
        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging) return;
          
          // We don't update position during drag to prevent excessive rerenders
          // Just show a visual indicator that dragging is happening
          // Final position will be set on mouse up
        };
        
        const handleMouseUp = (e: MouseEvent) => {
          if (!isDragging) return;
          
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Only call the position change handler on mouse up
          onCanvasClick(x, y);
          
          // Reset dragging state
          setIsDragging(false);
          canvas.style.cursor = 'grab';
        };
        
        const handleClick = (e: MouseEvent) => {
          // Don't trigger click events if we were dragging
          if (isDragging) return;
          
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          onCanvasClick(x, y);
        };
        
        // Set initial cursor
        canvas.style.cursor = 'grab';
        
        // Add event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);
        
        return () => {
          // Clean up event listeners
          canvas.removeEventListener('mousedown', handleMouseDown);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          canvas.removeEventListener('click', handleClick);
        };
      }
    }, [onCanvasClick, isDragging]);
    
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
        className={`max-w-full max-h-[70vh] object-contain ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
