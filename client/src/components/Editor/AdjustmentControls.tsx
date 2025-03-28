import { ImageAdjustments } from "@shared/schema";
import { Sliders } from "lucide-react";
import SliderWithValue from "@/components/ui/slider-with-value";
import { useCallback, useMemo } from "react";

interface AdjustmentControlsProps {
  adjustments: ImageAdjustments;
  onAdjustmentChange: (adjustments: ImageAdjustments) => void;
}

interface AdjustmentOption {
  key: keyof ImageAdjustments;
  label: string;
  min: number;
  max: number;
  step: number;
}

export default function AdjustmentControls({
  adjustments,
  onAdjustmentChange,
}: AdjustmentControlsProps) {
  // Define options as memoized value to prevent recreation on every render
  const adjustmentOptions = useMemo<AdjustmentOption[]>(() => [
    { key: "brightness", label: "Brightness", min: -100, max: 100, step: 1 },
    { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1 },
    { key: "saturation", label: "Saturation", min: -100, max: 100, step: 1 },
    { key: "hue", label: "Hue", min: -180, max: 180, step: 1 },
    { key: "opacity", label: "Opacity", min: 0, max: 100, step: 1 },
  ], []);

  // Use callback to prevent recreating this function on every render
  const handleSliderChange = useCallback((key: keyof ImageAdjustments, value: number) => {
    // Make sure we're using integer values to avoid floating point issues
    const roundedValue = Math.round(value);
    onAdjustmentChange({
      ...adjustments,
      [key]: roundedValue,
    });
  }, [adjustments, onAdjustmentChange]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <Sliders className="h-5 w-5 mr-2 text-primary" />
        Adjustments
      </h3>
      <div className="space-y-4">
        {adjustmentOptions.map((option) => (
          <SliderWithValue
            key={option.key}
            label={option.label}
            value={adjustments[option.key]}
            min={option.min}
            max={option.max}
            step={option.step}
            onChange={(value) => handleSliderChange(option.key, value)}
          />
        ))}
      </div>
    </div>
  );
}
