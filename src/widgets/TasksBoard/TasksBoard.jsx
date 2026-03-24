import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { useDebouncedCallback } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";

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
import { useGetTasks } from "@/features/Kanban/api/useGetTasks";
import { useWorkTasks } from "@/features/Kanban/api/useWorkTasks"; // ✅ добавили
import SkeletonColumn from "@/shared/Skeletons/SkeletonColumn";
import StrictModeDroppable from "@/shared/StrictModeDroppable";

const FALLBACK_USER_ID = "68ad5e4b6f10733f3245325f";

const extractTasksArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.tasks)) return res.tasks;
  if (Array.isArray(res?.data)) return res.data;
  return null;
};

const sortTasks = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
};

const normalizeIds = (v) => {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (v == null) return [];
  return [String(v)].filter(Boolean);
};

const appendResponsibleUserIds = (fd, ids) => {
  const uniq = Array.from(new Set(normalizeIds(ids)));
  const safe = uniq.length ? uniq : [FALLBACK_USER_ID];
  safe.forEach((id) => fd.append("responsibleUserIds", String(id)));
};

// ✅ из локальных columns строим массив raw tasks для React Query кэша
const buildTasksFromColumns = (cols) => {
  const out = [];
  (cols || []).forEach((col) => {
    (col.cards || []).forEach((card, idx) => {
      const raw = card.raw || {};
      out.push({
        ...raw,
        id: raw.id ?? card.id,
        columnId: String(col.id),
        position: idx,
      });
    });
  });
  return sortTasks(out);
};

// ✅ обновляет raw у карточек: columnId/position, чтобы PUT отправлял правильные значения
const reindexColumnCards = (col) => ({
  ...col,
  cards: (col.cards || []).map((card, idx) => ({
    ...card,
    raw: {
      ...(card.raw || {}),
      id: (card.raw || {}).id ?? card.id,
      columnId: String(col.id),
      position: idx,
    },
  })),
});

const TasksBoard = (props) => {
  const { boards } = props || {};

  const queryClient = useQueryClient();

  const setTaskCounts = useListTaskInBoard((s) => s.setTaskCounts);
  const { activeBoardId, activeGroupBoardId, activeProjectId } = useTargetEvent();

  const isProjectView = Array.isArray(boards);
  const currentBoardId = isProjectView ? activeGroupBoardId : activeBoardId;

  const { postColumnFunc, loadingPost, deleteColumnFunc, putColumnFunc } = useWorkColumn();

  const {
    columns: columnsApi,
    loading: columnsLoading,
    refetch: refetchColumns,
    // error: columnsError,
  } = useGetColumns(currentBoardId, { enabled: !!currentBoardId });

  const {
    tasks: tasksApi,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks, // ✅ пригодится если что-то пошло не так
  } = useGetTasks(currentBoardId, { enabled: !!currentBoardId });

  const updateTasksFunc = useWorkTasks((s) => s.updateTasksFunc); // ✅ PUT карточки

  const { editModalColumnMenu, menuPosition } = useOpenColumnMenu();
  const { openModalTaskState } = ModalTaskState();

  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [columns, setColumns] = useState([]);
  const [currentColumnId, setCurrentColumnId] = useState("");

  // =========================
  // 1) Сборка колонок + задач
  // =========================
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

  // ==========================================
  // 2) Debounce очередь сохранения порядка колонок
  // ==========================================
  const pendingColRef = useRef(null);

  const commitPendingColumnOrder = useDebouncedCallback(async () => {
    const pending = pendingColRef.current;
    if (!pending) return;

    pendingColRef.current = null;

    const { boardId, cols, start, end } = pending;
    if (!boardId || !Array.isArray(cols) || cols.length === 0) return;

    const safeStart = Math.max(0, start ?? 0);
    const safeEnd = Math.min(cols.length - 1, end ?? cols.length - 1);

    const slice = cols.slice(safeStart, safeEnd + 1);

    try {
      await Promise.all(
        slice.map((col, i) => {
          const position = safeStart + i;
          return putColumnFunc(boardId, col.id, { name: col.title, position });
        })
      );

      await refetchColumns();
    } catch (e) {
      console.error("Не удалось сохранить порядок колонок:", e);
      await refetchColumns();
    }
  }, 800);

  const queuePersistColumnPositions = (nextCols, sourceIndex, destIndex) => {
    if (!currentBoardId) return;

    const start = Math.min(sourceIndex, destIndex);
    const end = Math.max(sourceIndex, destIndex);

    const prev = pendingColRef.current;

    if (prev && prev.boardId === currentBoardId) {
      pendingColRef.current = {
        boardId: currentBoardId,
        cols: nextCols,
        start: Math.min(prev.start, start),
        end: Math.max(prev.end, end),
      };
    } else {
      pendingColRef.current = { boardId: currentBoardId, cols: nextCols, start, end };
    }

    commitPendingColumnOrder();
  };

  // ==========================================
  // 3) Debounce очередь сохранения карточек
  // ==========================================
  /**
   * pendingTaskRef хранит:
   * - boardId
   * - cols (последнее состояние columns с карточками)
   * - affectedColumnIds (Set) — какие колонки надо пересохранить (позиции + columnId)
   */
  const pendingTaskRef = useRef(null);

  const commitPendingTaskOrder = useDebouncedCallback(async () => {
    const pending = pendingTaskRef.current;
    if (!pending) return;

    pendingTaskRef.current = null;

    const { boardId, cols, affectedColumnIds } = pending;
    if (!boardId || !Array.isArray(cols) || !affectedColumnIds?.size) return;

    const affectedCols = cols.filter((c) => affectedColumnIds.has(String(c.id)));

    let lastTasksFromServer = null;

    try {
      // ⚠️ специально последовательно (не Promise.all), чтобы не DDOS-ить бэк
      for (const col of affectedCols) {
        for (let i = 0; i < (col.cards || []).length; i++) {
          const card = col.cards[i];
          const raw = card.raw || {};
          const taskId = raw.id ?? card.id;
          if (!taskId) continue;

          const fd = new FormData();
          fd.append("title", String(raw.title ?? card.title ?? ""));
          fd.append("description", String(raw.description ?? card.description ?? ""));
          fd.append("difficulty", String(raw.difficulty ?? "LOW"));
          fd.append("columnId", String(col.id));
          fd.append("position", String(i));
          fd.append("boardId", String(boardId));

          // ✅ responsibleUserIds: каждый id отдельным append
          appendResponsibleUserIds(fd, raw.responsibleUserIds);

          const res = await updateTasksFunc(boardId, taskId, fd);
          const arr = extractTasksArray(res);
          if (arr) lastTasksFromServer = arr;
        }
      }

      // ✅ если бэк возвращает массив задач — заменяем им кэш
      if (Array.isArray(lastTasksFromServer)) {
        queryClient.setQueryData(["tasks", boardId], sortTasks(lastTasksFromServer));
      } else {
        // иначе оставляем оптимистичный кэш из cols
        queryClient.setQueryData(["tasks", boardId], buildTasksFromColumns(cols));
      }
    } catch (e) {
      console.error("Не удалось сохранить порядок задач:", e);
      // откат/синхронизация: лучше один GET, чем рассинхрон навсегда
      try {
        await refetchTasks();
      }catch(err){console.log(err)}
    }
  }, 800);

  const queuePersistTaskPositions = (nextCols, columnIds) => {
    if (!currentBoardId) return;

    const prev = pendingTaskRef.current;
    const ids = new Set((columnIds || []).map(String));

    if (prev && prev.boardId === currentBoardId) {
      // объединяем набор колонок, чтобы не потерять изменения
      const merged = new Set([...prev.affectedColumnIds, ...ids]);
      pendingTaskRef.current = {
        boardId: currentBoardId,
        cols: nextCols,
        affectedColumnIds: merged,
      };
    } else {
      pendingTaskRef.current = {
        boardId: currentBoardId,
        cols: nextCols,
        affectedColumnIds: ids,
      };
    }

    commitPendingTaskOrder();
  };

  // ======================================================
  // 4) Не перетираем локальный порядок, пока есть pending по колонкам
  // ======================================================
  useEffect(() => {
    if (pendingColRef.current) return;
    setColumns(builtColumns);
  }, [builtColumns]);

  // ======================================================
  // 5) Flush при уходе / смене доски / скрытии вкладки
  // ======================================================
  useEffect(() => {
    const onHide = () => {
      void commitPendingColumnOrder.flush?.();
      void commitPendingTaskOrder.flush?.();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onHide);
      void commitPendingColumnOrder.flush?.();
      void commitPendingTaskOrder.flush?.();
    };
  }, [commitPendingColumnOrder, commitPendingTaskOrder]);

  useEffect(() => {
    return () => {
      void commitPendingColumnOrder.flush?.();
      void commitPendingTaskOrder.flush?.();
    };
  }, [currentBoardId, commitPendingColumnOrder, commitPendingTaskOrder]);

  // ==========================================
  // 6) Редактирование названия колонки
  // ==========================================
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

  // ==========================================
  // 7) Drag & Drop
  // ==========================================
  const onDragEnd = async (result) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // ---------- COLUMN ----------
    if (type === "COLUMN") {
      if (destination.index === source.index) return;

      const newCols = [...columns];
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);

      const updatedCols = newCols.map((c, i) => ({ ...c, order: i }));
      setColumns(updatedCols);

      queuePersistColumnPositions(updatedCols, source.index, destination.index);
      return;
    }

    // ---------- CARD ----------
    const startColId = String(source.droppableId);
    const finishColId = String(destination.droppableId);

    if (startColId === finishColId && destination.index === source.index) return;

    const newCols = [...columns];
    const startIdx = newCols.findIndex((c) => String(c.id) === startColId);
    const finishIdx = newCols.findIndex((c) => String(c.id) === finishColId);
    if (startIdx === -1 || finishIdx === -1) return;

    const startCol = newCols[startIdx];
    const finishCol = newCols[finishIdx];

    // перемещение в пределах одной колонки
    if (startIdx === finishIdx) {
      const newCards = [...startCol.cards];
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      newCols[startIdx] = reindexColumnCards({ ...startCol, cards: newCards });

      setColumns(newCols);

      // ✅ оптимистично обновляем кэш задач (чтобы builtColumns не откатывал UI)
      queryClient.setQueryData(["tasks", currentBoardId], buildTasksFromColumns(newCols));

      // ✅ сохраняем на бэке с debounce только эту колонку
      queuePersistTaskPositions(newCols, [startColId]);
      return;
    }

    // перемещение между колонками
    const startCards = [...startCol.cards];
    const [moved] = startCards.splice(source.index, 1);
    const finishCards = [...finishCol.cards];
    finishCards.splice(destination.index, 0, moved);

    newCols[startIdx] = reindexColumnCards({ ...startCol, cards: startCards });
    newCols[finishIdx] = reindexColumnCards({ ...finishCol, cards: finishCards });

    setColumns(newCols);

    queryClient.setQueryData(["tasks", currentBoardId], buildTasksFromColumns(newCols));

    // ✅ сохраняем две колонки: источник и назначение
    queuePersistTaskPositions(newCols, [startColId, finishColId]);
  };

  // ==========================================
  // 8) Подсчёт задач
  // ==========================================
  useEffect(() => {
    const totalTasks = columns.reduce((acc, c) => acc + c.cards.length, 0);
    const doneColumn = columns.find(
      (c) => c.title?.toLowerCase() === "завершено" || String(c.id) === "done"
    );
    const doneTasks = doneColumn ? doneColumn.cards.length : 0;
    setTaskCounts(totalTasks, doneTasks);
  }, [columns, setTaskCounts]);

  // ==========================================
  // 9) Add/Delete column
  // ==========================================
  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const handleDeleteColumn = async (columnId) => {
    if (!currentBoardId || !columnId) return;

    void commitPendingColumnOrder.flush?.();
    void commitPendingTaskOrder.flush?.();

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

    void commitPendingColumnOrder.flush?.();
    void commitPendingTaskOrder.flush?.();

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

  if (tasksError) {
    return (
      <div className="tasks-board-container">
        <HeaderTaskBoard />
        <div className="tasks-board-wrapper">
          <div className="w-full h-full ml-5 text-2xl flex items-center justify-center text-center">
            Ошибка загрузки задач этой доски (500).
            <br />
            Попробуй открыть другую доску или обновить страницу.
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
                                        const rect = e.currentTarget.getBoundingClientRect();
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

                                  <StrictModeDroppable droppableId={String(column.id)}>
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
                                onChange={(e) => setNewColumnName(e.target.value)}
                                placeholder="Название колонки"
                                onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
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
                  columns.find((c) => String(c.id) === String(currentColumnId))?.title ||
                  ""
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
