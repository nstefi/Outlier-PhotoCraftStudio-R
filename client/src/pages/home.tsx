import { useState, useRef } from "react";
import { ImageInfo, ImageAdjustments, ImageFilter, BlendMode } from "@shared/schema";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ImageUploader from "@/components/Editor/ImageUploader";
import Canvas from "@/components/Editor/Canvas";
import FilterControls from "@/components/Editor/FilterControls";
import AdjustmentControls from "@/components/Editor/AdjustmentControls";
import LayerList from "@/components/Editor/LayerList";
import BlendModeControls from "@/components/Editor/BlendModeControls";
import LoadingOverlay from "@/components/Layout/LoadingOverlay";
import { useCanvasEditor } from "@/hooks/use-canvas-editor";
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  // Step 1: Define all state hooks first to maintain consistent order
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  
  // Step 2: Define all refs after state hooks
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Step 3: Define custom hooks after refs
  const {
    canvasRef,
    canvasWidth,
    canvasHeight,
    originalImage,
    currentFilter,
    adjustments,
    canDownload,
    setCurrentFilter,
    setAdjustments,
    handleImageLoad,
    resetEdits,
    downloadImage,
    // Layer API
    layers,
    activeLayerId,
    activeLayer,
    setActiveLayerId,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    setLayerBlendMode,
    setLayerFilter,
    setLayerAdjustments,
    moveLayerUp,
    moveLayerDown,
    setLayerOpacity,
    handleCanvasClick,
  } = useCanvasEditor();

  // Step 4: Define handler functions after all hooks
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    setImageFile(file);
    setShowLoading(true);
    
    // Create the image info
    const info: ImageInfo = {
      filename: file.name,
      size: Math.round(file.size / 1024), // Size in KB
      width: 0, // Will be set after image loads
      height: 0,
    };
    
    setImageInfo(info);
    await handleImageLoad(file, info);
    setShowLoading(false);
  };

  const handleAddNewLayer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNewLayerFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setShowLoading(true);
    await addLayer(file);
    setShowLoading(false);
    
    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetEdits = () => {
    resetEdits();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onDownload={downloadImage} canDownload={canDownload} />
      
      <main className="flex-grow flex flex-col lg:flex-row">
        <div className="flex-grow p-4">
          {!originalImage ? (
            <ImageUploader onFileSelect={handleFileSelect} />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetEdits}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset Effects</span>
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-center bg-gray-100 rounded-md min-h-[300px]">
                  <Canvas 
                    ref={canvasRef} 
                    width={canvasWidth} 
                    height={canvasHeight}
                    layers={layers}
                    onCanvasClick={handleCanvasClick}
                  />
                </div>
                {imageInfo && (
                  <div className="mt-2 text-sm text-gray-500 flex justify-between">
                    <span>Dimensions: {imageInfo.width} x {imageInfo.height}</span>
                    <span>Size: {imageInfo.size} KB</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {originalImage && (
          <div className="lg:w-80 bg-white lg:shadow-md p-4">
            <div className="sticky top-4">
              <Tabs defaultValue="layers">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="layers" className="flex-1 flex items-center justify-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Layers</span>
                  </TabsTrigger>
                  <TabsTrigger value="adjustments" className="flex-1">
                    Adjustments
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="layers" className="space-y-4">
                  <LayerList 
                    layers={layers}
                    activeLayerId={activeLayerId}
                    onLayerSelect={setActiveLayerId}
                    onToggleVisibility={toggleLayerVisibility}
                    onRemoveLayer={removeLayer}
                    onMoveLayerUp={moveLayerUp}
                    onMoveLayerDown={moveLayerDown}
                    onBlendModeChange={setLayerBlendMode}
                    onOpacityChange={setLayerOpacity}
                    onAddLayer={handleAddNewLayer}
                  />
                  
                  {/* Hidden file input for adding new layers */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleNewLayerFileSelect}
                  />
                </TabsContent>
                
                <TabsContent value="adjustments" className="space-y-4">
                  {activeLayer && (
                    <>
                      <FilterControls 
                        currentFilter={currentFilter} 
                        onFilterChange={setCurrentFilter} 
                      />
                      {activeLayer.blendMode !== 'normal' && (
                        <BlendModeControls 
                          currentBlendMode={activeLayer.blendMode}
                          onBlendModeChange={(mode) => setLayerBlendMode(activeLayerId!, mode)}
                        />
                      )}
                      <AdjustmentControls 
                        adjustments={adjustments} 
                        onAdjustmentChange={setAdjustments} 
                      />
                    </>
                  )}
                  
                  {!activeLayer && layers.length > 0 && (
                    <div className="p-4 text-center text-gray-500">
                      Select a layer to edit its properties
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      
      {showLoading && <LoadingOverlay />}
    </div>
  );
}
