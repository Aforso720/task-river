import { useQueries } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const fetchProjects = async () => {
  const { data } = await axiosInstance.get("/kanban/projects");
  return data || [];
};

const fetchBoards = async () => {
  const { data } = await axiosInstance.get("/kanban/boards");
  return data || [];
};

export function usePanelData({ enabled = true } = {}) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["projects"],
        queryFn: fetchProjects,
        enabled,
        staleTime: 60_000, 
      },
      {
        queryKey: ["boards"],
        queryFn: fetchBoards,
        enabled,
        staleTime: 30_000,
      },
    ],
  });

  const projectsQ = results[0];
  const boardsQ = results[1];

  return {
    projects: projectsQ.data || [],
    boards: boardsQ.data || [],
    loading: projectsQ.isLoading || boardsQ.isLoading,
    error: projectsQ.error || boardsQ.error,
    refetch: () => {
      projectsQ.refetch();
      boardsQ.refetch();
    },
  };
}
