import React, { useState } from "react";
import "./ModalAddTask.scss";

const ModalAddTask = ({
  newTask,
  setNewTask,
  currentColumnId,
  addCard,
  setIsModalOpen,
}) => {
  const [priority, setPriority] = useState("Высокий");
  const [deadlineDate, setDeadlineDate] = useState("2025-06-23");
  const [deadlineTime, setDeadlineTime] = useState("14:30");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = [...files, ...Array.from(e.target.files)];
    setFiles(newFiles);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  const users = [
    { id: 1, firstName: "Екатерина", lastName: "Алексеева", avatar: null },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-medium text-xl text-[#000000] text-center w-full">
          Добавления задачи
        </h3>
        <div className="contentModalAdd px-5 flex gap-10">
          <div className="leftSide">
            <label>Заголовок задачи</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <label>Описание задачи</label>
            <textarea
              className="h-20 max-h-32"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <div className="assignee-row">
              <label>Ответственные</label>
              <button className="add-btn ml-auto">+</button>
              <div className="assignees-column h-20 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="assignee-item bg-[#F7F7F7] p-1 rounded-lg">
                    <div className="avatar">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        `${user.lastName[0]}${user.firstName[0]}`
                      )}
                    </div>
                    <div className="user-name">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ridthSide">
            <div className="deadline-row">
              <label>Сроки</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </div>

            <div className="priority-row">
              <label>Приоритет</label>
              <div className="priority-options">
                {["Высокий", "Средний", "Низкий"].map((level) => (
                  <button
                    key={level}
                    className={priority === level ? "selected" : ""}
                    onClick={() => setPriority(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="file-section">
              <label>Прикрепленные файлы</label>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    <button onClick={() => removeFile(index)}>🗑️</button>
                  </li>
                ))}
              </ul>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
          </div>
        </div>
        <div className="modal-actions mx-5 mb-2">
          <button className="delete-btn">Удалить</button>
          <div className="gap-5 flex">
            <button
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
            >
              Отменить
            </button>
            <button
              className="save-btn"
              onClick={() => {
                addCard(currentColumnId);
                setIsModalOpen(false);
                setNewTask({ title: "", description: "" });
                setFiles([]);
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddTask;
