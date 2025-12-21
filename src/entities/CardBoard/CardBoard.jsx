import { Draggable } from "@hello-pangea/dnd";
import "./CardBoard.scss";
import { ModalTaskState } from "../ModalAddTask/store/ModalTaskState";

const PRIORITY_CLASS_BY_DIFFICULTY = {
  HARD: "high-priority",
  MEDIUM: "medium-priority",
  EASY: "low-priority",
};

const PRIORITY_LABEL_BY_DIFFICULTY = {
  HARD: "Высокая",
  MEDIUM: "Средняя",
  EASY: "Низкая",
};

function getPriorityInfo(difficultyRaw) {
  const key = String(difficultyRaw || "").trim().toUpperCase();
  const cls =
    PRIORITY_CLASS_BY_DIFFICULTY[key] ?? PRIORITY_CLASS_BY_DIFFICULTY.LOW;
  const label =
    PRIORITY_LABEL_BY_DIFFICULTY[key] ?? PRIORITY_LABEL_BY_DIFFICULTY.LOW;
  return { cls, label };
}

const CardBoard = ({ column, provided, setCurrentColumnId }) => {
  const openModal = ModalTaskState((s) => s.openModalTaskState);

  return (
    <div className="cards" ref={provided.innerRef} {...provided.droppableProps}>
      {column.cards.map((card, index) => {
        const difficulty = card?.raw?.difficulty || card?.difficulty;
        const { cls: priorityClass, label: priorityLabel } =
          getPriorityInfo(difficulty);

        return (
          <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided) => (
              <div
                className="card text-xs text-[#959BA3]"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => openModal("view", card, column.id)}
              >
                <div className="flex items-start">
                  <img src="/image/IconWorld.png" alt="Avatar" className="mr-2" />
                  <h4 className="font-semibold text-black my-auto flex-auto">
                    {card.title}
                  </h4>
                  <img
                    className="cursor-pointer w-5 h-5 ml-2"
                    src="/image/MenuModelBoard.png"
                    alt="Menu Card"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("edit", card, column.id);
                    }}
                  />
                </div>

                <div className="card-content text-xs mt-2">{card.content}</div>

                <div className={`flagsInTask ${priorityClass}`}>
                  {priorityLabel}
                </div>
              </div>
            )}
          </Draggable>
        );
      })}

      {provided.placeholder}

      <div className="add-card">
        <button
          className="add-card-button"
          onClick={() => {
            // оставлю твой прежний вызов, если он где-то нужен
            setCurrentColumnId?.(column.id);
            // основной вызов — открываем модалку в режиме "add" для этой колонки
            openModal("add", null, column.id);
          }}
        >
          + Добавить задачу
        </button>
      </div>
    </div>
  );
};

export default CardBoard;
