import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTargetEvent = create(
  persist(
    (set) => ({
      activeProjectId: null,
      activeBoardId: null,
      activeTaskId: null,
      activeSingleBoardId:null,
      addProjectID: (newID) => set({ activeProjectId: newID }),
      addBoardID: (newID) => set({ activeBoardId: newID }),
      addTaskID: (newID) => set({ activeTaskId: newID }),
      addSingleBoardID: (newID) => set({ activeSingleBoardId: newID }),
    }),
    {
      name: "target-event-store",
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        activeBoardId: state.activeBoardId,
        activeTaskId: state.activeTaskId,
        activeSingleBoardId: state.activeSingleBoardId,
      }),
    }
  )
);

export default useTargetEvent;
