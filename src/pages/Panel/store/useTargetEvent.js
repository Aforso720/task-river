// src/pages/Panel/store/useTargetEvent.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTargetEvent = create(
  persist(
    (set) => ({
      activeProjectId: null,
      activeBoardId: null,       // одиночная доска (без проекта)
      activeTaskId: null,
      activeGroupBoardId: null,  // доска, прикреплённая к проекту

      addProjectID: (newID) => set({ activeProjectId: newID }),
      addBoardID: (newID) => set({ activeBoardId: newID }),
      addTaskID: (newID) => set({ activeTaskId: newID }),
      addGroupBoardId: (newID) => set({ activeGroupBoardId: newID }),
    }),
    {
      name: "target-event-store",
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        activeBoardId: state.activeBoardId,
        activeTaskId: state.activeTaskId,
        activeGroupBoardId: state.activeGroupBoardId,
      }),
    }
  )
);

export default useTargetEvent;
