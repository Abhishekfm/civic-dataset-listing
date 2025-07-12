import { useRouter, useSearchParams } from "next/navigation";
import { Sort, Order } from "@/hooks/useFilters";

export interface Filters {
  sectors: string[];
  timePeriods: string[];
  dataTypes: string[];
  tags: string[];
  geography: string[];
  licenses: string[];
}

export interface URLState {
  search: string;
  filters: Filters;
  sortField: string;
  sortOrder: string;
  page: number;
  size: number;
  viewMode: ViewMode;
}

export enum ViewMode {
  List = "list",
  Grid = "grid",
}

// Convert filters object to URL search params
export function filtersToSearchParams(state: URLState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) {
    params.set("q", state.search);
  }

  if (state.filters.sectors.length > 0) {
    params.set("sectors", state.filters.sectors.join(","));
  }

  if (state.filters.timePeriods.length > 0) {
    params.set("timePeriods", state.filters.timePeriods.join(","));
  }

  if (state.filters.dataTypes.length > 0) {
    params.set("dataTypes", state.filters.dataTypes.join(","));
  }

  if (state.filters.tags.length > 0) {
    params.set("tags", state.filters.tags.join(","));
  }

  if (state.filters.geography.length > 0) {
    params.set("geography", state.filters.geography.join(","));
  }

  if (state.filters.licenses.length > 0) {
    params.set("licenses", state.filters.licenses.join(","));
  }

  if (state.sortField !== Sort.Recent) {
    params.set("sortField", state.sortField);
  }
  if (state.sortOrder !== Order.Desc) {
    params.set("sortOrder", state.sortOrder);
  }

  if (state.page > 1) {
    params.set("page", state.page.toString());
  }

  if (state.size !== 5) {
    params.set("size", state.size.toString());
  }

  if (state.viewMode !== "list") {
    params.set("view", state.viewMode);
  }

  return params;
}

// Convert URL search params to filters object
export function searchParamsToFilters(searchParams: URLSearchParams): URLState {
  const defaultFilters: Filters = {
    sectors: [],
    timePeriods: [],
    dataTypes: [],
    tags: [],
    geography: [],
    licenses: [],
  };

  return {
    search: searchParams.get("q") || "",
    filters: {
      sectors:
        searchParams.get("sectors")?.split(",").filter(Boolean) ||
        defaultFilters.sectors,
      timePeriods:
        searchParams.get("timePeriods")?.split(",").filter(Boolean) ||
        defaultFilters.timePeriods,
      dataTypes:
        searchParams.get("dataTypes")?.split(",").filter(Boolean) ||
        defaultFilters.dataTypes,
      tags:
        searchParams.get("tags")?.split(",").filter(Boolean) ||
        defaultFilters.tags,
      geography:
        searchParams.get("geography")?.split(",").filter(Boolean) ||
        defaultFilters.geography,
      licenses:
        searchParams.get("licenses")?.split(",").filter(Boolean) ||
        defaultFilters.licenses,
    },
    sortField: searchParams.get("sortField") || Sort.Recent,
    sortOrder: searchParams.get("sortOrder") || Order.Desc,
    page: parseInt(searchParams.get("page") || "1"),
    size: parseInt(searchParams.get("size") || "5"),
    viewMode: (searchParams.get("view") as ViewMode) || ViewMode.List,
  };
}

// Hook to manage URL-based filters
export function useURLFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (state: URLState) => {
    const params = filtersToSearchParams(state);
    const newURL = params.toString() ? `?${params.toString()}` : "";
    router.push(newURL, { scroll: false });
  };

  const getCurrentState = (): URLState => {
    return searchParamsToFilters(searchParams);
  };

  return {
    updateURL,
    getCurrentState,
  };
}
