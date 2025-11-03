import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTargetEvent = create(
  persist(
    (set) => ({
      activeProjectId: null,
      activeBoardId: null,
      activeTaskId: null,
      activeGroupBoardId: null,
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
        activeGroupBoardId: state.activeGroupBoardId, // ✅ значение
      }),
    }
  )
);

export default useTargetEvent;
