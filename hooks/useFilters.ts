import { useState } from "react";

export interface Filters {
  query: string;
  Geography: string;
  sectors: string;
  tags: string;
  formats: string;
  page: number;
  size: number;
  sort: Sort;
  order: Order;
}
export enum Sort {
  Recent = "recent",
  Alphabetical = "alphabetical",
}
export enum Order {
  Asc = "asc",
  Desc = "desc",
}

const defaultFilters: Filters = {
  query: "",
  Geography: "",
  sectors: "",
  tags: "",
  formats: "",
  page: 1,
  size: 10,
  sort: Sort.Recent,
  order: Order.Desc,
};

export function useFilters(initial?: Partial<Filters>) {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    ...initial,
  });
  return { filters, setFilters };
}
