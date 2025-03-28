import { ImageAdjustments } from "@shared/schema";
import { Sliders } from "lucide-react";
import SliderWithValue from "@/components/ui/slider-with-value";

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
  const adjustmentOptions: AdjustmentOption[] = [
    { key: "brightness", label: "Brightness", min: -100, max: 100, step: 1 },
    { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1 },
    { key: "saturation", label: "Saturation", min: -100, max: 100, step: 1 },
    { key: "hue", label: "Hue", min: -180, max: 180, step: 1 },
    { key: "opacity", label: "Opacity", min: 0, max: 100, step: 1 },
  ];

  const handleSliderChange = (key: keyof ImageAdjustments, value: number) => {
    onAdjustmentChange({
      ...adjustments,
      [key]: value,
    });
  };

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
