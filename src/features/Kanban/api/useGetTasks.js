import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const fetchTasks = async (boardId) => {
  const { data } = await axiosInstance.get(
    `kanban/boards/${boardId}/task-cards`
  );
  return data ?? [];
};

export const useGetTasks = (boardId, { enabled = true } = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () => fetchTasks(boardId),
    enabled: enabled && !!boardId,
    staleTime: 10_000,
  });

  const getTasksFunc = React.useCallback(
    async (maybeBoardId) => {
      const id = maybeBoardId ?? boardId;
      if (!id) return [];

      return queryClient.fetchQuery({
        queryKey: ["tasks", id],
        queryFn: () => fetchTasks(id),
      });
    },
    [boardId, queryClient]
  );

  return {
    tasks: query.data ?? [],
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    getTasksFunc,
  };
};
