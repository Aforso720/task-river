import React from "react";
import "./ModalWorkUsers.scss";
import useModalWorkUsersStore from "./store/useModalWorkUsersStore";
import useTargetEvent from "@/pages/Panel/store/useTargetEvent";
import { useWorkMembers } from "@/features/Kanban/api/useWorkMembers";
import axiosInstance from "@/app/api/axiosInstance";

const ROLES = ["ADMIN", "EDITOR", "READER"];

const ModalWorkUsers = ({ membersProject = [] }) => {
  const isOpen = useModalWorkUsersStore((s) => s.isOpen);
  const closeModal = useModalWorkUsersStore((s) => s.closeModal);

  const { activeProjectId } = useTargetEvent();
  const { getMemberProject } = useWorkMembers();

  const [searchValue, setSearchValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState("");

  const [actionLoadingId, setActionLoadingId] = React.useState(null);

  // сейчас просто включаем управление для всех — дальше можно завязать на текущего юзера
  const canManage = true;

  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();

  const getDisplayName = (m) =>
    m.fullName || m.username || m.email || "Без имени";

  const getInitials = (m) => {
    const name = getDisplayName(m);
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    const initials = (first + second).toUpperCase();
    return initials || "U";
  };

  const handleClose = () => {
    setSearchValue("");
    setSearchResults([]);
    setSearchError("");
    setActionLoadingId(null);
    closeModal();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!activeProjectId) return;
    const query = searchValue.trim();
    if (!query) return;

    setSearchLoading(true);
    setSearchError("");
    try {
      // ⚠️ ПОДПРАВЬ URL ПОД СВОЙ БЭК
      // Допустим, поиск пользователей: GET /kanban/users/search?q=...
      const { data } = await axiosInstance.get("/kanban/users/search", {
        params: { q: query },
      });

      const currentIds = new Set(membersProject.map((m) => m.id));
      const filtered = (data || []).filter((u) => !currentIds.has(u.id));

      setSearchResults(filtered);
    } catch (err) {
      console.error("Ошибка поиска пользователей:", err);
      setSearchError("Не удалось выполнить поиск");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshMembers = async () => {
    if (!activeProjectId) return;
    await getMemberProject(activeProjectId);
  };

  const handleAddUser = async (user, role = "READER") => {
    if (!activeProjectId || !user?.id) return;
    setActionLoadingId(user.id);
    try {
      // используется тот запрос, который ты присылал:
      // POST /kanban/projects/:projectId/members { userId, role }
      await axiosInstance.post(
        `/kanban/projects/${activeProjectId}/members`,
        {
          userId: user.id,
          role,
        }
      );
      await refreshMembers();

      // убираем добавленного из результатов поиска
      setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Не удалось добавить участника:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleChange = async (member, newRole) => {
    if (!activeProjectId || !member?.id) return;
    setActionLoadingId(member.id);
    try {
      // ⚠️ ПОДПРАВЬ ПОД СВОЙ БЭК
      // пример: PATCH /kanban/projects/:projectId/members/:userId { role }
      await axiosInstance.patch(
        `/kanban/projects/${activeProjectId}/members/${member.id}`,
        { role: newRole }
      );
      await refreshMembers();
    } catch (err) {
      console.error("Не удалось изменить роль:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!activeProjectId || !member?.id) return;
    if (!window.confirm(`Удалить ${getDisplayName(member)} из проекта?`))
      return;

    setActionLoadingId(member.id);
    try {
      await axiosInstance.delete(
        `/kanban/projects/${activeProjectId}/members/${member.id}`
      );
      await refreshMembers();
    } catch (err) {
      console.error("Не удалось удалить участника:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="ModalWorkUsersOverlay" onClick={handleClose}>
      <article className="ModalWorkUsers" onClick={stop}>
        <header className="ModalWorkUsers__header">
          <div>
            <h3 className="ModalWorkUsers__title">Участники проекта</h3>
            <p className="ModalWorkUsers__subtitle">
              Управляйте доступом пользователей к этому проекту
            </p>
          </div>
          <button
            type="button"
            className="ModalWorkUsers__close"
            onClick={handleClose}
          >
            ✕
          </button>
        </header>

        {/* ПОИСК ДЛЯ ДОБАВЛЕНИЯ НОВЫХ */}
        <section className="ModalWorkUsers__searchBlock">
          <form
            className="ModalWorkUsers__searchForm"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Найти пользователя по имени или email"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ModalWorkUsers__searchInput"
            />
            <button
              type="submit"
              className="ModalWorkUsers__searchButton"
              disabled={searchLoading || !searchValue.trim()}
            >
              {searchLoading ? "Ищем..." : "Найти"}
            </button>
          </form>

          {searchError && (
            <div className="ModalWorkUsers__searchError">{searchError}</div>
          )}

          {searchResults.length > 0 && (
            <div className="ModalWorkUsers__searchResults">
              <p className="ModalWorkUsers__searchTitle">
                Найденные пользователи
              </p>
              <ul className="ModalWorkUsers__searchList">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    className="ModalWorkUsers__searchItem"
                  >
                    <div className="ModalWorkUsers__user">
                      <div className="ModalWorkUsers__avatar">
                        {getInitials(user)}
                      </div>
                      <div className="ModalWorkUsers__info">
                        <p className="ModalWorkUsers__name">
                          {getDisplayName(user)}
                        </p>
                        {user.email && (
                          <p className="ModalWorkUsers__email">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="ModalWorkUsers__actions">
                      <select
                        className="ModalWorkUsers__roleSelect"
                        defaultValue="READER"
                        onChange={(e) =>
                          handleAddUser(user, e.target.value)
                        }
                        disabled={actionLoadingId === user.id}
                      >
                        <option value="READER">Добавить как READER</option>
                        <option value="EDITOR">Добавить как EDITOR</option>
                        <option value="ADMIN">Добавить как ADMIN</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* СПИСОК УЧАСТНИКОВ */}
        <section className="ModalWorkUsers__content">
          {membersProject.length === 0 ? (
            <div className="ModalWorkUsers__empty">
              В этом проекте пока нет участников.
            </div>
          ) : (
            <ul className="ModalWorkUsers__list">
              {membersProject.map((member) => (
                <li className="ModalWorkUsers__item" key={member.id}>
                  <div className="ModalWorkUsers__user">
                    <div className="ModalWorkUsers__avatar">
                      {getInitials(member)}
                    </div>
                    <div className="ModalWorkUsers__info">
                      <p className="ModalWorkUsers__name">
                        {getDisplayName(member)}
                      </p>
                      {member.email && (
                        <p className="ModalWorkUsers__email">
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ModalWorkUsers__actions">
                    {canManage ? (
                      <>
                        <select
                          className="ModalWorkUsers__roleSelect"
                          value={member.role}
                          disabled={actionLoadingId === member.id}
                          onChange={(e) =>
                            handleRoleChange(member, e.target.value)
                          }
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="ModalWorkUsers__remove"
                          disabled={actionLoadingId === member.id}
                          onClick={() => handleRemoveMember(member)}
                        >
                          Удалить
                        </button>
                      </>
                    ) : (
                      <span className="ModalWorkUsers__roleValue">
                        {member.role}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="ModalWorkUsers__footer">
          <p>
            <strong>Роли:</strong>{" "}
            <span>ADMIN — полный доступ</span>
            <span> · EDITOR — редактирование задач</span>
            <span> · READER — только просмотр</span>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default ModalWorkUsers;
