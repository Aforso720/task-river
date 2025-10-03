import React from "react";
import "./Setting.scss";
import SettingProfile from "../../../widgets/SettingProfile/SettingProfile";
import SettingSafe from "../../../widgets/SettingSafe/SettingSafe";

const Setting = () => {
  const [activeSett, setActiveSett] = React.useState("Профиль");
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
        </ul>
      </aside>
      {activeSett === "Профиль" ? <SettingProfile/> : <SettingSafe/>}
    </section>
  );
};

export default Setting;
