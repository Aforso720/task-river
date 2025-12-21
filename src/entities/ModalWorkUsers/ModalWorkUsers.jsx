import React from "react";
import "./ModalWorkUsers.scss";
import useModalWorkUsersStore from "./store/useModalWorkUsersStore";
import { useWorkMembers } from "@/features/Kanban/api/useWorkMembers";
import axiosInstance from "@/app/api/axiosInstance";

const ROLES = ["ADMIN", "EDITOR", "READER"];

const ModalWorkUsers = ({ members = [], entityType, entityId }) => {
  const isOpen = useModalWorkUsersStore((s) => s.isOpen);
  const closeModal = useModalWorkUsersStore((s) => s.closeModal);

  const { getMemberProject, getMembersBoard, addedProjectMembers, addedBoardMembers } = useWorkMembers();

  const [searchValue, setSearchValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState("");

  const [actionLoadingId, setActionLoadingId] = React.useState(null);
  // Добавляем состояние для хранения ID найденного пользователя
  const [foundUserId, setFoundUserId] = React.useState(null);

  const entityLabel = entityType === "project" ? "проекта" : "доски";
  const entityName = entityType === "project" ? "проект" : "доске";

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
    setFoundUserId(null); // Сбрасываем ID при закрытии
    closeModal();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!entityId) return;
    const query = searchValue.trim();
    if (!query) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    setFoundUserId(null); // Сбрасываем предыдущий ID

    try {
      const { data } = await axiosInstance.get(`/user/search?email=${query}`);

      // Проверяем структуру ответа
      console.log("Результат поиска:", data);
      
      // Обрабатываем разные форматы ответа
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data && typeof data === 'object') {
        // Если ответ - объект, проверяем есть ли в нем массив пользователей
        if (data.users && Array.isArray(data.users)) {
          users = data.users;
        } else if (data.data && Array.isArray(data.data)) {
          users = data.data;
        } else {
          // Если объект содержит информацию о пользователе напрямую
          users = [data];
        }
      }

      if (users.length === 0) {
        setSearchError("Пользователь не найден");
        return;
      }

      // Сохраняем ID первого найденного пользователя
      if (users[0]?.id) {
        setFoundUserId(users[0].id);
        console.log("Найден пользователь с ID:", users[0].id);
      }

      const currentIds = new Set(members.map((m) => m.id));
      const filtered = users.filter((u) => u.id && !currentIds.has(u.id));

      if (filtered.length === 0) {
        setSearchError("Пользователь уже добавлен в проект");
        setSearchResults([]);
      } else {
        setSearchResults(filtered);
        setSearchError(""); // Убираем ошибку при успешном поиске
      }
    } catch (err) {
      console.error("Ошибка поиска пользователей:", err);
      
      // Более информативное сообщение об ошибке
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setSearchError("Пользователь не найден");
            break;
          case 400:
            setSearchError("Неверный формат email");
            break;
          default:
            setSearchError(`Ошибка сервера: ${err.response.status}`);
        }
      } else if (err.request) {
        setSearchError("Нет ответа от сервера");
      } else {
        setSearchError("Не удалось выполнить поиск");
      }
      
      setSearchResults([]);
      setFoundUserId(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshMembers = async () => {
    if (!entityId) return;
    
    if (entityType === "project") {
      await getMemberProject(entityId);
    } else {
      await getMembersBoard(entityId);
    }
  };

  const handleAddUser = async (user, role = "READER") => {
    if (!entityId || !user?.id) {
      console.error("Отсутствует entityId или user.id");
      return;
    }
    
    setActionLoadingId(user.id);
    try {
      if (entityType === "project") {
        await addedProjectMembers(entityId, {
          userId: user.id,
          role,
        });
      } else {
        await addedBoardMembers(entityId, {
          userId: user.id,
          role,
        });
      }
      
      await refreshMembers();
      
      // Удаляем добавленного пользователя из результатов поиска
      setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
      
      // Очищаем поисковое поле и результаты
      setSearchValue("");
      setFoundUserId(null);
    } catch (err) {
      console.error("Не удалось добавить участника:", err);
      
      // Показываем ошибку добавления
      setSearchError("Не удалось добавить пользователя. Попробуйте снова.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleChange = async (member, newRole) => {
    if (!entityId || !member?.id) return;
    setActionLoadingId(member.id);
    try {
      if (entityType === "project") {
        await axiosInstance.patch(
          `/kanban/projects/${entityId}/members/${member.id}`,
          { role: newRole }
        );
      } else {
        await axiosInstance.patch(
          `/kanban/boards/${entityId}/members/${member.id}`,
          { role: newRole }
        );
      }
      await refreshMembers();
    } catch (err) {
      console.error("Не удалось изменить роль:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!entityId || !member?.id) return;
    if (!window.confirm(`Удалить ${getDisplayName(member)} из ${entityLabel}?`))
      return;

    setActionLoadingId(member.id);
    try {
      if (entityType === "project") {
        await axiosInstance.delete(
          `/kanban/projects/${entityId}/members/${member.id}`
        );
      } else {
        await axiosInstance.delete(
          `/kanban/boards/${entityId}/members/${member.id}`
        );
      }
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
            <h3 className="ModalWorkUsers__title">
              Участники {entityLabel}
            </h3>
            <p className="ModalWorkUsers__subtitle">
              Управляйте доступом пользователей к этой {entityName}
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
              type="email"
              placeholder="Найти пользователя по email"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchError(""); // Сбрасываем ошибку при изменении поля
              }}
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
          {members.length === 0 ? (
            <div className="ModalWorkUsers__empty">
              В этом {entityLabel} пока нет участников.
            </div>
          ) : (
            <ul className="ModalWorkUsers__list">
              {members.map((member) => (
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