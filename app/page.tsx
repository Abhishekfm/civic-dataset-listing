"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Grid3X3,
  List,
  ChevronDown,
  ArrowUpDown,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDatasets } from "@/utils/api";
import { useURLFilters, type Filters, type URLState } from "@/utils/urlFilters";
import type { DatasetResponse } from "@/types/dataset";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import DatasetList from "@/components/DatasetList";
import DatasetGrid from "@/components/DatasetGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CivicDataSpace() {
  const { updateURL, getCurrentState } = useURLFilters();

  // Get initial state from URL
  const urlState = getCurrentState();

  // UI state
  const [viewMode, setViewMode] = useState<"list" | "grid">(urlState.viewMode);
  const selectRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // Filter/search/sort state
  const [search, setSearch] = useState(urlState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(urlState.search);
  const [filters, setFilters] = useState<Filters>(urlState.filters);
  const [sort, setSort] = useState(urlState.sort);
  const [page, setPage] = useState(urlState.page);
  const [size, setSize] = useState(urlState.size);

  // Data state
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filters).some((arr) => arr.length > 0) || search;

  // Update URL function
  const updateURLState = useCallback(
    (newState: Partial<URLState>) => {
      const currentState = {
        search: debouncedSearch,
        filters,
        sort,
        page,
        size,
        viewMode,
      };

      const updatedState = { ...currentState, ...newState };
      updateURL(updatedState);
    },
    [debouncedSearch, filters, sort, page, size, viewMode, updateURL]
  );

  // Fetch datasets
  const getDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        query: debouncedSearch,
        sectors: filters.sectors.join(","),
        timePeriods: filters.timePeriods.join(","),
        formats: filters.dataTypes.join(","),
        tags: filters.tags.join(","),
        geography: filters.geography.join(","),
        licenses: filters.licenses.join(","),
        page,
        size,
        sort:
          sort === "latest"
            ? "recent"
            : sort === "oldest"
            ? "recent"
            : "alphabetical",
        order: sort === "oldest" ? "asc" : "desc",
      };
      const res = await fetchDatasets(params);
      setData(res);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error fetching datasets");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, page, size, sort]);

  useEffect(() => {
    getDatasets();
  }, [getDatasets]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
    // Update URL immediately when filters change
    updateURLState({ filters: newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      sectors: [],
      timePeriods: [],
      dataTypes: [],
      tags: [],
      geography: [],
      licenses: [],
    };
    setFilters(resetFilters);
    setPage(1);
    // Update URL immediately when filters are reset
    updateURLState({ filters: resetFilters, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
    // Update URL immediately when sort changes
    updateURLState({ sort: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL immediately when page changes
    updateURLState({ page: newPage });
  };

  const handleSizeChange = (value: string) => {
    const newSize = Number(value);
    setSize(newSize);
    setPage(1);
    // Update URL immediately when size changes
    updateURLState({ size: newSize, page: 1 });
  };

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    // Update URL immediately when view mode changes
    updateURLState({ viewMode: mode });
  };

  const handleArrowClick = () => {
    selectRef.current?.click();
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Update URL when debounced search changes (only after debounce)
  useEffect(() => {
    if (debouncedSearch !== urlState.search) {
      updateURLState({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Example fallback if no data (for dev)
  const datasets = data?.results || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / size) || 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-orange-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Home
            </a>
            <span>›</span>
            <span className="font-medium">All Data</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            data={data}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-800">
                      Active Filters:
                    </span>
                    {search && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Search: "{search}"
                      </span>
                    )}
                    {Object.entries(filters).map(
                      ([key, values]) =>
                        values.length > 0 && (
                          <span
                            key={key}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {key}: {values.join(", ")}
                          </span>
                        )
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShareClick}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                    <span className="ml-1 text-xs">
                      {copied ? "Copied!" : "Share"}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Start typing to search for any Dataset"
                    className="pl-10 bg-gray-50 border-gray-200"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 ">
                  <ArrowUpDown
                    className="cursor-pointer hover:text-blue-600 transition-colors w-4 h-4"
                    onClick={handleArrowClick}
                  />
                  <Select
                    value={sort}
                    onValueChange={handleSortChange}
                    defaultValue="latest"
                  >
                    <SelectTrigger ref={selectRef} className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest Updated</SelectItem>
                      <SelectItem value="oldest">Oldest Updated</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading/Error/Empty States */}
            {loading && (
              <div className="text-center py-8 text-blue-600 font-semibold">
                Loading datasets...
              </div>
            )}
            {error && (
              <div className="text-center py-8 text-red-600 font-semibold">
                {error}
              </div>
            )}
            {!loading && datasets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No datasets found.
              </div>
            )}

            {/* Dataset List/Grid */}
            {viewMode === "list" ? (
              <div className="space-y-4">
                {datasets.map((dataset, index) => (
                  <DatasetList key={dataset.id || index} dataset={dataset} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets.map((dataset, index) => (
                  <DatasetGrid key={dataset.id || index} dataset={dataset} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Items per page</span>
                <Select
                  value={String(size)}
                  onValueChange={handleSizeChange}
                  defaultValue="5"
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">05</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Page {page.toString().padStart(2, "0")} of{" "}
                  {totalPages.toString().padStart(2, "0")}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                  >
                    {"<<"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, page + 1))
                    }
                    disabled={page === totalPages}
                  >
                    {">"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                  >
                    {">>"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
