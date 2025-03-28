import { useRef, useState, useCallback, useEffect } from "react";
import { ImageFilter, ImageInfo, ImageAdjustments, Layer, BlendMode } from "@shared/schema";
import { applyFilter, applyAdjustments, applyBlendMode } from "@/lib/canvas-filters";
import { useLayers } from "./use-layers";

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
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [canDownload, setCanDownload] = useState(false);
  
  // Current filter and adjustments for backward compatibility
  const [currentFilter, setCurrentFilter] = useState<ImageFilter>("normal");
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  
  // Using the layer management system
  const {
    layers,
    activeLayerId,
    activeLayer,
    setActiveLayerId,
    addLayer,
    removeLayer,
    updateLayer,
    toggleLayerVisibility,
    setLayerBlendMode,
    setLayerFilter,
    setLayerAdjustments,
    moveLayerUp,
    moveLayerDown,
    setLayerOpacity,
    setLayerPosition,
    setLayerScale,
  } = useLayers();

  // Draw all layers on the canvas
  const drawLayersOnCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If we have no layers but have the original image, fall back to the legacy behavior
    if (layers.length === 0 && originalImage) {
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
      
      // Apply filter
      if (currentFilter !== "normal") {
        applyFilter(ctx, canvas.width, canvas.height, currentFilter);
      }
      
      // Apply adjustments
      applyAdjustments(ctx, canvas.width, canvas.height, adjustments);
      return;
    }
    
    // Skip if no layers
    if (layers.length === 0) return;
    
    // Process layers from bottom to top (first to last)
    // Create a temporary canvas for each layer
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    
    // Start with a blank canvas
    let compositedImageData = ctx.createImageData(canvas.width, canvas.height);
    
    // Process each layer
    for (const layer of layers) {
      if (!layer.visible || !layer.image) continue;
      
      // Clear temp canvas
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw this layer's image onto the temp canvas
      tempCtx.save();
      
      // Apply transformations
      tempCtx.translate(layer.position.x, layer.position.y);
      tempCtx.scale(layer.scale, layer.scale);
      
      // Draw the image centered
      const imgWidth = layer.image.width * layer.scale;
      const imgHeight = layer.image.height * layer.scale;
      tempCtx.drawImage(
        layer.image, 
        -imgWidth / 2, 
        -imgHeight / 2, 
        imgWidth, 
        imgHeight
      );
      
      tempCtx.restore();
      
      // Apply filter to this layer
      if (layer.filter !== "normal") {
        applyFilter(tempCtx, tempCanvas.width, tempCanvas.height, layer.filter);
      }
      
      // Apply adjustments to this layer
      applyAdjustments(tempCtx, tempCanvas.width, tempCanvas.height, {
        ...layer.adjustments,
        opacity: layer.opacity // Use the layer opacity
      });
      
      // Get the image data from this layer
      const layerImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      
      // For the first visible layer, just use it as is
      if (compositedImageData.data.every(val => val === 0)) {
        compositedImageData = layerImageData;
      } else {
        // Apply blend mode between the composited result and this layer
        compositedImageData = applyBlendMode(
          ctx, 
          compositedImageData, 
          layerImageData, 
          layer.blendMode
        );
      }
    }
    
    // Draw the final composited result to the main canvas
    ctx.putImageData(compositedImageData, 0, 0);
    
  }, [
    layers, 
    canvasRef, 
    originalImage, 
    currentFilter, 
    adjustments
  ]);

  // Apply changes when dependencies change
  useEffect(() => {
    drawLayersOnCanvas();
  }, [
    layers, 
    originalImage, 
    currentFilter, 
    adjustments, 
    drawLayersOnCanvas
  ]);

  // Sync the active layer filter and adjustments with the legacy state
  useEffect(() => {
    if (activeLayer) {
      setCurrentFilter(activeLayer.filter);
      setAdjustments(activeLayer.adjustments);
    }
  }, [activeLayer]);

  // Update the active layer when filter or adjustments change
  useEffect(() => {
    if (activeLayerId && activeLayer) {
      if (activeLayer.filter !== currentFilter) {
        setLayerFilter(activeLayerId, currentFilter);
      }
      if (JSON.stringify(activeLayer.adjustments) !== JSON.stringify(adjustments)) {
        setLayerAdjustments(activeLayerId, adjustments);
      }
    }
  }, [
    activeLayerId, 
    activeLayer, 
    currentFilter, 
    adjustments, 
    setLayerFilter, 
    setLayerAdjustments
  ]);

  const handleImageLoad = useCallback(async (file: File, info: ImageInfo) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Set image info dimensions
        info.width = img.width;
        info.height = img.height;
        
        // Calculate canvas size
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
        
        // Set canvas dimensions
        setCanvasWidth(width);
        setCanvasHeight(height);
        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
        
        // Store the original image
        setOriginalImage(img);
        
        // Add as a new layer
        const layerId = addLayer(img, file.name.split('.')[0] || 'Layer 1');
        setActiveLayerId(layerId);
        
        setCanDownload(true);
        resolve();
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [addLayer, setActiveLayerId]);

  const addNewLayer = useCallback(async (file: File) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Add as a new layer
        const layerId = addLayer(img, file.name.split('.')[0] || `Layer ${layers.length + 1}`);
        setActiveLayerId(layerId);
        resolve();
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [addLayer, setActiveLayerId, layers.length]);

  const resetEdits = useCallback(() => {
    if (activeLayerId) {
      const resetAdjustments = {...DEFAULT_ADJUSTMENTS};
      setLayerFilter(activeLayerId, "normal");
      setLayerAdjustments(activeLayerId, resetAdjustments);
      setCurrentFilter("normal");
      setAdjustments(resetAdjustments);
    } else {
      // Legacy behavior
      setCurrentFilter("normal");
      setAdjustments(DEFAULT_ADJUSTMENTS);
    }
  }, [activeLayerId, setLayerFilter, setLayerAdjustments]);

  const downloadImage = useCallback(() => {
    if (!canvasRef.current) return;
    
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvasRef.current.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Set a layer's position when the canvas is clicked
  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (activeLayerId) {
      setLayerPosition(activeLayerId, x, y);
    }
  }, [activeLayerId, setLayerPosition]);

  return {
    canvasRef,
    canvasWidth,
    canvasHeight,
    originalImage,
    currentFilter,
    adjustments,
    canDownload,
    // Legacy API
    setCurrentFilter,
    setAdjustments,
    handleImageLoad,
    resetEdits,
    downloadImage,
    // Layer API
    layers,
    activeLayerId,
    activeLayer,
    setActiveLayerId,
    addLayer: addNewLayer,
    removeLayer,
    toggleLayerVisibility,
    setLayerBlendMode,
    setLayerFilter,
    setLayerAdjustments,
    moveLayerUp,
    moveLayerDown,
    setLayerOpacity,
    handleCanvasClick,
  };
}
