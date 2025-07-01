import React, { useEffect, useRef, useState } from "react";
import "./ModalColumnMenu.scss";
import { ModalMenuCardTask } from "../CardBoard/store/ModalMenuCardTask";
import ModalAddTask from "../ModalAddTask/ModalAddTask";

const ModalTaskMenu = ({ position, onEditColumn, onDeleteColumn, onAddTask }) => {
  const menuRef = useRef();
  const [newTaskName, setNewTaskName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const closeModalMenuCardTaskState = ModalMenuCardTask(state => state.closeModalMenuCardTaskState);

  const handleSave = () => {
    setIsEditing(false);
    setNewTaskName("");
    closeModalMenuCardTaskState();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeModalMenuCardTaskState();
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModalMenuCardTaskState]);

  if (isEditing) {
    return (
     <ModalAddTask handleSave={handleSave}/>
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
      <ul className="ModalTaskMenu">
        <li onClick={() => setIsEditing(true)}>Редактировать задачу</li>
        <li onClick={() => {
          onAddTask();
          closeModalMenuCardTaskState();
        }}>Просмотреть задачу</li>
        <li onClick={() => {
          onDeleteColumn();
          closeModalMenuCardTaskState();
        }}>Удалить задачу</li>
      </ul>
    </div>
  );
};

export default ModalTaskMenu;
