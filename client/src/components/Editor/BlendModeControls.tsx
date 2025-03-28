import React from 'react';
import { BlendMode, blendModeTypes } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlendModeControlsProps {
  currentBlendMode: BlendMode;
  onBlendModeChange: (mode: BlendMode) => void;
}

export default function BlendModeControls({
  currentBlendMode,
  onBlendModeChange
}: BlendModeControlsProps) {
  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3">Blend Mode</h3>
      <Select
        value={currentBlendMode}
        onValueChange={(value) => onBlendModeChange(value as BlendMode)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select blend mode" />
        </SelectTrigger>
        <SelectContent>
          {blendModeTypes.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace(/-/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 mt-2">
        {getBlendModeDescription(currentBlendMode)}
      </p>
    </div>
  );
}

function getBlendModeDescription(mode: BlendMode): string {
  switch (mode) {
    case 'normal':
      return 'Standard blending with no special effects.';
    case 'multiply':
      return 'Multiplies base color by blend color, resulting in a darker image.';
    case 'screen':
      return 'Multiplies inverse colors, resulting in a lighter image.';
    case 'overlay':
      return 'Combines multiply and screen, preserving highlights and shadows.';
    case 'darken':
      return 'Selects the darker value between base and blend colors.';
    case 'lighten':
      return 'Selects the lighter value between base and blend colors.';
    case 'color-dodge':
      return 'Brightens the base color to reflect the blend color.';
    case 'color-burn':
      return 'Darkens the base color to reflect the blend color.';
    case 'hard-light':
      return 'Similar to overlay but with blend color as the reference.';
    case 'soft-light':
      return 'Softly lightens or darkens based on the blend color.';
    case 'difference':
      return 'Subtracts the darker from the lighter color.';
    case 'exclusion':
      return 'Similar to difference but with lower contrast.';
    case 'hue':
      return 'Uses the hue of the blend color with saturation and luminosity of the base.';
    case 'saturation':
      return 'Uses the saturation of the blend color with hue and luminosity of the base.';
    case 'color':
      return 'Uses the hue and saturation of the blend color with luminosity of the base.';
    case 'luminosity':
      return 'Uses the luminosity of the blend color with hue and saturation of the base.';
    default:
      return 'Blend mode that changes how layers interact with each other.';
  }
}