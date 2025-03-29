import { Layer } from "@shared/schema";
import { Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import SliderWithValue from "@/components/ui/slider-with-value";
import { Button } from "@/components/ui/button";

interface ResizeControlsProps {
  layer: Layer;
  onScaleChange: (scale: number) => void;
}

export default function ResizeControls({
  layer,
  onScaleChange,
}: ResizeControlsProps) {
  const [scalePercentage, setScalePercentage] = useState(layer.scale * 100);
  
  // Update local state when layer scale changes
  useEffect(() => {
    setScalePercentage(layer.scale * 100);
  }, [layer.scale]);

  const handleScaleChange = (value: number) => {
    setScalePercentage(value);
    onScaleChange(value / 100);
  };

  const handleReset = () => {
    handleScaleChange(100);
  };

  // Calculate current dimensions
  const currentWidth = layer.image ? Math.round(layer.image.width * layer.scale) : 0;
  const currentHeight = layer.image ? Math.round(layer.image.height * layer.scale) : 0;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <Maximize2 className="h-5 w-5 mr-2 text-primary" />
          Resize
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs"
        >
          Reset
        </Button>
      </h3>
      
      <div className="space-y-4">
        <SliderWithValue
          label="Scale"
          value={scalePercentage}
          min={10}
          max={200}
          step={1}
          onChange={handleScaleChange}
          valueLabel="%"
        />
        
        <div className="text-sm text-gray-500 space-y-1">
          <div>Current dimensions:</div>
          <div className="font-mono">
            {currentWidth} × {currentHeight} px
          </div>
        </div>
      </div>
    </div>
  );
} 