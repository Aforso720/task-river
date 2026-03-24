import React, { useEffect, useMemo, useState } from "react";
import "./ModalAddTask.scss";
import { ModalTaskState } from "./store/ModalTaskState";
import { useWorkTasks } from "@/features/Kanban/api/useWorkTasks";
import { useForm } from "react-hook-form";
import { useGetTasks } from "@/features/Kanban/api/useGetTasks";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkMembers } from "@/features/Kanban/api/useWorkMembers";
import ConfirmDeleteModal from "@/shared/ConfirmDeleteModal/ConfirmDeleteModal";

const difficultyByPriority = {
  Высокий: "HARD",
  Средний: "MEDIUM",
  Низкий: "EASY",
};

const normalizeAttachment = (a, idx) => {
  if (a == null) return null;

  if (typeof a === "string" || typeof a === "number") {
    const id = String(a);
    return { id, name: `Файл #${id}`, size: null };
  }

  const id = a.id ?? a.fileId ?? a.attachmentId ?? a.uuid ?? a.key ?? null;
  const name =
    a.name ??
    a.filename ??
    a.originalName ??
    a.title ??
    (id ? `Файл #${id}` : `Файл ${idx + 1}`);

  const size = a.size ?? a.fileSize ?? null;

  return { id: id ? String(id) : null, name, size };
};

const sortTasks = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
};

// ✅ helper: добавляем responsibleUserIds как повторяющиеся поля FormData
const appendResponsibleUserIds = (fd, ids) => {
  const uniq = Array.from(
    new Set((ids || []).map((x) => String(x)).filter(Boolean))
  );
  uniq.forEach((id) => fd.append("responsibleUserIds", id));
};

// аккуратно вытаскиваем id из members (на случай разных форматов)
const pickMemberId = (m) =>
  m?.id ?? m?.userId ?? m?.memberId ?? m?.accountId ?? null;

export default function ModalAddTask({ typeBoard }) {
  const queryClient = useQueryClient();

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

  const {
    tasks: tasksAll,
    loading: tasksLoading,
    fetching: tasksFetching,
    refetch: refetchTasks,
  } = useGetTasks(typeBoard, { enabled: modalInTaskState && !!typeBoard });

  const {
    postTasksFunc,
    updateTasksFunc,
    deleteTasksFunc,
    loadingPost,
    loadingPut,
    loadingDelete,
    getFileTask,
    loadingFile,
  } = useWorkTasks();

  // ✅ members из zustand
  const membersBoard = useWorkMembers((s) => s.membersBoard);
  const getMembersBoard = useWorkMembers((s) => s.getMembersBoard);

  // ✅ confirm modal state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // ✅ грузим участников, когда модалка открылась
  useEffect(() => {
    if (!modalInTaskState || !typeBoard) return;
    getMembersBoard(typeBoard).catch(() => {});
  }, [modalInTaskState, typeBoard, getMembersBoard]);

  const boardMemberIds = useMemo(() => {
    const ids = (membersBoard || [])
      .map(pickMemberId)
      .filter(Boolean)
      .map(String);

    return Array.from(new Set(ids));
  }, [membersBoard]);

  const [priority, setPriority] = useState("Высокий");
  const [files, setFiles] = useState([]);
  const [serverError, setServerError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const rawTask = useMemo(
    () => (selectedTask?.raw ? selectedTask.raw : selectedTask),
    [selectedTask]
  );

  const existingAttachments = useMemo(() => {
    const arr = Array.isArray(rawTask?.attachments) ? rawTask.attachments : [];
    return arr.map(normalizeAttachment).filter(Boolean);
  }, [rawTask]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (!modalInTaskState) return;

    setServerError("");
    setFiles([]);
    setConfirmDeleteOpen(false);

    if (isAddMode || !rawTask) {
      reset({ title: "", description: "" });
      setPriority("Высокий");
      return;
    }

    reset({
      title: rawTask?.title ?? "",
      description: rawTask?.description ?? "",
    });

    const d = String(rawTask?.difficulty || "").trim().toUpperCase();
    if (d === "HIGH" || d === "HARD") setPriority("Высокий");
    else if (d === "MEDIUM") setPriority("Средний");
    else setPriority("Низкий");
  }, [modalInTaskState, isAddMode, rawTask, reset]);

  if (!modalInTaskState) return null;

  const calcLastPositionInColumn = (colId) => {
    const last = (tasksAll || [])
      .filter((t) => String(t.columnId) === String(colId))
      .reduce((max, t) => Math.max(max, t.position ?? -1), -1);
    return last;
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

  const downloadAttachment = async (att) => {
    if (!att?.id) return;

    setServerError("");
    setDownloadingId(att.id);

    try {
      const res = await getFileTask(typeBoard, att.id);

      const blob = res?.blob instanceof Blob ? res.blob : new Blob([res?.blob]);
      const filename = res?.filename || att.name || `file-${att.id}`;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Не удалось скачать файл";
      setServerError(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  // ✅ реальное удаление после подтверждения
  const doDelete = async () => {
    if (!typeBoard || !rawTask?.id) return;

    setServerError("");

    try {
      const res = await deleteTasksFunc(typeBoard, rawTask.id);

      if (Array.isArray(res)) {
        queryClient.setQueryData(["tasks", typeBoard], sortTasks(res));
      } else {
        queryClient.setQueryData(["tasks", typeBoard], (old = []) => {
          if (!Array.isArray(old)) return old;
          return old.filter((t) => String(t.id) !== String(rawTask.id));
        });
      }

      setConfirmDeleteOpen(false);
      closeModalTaskState();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Не удалось удалить задачу";
      setServerError(msg);
      setConfirmDeleteOpen(false);
    }
  };

  const onSave = handleSubmit(async (data) => {
    if (isViewMode) return;

    setServerError("");

    const title = (data.title || "").trim();
    const description = (data.description || "").trim();
    const difficulty = difficultyByPriority[priority] || "LOW";

    try {
      if (isAddMode) {
        const colId = currentColumnId;

        if (tasksLoading || tasksFetching) {
          await refetchTasks();
        }

        const lastPos = calcLastPositionInColumn(colId);
        const position = lastPos + 1;

        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("difficulty", difficulty);
        fd.append("columnId", String(colId));
        fd.append("position", String(position));
        fd.append("boardId", String(typeBoard));

        if (boardMemberIds.length > 0) {
          appendResponsibleUserIds(fd, boardMemberIds);
        } else {
          appendResponsibleUserIds(fd, ["68ad5e4b6f10733f3245325f"]);
        }

        files.forEach((file) => fd.append("attachments", file));

        const tasksFromServer = await postTasksFunc(typeBoard, fd);

        queryClient.setQueryData(["tasks", typeBoard], sortTasks(tasksFromServer));
        closeModalTaskState();
      }

      if (isEditMode && rawTask) {
        const prevColId = rawTask?.columnId;
        const nextColId = currentColumnId || prevColId;

        if (tasksLoading || tasksFetching) {
          await refetchTasks();
        }

        let position = rawTask?.position ?? 0;
        if (String(nextColId) !== String(prevColId)) {
          const lastPos = calcLastPositionInColumn(nextColId);
          position = lastPos + 1;
        }

        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("difficulty", difficulty);
        fd.append("columnId", String(nextColId));
        fd.append("position", String(position));
        fd.append("boardId", String(typeBoard));

        const fallbackIds =
          Array.isArray(rawTask?.responsibleUserIds) &&
          rawTask.responsibleUserIds.length
            ? rawTask.responsibleUserIds
            : ["68ad5e4b6f10733f3245325f"];

        if (boardMemberIds.length > 0) {
          appendResponsibleUserIds(fd, boardMemberIds);
        } else {
          appendResponsibleUserIds(fd, fallbackIds);
        }

        files.forEach((file) => fd.append("attachments", file));

        const tasksFromServer = await updateTasksFunc(typeBoard, rawTask.id, fd);

        queryClient.setQueryData(["tasks", typeBoard], sortTasks(tasksFromServer));
        closeModalTaskState();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Не удалось сохранить задачу";
      setServerError(msg);
    }
  });

  return (
    <div className="modal-overlay">
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        itemName={rawTask?.title || "задачу"}
        loading={loadingDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={doDelete}
      />

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
              disabled={isViewMode}
              aria-invalid={!!errors.title}
              {...register("title", {
                required: "Заполните заголовок",
                validate: (v) =>
                  (v || "").trim().length > 0 || "Заполните заголовок",
              })}
            />
            {errors.title && (
              <div className="text-xs" style={{ color: "#cc0000" }}>
                {errors.title.message}
              </div>
            )}

            <label>Описание задачи</label>
            <textarea
              className="h-20 max-h-32 w-full"
              disabled={isViewMode}
              aria-invalid={!!errors.description}
              {...register("description", {
                required: "Заполните описание",
                validate: (v) =>
                  (v || "").trim().length > 0 || "Заполните описание",
              })}
            />
            {errors.description && (
              <div className="text-xs" style={{ color: "#cc0000" }}>
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="ridthSide">
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

              {existingAttachments.length > 0 && (
                <ul className="space-y-2">
                  {existingAttachments.map((att) => (
                    <li
                      key={att.id || att.name}
                      className="fileElem flex items-center justify-between h-auto max-h-14 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                    >
                      <div className="flex gap-2 text-xs font-medium w-64">
                        <img src="/image/FileTask.svg" alt="" />
                        <span className="flex flex-col truncate max-w-[80%]">
                          {att.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadAttachment(att)}
                        disabled={!att.id || loadingFile || downloadingId === att.id}
                        className="text-[#22333B] hover:text-blue-600 transition-colors text-xs"
                      >
                        {downloadingId === att.id ? "Скачиваем…" : "Скачать"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="fileElem flex items-center justify-between h-auto max-h-14 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                    >
                      <div className="flex gap-2 text-xs font-medium w-64">
                        <img src="/image/FileTask.svg" alt="" />
                        <span className="flex flex-col truncate max-w-[80%]">
                          {file.name}
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

        {serverError && (
          <div className="mx-5 mt-2" style={{ color: "#cc0000", textAlign: "left" }}>
            {serverError}
          </div>
        )}

        <div className="modal-actions mx-5 mb-2">
          {!isViewMode && !isAddMode && (
            <button
              className="delete-btn"
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={loadingDelete || loadingPost || loadingPut}
            >
              {loadingDelete ? "Удаляем…" : "Удалить"}
            </button>
          )}

          <div className="gap-5 flex">
            <button
              onClick={() => {
                setConfirmDeleteOpen(false);
                closeModalTaskState();
              }}
              className="cancel-btn"
              type="button"
              disabled={isSubmitting}
            >
              Отмена
            </button>

            {!isViewMode && (
              <button
                className="save-btn"
                onClick={onSave}
                type="button"
                disabled={
                  loadingPost ||
                  loadingPut ||
                  loadingDelete ||
                  isSubmitting ||
                  !isValid ||
                  tasksLoading
                }
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
