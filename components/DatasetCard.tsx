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
import type { Dataset } from "@/types/dataset";

interface DatasetCardProps {
  dataset: Dataset;
  viewMode: "list" | "grid";
}

export default function DatasetCard({ dataset, viewMode }: DatasetCardProps) {
  const isListView = viewMode === "list";

  const formatIcons = {
    PDF: <FileText className="w-4 h-4 text-red-600" />,
    CSV: <FileSpreadsheet className="w-4 h-4 text-green-600" />,
    JSON: <File className="w-4 h-4 text-orange-600" />,
    API: <Database className="w-4 h-4 text-blue-600" />,
  };

  if (isListView) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
            {dataset.title}
          </h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {dataset.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
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

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sectors:</span>
              <div className="flex space-x-1">
                {dataset.sectors.map((sector, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Published by:</span>
              <div className="flex items-center space-x-1">
                {dataset.organization.logo && (
                  <img
                    src={dataset.organization.logo}
                    alt={dataset.organization.name}
                    className="w-4 h-4 rounded-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                )}
                <span className="text-sm">{dataset.organization.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Tags:</span>
              <div className="flex space-x-1">
                {dataset.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
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

  // Grid view
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-blue-600 hover:underline cursor-pointer line-clamp-2">
          {dataset.title}
        </h3>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {dataset.description}
      </p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{new Date(dataset.created).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Download className="w-3 h-3" />
          <span>{dataset.download_count} downloads</span>
        </div>
        {dataset.has_charts && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <BarChart3 className="w-3 h-3" />
            <span>With Charts</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Sectors:</span>
          <div className="flex flex-wrap gap-1">
            {dataset.sectors.slice(0, 2).map((sector, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {sector}
              </Badge>
            ))}
            {dataset.sectors.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{dataset.sectors.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {dataset.tags.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {dataset.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{dataset.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Formats:</span>
          <div className="flex space-x-1">
            {dataset.formats.slice(0, 3).map((format, idx) => {
              const icon = formatIcons[format as keyof typeof formatIcons];
              return (
                <span key={idx} title={format}>
                  {icon || <File className="w-3 h-3 text-gray-600" />}
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

        <div className="flex items-center space-x-2 pt-2 border-t">
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
            <span className="text-xs text-gray-600">
              {dataset.organization.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
