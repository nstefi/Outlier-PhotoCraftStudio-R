import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  canDownload: boolean;
  onDownload: () => void;
}

export default function Header({ canDownload, onDownload }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image className="text-primary h-6 w-6" />
          <h1 className="text-xl font-semibold text-gray-800">PhotoCraftStudio</h1>
        </div>
        <div>
          <Button 
            onClick={onDownload} 
            disabled={!canDownload}
            className="flex items-center space-x-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
