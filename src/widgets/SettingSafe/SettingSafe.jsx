import React from 'react'
import './SettingSafe.scss'

const SettingSafe = () => {
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
          При изменении пароля вы останетесь в системе на этом устройстве, но, возможно,
          выйдете из системы на других устройствах.
        </p>

        <form className="SettingSafe__form mt-5 flex flex-col gap-2 w-full">
          <label className="SettingSafe__label font-normal text-[14px]" htmlFor="old-pass">
            Текущий пароль
          </label>
          <input
            id="old-pass"
            className="SettingSafe__input"
            type="password"
            placeholder="Введите текущий пароль"
          />

          <label className="SettingSafe__label font-normal text-[14px]" htmlFor="new-pass">
            Новый пароль
          </label>
          <input
            id="new-pass"
            className="SettingSafe__input"
            type="password"
            placeholder="Введите новый пароль"
          />

          <button
            type="submit"
            className="SettingSafe__button font-medium text-xl"
          >
            Сохранить изменения
          </button>
        </form>
      </section>
    </section>
  )
}

export default SettingSafe
