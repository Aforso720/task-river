import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const EMPTY = Object.freeze([]);

const fetchColumns = async (boardId) => {
  const { data } = await axiosInstance.get(`kanban/boards/${boardId}/columns`);
  return data ?? [];
};

export function useGetColumns(boardId, { enabled = true } = {}) {
  const query = useQuery({
    queryKey: ["columns", boardId],
    queryFn: () => fetchColumns(boardId),
    enabled: enabled && !!boardId,

    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });

  return {
    columns: query.data ?? EMPTY, // ✅ стабильная ссылка
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
