import { forwardRef, useEffect, useRef, useState } from "react";
import { Layer } from "@shared/schema";

interface CanvasProps {
  className?: string;
  layers?: Layer[];
  width?: number;
  height?: number;
  onCanvasClick?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className = "", layers = [], width = 800, height = 600, onCanvasClick, onDrag }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const lastDragTimeRef = useRef(0);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && (onCanvasClick || onDrag)) {
        const handleMouseDown = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          // Find the active layer
          const activeLayer = layers.find(layer => layer.visible);
          if (!activeLayer) return;
          
          // Calculate the offset between mouse position and layer position
          dragOffsetRef.current = {
            x: mouseX - activeLayer.position.x,
            y: mouseY - activeLayer.position.y
          };
          
          dragStartRef.current = { x: mouseX, y: mouseY };
          setIsDragging(true);
          
          // Change cursor to indicate dragging
          canvas.style.cursor = 'grabbing';
          
          // Prevent text selection during drag
          e.preventDefault();
        };
        
        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging || !onDrag) return;
          
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          // Calculate new position considering the initial offset
          const newX = mouseX - dragOffsetRef.current.x;
          const newY = mouseY - dragOffsetRef.current.y;
          
          // Update position in real-time
          onDrag(newX, newY);
        };
        
        const handleMouseUp = (e: MouseEvent) => {
          if (!isDragging) return;
          
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          // Calculate final position considering the offset
          const finalX = mouseX - dragOffsetRef.current.x;
          const finalY = mouseY - dragOffsetRef.current.y;
          
          // Call the click handler on mouse up to finalize the position
          if (onCanvasClick) {
            onCanvasClick(finalX, finalY);
          }
          
          // Store the time of the last drag
          lastDragTimeRef.current = Date.now();
          
          // Reset dragging state
          setIsDragging(false);
          canvas.style.cursor = 'grab';
        };
        
        const handleClick = (e: MouseEvent) => {
          // Don't trigger click events if we were dragging or just finished dragging
          if (isDragging || (Date.now() - lastDragTimeRef.current < 100)) return;
          
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          onCanvasClick?.(x, y);
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
    }, [onCanvasClick, onDrag, isDragging, layers]);
    
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
        className={className}
        width={width}
        height={height}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none', // Prevent scrolling on touch devices
        }}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
