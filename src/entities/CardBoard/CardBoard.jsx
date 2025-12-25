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

  // fallback должен быть на EASY, а не LOW (LOW у тебя нет)
  const cls =
    PRIORITY_CLASS_BY_DIFFICULTY[key] ?? PRIORITY_CLASS_BY_DIFFICULTY.EASY;
  const label =
    PRIORITY_LABEL_BY_DIFFICULTY[key] ?? PRIORITY_LABEL_BY_DIFFICULTY.EASY;

  return { cls, label };
}

const CardBoard = ({ column, provided: dropProvided, setCurrentColumnId }) => {
  const openModal = ModalTaskState((s) => s.openModalTaskState);

  return (
    <div
      className="cards"
      ref={dropProvided.innerRef}
      {...dropProvided.droppableProps}
    >
      {column.cards.map((card, index) => {
        const difficulty = card?.raw?.difficulty || card?.difficulty;
        const { cls: priorityClass, label: priorityLabel } =
          getPriorityInfo(difficulty);

        // ВАЖНО: draggableId всегда строка
        const draggableId = String(card.id);

        return (
          <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {(dragProvided, snapshot) => (
              <div
                className={`card text-xs text-[#959BA3] ${
                  snapshot.isDragging ? "is-dragging" : ""
                }`}
                ref={dragProvided.innerRef}
                {...dragProvided.draggableProps}
                {...dragProvided.dragHandleProps}
                style={dragProvided.draggableProps.style} // ВАЖНО
                onClick={() => openModal("view", card, column.id)}
              >
                <div className="flex items-start">
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

      {dropProvided.placeholder}

      <div className="add-card">
        <button
          className="add-card-button"
          type="button"
          onClick={() => {
            setCurrentColumnId?.(column.id);
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
