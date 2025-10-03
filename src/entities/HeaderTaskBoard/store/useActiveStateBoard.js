import { create } from "zustand"

const useActiveStateBoard = create((set)=>({
    activeStateBoard : 'board',
    editActiveStateBoard : (newState) => set((state)=>({activeStateBoard: state.activeStateBoard = newState}))
}))

export default useActiveStateBoard
