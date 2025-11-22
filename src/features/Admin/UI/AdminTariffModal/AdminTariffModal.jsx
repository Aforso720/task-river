import React, { useEffect, useMemo } from "react";
import "./AdminTariffModal.scss";
import { useAdminTariffModal } from "../../store/useAdminTariffModal";
import { useTariffs } from "../../api/useTariffs";
import { useForm } from "react-hook-form";

const AdminTariffModal = () => {
  // РЕКОМЕНДАЦИЯ: расширьте стор модалки, чтобы прокидывать один из параметров:
  // - editingTariff (полный объект тарифа) ИЛИ
  // - editingTariffId (id тарифа) ИЛИ
  // - editingTariffName (имя тарифа)
  const {
    modalState,
    modalVers,
    closeModal,
    editingTariff,      // опционально
    editingTariffId,    // опционально
    editingTariffName,  // опционально
  } = useAdminTariffModal();

  const {
    tariffs,
    createTariff,
    updateTariff,
    loadingCreate,
    loadingUpdate,
    deleteTariff,
    loadingDelete,
    getTariffs,
  } = useTariffs();

  if (!modalState) return null;

  const isEdit = modalVers === "Редактирование тарифа";

  // Находим тариф для редактирования из приоритетов:
  // 1) передан целиком через стор модалки
  // 2) по id
  // 3) по имени
  const tariffToEdit = useMemo(() => {
    if (editingTariff) return editingTariff;
    if (editingTariffId)
      return tariffs.find((t) => String(t.id) === String(editingTariffId));
    if (editingTariffName)
      return tariffs.find((t) => String(t.name) === String(editingTariffName));
    return null;
  }, [editingTariff, editingTariffId, editingTariffName, tariffs]);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      price: undefined,
      custom: false,
      boardLimit: undefined,
      projectLimit: undefined,
      projectBoardLimit: undefined,
      userLimit: undefined,
      storageLimitMb: undefined,
      storageLimitBytes: 0,
      roleLimits: {
        READER: undefined,
        EDITOR: undefined,
        ADMIN: undefined,
      },
      // Прячем исходные значения (используем для поиска планId, если имя поменяют)
      originalName: "",
      originalId: "",
    },
  });

  // Когда открыли модалку в режиме редактирования — заполняем форму значениями тарифа
  useEffect(() => {
    if (!isEdit) return;
    // Если тариф ещё не найден — не сбрасываем форму
    if (!tariffToEdit) return;

    const safeNum = (v) => (v == null ? undefined : Number(v));
    const rl = tariffToEdit.roleLimits || {};

    reset({
      name: tariffToEdit.name ?? "",
      price: safeNum(tariffToEdit.price),
      custom: !!tariffToEdit.custom,
      boardLimit: safeNum(tariffToEdit.boardLimit),
      projectLimit: safeNum(tariffToEdit.projectLimit),
      projectBoardLimit: safeNum(tariffToEdit.projectBoardLimit),
      userLimit: safeNum(tariffToEdit.userLimit),
      storageLimitMb: safeNum(tariffToEdit.storageLimitMb),
      storageLimitBytes: safeNum(tariffToEdit.storageLimitBytes ?? 0),
      roleLimits: {
        READER: safeNum(rl.READER),
        EDITOR: safeNum(rl.EDITOR),
        ADMIN: safeNum(rl.ADMIN),
      },
      originalName: tariffToEdit.name ?? "",
      originalId: String(tariffToEdit.id ?? ""),
    });
  }, [isEdit, tariffToEdit, reset]);

  const onSave = handleSubmit(async (data) => {
    const payload = {
      name: String(data.name || "").trim(),
      price: Number(data.price) || 0,
      custom: !!data.custom,
      boardLimit: Number(data.boardLimit) || 0,
      projectLimit: Number(data.projectLimit) || 0,
      projectBoardLimit: Number(data.projectBoardLimit) || 0,
      userLimit: Number(data.userLimit) || 0,
      roleLimits: {
        READER: Number(data.roleLimits?.READER) || 0,
        EDITOR: Number(data.roleLimits?.EDITOR) || 0,
        ADMIN: Number(data.roleLimits?.ADMIN) || 0,
      },
      storageLimitMb: Number(data.storageLimitMb) || 0,
      storageLimitBytes: Number(data.storageLimitBytes) || 0,
    };

    if (!payload.name) return;

    try {
      if (isEdit) {
        // planId берём в приоритете:
        // 1) originalId из формы
        // 2) из найденного tariffToEdit
        // 3) по originalName/новому name из списка тарифов
        const byOriginalId = data.originalId && String(data.originalId);
        const planId =
          byOriginalId ||
          (tariffToEdit && String(tariffToEdit.id)) ||
          (tariffs.find((t) => String(t.name) === String(data.originalName))?.id) ||
          (tariffs.find((t) => String(t.name) === String(payload.name))?.id);

        if (!planId) {
          console.warn("Не удалось определить id тарифа для редактирования");
          return;
        }
        await updateTariff(planId, payload);
      } else {
        await createTariff(payload);
      }

      await getTariffs();
      closeModal(modalVers);
    } catch (e) {
      console.error(isEdit ? "Не удалось изменить тариф:" : "Не удалось создать тариф:", e);
    }
  });

  const onClone = () => {
    console.log("CLONE tariff from:", getValues());
  };

  const onDelete = async () => {
    // Для удаления тоже используем id в приоритете
    const byOriginalId = getValues("originalId");
    const planId =
      (byOriginalId && String(byOriginalId)) ||
      (tariffToEdit && String(tariffToEdit.id));

    if (!planId) {
      console.warn("Не удалось определить id тарифа для удаления");
      return;
    }

    try {
      await deleteTariff(planId);
      closeModal(modalVers);
    } catch (e) {
      console.error("Не удалось удалить тариф:", e);
    }
  };

  const asNumberOrUndef = {
    setValueAs: (v) => (v === "" ? undefined : Number(v)),
  };

  // UX: если это редактирование и тариф ещё не найден — покажем компактный плейсхолдер
  if (isEdit && !tariffToEdit) {
    return (
      <article className="flex flex-col justify-center w-[80%]">
        <header className="flex justify-between items-center w-full">
          <img
            onClick={() => closeModal(modalVers)}
            src="/image/ArrowBack.svg"
            className="cursor-pointer"
            alt="Назад"
          />
          <h2 className="text-[#8C6D51] font-semibold text-4xl">{modalVers}</h2>
          <div />
        </header>
        <div className="px-2 py-8 text-[#8C6D51]">
          Загружаем данные тарифа…
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col justify-center w-[80%]">
      <header className="flex justify-between items-center w-full">
        <img
          onClick={() => closeModal(modalVers)}
          src="/image/ArrowBack.svg"
          className="cursor-pointer"
          alt="Назад"
        />
        <h2 className="text-[#8C6D51] font-semibold text-4xl">{modalVers}</h2>
        <div className="flex gap-3 h-10">
          <button
            onClick={onSave}
            className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-xl px-2 py-1 text-center"
            disabled={loadingCreate || loadingUpdate || isSubmitting}
          >
            {loadingCreate || loadingUpdate || isSubmitting
              ? "Сохраняем…"
              : isEdit
              ? "Сохранить изменения"
              : "Сохранить"}
          </button>
          <button
            onClick={onClone}
            className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-xl px-2 py-1 text-center"
          >
            Создать копию
          </button>
          <button
            onClick={onDelete}
            className="bg-[#FFD8D8] h-10 w-10 flex items-center justify-center rounded-[7px] border-[1px] border-[#FF4A4A]"
            title="Удалить тариф"
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <span className="text-[#FF4A4A] text-sm px-2">…</span>
            ) : (
              <img src="/image/Corzina.svg" alt="Корзина" />
            )}
          </button>
        </div>
      </header>

      <form className="w-full mt-8 px-2" onSubmit={onSave}>
        {/* скрытые поля для сохранения оригиналов */}
        <input type="hidden" {...register("originalName")} />
        <input type="hidden" {...register("originalId")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[16px] border border-[#8C6D51]/30 p-5">
            <h3 className="text-xl font-semibold text-[#8C6D51] mb-4">
              Основная информация
            </h3>

            <label className="block text-[#22333B] text-sm mb-1">
              Название тарифа
            </label>
            <input
              type="text"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 mb-4 outline-none"
              placeholder="Например: Pro"
              {...register("name")}
            />

            <label className="block text-[#22333B] text-sm mb-1">Цена (₽)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 mb-4 outline-none"
              placeholder="1999.99"
              {...register("price", asNumberOrUndef)}
            />

            <div className="flex items-center gap-3 mb-4">
              <input id="custom" type="checkbox" {...register("custom")} />
              <label htmlFor="custom" className="text-[#22333B] text-sm cursor-pointer font-bold">
                Кастомный тариф
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#22333B] text-sm mb-1">
                  Лимит хранилища (MB)
                </label>
                <input
                  type="number"
                  className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 outline-none"
                  placeholder="10240"
                  {...register("storageLimitMb", asNumberOrUndef)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#8C6D51]/30 p-5">
            <h3 className="text-xl font-semibold text-[#8C6D51] mb-4">
              Ограничения
            </h3>

            <label className="block text-[#22333B] text-sm mb-1">
              Лимит досок (boardLimit)
            </label>
            <input
              type="number"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 mb-4 outline-none"
              placeholder="50"
              {...register("boardLimit", asNumberOrUndef)}
            />

            <label className="block text-[#22333B] text-sm mb-1">
              Лимит проектов (projectLimit)
            </label>
            <input
              type="number"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 mb-4 outline-none"
              placeholder="10"
              {...register("projectLimit", asNumberOrUndef)}
            />

            <label className="block text-[#22333B] text-sm mb-1">
              Лимит досок в проекте (projectBoardLimit)
            </label>
            <input
              type="number"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 mb-4 outline-none"
              placeholder="20"
              {...register("projectBoardLimit", asNumberOrUndef)}
            />

            <label className="block text-[#22333B] text-sm mb-1">
              Лимит пользователей (userLimit)
            </label>
            <input
              type="number"
              className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 outline-none"
              placeholder="50"
              {...register("userLimit", asNumberOrUndef)}
            />
          </div>
        </div>

        <div className="rounded-[16px] border border-[#8C6D51]/30 p-5 mt-8">
          <h3 className="text-xl font-semibold text-[#8C6D51] mb-4">
            Лимиты по ролям
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#22333B] text-sm mb-1">READER</label>
              <input
                type="number"
                className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 outline-none"
                placeholder="800"
                {...register("roleLimits.READER", asNumberOrUndef)}
              />
            </div>
            <div>
              <label className="block text-[#22333B] text-sm mb-1">EDITOR</label>
              <input
                type="number"
                className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 outline-none"
                placeholder="180"
                {...register("roleLimits.EDITOR", asNumberOrUndef)}
              />
            </div>
            <div>
              <label className="block text-[#22333B] text-sm mb-1">ADMIN</label>
              <input
                type="number"
                className="w-full border border-[#8C6D51]/40 rounded-[10px] px-3 py-2 outline-none"
                placeholder="20"
                {...register("roleLimits.ADMIN", asNumberOrUndef)}
              />
            </div>
          </div>
        </div>
      </form>
    </article>
  );
};

export default AdminTariffModal;
