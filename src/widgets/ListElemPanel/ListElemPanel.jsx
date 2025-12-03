// src/widgets/ListElemPanel/ListElemPanel.jsx
import React, { useState } from "react";
import "./ListElemPanel.scss";
import { useNavigate } from "react-router";
import useTargetEvent from "../../pages/Panel/store/useTargetEvent";
import useModalAddElemStore from "../../widgets/AddElemModal/useModalAddElemStore";
import ConfirmDeleteModal from "@/shared/ConfirmDeleteModal/ConfirmDeleteModal";
import CrossIcon from "@/shared/UI/CrossIcon";
import { useDeleteElemPanel } from "@/features/Kanban/api/useDeleteElemPanel";
import SkeletonMenuElem from "@/shared/Skeletons/SkeletonMenuElem";

const ListElemPanel = ({ type, list, listBoards, loading }) => {
  const openModalAddElem = useModalAddElemStore(
    (state) => state.openModalAddElem
  );

  const addProjectID = useTargetEvent((state) => state.addProjectID);
  const addGroupBoardId = useTargetEvent((state) => state.addGroupBoardId);
  const addBoardID = useTargetEvent((state) => state.addBoardID);
  const addTaskID = useTargetEvent((state) => state.addTaskID);

  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  const deleteElemPanel = useDeleteElemPanel((s) => s.deleteElemPanel);
  const storeDeleting = useDeleteElemPanel((s) => s.isDeleting);

  const handleClick = (item) => {
    if (type === "Проекты") {
      addProjectID?.(item.id);

      const projectBoards = listBoards?.filter((b) => b.projectId === item.id);
      if (projectBoards?.length > 0) addGroupBoardId?.(projectBoards[0].id);
      else addGroupBoardId?.(null);

      navigate(`/panel/project/${item.id}`);
    } else if (type === "Доски") {
      addBoardID?.(item.id);
      navigate(`/panel/board/${item.id}`);
    } else {
      addTaskID?.(item.id);
      navigate(`/panel/tasks/${item.id}`);
    }
  };

  const getTypeAddText = () => {
    if (type === "Проекты") return "проект";
    if (type === "Доски") return "доску";
    return "задачу";
  };

  const handleAddClick = () => {
    if (type === "Проекты") openModalAddElem("project");
    else if (type === "Доски") openModalAddElem("board");
    else openModalAddElem("task");
  };

  const askDelete = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmItem(item);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmItem) return;
    await deleteElemPanel(type, confirmItem.id);
    setConfirmOpen(false);
    setConfirmItem(null);
  };

  return (
    <article
      className={`ListElemPanel ${type === "Задачи" ? "" : " borderListElem"}`}
    >
      <h3 className="text-3xl font-bold text-[#22333B]">{type}</h3>
      <ul>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonMenuElem 
                key={`skeleton-${index}`}
                />
            ))
          : list.map((item) => (
              <li
                key={item.id}
                onClick={() => handleClick(item)}
                className="relative cursor-pointer group"
              >
                {item.icon && (
                  <img
                    src={`/image/${item.icon}`}
                    alt="Icon"
                    className="item-icon"
                    style={{ width: 24, height: 24 }}
                  />
                )}
                <p className="font-medium text-xs text-[#22333B]">
                  {item.name ?? item.title}
                </p>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    askDelete(e, item);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  aria-label="Удалить"
                  title="Удалить"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      askDelete(e, item);
                    }
                  }}
                  className="
              absolute right-1.5 top-1/2 -translate-y-1/2
              w-[22px] h-[22px] grid place-items-center
              rounded-md cursor-pointer z-10
              bg-transparent
              transition-colors duration-200
              hover:bg-[rgba(34,51,59,0.08)]
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#22333B]
            "
                >
                  <span
                    className="
                  pointer-events-none
                  transition-transform duration-300
                  group-hover:rotate-90 group-hover:scale-110
                "
                  >
                    <CrossIcon />
                  </span>
                </span>
              </li>
            ))}

        <li
          className="add-project-item text-xs text-[#22333B]"
          style={{ cursor: "pointer" }}
          onClick={handleAddClick}
        >
          {`+ добавить ${getTypeAddText()}`}
        </li>
      </ul>

      <ConfirmDeleteModal
        open={confirmOpen}
        itemName={confirmItem?.name ?? confirmItem?.title ?? ""}
        loading={storeDeleting}
        onCancel={() => {
          if (storeDeleting) return;
          setConfirmOpen(false);
          setConfirmItem(null);
        }}
        onConfirm={confirmDelete}
      />
    </article>
  );
};

export default ListElemPanel;
