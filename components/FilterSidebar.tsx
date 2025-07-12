import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { DatasetResponse } from "@/types/dataset";
import type { Filters } from "@/utils/urlFilters";

interface FilterSidebarProps {
  data: DatasetResponse | null;
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  data,
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  // UI state for expand/collapse
  const [sectorsExpanded, setSectorsExpanded] = useState(true);
  const [timePeriodExpanded, setTimePeriodExpanded] = useState(true);
  const [dataTypeExpanded, setDataTypeExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [geographyExpanded, setGeographyExpanded] = useState(true);
  const [licensesExpanded, setLicensesExpanded] = useState(true);

  // Calculate total active filters
  const totalActiveFilters = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  // Handler functions
  const handleSectorChange = (sector: string) => {
    const exists = filters.sectors.includes(sector);
    const newSectors = exists
      ? filters.sectors.filter((s) => s !== sector)
      : [...filters.sectors, sector];
    onFilterChange({ ...filters, sectors: newSectors });
  };

  const handleTimePeriodChange = (period: string) => {
    const exists = filters.timePeriods.includes(period);
    const newTimePeriods = exists
      ? filters.timePeriods.filter((p) => p !== period)
      : [...filters.timePeriods, period];
    onFilterChange({ ...filters, timePeriods: newTimePeriods });
  };

  const handleDataTypeChange = (type: string) => {
    const exists = filters.dataTypes.includes(type);
    const newDataTypes = exists
      ? filters.dataTypes.filter((t) => t !== type)
      : [...filters.dataTypes, type];
    onFilterChange({ ...filters, dataTypes: newDataTypes });
  };

  const handleTagChange = (tag: string) => {
    const exists = filters.tags.includes(tag);
    const newTags = exists
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  const handleGeographyChange = (location: string) => {
    const exists = filters.geography.includes(location);
    const newGeography = exists
      ? filters.geography.filter((g) => g !== location)
      : [...filters.geography, location];
    onFilterChange({ ...filters, geography: newGeography });
  };

  const handleLicenseChange = (license: string) => {
    const exists = filters.licenses.includes(license);
    const newLicenses = exists
      ? filters.licenses.filter((l) => l !== license)
      : [...filters.licenses, license];
    onFilterChange({ ...filters, licenses: newLicenses });
  };

  return (
    <div className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">FILTERS</h3>
            {totalActiveFilters > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {totalActiveFilters}
              </span>
            )}
          </div>
          <button
            className="text-orange-500 text-sm hover:underline"
            onClick={onReset}
          >
            RESET
          </button>
        </div>

        {/* Sectors */}
        <div className="mb-6">
          <button
            onClick={() => setSectorsExpanded(!sectorsExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Sectors (
            {data?.aggregations?.sectors
              ? Object.keys(data.aggregations.sectors).length
              : 5}
            )
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                sectorsExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {sectorsExpanded && (
            <div className="space-y-2">
              {data?.aggregations?.sectors
                ? Object.entries(data.aggregations.sectors).map(
                    ([sector, count]) => (
                      <div className="flex items-center space-x-2" key={sector}>
                        <Checkbox
                          id={sector}
                          checked={filters.sectors.includes(sector)}
                          onCheckedChange={() => handleSectorChange(sector)}
                        />
                        <label
                          htmlFor={sector}
                          className="text-sm text-gray-700"
                        >
                          {sector} ({count})
                        </label>
                      </div>
                    )
                  )
                : // Fallback to hardcoded sectors if no aggregation data
                  [
                    "Biodiversity Conservation",
                    "Climate Finance",
                    "Climate and Health",
                    "Disaster Risk Reduction",
                    "Energy Transition",
                  ].map((sector) => (
                    <div className="flex items-center space-x-2" key={sector}>
                      <Checkbox
                        id={sector}
                        checked={filters.sectors.includes(sector)}
                        onCheckedChange={() => handleSectorChange(sector)}
                      />
                      <label htmlFor={sector} className="text-sm text-gray-700">
                        {sector}
                      </label>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Time Period */}
        <div className="mb-6">
          <button
            onClick={() => setTimePeriodExpanded(!timePeriodExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Time Period (5)
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                timePeriodExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {timePeriodExpanded && (
            <div className="space-y-2">
              {[
                "2000-2003",
                "2003-2006",
                "2006-2009",
                "2009-2012",
                "2012-2015",
              ].map((period) => (
                <div className="flex items-center space-x-2" key={period}>
                  <Checkbox
                    id={period}
                    checked={filters.timePeriods.includes(period)}
                    onCheckedChange={() => handleTimePeriodChange(period)}
                  />
                  <label htmlFor={period} className="text-sm text-gray-700">
                    {period}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Type */}
        <div className="mb-6">
          <button
            onClick={() => setDataTypeExpanded(!dataTypeExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Data Type (
            {data?.aggregations?.formats
              ? Object.keys(data.aggregations.formats).length
              : 4}
            )
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                dataTypeExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {dataTypeExpanded && (
            <div className="space-y-2">
              {data?.aggregations?.formats
                ? Object.entries(data.aggregations.formats).map(
                    ([format, count]) => (
                      <div className="flex items-center space-x-2" key={format}>
                        <Checkbox
                          id={format}
                          checked={filters.dataTypes.includes(format)}
                          onCheckedChange={() => handleDataTypeChange(format)}
                        />
                        <label
                          htmlFor={format}
                          className="text-sm text-gray-700"
                        >
                          {format} ({count})
                        </label>
                      </div>
                    )
                  )
                : // Fallback to hardcoded formats if no aggregation data
                  ["CSV", "GeoJSON", "XLS", "API"].map((type) => (
                    <div className="flex items-center space-x-2" key={type}>
                      <Checkbox
                        id={type}
                        checked={filters.dataTypes.includes(type)}
                        onCheckedChange={() => handleDataTypeChange(type)}
                      />
                      <label htmlFor={type} className="text-sm text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Tags (
            {data?.aggregations?.tags
              ? Object.keys(data.aggregations.tags).length
              : 10}
            )
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                tagsExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {tagsExpanded && (
            <div className="space-y-2">
              {data?.aggregations?.tags
                ? Object.entries(data.aggregations.tags).map(([tag, count]) => (
                    <div className="flex items-center space-x-2" key={tag}>
                      <Checkbox
                        id={tag}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => handleTagChange(tag)}
                      />
                      <label htmlFor={tag} className="text-sm text-gray-700">
                        {tag} ({count})
                      </label>
                    </div>
                  ))
                : // Fallback to hardcoded tags if no aggregation data
                  ["Budget", "Law", "Justice", "Courts", "Disaster"].map(
                    (tag) => (
                      <div className="flex items-center space-x-2" key={tag}>
                        <Checkbox
                          id={tag}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={() => handleTagChange(tag)}
                        />
                        <label htmlFor={tag} className="text-sm text-gray-700">
                          {tag}
                        </label>
                      </div>
                    )
                  )}
            </div>
          )}
        </div>

        {/* Geography */}
        <div className="mb-6">
          <button
            onClick={() => setGeographyExpanded(!geographyExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Geography (
            {data?.aggregations?.Geography
              ? Object.keys(data.aggregations.Geography).length
              : 19}
            )
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                geographyExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {geographyExpanded && (
            <div className="space-y-2">
              {data?.aggregations?.Geography
                ? Object.entries(data.aggregations.Geography).map(
                    ([location, count]) => (
                      <div
                        className="flex items-center space-x-2"
                        key={location}
                      >
                        <Checkbox
                          id={location}
                          checked={filters.geography.includes(location)}
                          onCheckedChange={() =>
                            handleGeographyChange(location)
                          }
                        />
                        <label
                          htmlFor={location}
                          className="text-sm text-gray-700"
                        >
                          {location} ({count})
                        </label>
                      </div>
                    )
                  )
                : // Fallback to hardcoded geography if no aggregation data
                  ["India", "Asia-Pacific", "Assam", "Delhi", "Gujarat"].map(
                    (location) => (
                      <div
                        className="flex items-center space-x-2"
                        key={location}
                      >
                        <Checkbox
                          id={location}
                          checked={filters.geography.includes(location)}
                          onCheckedChange={() =>
                            handleGeographyChange(location)
                          }
                        />
                        <label
                          htmlFor={location}
                          className="text-sm text-gray-700"
                        >
                          {location}
                        </label>
                      </div>
                    )
                  )}
            </div>
          )}
        </div>

        {/* Licenses */}
        <div className="mb-6">
          <button
            onClick={() => setLicensesExpanded(!licensesExpanded)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Licenses
            {data?.aggregations?.licenses
              ? Object.keys(data.aggregations.licenses).length
              : ""}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                licensesExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {licensesExpanded && (
            <div className="space-y-2">
              {data?.aggregations?.licenses &&
                Object.entries(data.aggregations.licenses).map(
                  ([license, count]) => (
                    <div className="flex items-center space-x-2" key={license}>
                      <Checkbox
                        id={license}
                        checked={filters.licenses.includes(license)}
                        onCheckedChange={() => handleLicenseChange(license)}
                      />
                      <label
                        htmlFor={license}
                        className="text-sm text-gray-700"
                      >
                        {license} ({count})
                      </label>
                    </div>
                  )
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
