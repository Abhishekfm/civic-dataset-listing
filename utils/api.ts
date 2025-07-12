import { Order, Sort } from "@/hooks/useFilters";
import { DatasetResponse } from "../types/dataset";

const BASE_URL = "https://api.datakeep.civicdays.in/api/search/dataset/";

export interface FetchDatasetsParams {
  query?: string;
  Geography?: string;
  sectors?: string;
  tags?: string;
  formats?: string;
  page?: number;
  size?: number;
  sort?: Sort;
  order?: Order;
}

export async function fetchDatasets(
  params: FetchDatasetsParams
): Promise<DatasetResponse> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch datasets");
  return res.json();
}
