import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
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
import { useGetColumns } from "@/features/Kanban/api/useGetColumns";
import { useGetTasks } from "@/features/Kanban/api/useGetTasks"; // ✅ NEW: задачи через React Query
import SkeletonColumn from "@/shared/Skeletons/SkeletonColumn";
import StrictModeDroppable from "@/shared/StrictModeDroppable";

const TasksBoard = (props) => {
  const { boards } = props || {};

  const setTaskCounts = useListTaskInBoard((s) => s.setTaskCounts);
  const { activeBoardId, activeGroupBoardId, activeProjectId } = useTargetEvent();

  const isProjectView = Array.isArray(boards);
  const currentBoardId = isProjectView ? activeGroupBoardId : activeBoardId;

  const { postColumnFunc, loadingPost, deleteColumnFunc, putColumnFunc } =
    useWorkColumn();

  const {
    columns: columnsApi,
    loading: columnsLoading,
    refetch: refetchColumns,
  } = useGetColumns(currentBoardId, { enabled: !!currentBoardId });

  // ✅ GET задач теперь из React Query, без zustand.getTasksFunc
  const {
    tasks: tasksApi,
    loading: tasksLoading,
  } = useGetTasks(currentBoardId, { enabled: !!currentBoardId });

  const { editModalColumnMenu, menuPosition } = useOpenColumnMenu();
  const { openModalTaskState } = ModalTaskState();

  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [columns, setColumns] = useState([]);
  const [currentColumnId, setCurrentColumnId] = useState("");

  const builtColumns = useMemo(() => {
    const sortedCols = [...(columnsApi || [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    );

    const tasksByColumn = new Map();
    (tasksApi || []).forEach((t) => {
      const key = String(t.columnId);
      const arr = tasksByColumn.get(key) || [];
      arr.push(t);
      tasksByColumn.set(key, arr);
    });

    for (const [, arr] of tasksByColumn) {
      arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }

    return sortedCols.map((c, idx) => ({
      id: c.id,
      title: c.name,
      order: c.position ?? idx,
      cards: (tasksByColumn.get(String(c.id)) || []).map((t) => ({
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

  // ✅ Редактирование названия колонки из модалки
  const handleEditColumnName = async (newNameRaw) => {
    const newName = String(newNameRaw || "").trim();
    if (!newName || !currentBoardId || !currentColumnId) return;

    const col = columns.find((c) => String(c.id) === String(currentColumnId));
    const position =
      typeof col?.order === "number"
        ? col.order
        : columns.findIndex((c) => String(c.id) === String(currentColumnId));

    try {
      await putColumnFunc(currentBoardId, currentColumnId, {
        name: newName,
        position: Math.max(0, position),
      });

      await refetchColumns();
    } catch (e) {
      console.error("Не удалось изменить название колонки:", e);
      await refetchColumns();
    }
  };

  // ✅ PUT только для затронутого диапазона колонок
  const persistColumnPositions = async (nextCols, sourceIndex, destIndex) => {
    if (!currentBoardId) return;

    const start = Math.min(sourceIndex, destIndex);
    const end = Math.max(sourceIndex, destIndex);
    const slice = nextCols.slice(start, end + 1);

    try {
      await Promise.all(
        slice.map((col, i) => {
          const position = start + i;
          return putColumnFunc(currentBoardId, col.id, {
            name: col.title,
            position,
          });
        })
      );

      await refetchColumns();
    } catch (e) {
      console.error("Не удалось сохранить порядок колонок:", e);
      await refetchColumns();
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      if (destination.index === source.index) return;

      const newCols = [...columns];
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);

      const updatedCols = newCols.map((c, i) => ({ ...c, order: i }));
      setColumns(updatedCols);

      await persistColumnPositions(updatedCols, source.index, destination.index);
      return;
    }

    // карточки — локально как было
    const startColId = String(source.droppableId);
    const finishColId = String(destination.droppableId);

    if (startColId === finishColId && destination.index === source.index) return;

    const newCols = [...columns];
    const startIdx = newCols.findIndex((c) => String(c.id) === startColId);
    const finishIdx = newCols.findIndex((c) => String(c.id) === finishColId);
    if (startIdx === -1 || finishIdx === -1) return;

    const startCol = newCols[startIdx];
    const finishCol = newCols[finishIdx];

    if (startIdx === finishIdx) {
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

  useEffect(() => {
    const totalTasks = columns.reduce((acc, c) => acc + c.cards.length, 0);
    const doneColumn = columns.find(
      (c) => c.title?.toLowerCase() === "завершено" || String(c.id) === "done"
    );
    const doneTasks = doneColumn ? doneColumn.cards.length : 0;
    setTaskCounts(totalTasks, doneTasks);
  }, [columns, setTaskCounts]);

  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const handleDeleteColumn = async (columnId) => {
    if (!currentBoardId || !columnId) return;
    try {
      await deleteColumnFunc(currentBoardId, columnId);
      await refetchColumns();
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
      await refetchColumns();
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
          {loading ? (
            <div className="columns">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`column-skeleton-${index}`}>
                  <SkeletonColumn />
                </div>
              ))}
            </div>
          ) : (
            <>
              <DragDropContext
                onDragEnd={(result) => {
                  setIsDraggingColumn(false);
                  void onDragEnd(result);
                }}
                onDragStart={(start) => {
                  if (start.type === "COLUMN") setIsDraggingColumn(true);
                }}
              >
                <StrictModeDroppable
                  droppableId="all-columns"
                  direction="horizontal"
                  type="COLUMN"
                >
                  {(dropProvided) => (
                    <div
                      className="columns-container flex"
                      ref={dropProvided.innerRef}
                      {...dropProvided.droppableProps}
                    >
                      <div className="columns">
                        {columns.map((column, index) => (
                          <Draggable
                            key={String(column.id)}
                            draggableId={String(column.id)}
                            index={index}
                          >
                            {(dragProvided, snapshot) => (
                              <div
                                className={`column-wrapper ${
                                  snapshot.isDragging ? "is-dragging" : ""
                                }`}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                style={dragProvided.draggableProps.style}
                              >
                                <div className="column">
                                  <div className="column-header flex justify-between items-center">
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
                                        e.stopPropagation();
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        editModalColumnMenu(
                                          {
                                            top: rect.bottom + window.scrollY,
                                            left:
                                              rect.left + window.scrollX + 5,
                                          },
                                          column.id
                                        );
                                        setCurrentColumnId(column.id);
                                      }}
                                    />
                                  </div>

                                  <StrictModeDroppable
                                    droppableId={String(column.id)}
                                  >
                                    {(innerProvided) => (
                                      <CardBoard
                                        column={column}
                                        provided={innerProvided}
                                        setCurrentColumnId={setCurrentColumnId}
                                      />
                                    )}
                                  </StrictModeDroppable>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {!isDraggingColumn &&
                          (isAddColumnVisible ? (
                            <div className="add-column-inline">
                              <input
                                type="text"
                                value={newColumnName}
                                onChange={(e) =>
                                  setNewColumnName(e.target.value)
                                }
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

                      {dropProvided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </DragDropContext>

              <ModalAddTask typeBoard={currentBoardId} />

              <ModalColumnMenu
                position={menuPosition}
                currentColumnName={
                  columns.find((c) => String(c.id) === String(currentColumnId))
                    ?.title || ""
                }
                onEditColumn={handleEditColumnName}
                onDeleteColumn={() => handleDeleteColumn(currentColumnId)}
                onAddTask={() => {
                  setCurrentColumnId(currentColumnId);
                  openModalTaskState();
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksBoard;
