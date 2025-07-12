import { useState } from "react";

export function usePagination(total: number, size: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / size);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return { page, setPage, totalPages, nextPage, prevPage, goToPage };
}
