import React, { useEffect, useRef, useState } from "react";
import "./ModalColumnMenu.scss";
import useOpenColumnMenu from "./useOpenColumnMenu";

const ModalColumnMenu = ({ position, onEditColumn, onDeleteColumn, onAddTask }) => {
  const menuRef = useRef();
  const [newColumnName, setNewColumnName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const closeModalColumnMenu = useOpenColumnMenu(state => state.closeModalColumnMenu);

  const handleSave = () => {
    if (newColumnName.trim()) {
      onEditColumn(newColumnName);
    }
    setIsEditing(false);
    setNewColumnName("");
    closeModalColumnMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeModalColumnMenu();
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModalColumnMenu]);

  if (isEditing) {
    return (
      <div 
        ref={menuRef}
        className="modal-column-menu-container"
        style={{
          position: 'absolute',
          top: position?.top || 0,
          left: position?.left || 0,
          zIndex: 1000
        }}
      >
        <div className="ModalColumnMenu edit-mode">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Новое название"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => {
              setIsEditing(false);
              closeModalColumnMenu();
            }}>Отмена</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={menuRef}
      className="modal-column-menu-container"
      style={{
        position: 'absolute',
        top: position?.top || 0,
        left: position?.left || 0,
        zIndex: 1000
      }}
    >
      <ul className="ModalColumnMenu">
        <li onClick={() => setIsEditing(true)}>Редактировать название</li>
        <li onClick={() => {
          onAddTask();
          closeModalColumnMenu();
        }}>Добавить задачу</li>
        <li onClick={() => {
          onDeleteColumn();
          closeModalColumnMenu();
        }}>Удалить колонку</li>
      </ul>
    </div>
  );
};

export default ModalColumnMenu;
