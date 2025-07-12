import { useState } from "react";
import {
  Calendar,
  Download,
  BarChart3,
  FileText,
  FileSpreadsheet,
  File,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dataset } from "@/types/dataset";

interface DatasetGridProps {
  dataset: Dataset;
}

export default function DatasetGrid({ dataset }: DatasetGridProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatIcons = {
    PDF: <FileText className="w-4 h-4 text-red-600" />,
    CSV: <FileSpreadsheet className="w-4 h-4 text-green-600" />,
    JSON: <File className="w-4 h-4 text-orange-600" />,
    XLSX: <FileSpreadsheet className="w-4 h-4 text-green-600" />,
    API: <Database className="w-4 h-4 text-blue-600" />,
  };

  const shouldShowMore = dataset.description.length > 120;
  const displayDescription = showFullDescription
    ? dataset.description
    : dataset.description.slice(0, 120) + (shouldShowMore ? "..." : "");

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow h-fit">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-blue-600 hover:underline cursor-pointer line-clamp-2">
          {dataset.title}
        </h3>
      </div>

      <div className="mb-3">
        <p className="text-gray-600 text-sm">
          {displayDescription}
          {shouldShowMore && (
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs ml-1"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show Less" : "Show More"}
            </Button>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Sectors:</span>
          <div className="flex flex-wrap gap-1">
            {dataset.sectors.slice(0, 2).map((sector, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-green-300 hover:bg-green-400 text-black"
              >
                {sector}
              </Badge>
            ))}
            {dataset.sectors.length > 2 && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-300 hover:bg-green-400 text-black"
              >
                +{dataset.sectors.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {dataset.tags.slice(0, 2).map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs  bg-green-300 hover:bg-green-400 text-black"
              >
                {tag}
              </Badge>
            ))}
            {dataset.tags.length > 2 && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-300 hover:bg-green-400 text-black  bg-green-300 hover:bg-green-400 text-black"
              >
                +{dataset.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Formats:</span>
          <div className="flex space-x-1">
            {dataset.formats.slice(0, 3).map((format, idx) => {
              const icon = formatIcons[format as keyof typeof formatIcons];
              return (
                <span key={idx} title={format}>
                  {icon || <File className="w-4 h-4 text-gray-600" />}
                </span>
              );
            })}
            {dataset.formats.length > 3 && (
              <span className="text-xs text-gray-500">
                +{dataset.formats.length - 3}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(dataset.created).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Download className="w-3 h-3" />
              <span>{dataset.download_count} downloads</span>
            </div>
          </div>
          {dataset.has_charts && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <BarChart3 className="w-3 h-3" />
              <span>With Charts</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between space-x-2 pt-2 border-t">
          <span className="text-[12px] text-gray-500 whitespace-nowrap">
            Published by:
          </span>
          <div className="flex items-center space-x-1">
            {dataset.organization.logo && (
              <img
                src={dataset.organization.logo}
                alt={dataset.organization.name}
                className="w-3 h-3 rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="text-xs text-gray-600 font-semibold">
              {dataset.organization.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
