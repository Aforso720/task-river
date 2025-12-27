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

// аккуратно достаём tasks из ответа (на случай разных форматов)
const extractTasksFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tasks)) return data.tasks;
  if (Array.isArray(data?.data)) return data.data;
  return null;
};

export const useWorkTasks = create((set) => ({
  loadingPost: false,
  errorPost: null,

  loadingPut: false,
  errorPut: null,

  loadingDelete: false,
  errorDelete: null,

  getFile: null,
  errorFile: null,
  loadingFile: false,

  // ✅ POST: возвращаем ВЕСЬ список задач из response
  async postTasksFunc(boardId, formData) {
    try {
      set({ loadingPost: true, errorPost: null });

      const resp = await axiosInstance.post(
        `kanban/boards/${boardId}/task-cards`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const tasks = extractTasksFromResponse(resp?.data);
      // если бэк вдруг вернул не список — вернём пустой массив, чтобы не падать
      return tasks ?? [];
    } catch (error) {
      set({ errorPost: error.message });
      throw error;
    } finally {
      set({ loadingPost: false });
    }
  },

  // ✅ PUT: отправляем FormData и тоже возвращаем ВЕСЬ список задач из response
  async updateTasksFunc(boardId, taskId, formData) {
    try {
      set({ loadingPut: true, errorPut: null });

      const resp = await axiosInstance.put(
        `kanban/boards/${boardId}/task-cards/${taskId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const tasks = extractTasksFromResponse(resp?.data);
      return tasks ?? [];
    } catch (error) {
      set({ errorPut: error.message });
      throw error;
    } finally {
      set({ loadingPut: false });
    }
  },

  async deleteTasksFunc(boardId, taskId) {
    try {
      set({ loadingDelete: true, errorDelete: null });

      const resp = await axiosInstance.delete(
        `kanban/boards/${boardId}/task-cards/${taskId}`
      );

      // если бэк вернул список задач — можно вернуть его тоже
      const tasks = extractTasksFromResponse(resp?.data);
      return tasks ?? true;
    } catch (error) {
      set({ errorDelete: error.message });
      throw error;
    } finally {
      set({ loadingDelete: false });
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
        res?.headers?.["content-disposition"] ||
        res?.headers?.["Content-Disposition"];

      const filename = parseFilenameFromDisposition(disposition);

      set({ loadingFile: false, getFile: res.data });
      return { blob: res.data, filename };
    } catch (error) {
      set({ loadingFile: false, errorFile: error });
      throw error;
    }
  },
}));
