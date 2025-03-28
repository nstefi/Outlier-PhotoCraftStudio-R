import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
  
  // Use a ref to track if we're currently dragging
  const isDraggingRef = useRef(false);
  
  // Only update from props when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Handle slider change without immediate parent update during dragging
  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue);
    
    // Only call parent onChange when we've stopped dragging
    if (!isDraggingRef.current) {
      onChange(newValue);
    }
  };
  
  const handleSliderDragStart = () => {
    isDraggingRef.current = true;
  };
  
  const handleSliderDragEnd = () => {
    isDraggingRef.current = false;
    // Now that dragging is done, send the final value to parent
    onChange(localValue);
  };
  
  // Format the displayed value to avoid decimals that cause visual shaking
  const displayValue = Math.round(localValue);
  
  return (
    <div className="adjustment-control">
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={`${label}Range`} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <span className="text-xs text-gray-500">{displayValue}</span>
      </div>
      <Slider
        id={`${label}Range`}
        min={min}
        max={max}
        step={step}
        value={[localValue]}
        onValueChange={handleValueChange}
        onValueCommit={(value) => {
          handleSliderDragEnd();
          onChange(value[0]);
        }}
        onPointerDown={handleSliderDragStart}
        className="slider w-full"
      />
    </div>
  );
}
