import React, { useState, useEffect } from "react";
import "./HeaderTaskBoard.scss";
import ProgressBar from "../../shared/ProgressBar/ProgressBar";
import { useWorkMembers } from "@/features/Kanban/api/useWorkMembers";
import useTargetEvent from "@/pages/Panel/store/useTargetEvent";
import ModalWorkUsers from "../ModalWorkUsers/ModalWorkUsers";
import useModalWorkUsersStore from "../ModalWorkUsers/store/useModalWorkUsersStore";
import { useLocation, useNavigate } from "react-router";
import ConfirmDeleteModal from "@/shared/ConfirmDeleteModal/ConfirmDeleteModal";
import axiosInstance from "@/app/api/axiosInstance";
import { useWorkColumn } from "@/features/Kanban/api/useWorkColumn";
import { useDeleteElemPanel } from "@/features/Kanban/api/useDeleteElemPanel";
import { useFullVerse } from "@/features/Kanban/store/useFullVerse";
import useModalAddElemStore from "@/widgets/AddElemModal/useModalAddElemStore";
// import { usePostElemPanel } from "@/features/Kanban/api/usePostElemPanel";
import { useUserData } from "@/widgets/HeaderSideBar/useUserData";

const HeaderTaskBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeBoardId, activeProjectId, addBoardID, addProjectID , addGroupBoardId , activeGroupBoardId} = useTargetEvent();
  const { getMemberProject, getMembersBoard, membersProject, membersBoard } = useWorkMembers();
  const openUsersModal = useModalWorkUsersStore((s) => s.openModal);
  const [activeSetting, setActiveSetting] = useState(false);
  const { getColumnFunc } = useWorkColumn();
  const { deleteElemPanel, isDeleting } = useDeleteElemPanel();
  const { setFulled , isFull  } = useFullVerse();
  const {openModalAddElem} = useModalAddElemStore();

  // const { editBoard } = usePostElemPanel();
  const {userData} = useUserData();
  

  // useEffect(()=>{
  //   getUserData();
  // },[])
  
  // const [payloadPut,setPayloadPut]=useState({
  //   title: "",
  //   description: "",
  //   memberEmails: {
  //     userData?.email: "EDITOR"
  //   },
  // })
  
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: "", 
    itemName: "",
    loading: false,
  });
  
  const isProjectPage = location.pathname.includes("/project/");
  const isBoardPage = location.pathname.includes("/board/");
  
  const currentEntityId = isProjectPage ? activeProjectId : activeBoardId;
  const entityType = isProjectPage ? "project" : "board";
  
  useEffect(() => {
    if (!currentEntityId) return;
    
    if (isProjectPage) {
      getMemberProject(currentEntityId).catch((e) =>
        console.error("Не удалось получить участников проекта:", e)
      );
    } else if (isBoardPage) {
      getMembersBoard(currentEntityId).catch((e) =>
        console.error("Не удалось получить участников доски:", e)
      );
    }
  }, [currentEntityId, isProjectPage, isBoardPage, getMemberProject, getMembersBoard]);
  
  const members = isProjectPage ? membersProject : membersBoard;

  const getDisplayName = (m) =>
    m.fullName || m.username || m.email || "Без имени";

  const getInitials = (m) => {
    const name = getDisplayName(m);
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    const initials = (first + second).toUpperCase();
    return initials || "U";
  };

  const openDeleteProjectModal = () => {
    setDeleteModal({
      open: true,
      type: "project",
      itemName: "проект",
      loading: false,
    });
  };

  const openDeleteBoardModal = () => {
    setDeleteModal({
      open: true,
      type: "board",
      itemName: "доску",
      loading: false,
    });
  };

  const openDeleteBoardFromProjectModal = () => {
    setDeleteModal({
      open: true,
      type: "boardFromProject",
      itemName: "доску из проекта",
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));
    
    try {
      switch (deleteModal.type) {
        case "project":
          if (activeProjectId) {
            await deleteElemPanel("Проекты", activeProjectId);
            addProjectID(null);
            navigate("/panel"); 
          }
          break;
          
        case "board":
          if (activeBoardId) {
            await deleteElemPanel("Доски", activeBoardId);
            addBoardID(null);
            if (isBoardPage) {
              navigate("/panel");
            }
          }
          break;
          
        case "boardFromProject":
          if (activeProjectId && activeBoardId) {
            await axiosInstance.delete(`/kanban/projects/${activeProjectId}/boards/${activeGroupBoardId}`);
            addGroupBoardId(null);
          }
          break;
          
        default:
          break;
      }
      
      setDeleteModal({
        open: false,
        type: "",
        itemName: "",
        loading: false,
      });
      setActiveSetting(false);
      
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      setDeleteModal(prev => ({ ...prev, loading: false }));

    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      open: false,
      type: "",
      itemName: "",
      loading: false,
    });
  };

  const visibleMembers = (members || []).slice(0, 3);
  const extraCount = (members?.length || 0) > 3 ? members.length - 3 : 0;

  return (
    <>
      <header className="HeaderTaskBoard w-full flex flex-col px-6 gap-3 py-5">
        <div className="topSide flex justify-between w-full">
          <div className="resultBoard flex items-center">
            <ProgressBar />
          </div>

          <div className="shareBoard flex items-center gap-2">
            <div className="flex items-center -space-x-2 mr-2">
              {visibleMembers.length > 0 ? (
                <>
                  {visibleMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={openUsersModal}
                      className="w-8 h-8 rounded-full bg-[#8C6D51] text-[#E6E4D8] text-xs font-semibold flex items-center justify-center border border-[#E6E4D8] shadow-sm cursor-pointer"
                      title={getDisplayName(member)}
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={getDisplayName(member)}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(member)
                      )}
                    </button>
                  ))}

                  {extraCount > 0 && (
                    <button
                      type="button"
                      onClick={openUsersModal}
                      className="w-8 h-8 rounded-full bg-[#22333B] text-[#E6E4D8] text-xs font-semibold flex items-center justify-center border border-[#E6E4D8] cursor-pointer"
                      title={`Ещё ${extraCount} участник(ов)`}
                    >
                      +{extraCount}
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={openUsersModal}
                  className="w-8 h-8 rounded-full bg-[#8C6D51] text-[#E6E4D8] text-lg font-semibold flex items-center justify-center border border-[#E6E4D8] cursor-pointer"
                  title={`Добавить участников в ${isProjectPage ? "проект" : "доску"}`}
                >
                  +
                </button>
              )}
            </div>

            <button
              className="bg-[#E6E4D8] text-[#22333B] text-xs font-semibold rounded-lg py-1 px-3"
              onClick={openUsersModal}
            >
              + Поделиться
            </button>
          </div>
        </div>

        <div className="bottomSide px-2 flex justify-between w-full">
          <div className="viewBoard flex gap-5 h-8 font-semibold text-[#E6E4D8]">
            {userData.id && activeSetting &&  
            <>
              {/* {!isProjectPage && (
                <button className="bg-[#8C6D51] text-xs rounded-lg px-2 py-1"
                // onClick={()=>editBoard(activeBoardId,payloadPut)}
                >
                Редактировать {isProjectPage ? "проект" : "доску"}
                </button>
              )} */}
              {/* {isProjectPage && activeGroupBoardId && (
                <button 
                  className="bg-[#cb2525] text-xs rounded-lg px-2 py-1"
                  onClick={openDeleteBoardFromProjectModal}
                >
                  Удалить доску из проекта
                </button>
              )} */}

              {isProjectPage && (
                <button 
                  className="bg-[#8C6D51] text-xs rounded-lg px-2 py-1"
                  onClick={()=>openModalAddElem("board")}
                >
                  Добавить доску к проекту
                </button>
              )}
              <button 
                className="bg-[#cb2525] text-xs rounded-lg px-2 py-1"
                onClick={isProjectPage ? openDeleteProjectModal : openDeleteBoardModal}
              >
                Удалить {isProjectPage ? "проект" : "доску"}
              </button>
            </>
            }
          </div>
          <div className="boardFunction flex gap-3">
            <img
              className="w-5 cursor-pointer"
              src="/image/IconRestart.svg"
              alt="IconRestart"
              onClick={() => activeBoardId && getColumnFunc(activeBoardId)}
            />
            <img
              className="w-5 cursor-pointer"
              src="/image/IconFull.svg"
              alt="IconFull"
              onClick={()=>setFulled(!isFull)}
            />
            {userData.id && <img
              className="w-5 cursor-pointer"
              src="/image/IconSettingBoard.svg"
              alt="IconSettingBoard"
              onClick={() => setActiveSetting(!activeSetting)}
            />}
          </div>
        </div>

        <ModalWorkUsers 
          members={members} 
          entityType={entityType}
          entityId={currentEntityId}
        />
      </header>

      <ConfirmDeleteModal
        open={deleteModal.open}
        itemName={deleteModal.itemName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteModal.loading || isDeleting}
      />
    </>
  );
};

export default HeaderTaskBoard;