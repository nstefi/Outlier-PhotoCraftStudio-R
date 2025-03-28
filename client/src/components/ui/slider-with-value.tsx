import * as React from "react";
import { useState, useEffect } from "react";
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
  // Use a local state to prevent shaking during drag
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop value changes (except during dragging)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Handle slider change with debounce
  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue);
    onChange(newValue);
  };
  
  return (
    <div className="adjustment-control">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={`${label}Range`} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <span className="text-xs text-gray-500">{Math.round(localValue)}</span>
      </div>
      <Slider
        id={`${label}Range`}
        min={min}
        max={max}
        step={step}
        value={[localValue]}
        onValueChange={handleValueChange}
        className="slider w-full"
      />
    </div>
  );
}
