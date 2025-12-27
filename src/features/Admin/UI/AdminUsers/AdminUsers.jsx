import React, { useMemo, useState } from "react";
import "./AdminUsers.scss";
import { useAdminUsers } from "../../api/useAdminUsers";

function getInitials(u) {
  const a = (u?.firstName || "").trim()[0] || "";
  const b = (u?.lastName || "").trim()[0] || "";
  const c = (u?.username || "").trim()[0] || "";
  return (a + b || c || "U").toUpperCase();
}

function formatRoleName(roleName) {
  if (!roleName) return "";
  return String(roleName).replace(/^ROLE_/, "");
}

const AdminUsers = () => {
  const {
    users,
    loading,
    fetching,
    error,
    refetch,
    deleteUser,
    deleting,
    updateUser,
    updating,
  } = useAdminUsers();

  const [q, setQ] = useState("");

  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;

    return (users || []).filter((u) => {
      const hay = [
        u.username,
        u.email,
        u.phoneNumber,
        u.firstName,
        u.lastName,
        u.middleName,
        u.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(s);
    });
  }, [users, q]);

  const openEdit = (u) => {
    setEditModal({ open: true, user: u });
    setForm({
      firstName: u?.firstName ?? "",
      lastName: u?.lastName ?? "",
      middleName: u?.middleName ?? "",
      email: u?.email ?? "",
      phoneNumber: u?.phoneNumber ?? "",
    });
  };

  const closeEdit = () => {
    setEditModal({ open: false, user: null });
  };

  const saveEdit = async () => {
    const user = editModal.user;
    if (!user?.id) return;

    // простая валидация (можешь ослабить/усилить)
    const email = String(form.email || "").trim();
    if (!email.includes("@")) {
      alert("Проверь email");
      return;
    }

    await updateUser({ userId: user.id, values: form });
    closeEdit();
  };

  const confirmDelete = (u) => {
    setDeleteModal({ open: true, user: u });
  };

  const closeDelete = () => setDeleteModal({ open: false, user: null });

  const doDelete = async () => {
    const user = deleteModal.user;
    if (!user?.id) return;
    await deleteUser(user.id);
    closeDelete();
  };

  return (
    <section className="AdminUsersPage">
      <div className="AdminUsersHeader">
        <div className="left">
          <h2 className="title">Пользователи</h2>
          <div className="subtitle">
            Управление пользователями: просмотр, редактирование, удаление
          </div>
        </div>

        <div className="right">
          <button className="btn secondary" type="button" onClick={() => refetch()} disabled={fetching}>
            {fetching ? "Обновляем…" : "Обновить"}
          </button>
        </div>
      </div>

      <div className="AdminUsersToolbar">
        <div className="search">
          <img src="/image/Search.png" alt="" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: имя, email, телефон, username…"
          />
        </div>
      </div>

      {loading ? (
        <div className="AdminUsersState">Загрузка…</div>
      ) : error ? (
        <div className="AdminUsersState error">
          Не удалось загрузить пользователей. {String(error?.message || "")}
        </div>
      ) : (
        <div className="AdminUsersList">
          {filtered.length === 0 ? (
            <div className="AdminUsersState">Ничего не найдено</div>
          ) : (
            filtered.map((u) => (
              <div className="UserCard" key={u.id}>
                <div className="avatar">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.fullName || u.username} />
                  ) : (
                    <div className="initials">{getInitials(u)}</div>
                  )}
                </div>

                <div className="info">
                  <div className="top">
                    <div className="name">{u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Без имени"}</div>
                    <div className="username">@{u.username}</div>
                  </div>

                  <div className="meta">
                    <div className="metaItem">
                      <span className="label">Email:</span> <span className="value">{u.email || "—"}</span>
                    </div>
                    <div className="metaItem">
                      <span className="label">Телефон:</span> <span className="value">{u.phoneNumber || "—"}</span>
                    </div>
                  </div>

                  <div className="roles">
                    {(u.roles || []).map((r) => (
                      <span className="roleBadge" key={r.id || r.name}>
                        {formatRoleName(r.name)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="actions">
                  <button className="btn secondary" type="button" onClick={() => openEdit(u)} disabled={updating}>
                    Редактировать
                  </button>
                  <button className="btn danger" type="button" onClick={() => confirmDelete(u)} disabled={deleting}>
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ MODAL: EDIT */}
      {editModal.open && (
        <div className="ModalOverlay" onMouseDown={closeEdit}>
          <div className="Modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ModalHeader">
              <div className="ModalTitle">Редактирование пользователя</div>
              <button className="IconBtn" type="button" onClick={closeEdit}>
                ✕
              </button>
            </div>

            <div className="ModalBody">
              <div className="FormGrid">
                <label>
                  Имя
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                    placeholder="Иван"
                  />
                </label>

                <label>
                  Фамилия
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                    placeholder="Иванов"
                  />
                </label>

                <label>
                  Отчество
                  <input
                    value={form.middleName}
                    onChange={(e) => setForm((s) => ({ ...s, middleName: e.target.value }))}
                    placeholder="Иванович"
                  />
                </label>

                <label>
                  Email
                  <input
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </label>

                <label>
                  Телефон
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setForm((s) => ({ ...s, phoneNumber: e.target.value }))}
                    placeholder="+7 999 123-45-67"
                  />
                </label>
              </div>
            </div>

            <div className="ModalFooter">
              <button className="btn secondary" type="button" onClick={closeEdit} disabled={updating}>
                Отмена
              </button>
              <button className="btn primary" type="button" onClick={saveEdit} disabled={updating}>
                {updating ? "Сохраняем…" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL: DELETE CONFIRM */}
      {deleteModal.open && (
        <div className="ModalOverlay" onMouseDown={closeDelete}>
          <div className="Modal small" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ModalHeader">
              <div className="ModalTitle">Удалить пользователя?</div>
              <button className="IconBtn" type="button" onClick={closeDelete}>
                ✕
              </button>
            </div>

            <div className="ModalBody">
              <div className="confirmText">
                Вы уверены, что хотите удалить{" "}
                <b>{deleteModal.user?.fullName || deleteModal.user?.username}</b>?
              </div>
            </div>

            <div className="ModalFooter">
              <button className="btn secondary" type="button" onClick={closeDelete} disabled={deleting}>
                Отмена
              </button>
              <button className="btn danger" type="button" onClick={doDelete} disabled={deleting}>
                {deleting ? "Удаляем…" : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
