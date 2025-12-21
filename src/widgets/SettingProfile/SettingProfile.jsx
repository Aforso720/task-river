import React from "react";
import "./SettingProfile.scss";
import { useUserData } from "../HeaderSideBar/useUserData";

const SettingProfile = () => {
  const { userData, getUserData, putUserData } = useUserData();

  // какое поле сейчас редактируется (по id), null = ничего
  const [editId, setEditId] = React.useState(null);

  // черновик значений инпутов
  const [draft, setDraft] = React.useState({
    fullName: "",
    username: "",
    phoneNumber: "",
    email: "",
  });

  React.useEffect(() => {
    getUserData();
  }, []);

  // когда userData пришли — заполняем черновик
  React.useEffect(() => {
    const firstName = userData?.firstName ?? "";
    const lastName = userData?.lastName ?? "";
    const middleName = userData?.middleName ?? "";
    const fullName = [lastName, firstName, middleName].filter(Boolean).join(" ");

    setDraft({
      fullName,
      username: userData?.username ?? "",
      phoneNumber: userData?.phoneNumber ?? "",
      email: userData?.email ?? "",
    });
  }, [userData]);

  const roles = userData?.roles ?? [];
  const roleNames = roles.map((r) => r.name).join(", ");

  // маппинг id -> что редактируем и что отправляем в PUT
  const fieldConfig = {
    0: { draftKey: "fullName", putKeys: ["firstName", "lastName", "middleName"] },
    1: { draftKey: "username", putKeys: ["username"] },
    3: { draftKey: "phoneNumber", putKeys: ["phoneNumber"] },
    contact: { draftKey: "email", putKeys: ["email"] },
  };

  const handlePenClick = (id) => {
    setEditId(id);
  };

  const handleChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const buildPutPayload = (id) => {
    const cfg = fieldConfig[id];
    if (!cfg) return {};

    // особый случай: fullName -> lastName firstName middleName
    if (cfg.draftKey === "fullName") {
      const parts = (draft.fullName || "").trim().split(/\s+/).filter(Boolean);
      // ожидаем: Фамилия Имя Отчество (если отчества нет — ок)
      const [lastName = "", firstName = "", middleName = ""] = parts;
      return { lastName, firstName, middleName };
    }

    return { [cfg.putKeys[0]]: draft[cfg.draftKey] };
  };

  // Enter = сохранить, Escape = отменить
  const handleKeyDown = async (e, id) => {
    if (editId !== id) return;

    if (e.key === "Enter") {
      const payload = buildPutPayload(id);
      await putUserData(payload);
      setEditId(null);
    }

    if (e.key === "Escape") {
      // откатить к данным с сервера
      const firstName = userData?.firstName ?? "";
      const lastName = userData?.lastName ?? "";
      const middleName = userData?.middleName ?? "";
      const fullName = [lastName, firstName, middleName].filter(Boolean).join(" ");

      setDraft((prev) => ({
        ...prev,
        fullName,
        username: userData?.username ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
        email: userData?.email ?? "",
      }));
      setEditId(null);
    }
  };

  const formElem = [
    { id: 0, title: "Полное ФИО", draftKey: "fullName", view: draft.fullName || "—" },
    { id: 1, title: "Публичное имя", draftKey: "username", view: draft.username || "—" },
    { id: 2, title: "Роль", draftKey: null, view: roleNames || "—" }, // не редактируем
    { id: 3, title: "Телефон", draftKey: "phoneNumber", view: draft.phoneNumber || "—" },
  ];

  return (
    <section className="SettingProfile p-5">
      <h4 className="text-2xl font-semibold text-[#22333B] dark:text-[#E6E4D8]">
        Профиль
      </h4>

      <div className="flex gap-10 flex-col items-center">
        <section>
          <h5 className="HeadArticle">Информация профиля</h5>
          <article className="h-[444px] flex flex-col justify-evenly">
            {formElem.map((elem) => {
              const isEditing = editId === elem.id;
              const canEdit = elem.id !== 2; // роль не редактируем

              return (
                <div className="flex flex-col px-14" key={elem.id}>
                  <label className="text-[#00000099] flex" htmlFor={String(elem.id)}>
                    {elem.title}
                    <img
                      src="/image/PenSettingsvg.svg"
                      className="ml-2 cursor-pointer"
                      alt="Карандаш"
                      onClick={() => canEdit && handlePenClick(elem.id)}
                    />
                  </label>

                  <input
                    type="text"
                    id={String(elem.id)}
                    placeholder={elem.view}
                    value={elem.draftKey ? draft[elem.draftKey] : elem.view}
                    disabled={!isEditing || !canEdit}
                    onChange={(e) => elem.draftKey && handleChange(elem.draftKey, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, elem.id)}
                    onBlur={async () => {
                      // сохранить при уходе с поля, но только если оно редактировалось
                      if (!isEditing || !canEdit) return;
                      const payload = buildPutPayload(elem.id);
                      await putUserData(payload);
                      setEditId(null);
                    }}
                  />
                </div>
              );
            })}
          </article>
        </section>

        <section>
          <h5 className="HeadArticle">Контактные данные</h5>
          <article className="h-24 flex items-center">
            <div className="flex flex-col px-14">
              <label className="text-[#00000099] flex" htmlFor="contact">
                Адрес электронной почты
                <img
                  src="/image/PenSettingsvg.svg"
                  className="ml-2 cursor-pointer"
                  alt="Карандаш"
                  onClick={() => handlePenClick("contact")}
                />
              </label>

              <input
                className=""
                type="text"
                id="contact"
                placeholder={draft.email || "—"}
                value={draft.email}
                disabled={editId !== "contact"}
                onChange={(e) => handleChange("email", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "contact")}
                onBlur={async () => {
                  if (editId !== "contact") return;
                  const payload = buildPutPayload("contact");
                  await putUserData(payload);
                  setEditId(null);
                }}
              />
            </div>
          </article>
        </section>
      </div>
    </section>
  );
};

export default SettingProfile;
