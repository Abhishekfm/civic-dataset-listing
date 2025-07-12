import { useState } from "react";

export interface Filters {
  query: string;
  Geography: string;
  sectors: string;
  tags: string;
  formats: string;
  page: number;
  size: number;
  sort: "recent" | "alphabetical";
  order: "asc" | "desc";
}

const defaultFilters: Filters = {
  query: "",
  Geography: "",
  sectors: "",
  tags: "",
  formats: "",
  page: 1,
  size: 10,
  sort: "recent",
  order: "desc",
};

export function useFilters(initial?: Partial<Filters>) {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    ...initial,
  });
  return { filters, setFilters };
}
