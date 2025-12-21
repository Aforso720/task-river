import React, { useEffect, useState } from "react";
import "./ModalAddTask.scss";
import { ModalTaskState } from "./store/ModalTaskState";
import { useWorkTasks } from "@/features/Kanban/api/useWorkTasks";
import useTargetEvent from "@/pages/Panel/store/useTargetEvent";

const difficultyByPriority = {
  "Высокий": "HARD",
  "Средний": "MEDIUM",
  "Низкий": "EASY",
};

export default function ModalAddTask() {
  const {
    modalInTaskState,
    mode, 
    selectedTask,
    currentColumnId,
    closeModalTaskState,
  } = ModalTaskState();

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const { activeBoardId } = useTargetEvent();

  const {
    postTasksFunc,
    updateTasksFunc,
    getTasksFunc,
    loadingPost,
    loadingPut,
    tasks: tasksAll,
  } = useWorkTasks();

  const [form, setForm] = useState({ title: "", description: "" });
  const [priority, setPriority] = useState("Высокий");
  const [deadlineDate, setDeadlineDate] = useState("2025-06-23");
  const [deadlineTime, setDeadlineTime] = useState("14:30");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!modalInTaskState) return;

    if (isAddMode || !selectedTask) {
      setForm({ title: "", description: "" });
      setPriority("Высокий");
    } else {
      const raw = selectedTask.raw || selectedTask;
      setForm({
        title: raw?.title ?? "",
        description: raw?.description ?? "",
      });

      const d = String(raw?.difficulty || "").trim().toUpperCase();
      if (d === "HIGH") setPriority("Высокий");
      else if (d === "MEDIUM") setPriority("Средний");
      else setPriority("Низкий");
    }

    setFiles([]);
  }, [modalInTaskState, isAddMode, selectedTask]);

  if (!modalInTaskState) return null;

  const calcLastPositionInColumn = (colId) => {
    const last = (tasksAll || [])
      .filter((t) => t.columnId === colId)
      .reduce((max, t) => Math.max(max, t.position ?? -1), -1);
    return last;
  };

  const onSave = async () => {
    if (isViewMode) return;

    const title = (form.title || "").trim();
    if (!title) return;

    const description = (form.description || "").trim();
    const difficulty = difficultyByPriority[priority] || "LOW";

    try {
      if (isAddMode) {
        const colId = currentColumnId;
        const lastPos = calcLastPositionInColumn(colId);
        const position = lastPos + 1;

        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("difficulty", difficulty);

        fd.append("columnId", colId);

        fd.append("position", String(position));

        fd.append("boardId", activeBoardId);

        fd.append("responsibleUserIds", "68ad5e4b6f10733f3245325f");

        files.forEach((file) => {
          fd.append("attachments", file);
        });

        await postTasksFunc(activeBoardId, fd);
        await getTasksFunc(activeBoardId);
        closeModalTaskState();
      }

      if (isEditMode && selectedTask) {
        const prev = selectedTask.raw || selectedTask;
        const prevColId = prev?.columnId;
        const nextColId = currentColumnId || prevColId;

        let position = prev?.position ?? 0;
        if (nextColId !== prevColId) {
          const lastPos = calcLastPositionInColumn(nextColId);
          position = lastPos + 1;
        }

        const payload = {
          title,
          description,
          difficulty,
          columnId: nextColId,
          position,
          responsibleUserIds: prev?.responsibleUserIds || [
            "68ad5e4b6f10733f3245325f",
          ],
          attachments: prev?.attachments || [],
        };

        await updateTasksFunc(activeBoardId, prev.id, payload);
        await getTasksFunc(activeBoardId);
        closeModalTaskState();
      }
    } catch (err) {
      console.error("Не удалось сохранить задачу:", err);
    }
  };

  const handleFileChange = (e) => {
    if (isViewMode) return;
    const newFiles = [...files, ...Array.from(e.target.files || [])];
    setFiles(newFiles);
  };

  const removeFile = (index) => {
    if (isViewMode) return;
    setFiles(files.filter((_, i) => i !== index));
  };

  const users = [
    // { id: 1, firstName: "Екатерина", lastName: "Алексеева", avatar: null },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-medium text-xl text-[#000000] text-center w-full">
          {isAddMode && "Добавление задачи"}
          {isEditMode && "Редактирование задачи"}
          {isViewMode && "Просмотр задачи"}
        </h3>

        <div className="contentModalAdd px-5 flex gap-10">
          <div className="leftSide w-60">
            <label>Заголовок задачи</label>
            <input
              className="w-full"
              type="text"
              value={form.title}
              disabled={isViewMode}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />

            <label>Описание задачи</label>
            <textarea
              className="h-20 max-h-32 w-full"
              value={form.description}
              disabled={isViewMode}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
            />

            <div className="assignee-row">
              <label>Ответственные</label>
              <div className="assignees-column h-auto max-h-24 overflow-y-auto my-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="assignee-item bg-[#F7F7F7] p-1 rounded-lg flex items-center"
                  >
                    <div className="avatar ml-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        `${user.lastName[0]}${user.firstName[0]}`
                      )}
                    </div>
                    <div className="user-name text-xs flex-grow">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                ))}
              </div>

              {!isViewMode && (
                <button
                  className="add-btn w-full flex justify-center rounded-xl"
                  type="button"
                >
                  +
                </button>
              )}
            </div>
          </div>

          <div className="ridthSide">
            <div className="deadline-row flex flex-col ">
              <label>Сроки</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  disabled={isViewMode}
                />
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="priority-row">
              <label>Приоритет</label>
              <div className="priority-options">
                <button
                  className={`high-priority ${
                    priority === "Высокий" ? "selected" : ""
                  }`}
                  onClick={() => !isViewMode && setPriority("Высокий")}
                  disabled={isViewMode}
                  type="button"
                >
                  Высокий
                </button>

                <button
                  className={`medium-priority ${
                    priority === "Средний" ? "selected" : ""
                  }`}
                  onClick={() => !isViewMode && setPriority("Средний")}
                  disabled={isViewMode}
                  type="button"
                >
                  Средний
                </button>

                <button
                  className={`low-priority ${
                    priority === "Низкий" ? "selected" : ""
                  }`}
                  onClick={() => !isViewMode && setPriority("Низкий")}
                  disabled={isViewMode}
                  type="button"
                >
                  Низкий
                </button>
              </div>
            </div>

            <div className="file-section space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Прикрепленные файлы
              </label>

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="fileElem flex items-center justify-between h-auto max-h-14 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                    >
                      <div className="flex gap-2 text-xs font-medium w-64">
                        <img src="/image/FileTask.svg" alt="" />
                        <span className="flex flex-col truncate max-w-[80%]">
                          {file.name}{" "}
                          <span className="text-[#22333B] font-normal">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </span>
                      </div>
                      {!isViewMode && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-[#22333B] hover:text-red-500 transition-colors"
                          type="button"
                        >
                          <img src="/image/CorzinaTask.svg" alt="" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {!isViewMode && (
                <div className="file-upload-container relative">
                  <input
                    type="file"
                    id="fileInput"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl mb-1 text-gray-400">+</span>
                    <span className="text-sm text-[#22333B99] font-medium">
                      Прикрепить файл
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions mx-5 mb-2">
          {!isViewMode && !isAddMode && (
            <button className="delete-btn" type="button">
              Удалить
            </button>
          )}

          <div className="gap-5 flex">
            <button
              onClick={closeModalTaskState}
              className="cancel-btn"
              type="button"
            >
              Отмена
            </button>

            {!isViewMode && (
              <button
                className="save-btn"
                onClick={onSave}
                type="button"
                disabled={loadingPost || loadingPut}
              >
                {loadingPost || loadingPut ? "Сохраняем…" : "Сохранить"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
