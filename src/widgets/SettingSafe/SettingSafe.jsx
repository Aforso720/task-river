import React from "react";
import "./SettingSafe.scss";
import { usePutPassword } from "./usePutPassword";

const SettingSafe = () => {
  const { putPassword, loading, success, error, resetStatus } =
    usePutPassword();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    resetStatus();

    const ok = await putPassword({ currentPassword, newPassword });

    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      // success уже выставится в zustand — покажем сообщение ниже
    }
  };

  return (
    <section className="SettingSafe px-5 py-7 w-full flex justify-center items-center flex-col relative">
      <h3 className="SettingSafe__title font-semibold text-2xl left-5 top-7 absolute">
        Безопасность
      </h3>

      <section className="SettingSafe__content flex items-center gap-2 flex-col w-1/2 h-full px-5 py-7 mt-10">
        <h4 className="SettingSafe__subtitle font-semibold text-2xl">
          Изменить пароль
        </h4>

        <p className="SettingSafe__description font-light text-xs">
          При изменении пароля вы останетесь в системе на этом устройстве, но,
          возможно, выйдете из системы на других устройствах.
        </p>

        <form
          className="SettingSafe__form mt-5 flex flex-col gap-2 w-full"
          onSubmit={onSubmit}
        >
          <label
            className="SettingSafe__label font-normal text-[14px]"
            htmlFor="old-pass"
          >
            Текущий пароль
          </label>
          <input
            id="old-pass"
            className="SettingSafe__input"
            type="password"
            placeholder="Введите текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />

          <label
            className="SettingSafe__label font-normal text-[14px]"
            htmlFor="new-pass"
          >
            Новый пароль
          </label>
          <input
            id="new-pass"
            className="SettingSafe__input"
            type="password"
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />

          {success && (
            <p className="SettingSafe__description text-center font-normal text-xl">
              ✅ Пароль успешно обновлён
            </p>
          )}
          {error && (
            <p className="SettingSafe__description font-normal text-xl">
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            className="SettingSafe__button font-medium text-xl"
            disabled={loading || !currentPassword || !newPassword}
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </section>
    </section>
  );
};

export default SettingSafe;
