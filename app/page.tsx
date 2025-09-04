"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  Search,
  Grid3X3,
  List,
  ArrowUpDown,
  Share2,
  Check,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDatasets } from "@/utils/api";
import {
  useURLFilters,
  ViewMode,
  type Filters,
  type URLState,
} from "@/utils/urlFilters";
// import type { ViewMode } from "@/types/viewMode";
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
import { Order, Sort } from "@/hooks/useFilters";

function CivicDataSpaceContent() {
  const { updateURL, getCurrentState } = useURLFilters();

  // Get initial state from URL
  const urlState = getCurrentState();

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>(urlState.viewMode);
  const [copied, setCopied] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter/search/sort state
  const [search, setSearch] = useState(urlState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(urlState.search);
  const [filters, setFilters] = useState<Filters>(urlState.filters);
  const [sortField, setSortField] = useState<Sort>(
    (urlState.sortField as Sort) || Sort.Recent
  );
  const [sortOrder, setSortOrder] = useState<Order>(
    (urlState.sortOrder as Order) || Order.Desc
  );
  const [page, setPage] = useState(urlState.page);
  const [size, setSize] = useState(urlState.size);

  // Data state
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(filters).some((arr) => arr.length > 0) || search;

  // Function to get limited active filters for display
  const getLimitedActiveFilters = (maxItems: number = 3) => {
    const activeFilters: string[] = [];

    if (search) {
      activeFilters.push(`Search: ${search}`);
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        activeFilters.push(`${key}: ${values.join(", ")}`);
      }
    });

    if (activeFilters.length <= maxItems) {
      return {
        filters: activeFilters,
        hasMore: false,
        totalCount: activeFilters.length,
      };
    }

    return {
      filters: activeFilters.slice(0, maxItems),
      hasMore: true,
      totalCount: activeFilters.length,
    };
  };

  // Update URL function
  const updateURLState = useCallback(
    (newState: Partial<URLState>) => {
      const currentState = {
        search: debouncedSearch,
        filters,
        sortField,
        sortOrder,
        page,
        size,
        viewMode,
      };

      const updatedState = { ...currentState, ...newState };
      updateURL(updatedState);
    },
    [
      debouncedSearch,
      filters,
      sortField,
      sortOrder,
      page,
      size,
      viewMode,
      updateURL,
    ]
  );

  // Fetch datasets
  const getDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        query: debouncedSearch,
        sectors: filters.sectors.join(","),
        timePeriods: filters.timePeriods.join(","),
        formats: filters.dataTypes.join(","),
        tags: filters.tags.join(","),
        geography: filters.geography.join(","),
        licenses: filters.licenses.join(","),
        page,
        size,
        sort: sortField,
        order: sortOrder,
      };
      const res = await fetchDatasets(params);
      setData(res);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching datasets";
      setError(errorMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  }, [debouncedSearch, filters, page, size, sortField, sortOrder]);

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

  const handleSortFieldChange = (value: string) => {
    const newSortField = value as Sort;
    setSortField(newSortField);
    setPage(1);
    // Update URL immediately when sort field changes
    updateURLState({ sortField: newSortField, page: 1 });
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder === Order.Desc ? Order.Asc : Order.Desc;
    setSortOrder(newSortOrder);
    setPage(1);
    // Update URL immediately when sort order changes
    updateURLState({ sortOrder: newSortOrder, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Update URL immediately when view mode changes
    updateURLState({ viewMode: mode });
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
  }, [debouncedSearch, updateURLState, urlState.search]);

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
          {/* Desktop Filter Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <FilterSidebar
              data={data}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="mb-4 p-2 bg-gray-100 border border-gray-200 rounded-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span className="text-sm font-medium text-blue-800 flex-shrink-0">
                      Active Filters:
                    </span>
                    <div className="flex items-center space-x-1 overflow-hidden">
                      {(() => {
                        const {
                          filters: displayFilters,
                          hasMore,
                          totalCount,
                        } = getLimitedActiveFilters(2);
                        return (
                          <>
                            {displayFilters.map((filter, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0 max-w-[120px] sm:max-w-none truncate"
                                title={filter}
                              >
                                {filter}
                              </span>
                            ))}
                            {hasMore && (
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ...+{totalCount - 2} more
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShareClick}
                    className="text-blue-600 hover:text-blue-800 flex-shrink-0 ml-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                    <span className="ml-1 text-xs hidden sm:inline">
                      {copied ? "Copied!" : "Share"}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex-1 max-w-xl">
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
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange(ViewMode.Grid)}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange(ViewMode.List)}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Sort Order Toggle */}
                  <ArrowUpDown
                    className="cursor-pointer hover:text-blue-600 transition-colors w-4 h-4"
                    onClick={handleSortOrderToggle}
                  />
                  {/* Sort Field Dropdown */}
                  <Select
                    value={sortField}
                    onValueChange={handleSortFieldChange}
                    defaultValue={Sort.Recent}
                  >
                    <SelectTrigger className="w-32 lg:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Sort.Recent}>
                        Latest Updated
                      </SelectItem>
                      <SelectItem value={Sort.Alphabetical}>
                        Name A-Z
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Early return for loading state */}
            {loading && (
              // <div className="flex items-center justify-center min-h-[400px]">
              //   <div className="text-center">
              //     <svg
              //       aria-hidden="true"
              //       className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto mb-4"
              //       viewBox="0 0 100 101"
              //       fill="none"
              //       xmlns="http://www.w3.org/2000/svg"
              //     >
              //       <path
              //         d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              //         fill="currentColor"
              //       />
              //       <path
              //         d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              //         fill="currentFill"
              //       />
              //     </svg>
              //     <div className="text-blue-600 font-semibold">
              //       Loading datasets...
              //     </div>
              //     <span className="sr-only">Loading...</span>
              //   </div>
              // </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[500px]">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full bg-gray-100 animate-pulse"
                  >
                    <div className="w-full bg-gray-300 h-4 rounded-md"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-8 text-red-600 font-semibold">
                {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && datasets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No datasets found.
              </div>
            )}

            {/* Dataset List/Grid - only show when not loading and no error */}
            {!loading && !error && (
              <>
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {datasets.map((dataset, index) => (
                      <DatasetList
                        key={dataset.id || index}
                        dataset={dataset}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets.map((dataset, index) => (
                      <DatasetGrid
                        key={dataset.id || index}
                        dataset={dataset}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm text-gray-500 text-center sm:text-left">
                  Page {page.toString().padStart(2, "0")} of{" "}
                  {totalPages.toString().padStart(2, "0")}
                </span>
                <div className="flex items-center justify-center sm:justify-start space-x-1">
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

      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <Filter className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileFilters(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar
                data={data}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CivicDataSpace() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-blue-600 font-semibold mb-2">Loading...</div>
            <div className="text-gray-500 text-sm">
              Preparing your dataset listing
            </div>
          </div>
        </div>
      }
    >
      <CivicDataSpaceContent />
    </Suspense>
  );
}
