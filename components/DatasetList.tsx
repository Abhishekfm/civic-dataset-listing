import { useState } from "react";
import {
  Calendar,
  Download,
  MapPin,
  BarChart3,
  FileText,
  FileSpreadsheet,
  File,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dataset } from "@/types/dataset";
import Image from "next/image";

interface DatasetListProps {
  dataset: Dataset;
}

export default function DatasetList({ dataset }: DatasetListProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatIcons = {
    PDF: <FileText className="w-4 h-4 text-red-600" />,
    CSV: <FileSpreadsheet className="w-4 h-4 text-green-600" />,
    JSON: <File className="w-4 h-4 text-orange-600" />,
    API: <Database className="w-4 h-4 text-blue-600" />,
  };

  const shouldShowMore = dataset.description.length > 200;
  const displayDescription = showFullDescription
    ? dataset.description
    : dataset.description.slice(0, 200) + (shouldShowMore ? "..." : "");

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
          {dataset.title}
        </h3>
      </div>
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {displayDescription}
          {shouldShowMore && (
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm ml-1"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show Less" : "Show More"}
            </Button>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              Created: {new Date(dataset.created).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Downloads: {dataset.download_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>
              Geography:{" "}
              {dataset.metadata.find(
                (m) => m.metadata_item.label === "Geography"
              )?.value || "N/A"}
            </span>
          </div>
          {dataset.has_charts && (
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span>With Charts</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 pt-4 border-t gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sectors:</span>
            <div className="flex flex-wrap gap-1">
              {dataset.sectors.map((sector, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs bg-green-300 hover:bg-green-400 text-black"
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 font-semibold">
              Published by:
            </span>
            <div className="flex items-center space-x-1">
              {dataset.organization?.logo && (
                <Image
                  src={dataset.organization?.logo}
                  alt={dataset.organization?.name}
                  className="w-4 h-4 rounded-full"
                  width={12}
                  height={12}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              )}
              <span className="text-sm font-semibold">
                {dataset.organization?.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {dataset.tags.map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="secondary"
                  className="text-xs bg-green-300 hover:bg-green-400 text-black"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Formats:</span>
            <div className="flex space-x-1">
              {dataset.formats.map((format, idx) => {
                const icon = formatIcons[format as keyof typeof formatIcons];
                return (
                  <span key={idx} title={format}>
                    {icon || <File className="w-4 h-4 text-gray-600" />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
