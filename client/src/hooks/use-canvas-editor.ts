import { useRef, useState, useCallback, useEffect } from "react";
import { ImageFilter, ImageInfo, ImageAdjustments } from "@shared/schema";
import { applyFilter, applyAdjustments } from "@/lib/canvas-filters";

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  opacity: 100,
};

export function useCanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [currentFilter, setCurrentFilter] = useState<ImageFilter>("normal");
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [canDownload, setCanDownload] = useState(false);

  const drawImageOnCanvas = useCallback(() => {
    if (!canvasRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw original image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // Apply filter
    if (currentFilter !== "normal") {
      applyFilter(ctx, canvas.width, canvas.height, currentFilter);
    }
    
    // Apply adjustments
    applyAdjustments(ctx, canvas.width, canvas.height, adjustments);
    
  }, [originalImage, currentFilter, adjustments]);

  // Apply changes when dependencies change
  useEffect(() => {
    if (originalImage) {
      drawImageOnCanvas();
    }
  }, [originalImage, currentFilter, adjustments, drawImageOnCanvas]);

  const handleImageLoad = useCallback(async (file: File, info: ImageInfo) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Set image info dimensions
        info.width = img.width;
        info.height = img.height;
        
        // Set canvas size
        if (canvasRef.current) {
          const maxWidth = Math.min(window.innerWidth * 0.8, img.width);
          const maxHeight = Math.min(window.innerHeight * 0.6, img.height);
          
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }
          
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
        
        setOriginalImage(img);
        setCanDownload(true);
        resolve();
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const resetEdits = useCallback(() => {
    setCurrentFilter("normal");
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }, []);

  const downloadImage = useCallback(() => {
    if (!canvasRef.current) return;
    
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvasRef.current.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    canvasRef,
    originalImage,
    currentFilter,
    adjustments,
    canDownload,
    setCurrentFilter,
    setAdjustments,
    handleImageLoad,
    resetEdits,
    downloadImage,
  };
}
