import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SliderWithValueProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function SliderWithValue({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderWithValueProps) {
  return (
    <div className="adjustment-control">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={`${label}Range`} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <Slider
        id={`${label}Range`}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="slider w-full"
      />
    </div>
  );
}
