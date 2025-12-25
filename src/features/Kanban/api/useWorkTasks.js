import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

const parseFilenameFromDisposition = (disposition) => {
  if (!disposition) return null;

  const match = /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(disposition);
  if (!match?.[1]) return null;

  try {
    return decodeURIComponent(match[1].replace(/"/g, "").trim());
  } catch {
    return match[1].replace(/"/g, "").trim();
  }
};

export const useWorkTasks = create((set) => ({

  loadingPost: false,
  errorPost: null,

  loadingPut: false,
  errorPut: null,

  getFile: null,
  errorFile: null,
  loadingFile: false,

  async postTasksFunc(boardId, formData) {
    try {
      set({ loadingPost: true, errorPost: null });

      const resp = await axiosInstance.post(
        `kanban/boards/${boardId}/task-cards`,
        formData
      );

      const created = resp?.data;
      set((s) => ({ tasks: [...(s.tasks || []), created] }));
      return created;
    } catch (error) {
      set({ errorPost: error.message });
      throw error;
    } finally {
      set({ loadingPost: false });
    }
  },

  async updateTasksFunc(boardId, taskId, payload) {
    try {
      set({ loadingPut: true, errorPut: null });

      const resp = await axiosInstance.put(
        `kanban/boards/${boardId}/task-cards/${taskId}`,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          transformRequest: [(d) => d],
        }
      );

      const updated = resp?.data;
      set((s) => ({
        tasks: (s.tasks || []).map((t) => (t.id === taskId ? updated : t)),
      }));

      return updated;
    } catch (error) {
      set({ errorPut: error.message });
      throw error;
    } finally {
      set({ loadingPut: false });
    }
  },

  async getFileTask(boardId, fileId) {
    try {
      set({ loadingFile: true, errorFile: null, getFile: null });

      const res = await axiosInstance.get(
        `/kanban/boards/${boardId}/task-cards/files/${fileId}`,
        { responseType: "blob" }
      );

      const disposition =
        res?.headers?.["content-disposition"] || res?.headers?.["Content-Disposition"];

      const filename = parseFilenameFromDisposition(disposition);

      set({ loadingFile: false, getFile: res.data });
      return { blob: res.data, filename };
    } catch (error) {
      set({ loadingFile: false, errorFile: error });
      throw error;
    }
  },
}));
