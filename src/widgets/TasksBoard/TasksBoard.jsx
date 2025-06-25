import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TasksBoard.scss";
import ModalAddTask from "../../entities/ModalAddTask/ModalAddTask";
import ModalColumnMenu from "../../entities/ModalColumnMenu/ModalColumnMenu";
import useOpenColumnMenu from "../../entities/ModalColumnMenu/useOpenColumnMenu";
import CardBoard from "../../entities/CardBoard/CardBoard";

const TasksBoard = () => {
  const isModalColumnMenu = useOpenColumnMenu(
    (state) => state.isModalColumnMenu
  );
  const editModalColumnMenu = useOpenColumnMenu(
    (state) => state.editModalColumnMenu
  );
  const menuPosition = useOpenColumnMenu((state) => state.menuPosition);

  const handleEditColumn = (newName) => {
    if (!newName.trim()) return;

    setColumns((prev) => ({
      ...prev,
      [currentColumnId]: {
        ...prev[currentColumnId],
        title: newName,
      },
    }));
  };

  const handleDeleteColumn = (columnId) => {
    const newColumns = { ...columns };
    delete newColumns[columnId];
    setColumns(newColumns);
  };

  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
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
          <DragDropContext
            onDragEnd={(result) => {
              setIsDraggingColumn(false);
              onDragEnd(result);
            }}
            onDragStart={(start) => {
              if (start.type === "COLUMN") {
                setIsDraggingColumn(true);
              }
            }}
          >
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <div
                  className="columns-container flex"
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
                                className="column-header flex justify-between items-center"
                                {...provided.dragHandleProps}
                              >
                                <h3 className="text-2xl font-bold">
                                  {column.title}
                                  <span className="task-count">
                                    {column.cards.length}
                                  </span>
                                </h3>

                                <img
                                  className="cursor-pointer w-5 h-5"
                                  src="/image/MenuModelBoard.png"
                                  alt="Menu Column"
                                  onClick={(e) => {
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    editModalColumnMenu(
                                      {
                                        top: rect.bottom + window.scrollY,
                                        left: rect.left + window.scrollX + 5,
                                      },
                                      column.id
                                    );
                                    setCurrentColumnId(column.id); 
                                  }}
                                />
                              </div>

                              <Droppable droppableId={column.id}>
                                {(provided) => (
                                  <CardBoard
                                    column={column}
                                    provided={provided}
                                    editModalColumnMenu={() =>
                                      editModalColumnMenu(
                                        {
                                          top: menuPosition.top,
                                          left: menuPosition.left,
                                        },
                                        column.id
                                      )
                                    }
                                    setCurrentColumnId={setCurrentColumnId}
                                    setIsModalOpen={setIsModalOpen}
                                  />
                                )}
                              </Droppable>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {!isDraggingColumn &&
                      (isAddColumnVisible ? (
                        <div
                          className={`add-column-inline ${
                            isDraggingColumn ? "hidden-during-drag" : ""
                          }`}
                        >
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
                      ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {isModalOpen && (
            <ModalAddTask
              newTask={newTask}
              setNewTask={setNewTask}
              currentColumnId={currentColumnId}
              addCard={addCard}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {isModalColumnMenu && (
            <ModalColumnMenu
              position={menuPosition}
              onEditColumn={handleEditColumn}
              onDeleteColumn={() => handleDeleteColumn(currentColumnId)}
              onAddTask={() => {
                setCurrentColumnId(currentColumnId);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksBoard;
