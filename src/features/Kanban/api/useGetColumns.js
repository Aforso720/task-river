import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const fetchColumns = async (boardId) => {
  const { data } = await axiosInstance.get(`kanban/boards/${boardId}/columns`);
  return data ?? [];
};

export function useGetColumns(boardId, { enabled = true } = {}) {
  const query = useQuery({
    queryKey: ["columns", boardId],
    queryFn: () => fetchColumns(boardId),
    enabled: enabled && !!boardId,
    staleTime: 10_000,
  });

  return {
    columns: query.data ?? [],
    loading: query.isLoading,
    fetching: query.isFetching, // полезно для "перезагрузки"
    error: query.error,
    refetch: query.refetch,
  };
}
