import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  
  // Track the last committed value to prevent unnecessary updates
  const lastCommittedValueRef = useRef(value);
  
  // Only update from props when not dragging and value has changed significantly
  useEffect(() => {
    if (!isDraggingRef.current && Math.abs(value - lastCommittedValueRef.current) >= 1) {
      setLocalValue(value);
      lastCommittedValueRef.current = value;
    }
  }, [value]);
  
  // Handle slider change without immediate parent update during dragging
  const handleValueChange = useCallback((values: number[]) => {
    const newValue = Math.round(values[0]); // Always round to prevent decimal shaking
    setLocalValue(newValue);
    
    // Only call parent onChange when we've stopped dragging
    if (!isDraggingRef.current) {
      onChange(newValue);
      lastCommittedValueRef.current = newValue;
    }
  }, [onChange]);
  
  const handleSliderDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);
  
  const handleSliderDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    // Now that dragging is done, send the final value to parent
    const roundedValue = Math.round(localValue);
    onChange(roundedValue);
    lastCommittedValueRef.current = roundedValue;
  }, [localValue, onChange]);
  
  // Format the displayed value to avoid decimals that cause visual shaking
  const displayValue = useMemo(() => Math.round(localValue), [localValue]);
  
  // Memoize slider value to prevent unnecessary rerenders
  const sliderValue = useMemo(() => [localValue], [localValue]);
  
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
        value={sliderValue}
        onValueChange={handleValueChange}
        onValueCommit={(value) => {
          handleSliderDragEnd();
        }}
        onPointerDown={handleSliderDragStart}
        className="slider w-full"
      />
    </div>
  );
}
