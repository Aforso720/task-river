import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useWorkMembers = create((set,get)=>({
    membersProject:[],
    membersBoard:[],
    async getMembersBoard(boardId) {
        const {data} = await axiosInstance.get(`/kanban/boards/${boardId}/members`)
        set({membersBoard:data})
    },

    async getMemberProject(projectId){
        const {data} = await axiosInstance.get(`/kanban/projects/${projectId}/members`) 
        set({membersProject:data})
    },

    async addedBoardMembers(boardId,payload){
        const {data} = await axiosInstance.post(`/kanban/boards/${boardId}/members`,payload)
        get().getMembersBoard()
        return data
    },

    async addedProjectMembers(projectId,payload){
        const {data} = await axiosInstance.post(`/kanban/boards/${projectId}/members`,payload)
        get().getMemberProject()
        return data
    },
}))