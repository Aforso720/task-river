// src/widgets/TasksBoard/TasksBoard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TasksBoard.scss";
import ModalAddTask from "../../entities/ModalAddTask/ModalAddTask";
import ModalColumnMenu from "../../entities/ModalColumnMenu/ModalColumnMenu";
import useOpenColumnMenu from "../../entities/ModalColumnMenu/useOpenColumnMenu";
import CardBoard from "../../entities/CardBoard/CardBoard";
import HeaderTaskBoard from "../../entities/HeaderTaskBoard/HeaderTaskBoard";
import useListTaskInBoard from "../../entities/HeaderTaskBoard/store/useListTaskInBoard";
import { ModalTaskState } from "../../entities/ModalAddTask/store/ModalTaskState";
import useTargetEvent from "@/pages/Panel/store/useTargetEvent";
import { useWorkColumn } from "@/features/Kanban/api/useWorkColumn";
import { useWorkTasks } from "@/features/Kanban/api/useWorkTasks";

const TasksBoard = (props) => {
  const { boards } = props || {}; // boards есть только на /panel/project/:projectId

  const setTaskCounts = useListTaskInBoard((s) => s.setTaskCounts);
  const { activeBoardId, activeGroupBoardId, activeProjectId } = useTargetEvent();

  const isProjectView = Array.isArray(boards);
  const currentBoardId = isProjectView ? activeGroupBoardId : activeBoardId;

  const {
    getColumnFunc,
    columns: columnsApi,
    loading: columnsLoading,
    postColumnFunc,
    loadingPost,
    deleteColumnFunc,
  } = useWorkColumn();

  const {
    getTasksFunc,
    tasks: tasksApi,
    loading: tasksLoading,
  } = useWorkTasks();

  const { editModalColumnMenu, menuPosition } = useOpenColumnMenu();
  const { openModalTaskState } = ModalTaskState();

  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!currentBoardId) return;
    (async () => {
      await Promise.all([
        getColumnFunc(currentBoardId),
        getTasksFunc(currentBoardId),
      ]);
    })();
  }, [currentBoardId, getColumnFunc, getTasksFunc]);

  const builtColumns = useMemo(() => {
    const sortedCols = [...(columnsApi || [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    );

    const tasksByColumn = new Map();
    (tasksApi || []).forEach((t) => {
      const arr = tasksByColumn.get(t.columnId) || [];
      arr.push(t);
      tasksByColumn.set(t.columnId, arr);
    });
    for (const [, arr] of tasksByColumn) {
      arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }

    return sortedCols.map((c, idx) => ({
      id: c.id,
      title: c.name,
      order: c.position ?? idx,
      cards: (tasksByColumn.get(c.id) || []).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        content: (
          <div className="card-content">
            <label>{t.description || "Описание отсутствует"}</label>
          </div>
        ),
        raw: t,
      })),
    }));
  }, [columnsApi, tasksApi]);

  useEffect(() => {
    setColumns(builtColumns);
  }, [builtColumns]);

  const onDragEnd = (result) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      if (destination.index === source.index) return;
      const newCols = [...columns];
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);
      setColumns(newCols.map((c, i) => ({ ...c, order: i })));
      return;
    }

    const startColId = source.droppableId;
    const finishColId = destination.droppableId;
    if (startColId === finishColId && destination.index === source.index)
      return;

    const newCols = [...columns];
    const startIdx = newCols.findIndex((c) => c.id === startColId);
    const finishIdx = newCols.findIndex((c) => c.id === finishColId);
    if (startIdx === -1 || finishIdx === -1) return;

    const startCol = newCols[startIdx];
    const finishCol = newCols[finishIdx];

    if (startCol === finishCol) {
      const newCards = [...startCol.cards];
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);
      newCols[startIdx] = { ...startCol, cards: newCards };
      setColumns(newCols);
      return;
    }

    const startCards = [...startCol.cards];
    const [moved] = startCards.splice(source.index, 1);
    const finishCards = [...finishCol.cards];
    finishCards.splice(destination.index, 0, moved);

    newCols[startIdx] = { ...startCol, cards: startCards };
    newCols[finishIdx] = { ...finishCol, cards: finishCards };
    setColumns(newCols);
  };

  const [currentColumnId, setCurrentColumnId] = useState("");

  useEffect(() => {
    const totalTasks = columns.reduce((acc, c) => acc + c.cards.length, 0);
    const doneColumn = columns.find(
      (c) => c.title?.toLowerCase() === "завершено" || c.id === "done"
    );
    const doneTasks = doneColumn ? doneColumn.cards.length : 0;
    setTaskCounts(totalTasks, doneTasks);
  }, [columns, setTaskCounts]);

  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const handleEditColumn = (newName) => {
    if (!newName.trim()) return;
    setColumns((prev) =>
      prev.map((c) => (c.id === currentColumnId ? { ...c, title: newName } : c))
    );
  };

  const handleDeleteColumn = async (columnId) => {
    if (!currentBoardId || !columnId) return;
    try {
      await deleteColumnFunc(currentBoardId, columnId);
      await getColumnFunc(currentBoardId);
      if (currentColumnId === columnId) setCurrentColumnId("");
    } catch (e) {
      console.error("Не удалось удалить колонку:", e);
    }
  };

  const handleAddColumn = async () => {
    const name = newColumnName.trim();
    if (!name || !currentBoardId) return;

    const payload = { name, position: columns.length };

    try {
      await postColumnFunc(currentBoardId, payload);
      await getColumnFunc(currentBoardId);
      setNewColumnName("");
      setIsAddColumnVisible(false);
    } catch (e) {
      console.error("Не удалось создать колонку:", e);
    }
  };

  const loading = columnsLoading || tasksLoading;

  const projectBoards = useMemo(() => {
    if (!isProjectView || !activeProjectId) return [];
    return (boards || []).filter((b) => b.projectId === activeProjectId);
  }, [isProjectView, boards, activeProjectId]);

  if (isProjectView && projectBoards.length === 0) {
    return (
      <div className="tasks-board-container">
        <HeaderTaskBoard />
        <div className="tasks-board-wrapper">
          <div className="w-full h-full ml-5 text-4xl flex items-center justify-center text-center text-[#22333B]">
            У выбранного проекта пока нет досок.
            <br />
            Создайте доску в панели слева, чтобы начать работу.
          </div>
        </div>
      </div>
    );
  }

  if (!currentBoardId) {
    return (
      <div className="tasks-board-container">
        <HeaderTaskBoard />
        <div className="tasks-board-wrapper">
          <div className="w-full h-full ml-5 text-4xl flex items-center justify-center text-center text-[#22333B]">
            Доска не выбрана
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-board-container">
      <HeaderTaskBoard />
      <div className="tasks-board-wrapper">
        <div className="tasks-board">
          {loading && (
            <div className="px-4 py-2 text-sm text-[#22333B]">Загружаем…</div>
          )}

          <DragDropContext
            onDragEnd={(result) => {
              setIsDraggingColumn(false);
              onDragEnd(result);
            }}
            onDragStart={(start) => {
              if (start.type === "COLUMN") setIsDraggingColumn(true);
            }}
          >
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <div
                  className="columns-container flex"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="columns">
                    {columns.map((column, index) => (
                      <Draggable
                        key={column.id}
                        draggableId={String(column.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`column-wrapper ${
                              snapshot.isDragging ? "is-dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div className="column">
                              <div
                                className="column-header flex justify-between items-center"
                                {...provided.dragHandleProps}
                              >
                                <h3 className="text-2xl font-bold">
                                  {column.title}
                                  <span className="task-count">
                                    {column.cards.length}
                                  </span>
                                </h3>

                                <img
                                  className="cursor-pointer w-5 h-5"
                                  src="/image/MenuModelBoard.png"
                                  alt="Menu Column"
                                  onClick={(e) => {
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    editModalColumnMenu(
                                      {
                                        top: rect.bottom + window.scrollY,
                                        left: rect.left + window.scrollX + 5,
                                      },
                                      column.id
                                    );
                                    setCurrentColumnId(column.id);
                                  }}
                                />
                              </div>

                              <Droppable droppableId={String(column.id)}>
                                {(provided) => (
                                  <CardBoard
                                    column={column}
                                    provided={provided}
                                    setCurrentColumnId={setCurrentColumnId}
                                    setIsModalOpen={openModalTaskState}
                                  />
                                )}
                              </Droppable>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {!isDraggingColumn &&
                      (isAddColumnVisible ? (
                        <div
                          className={`add-column-inline ${
                            isDraggingColumn ? "hidden-during-drag" : ""
                          }`}
                        >
                          <input
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="Название колонки"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddColumn()
                            }
                          />
                          <button
                            className="add-column-button"
                            onClick={handleAddColumn}
                            disabled={!newColumnName.trim() || loadingPost}
                          >
                            {loadingPost ? "…" : "+"}
                          </button>
                          <button
                            className="cancel-add-column"
                            onClick={() => {
                              setNewColumnName("");
                              setIsAddColumnVisible(false);
                            }}
                            disabled={loadingPost}
                          >
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <div className="add-column-inline-two">
                          <button
                            className="add-column-toggle"
                            onClick={() => setIsAddColumnVisible(true)}
                          >
                            + Добавить колонку
                          </button>
                        </div>
                      ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <ModalAddTask />

          <ModalColumnMenu
            position={menuPosition}
            onEditColumn={handleEditColumn}
            onDeleteColumn={() => handleDeleteColumn(currentColumnId)}
            onAddTask={() => {
              setCurrentColumnId(currentColumnId);
              openModalTaskState();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksBoard;
