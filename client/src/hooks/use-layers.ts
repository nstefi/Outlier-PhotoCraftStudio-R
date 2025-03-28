import { useState, useCallback } from 'react';
import { Layer, BlendMode, ImageFilter, ImageAdjustments } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  opacity: 100,
};

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
  // Computed active layer
  const activeLayer = layers.find((layer) => layer.id === activeLayerId) || null;
  
  // Add a new layer
  const addLayer = useCallback((image: HTMLImageElement, name: string = `Layer ${layers.length + 1}`) => {
    const newLayer: Layer = {
      id: uuidv4(),
      name,
      visible: true,
      opacity: 100,
      image,
      filter: 'normal',
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      blendMode: 'normal',
      position: {
        x: image.width / 2,
        y: image.height / 2,
      },
      scale: 1,
    };
    
    setLayers((prevLayers) => [...prevLayers, newLayer]);
    return newLayer.id;
  }, [layers.length]);
  
  // Update an existing layer
  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  }, []);
  
  // Remove a layer
  const removeLayer = useCallback((layerId: string) => {
    setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== layerId));
    
    // If we're removing the active layer, set the active layer to null
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);
  
  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);
  
  // Set layer blend mode
  const setLayerBlendMode = useCallback((layerId: string, blendMode: BlendMode) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, blendMode } : layer
      )
    );
  }, []);
  
  // Set layer filter
  const setLayerFilter = useCallback((layerId: string, filter: ImageFilter) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, filter } : layer
      )
    );
  }, []);
  
  // Set layer adjustments
  const setLayerAdjustments = useCallback((layerId: string, adjustments: ImageAdjustments) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, adjustments } : layer
      )
    );
  }, []);
  
  // Set layer opacity
  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  }, []);
  
  // Set layer position
  const setLayerPosition = useCallback((layerId: string, x: number, y: number) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { 
          ...layer, 
          position: { x, y } 
        } : layer
      )
    );
  }, []);
  
  // Set layer scale
  const setLayerScale = useCallback((layerId: string, scale: number) => {
    setLayers((prevLayers) => 
      prevLayers.map((layer) => 
        layer.id === layerId ? { ...layer, scale } : layer
      )
    );
  }, []);
  
  // Move layer up in the stack (later in the array = higher in the stack)
  const moveLayerUp = useCallback((layerId: string) => {
    setLayers((prevLayers) => {
      const index = prevLayers.findIndex((layer) => layer.id === layerId);
      if (index === -1 || index === prevLayers.length - 1) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      
      return newLayers;
    });
  }, []);
  
  // Move layer down in the stack (earlier in the array = lower in the stack)
  const moveLayerDown = useCallback((layerId: string) => {
    setLayers((prevLayers) => {
      const index = prevLayers.findIndex((layer) => layer.id === layerId);
      if (index <= 0) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      
      return newLayers;
    });
  }, []);
  
  return {
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
    setLayerOpacity,
    setLayerPosition,
    setLayerScale,
    moveLayerUp,
    moveLayerDown,
  };
}