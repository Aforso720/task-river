import React from "react";
import "./Setting.scss";
import SettingProfile from "../../../widgets/SettingProfile/SettingProfile";
import SettingSafe from "../../../widgets/SettingSafe/SettingSafe";
import ConfirmDeleteModal from "@/shared/ConfirmDeleteModal/ConfirmDeleteModal";

const Setting = () => {
  const [activeSett, setActiveSett] = React.useState("Профиль");
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <section className="SettingPanel">
      <aside className="px-5 pt-7">
        <h3 className="text-3xl font-semibold mb-10">Настройки</h3>
        <ul>
          <li
            className={activeSett === "Профиль" ? "active" : ""}
            onClick={() => setActiveSett("Профиль")}
          >
            Профиль
          </li>
          <li
            className={activeSett === "Безопасность" ? "active" : ""}
            onClick={() => setActiveSett("Безопасность")}
          >
            Безопасность
          </li>

          <li
            className="deleteSett"
            onClick={() => setDeleteOpen(true)}
          >
            Удалить аккаунт
          </li>
        </ul>
      </aside>

      {activeSett === "Профиль" ? <SettingProfile /> : <SettingSafe />}

      <ConfirmDeleteModal
        open={deleteOpen}
        itemName="аккаунт"
        loading={false}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          // пока НИЧЕГО не делаем, просто закрываем
          setDeleteOpen(false);
          // позже тут будет вызов запроса DELETE/POST на /user/account
        }}
      />
    </section>
  );
};

export default Setting;
