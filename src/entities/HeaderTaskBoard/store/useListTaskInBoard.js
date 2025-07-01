import { create } from "zustand"

const useListTaskInBoard = create((set) => ({
  listTaskBoard: 0,
  doneTasks: 0,
  setTaskCounts: (total, done) => set(() => ({
    listTaskBoard: total,
    doneTasks: done,
  })),
}));


export default useListTaskInBoard
