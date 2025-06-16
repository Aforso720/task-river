import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TasksBoard.scss";

const TasksBoard = () => {
  const [columns, setColumns] = useState({
    backlog: {
      id: "backlog",
      title: "Бэклог",
      cards: [
        {
          id: "1",
          title: "Разработать систему авторизации",
          content:
            "Реализовать вход через email и соцсети. Добавить восстановление пароля.",
        },
        {
          id: "2",
          title: "Исправить баг с кнопкой отправки",
          content: "Кнопка неактивна после ошибки валидации формы",
        },
        {
          id: "3",
          title: "Добавить фильтры в каталог",
          content: "Фильтрация по цене, рейтингу и новизне",
        },
        {
          id: "4",
          title: "Оптимизировать загрузку изображений",
          content: "Реализовать lazy loading для галереи товаров",
        },
        {
          id: "5",
          title: "Обновить документацию API",
          content: "Добавить новые endpoints в swagger",
        },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "В работе",
      cards: [
        {
          id: "6",
          title: "Интеграция с платежной системой",
          content: "Подключение Stripe для приема оплаты",
        },
        {
          id: "7",
          title: "Рефакторинг корзины покупок",
          content: "Улучшить структуру кода компонента Cart",
        },
        {
          id: "8",
          title: "Адаптивная верстка личного кабинета",
          content: "Исправить баги на мобильных устройствах",
        },
      ],
    },
    review: {
      id: "review",
      title: "На проверке",
      cards: [
        {
          id: "9",
          title: "Новый дизайн главной страницы",
          content: "Готово к ревью от продуктовой команды",
        },
        {
          id: "10",
          title: "Миграция базы данных",
          content: "Перенос пользователей на новую схему",
        },
      ],
    },
    done: {
      id: "done",
      title: "Готово",
      cards: [
        {
          id: "11",
          title: "Настройка CI/CD пайплайна",
          content: "Автоматические деплои в staging окружение",
        },
        {
          id: "12",
          title: "Верстка email-рассылок",
          content: "Шаблоны для всех типов уведомлений",
        },
        {
          id: "13",
          title: "Тестирование checkout процесса",
          content: "Написано 25 тестов для сценариев оплаты",
        },
        {
          id: "14",
          title: "Обновление библиотек",
          content: "React 18 и все зависимости до актуальных версий",
        },
      ],
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);

  const [newColumnName, setNewColumnName] = useState("");

  const onDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // Если перетаскиваем колонку
    if (type === "COLUMN") {
      if (destination.index === source.index) return;

      const newColumnOrder = Object.values(columns).sort(
        (a, b) => a.order - b.order
      );
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);

      const newColumns = {};
      newColumnOrder.forEach((col, index) => {
        newColumns[col.id] = { ...col, order: index };
      });

      setColumns(newColumns);
      return;
    }

    // Если перетаскиваем карточку
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newCards = [...start.cards];
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [start.id]: {
          ...start,
          cards: newCards,
        },
      });
      return;
    }

    // Перемещение между колонками
    const startCards = [...start.cards];
    const [removed] = startCards.splice(source.index, 1);
    const finishCards = [...finish.cards];
    finishCards.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [start.id]: {
        ...start,
        cards: startCards,
      },
      [finish.id]: {
        ...finish,
        cards: finishCards,
      },
    });
  };

  const addCard = (columnId) => {
    if (!newTask.title.trim()) return;

    const newCard = {
      id: `card-${Date.now()}`,
      title: newTask.title,
      content: (
        <div className="card-content">
          <label>{newTask.description || "Описание отсутствует"}</label>
        </div>
      ),
    };

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: [...columns[columnId].cards, newCard],
      },
    });
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;

    const newId = `col-${Date.now()}`;
    setColumns({
      ...columns,
      [newId]: {
        id: newId,
        title: newColumnName,
        cards: [],
      },
    });
    setNewColumnName("");
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    addColumn();
    setIsAddColumnVisible(false);
  };

  return (
    <div className="tasks-board-container">
      <div className="tasks-board-wrapper">
        <div className="tasks-board">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <div
                  className="columns-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="columns">
                    {Object.values(columns).map((column, index) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`column-wrapper ${
                              snapshot.isDragging ? "is-dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div className="column">
                              <div
                                className="column-header"
                                {...provided.dragHandleProps}
                              >
                                <h3 className="text-2xl font-bold">
                                  {column.title}
                                  <span className="task-count">
                                    {column.cards.length}
                                  </span>
                                </h3>
                              </div>

                              <Droppable droppableId={column.id}>
                                {(provided) => (
                                  <div
                                    className="cards"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {column.cards.map((card, index) => (
                                      <Draggable
                                        key={card.id}
                                        draggableId={card.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            className="card text-xs text-[#959BA3]"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <h4 className="font-semibold text-black">
                                              {card.title}
                                            </h4>
                                            {card.content}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <div className="add-card">
                                      <button
                                        className="add-card-button"
                                        onClick={() => {
                                          setCurrentColumnId(column.id);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        + Добавить задачу
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {isAddColumnVisible ? (
                      <div className="add-column-inline">
                        <input
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          placeholder="Название колонки"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddColumn()
                          }
                        />
                        <button
                          className="add-column-button"
                          onClick={handleAddColumn}
                          disabled={!newColumnName.trim()}
                        >
                          +
                        </button>
                        <button
                          className="cancel-add-column"
                          onClick={() => {
                            setNewColumnName("");
                            setIsAddColumnVisible(false);
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="add-column-inline-two">
                        <button
                          className="add-column-toggle"
                          onClick={() => setIsAddColumnVisible(true)}
                        >
                          + Добавить колонку
                        </button>
                      </div>
                    )}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3 className="mb-3 text-xl font-bold text-black">Новая задача</h3>
                <input
                  type="text"
                  placeholder="Название задачи"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Описание задачи"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      addCard(currentColumnId);
                      setIsModalOpen(false);
                      setNewTask({ title: "", description: "" });
                    }}
                  >
                    Добавить
                  </button>
                  <button onClick={() => setIsModalOpen(false)}>Отмена</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksBoard;
