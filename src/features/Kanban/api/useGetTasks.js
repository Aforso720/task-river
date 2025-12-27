import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const EMPTY = Object.freeze([]);

const fetchTasks = async (boardId) => {
  const { data } = await axiosInstance.get(`kanban/boards/${boardId}/task-cards`);
  return data ?? [];
};

export function useGetTasks(boardId, { enabled = true } = {}) {
  const query = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () => fetchTasks(boardId),
    enabled: enabled && !!boardId,

    // чтобы не долбить сервер при 500
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });

  return {
    tasks: query.data ?? EMPTY,   // ✅ стабильная ссылка
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
