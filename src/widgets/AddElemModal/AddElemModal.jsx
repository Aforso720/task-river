import React, { useEffect, useState } from "react";
import "./AddElemModal.scss";
import useModalAddElemStore from "./useModalAddElemStore";
import { usePostElemPanel } from "@/features/Kanban/api/usePostElemPanel";
import { useGetElemPanel } from "@/pages/Panel/api/useGetElemPanel";

const AddElemModal = () => {
  const { ModalAddElemState, typeModalAddElem, closeModalAddElem } =
    useModalAddElemStore();
  const createElemPanel = usePostElemPanel((s) => s.createElemPanel);
  // const error = usePostElemPanel((s)=>s.error);

  const projects = useGetElemPanel((s) => s.projects) || [];
  const getAllElemPanel = useGetElemPanel((s) => s.getAllElemPanel);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachToProject: false,
    projectId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      ModalAddElemState &&
      typeModalAddElem === "board" &&
      projects.length === 0
    ) {
      getAllElemPanel?.();
    }
  }, [ModalAddElemState, typeModalAddElem, projects.length, getAllElemPanel]);

  useEffect(() => {
    if (!ModalAddElemState) {
      setFormData({
        title: "",
        description: "",
        attachToProject: false,
        projectId: "",
      });
      setErrors({});
    }
  }, [ModalAddElemState]);

  if (!ModalAddElemState) return null;

  const getTitleLabel = () =>
    typeModalAddElem === "project"
      ? "Название проекта"
      : typeModalAddElem === "board"
      ? "Название доски"
      : typeModalAddElem === "task"
      ? "Заголовок задачи"
      : "Название";

  const getDescriptionLabel = () =>
    typeModalAddElem === "project"
      ? "Описание проекта"
      : typeModalAddElem === "board"
      ? "Описание доски"
      : typeModalAddElem === "task"
      ? "Описание задачи"
      : "Описание";

  const renderTitle = () =>
    typeModalAddElem === "project"
      ? "Добавление проекта"
      : typeModalAddElem === "board"
      ? "Добавление доски"
      : typeModalAddElem === "task"
      ? "Добавление задачи"
      : "";

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = "Заполните название";
    if (
      typeModalAddElem === "board" &&
      formData.attachToProject &&
      !formData.projectId
    ) {
      next.projectId = "Выберите проект";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setIsSubmitting(true);
    try {
      const title = formData.title.trim();
      const description = formData.description.trim() || undefined;

      let url = "";
      let payload = {};

      if (typeModalAddElem === "project") {
        url = "projects";
        payload = { name: title, description };
      } else if (typeModalAddElem === "board") {
        url = "boards";
        payload = {
          title, 
          description,
          projectId: formData.attachToProject ? formData.projectId : null,
        };
      } else if (typeModalAddElem === "task") {
        url = "tasks";
        payload = { name: title, description };
      } else {
        throw new Error("Unknown type");
      }

      await createElemPanel(payload, url);
      await getAllElemPanel?.();

      setFormData({
        title: "",
        description: "",
        attachToProject: false,
        projectId: "",
      });
      closeModalAddElem();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Ошибка";
      setErrors((s) => ({ ...s, _form: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="modal-overlayAddElem"
      onClick={isSubmitting ? undefined : closeModalAddElem}
    >
      <article className="modal" onClick={stop}>
        <header>
          <h3>{renderTitle()}</h3>
        </header>

        <form id="add-elem-form" onSubmit={handleSubmit} noValidate>
          <section className="contentModalAdd flex">
            <div className="leftSide">
              <label htmlFor="add-elem-title">{getTitleLabel()}</label>
              <input
                id="add-elem-title"
                name="title"
                className="w-72"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={`Введите ${getTitleLabel().toLowerCase()}`}
                aria-invalid={!!errors.title}
                aria-describedby={
                  errors.title ? "add-elem-title-error" : undefined
                }
                autoComplete="off"
              />
              {errors.message && (
                <div
                  id="add-elem-title-error"
                  className="text-xs"
                  style={{ color: "#cc0000" }}
                >
                  {errors.title}
                </div>
              )}

              {typeModalAddElem === "board" && (
                <div className="attach-project-block">
                  <label htmlFor="attach-to-project" className="attach-toggle">
                    <input
                      id="attach-to-project"
                      type="checkbox"
                      checked={formData.attachToProject}
                      onChange={(e) =>
                        setFormData((s) => ({
                          ...s,
                          attachToProject: e.target.checked,
                          projectId: e.target.checked ? s.projectId : "", // сброс при выключении
                        }))
                      }
                    />
                    <span className="attach-toggle__label">
                      Прикрепить к проекту
                    </span>
                  </label>

                  <div
                    className={`attach-project__collapsible ${
                      formData.attachToProject ? "open" : ""
                    }`}
                  >
                    <label
                      htmlFor="project-select"
                      className="attach-project__label"
                    >
                      Выберите проект
                    </label>
                    <select
                      id="project-select"
                      className="attach-project__select"
                      disabled={!formData.attachToProject}
                      value={formData.projectId}
                      onChange={(e) =>
                        setFormData({ ...formData, projectId: e.target.value })
                      }
                      aria-invalid={!!errors?.projectId}
                    >
                      <option value="">— Не выбран —</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name ?? p.title ?? `#${p.id}`}
                        </option>
                      ))}
                    </select>
                    {errors?.projectId && (
                      <div className="attach-project__error">
                        {errors.projectId}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* твой блок ответственных как был */}
              {/* <div className="assignee-row">
                <label>Ответственные</label>
                <div className="assignees-column h-auto max-h-24 overflow-y-auto my-2" />
                <button
                  className="add-btn w-full flex justify-center rounded-xl"
                  type="button"
                >
                  +
                </button>
              </div> */}
            </div>

            <section>
              <label htmlFor="add-elem-desc">{getDescriptionLabel()}</label>
              <textarea
                id="add-elem-desc"
                name="description"
                className="h-20 max-h-32 w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={`Введите ${getDescriptionLabel().toLowerCase()}`}
                aria-invalid={!!errors.description}
              />
            </section>
          </section>

          {errors._form && (
            <div
              className="px-5"
              style={{ color: "#cc0000", textAlign: "left" }}
            >
              Заполните оба поля , минимум от 8 символов
            </div>
          )}
        </form>

        <footer className="modal-actions px-5">
          <button
            className="cancel-btn"
            type="button"
            onClick={closeModalAddElem}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            className="save-btn"
            type="submit"
            form="add-elem-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохраняем…" : "Сохранить"}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default AddElemModal;
