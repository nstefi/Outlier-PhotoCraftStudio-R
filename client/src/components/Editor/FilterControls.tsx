import { ImageFilter, imageFilterTypes } from "@shared/schema";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterControlsProps {
  currentFilter: ImageFilter;
  onFilterChange: (filter: ImageFilter) => void;
}

export default function FilterControls({ 
  currentFilter, 
  onFilterChange 
}: FilterControlsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <Filter className="h-5 w-5 mr-2 text-primary" />
        Filters
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {imageFilterTypes.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "p-2 rounded-md border text-sm font-medium transition-all",
              currentFilter === filter
                ? "bg-primary text-white border-primary"
                : "border-gray-200 hover:border-primary text-gray-700"
            )}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
