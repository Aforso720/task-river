import React, { useState } from 'react';
import './AddElemModal.scss';
import useModalAddElemStore from './useModalAddElemStore';

const AddElemModal = () => {
  const { ModalAddElemState, typeModalAddElem, closeModalAddElem } = useModalAddElemStore();

  if (!ModalAddElemState) return null;
  
  const users = [
    { id: 1, firstName: 'Иван', lastName: 'Иванов', avatar: '' },
    { id: 2, firstName: 'Петр', lastName: 'Петров', avatar: '' },
    { id: 3, firstName: 'Сидор', lastName: 'Сидоров', avatar: '' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const getTitleLabel = () => {
    switch (typeModalAddElem) {
      case 'project':
        return 'Название проекта';
      case 'board':
        return 'Название доски';
      case 'task':
        return 'Заголовок задачи';
      default:
        return 'Название';
    }
  };

  const getDescriptionLabel = () => {
    switch (typeModalAddElem) {
      case 'project':
        return 'Описание проекта';
      case 'board':
        return 'Описание доски';
      case 'task':
        return 'Описание задачи';
      default:
        return 'Описание';
    }
  };

  const renderTitle = () => {
    switch (typeModalAddElem) {
      case 'project':
        return 'Добавление проекта';
      case 'board':
        return 'Добавление доски';
      case 'task':
        return 'Добавление задачи';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlayAddElem" onClick={closeModalAddElem}>
      <article className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>{renderTitle()}</h3>
        </header>
        <section className="contentModalAdd flex">
          <div className="leftSide">
            <label>{getTitleLabel()}</label>
            <input
              className="w-72"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`Введите ${getTitleLabel().toLowerCase()}`}
            />

              <div className="assignee-row">
                <label>Ответственные</label>
                <div className="assignees-column h-auto max-h-24 overflow-y-auto my-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="assignee-item bg-[#F7F7F7] p-1 rounded-lg flex items-center"
                    >
                      <div className="avatar ml-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        ) : (
                          `${user.lastName[0]}${user.firstName[0]}`
                        )}
                      </div>
                      <div className="user-name text-xs flex-grow">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="add-btn w-full flex justify-center rounded-xl">
                  +
                </button>
              </div>
        
          </div>
          <section>
            <label>{getDescriptionLabel()}</label>
            <textarea
              className="h-20 max-h-32 w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Введите ${getDescriptionLabel().toLowerCase()}`}
            />
          </section>
        </section>
        <footer className="modal-actions px-5">
          <button className="cancel-btn" onClick={closeModalAddElem}>Отмена</button>
          <button className="save-btn">Сохранить</button>
        </footer>
      </article>
    </div>
  );
};

export default AddElemModal;