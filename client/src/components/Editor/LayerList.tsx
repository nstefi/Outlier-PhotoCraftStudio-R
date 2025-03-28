import React from 'react';
import { Layer, BlendMode } from '@shared/schema';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { blendModeTypes } from '@shared/schema';

interface LayerListProps {
  layers: Layer[];
  activeLayerId: string | null;
  onLayerSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
  onBlendModeChange: (id: string, mode: BlendMode) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onAddLayer: () => void;
}

export default function LayerList({
  layers,
  activeLayerId,
  onLayerSelect,
  onToggleVisibility,
  onRemoveLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onBlendModeChange,
  onOpacityChange,
  onAddLayer
}: LayerListProps) {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg flex items-center gap-1">
          <Layers className="h-5 w-5" /> Layers
        </h3>
        <Button 
          onClick={onAddLayer} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Layer</span>
        </Button>
      </div>
      
      <ScrollArea className="h-[250px] rounded-md border">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <Layers className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm text-center">No layers yet. Add a layer to get started.</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {layers.map((layer, index) => (
              <div 
                key={layer.id}
                className={`p-2 rounded-md border transition-colors ${
                  activeLayerId === layer.id ? 'bg-primary/10 border-primary/30' : 'hover:bg-gray-100 border-gray-200'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(layer.id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {layer.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <span className={`font-medium text-sm ${!layer.visible ? 'text-gray-400' : ''}`}>
                      {layer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayerUp(layer.id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={index === layers.length - 1}
                      title="Move up"
                    >
                      <ChevronUp className={`h-4 w-4 ${index === layers.length - 1 ? 'opacity-30' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayerDown(layer.id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={index === 0}
                      title="Move down"
                    >
                      <ChevronDown className={`h-4 w-4 ${index === 0 ? 'opacity-30' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this layer?')) {
                          onRemoveLayer(layer.id);
                        }
                      }}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete layer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {activeLayerId === layer.id && (
                  <div className="mt-2 space-y-2 text-sm">
                    <div>
                      <div className="mb-1 text-xs text-gray-500">Blend Mode</div>
                      <Select 
                        value={layer.blendMode}
                        onValueChange={(value) => onBlendModeChange(layer.id, value as BlendMode)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select blend mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {blendModeTypes.map((mode) => (
                            <SelectItem key={mode} value={mode} className="text-xs">
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Opacity</span>
                        <span className="text-xs text-gray-500">{Math.round(layer.opacity)}%</span>
                      </div>
                      <Slider 
                        value={[layer.opacity]} 
                        min={0} 
                        max={100} 
                        step={1}
                        className="py-0"
                        onValueChange={(value) => onOpacityChange(layer.id, value[0])}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}