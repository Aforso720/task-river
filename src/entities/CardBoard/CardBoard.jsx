import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./CardBoard.scss";
import { ModalMenuCardTask } from "./store/ModalMenuCardTask";

const CardBoard = ({
  column,
  provided,
  setCurrentColumnId,
}) => {
  // const modalMenuCardTaskState = ModalMenuCardTask((state)=> state.modalMenuCardTaskState);
  const openModalMenuCardTaskState = ModalMenuCardTask((state)=>state.openModalMenuCardTaskState);
  const closeModalMenuCardTaskState = ModalMenuCardTask((state)=>state.openModalMenuCardTaskState);



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
              <div className="flex items-start">
                <img src="/image/IconWorld.png" alt="Avatar" className="mr-2" />
                <h4 className="font-semibold text-black my-auto flex-auto">{card.title}</h4>
                <img
                  className="cursor-pointer w-5 h-5 ml-2"
                  src="/image/MenuModelBoard.png"
                  alt="Menu Card"
                  onClick={() => openModalMenuCardTaskState()}
                />
              </div>
             <div className="card-content text-xs mt-2">{card.content}</div>
             <div className="flagsInTask">Tiny</div>
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
            closeModalMenuCardTaskState();
          }}
        >
          + Добавить задачу
        </button>
      </div>
    </div>
  );
};

export default CardBoard;
