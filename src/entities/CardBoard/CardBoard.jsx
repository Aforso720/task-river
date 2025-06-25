import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./CardBoard.scss";

const CardBoard = ({
  column,
  provided,
  editModalColumnMenu,
  setCurrentColumnId,
  setIsModalOpen,
}) => {
  return (
    <div className="cards" ref={provided.innerRef} {...provided.droppableProps}>
      {column.cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided) => (
            <div
              className="card text-xs text-[#959BA3]"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="flex justify-between items-start">
                <img src="/image/IconWorld.png" alt="Avatar" className="mr-2" />
                <h4 className="font-semibold text-black my-auto">{card.title}</h4>
                <img
                  className="cursor-pointer w-5 h-5 ml-2"
                  src="/image/MenuModelBoard.png"
                  alt="Menu Card"
                  onClick={() => editModalColumnMenu()}
                />
              </div>
             <div className="card-content text-xs mt-2">{card.content}</div>
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
  );
};

export default CardBoard;
