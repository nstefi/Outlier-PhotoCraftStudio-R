import { useState } from "react";
import { ImageInfo, ImageAdjustments, ImageFilter } from "@shared/schema";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ImageUploader from "@/components/Editor/ImageUploader";
import Canvas from "@/components/Editor/Canvas";
import FilterControls from "@/components/Editor/FilterControls";
import AdjustmentControls from "@/components/Editor/AdjustmentControls";
import LoadingOverlay from "@/components/Layout/LoadingOverlay";
import { useCanvasEditor } from "@/hooks/use-canvas-editor";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  
  const {
    canvasRef,
    originalImage,
    currentFilter,
    adjustments,
    canDownload,
    setCurrentFilter,
    setAdjustments,
    handleImageLoad,
    resetEdits,
    downloadImage,
  } = useCanvasEditor();

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetEdits}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow p-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-center bg-gray-100 rounded-md min-h-[300px]">
                  <Canvas ref={canvasRef} />
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
              <FilterControls 
                currentFilter={currentFilter} 
                onFilterChange={setCurrentFilter} 
              />
              <AdjustmentControls 
                adjustments={adjustments} 
                onAdjustmentChange={setAdjustments} 
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      
      {showLoading && <LoadingOverlay />}
    </div>
  );
}
