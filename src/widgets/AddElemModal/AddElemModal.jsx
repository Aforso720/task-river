import React, { useEffect } from "react";
import "./AddElemModal.scss";
import useModalAddElemStore from "./useModalAddElemStore";
import { usePostElemPanel } from "@/features/Kanban/api/usePostElemPanel";
// import { useGetElemPanel } from "@/pages/Panel/api/useGetElemPanel";
import { usePanelData } from "@/pages/Panel/api/useGetElemPanel";
import { useForm } from "react-hook-form";

const AddElemModal = () => {
  const { ModalAddElemState, typeModalAddElem, closeModalAddElem } =
    useModalAddElemStore();

  const createElemPanel = usePostElemPanel((s) => s.createElemPanel);

  const {projects , refetch} = usePanelData();
  // const getAllElemPanel = useGetElemPanel((s) => s.getAllElemPanel);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      attachToProject: false,
      projectId: "",
    },
  });

  const attachToProject = watch("attachToProject");

  useEffect(() => {
    if (
      ModalAddElemState &&
      typeModalAddElem === "board" &&
      projects.length === 0
    ) {
      refetch();
    }
  }, [ModalAddElemState, typeModalAddElem, projects.length]);

  useEffect(() => {
    if (!ModalAddElemState) {
      reset({
        title: "",
        description: "",
        attachToProject: false,
        projectId: "",
      });
      clearErrors();
    }
  }, [ModalAddElemState, reset, clearErrors]);

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

  const onSubmit = async (data) => {
    clearErrors("root");

    try {
      const title = (data.title || "").trim();
      const description = (data.description || "").trim();

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
          projectId: data.attachToProject ? data.projectId : null,
        };
      } else if (typeModalAddElem === "task") {
        // как было, не трогаю логику задач
        url = "tasks";
        payload = { name: title, description };
      } else {
        throw new Error("Unknown type");
      }

      await createElemPanel(payload, url);
      await refetch();

      reset({
        title: "",
        description: "",
        attachToProject: false,
        projectId: "",
      });

      closeModalAddElem();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Не удалось создать. Попробуйте ещё раз.";

      // Показываем пользователю реальную причину (в т.ч. лимиты проекта/доски)
      setError("root", { type: "server", message: msg });
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

        <form id="add-elem-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <section className="contentModalAdd flex">
            <div className="leftSide">
              <label htmlFor="add-elem-title">{getTitleLabel()}</label>
              <input
                id="add-elem-title"
                className="w-72"
                type="text"
                placeholder={`Введите ${getTitleLabel().toLowerCase()}`}
                autoComplete="off"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "add-elem-title-error" : undefined}
                {...register("title", {
                  required: "Заполните название",
                  validate: (v) =>
                    (v || "").trim().length >= 8 || "Минимум 8 символов",
                })}
              />

              {errors.title && (
                <div
                  id="add-elem-title-error"
                  className="text-xs"
                  style={{ color: "#cc0000" }}
                >
                  {errors.title.message}
                </div>
              )}

              {typeModalAddElem === "board" && (
                <div className="attach-project-block">
                  <label htmlFor="attach-to-project" className="attach-toggle">
                    <input
                      id="attach-to-project"
                      type="checkbox"
                      checked={!!attachToProject}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setValue("attachToProject", checked, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        if (!checked) {
                          setValue("projectId", "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          clearErrors("projectId");
                        }
                      }}
                    />
                    <span className="attach-toggle__label">
                      Прикрепить к проекту
                    </span>
                  </label>

                  <div
                    className={`attach-project__collapsible ${
                      attachToProject ? "open" : ""
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
                      disabled={!attachToProject}
                      aria-invalid={!!errors.projectId}
                      {...register("projectId", {
                        validate: (v) => {
                          if (!attachToProject) return true;
                          return !!v || "Выберите проект";
                        },
                      })}
                    >
                      <option value="">— Не выбран —</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name ?? p.title ?? `#${p.id}`}
                        </option>
                      ))}
                    </select>

                    {errors.projectId && (
                      <div className="attach-project__error">
                        {errors.projectId.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* блок задач/ответственных не трогаю */}
            </div>

            <section>
              <label htmlFor="add-elem-desc">{getDescriptionLabel()}</label>
              <textarea
                id="add-elem-desc"
                name="description"
                className="h-20 max-h-32 w-full"
                placeholder={`Введите ${getDescriptionLabel().toLowerCase()}`}
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
            </section>
          </section>

          {errors.root?.message && (
            <div className="px-5" style={{ color: "#cc0000", textAlign: "left" }}>
              {errors.root.message}
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Сохраняем…" : "Сохранить"}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default AddElemModal;
