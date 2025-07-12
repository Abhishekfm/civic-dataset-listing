import { useState, useCallback } from "react";
import type { DatasetResponse } from "../types/dataset";
import { fetchDatasets, FetchDatasetsParams } from "../utils/api";

export function useDatasets() {
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDatasets = useCallback(async (params: FetchDatasetsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDatasets(params);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Error fetching datasets");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getDatasets };
}
