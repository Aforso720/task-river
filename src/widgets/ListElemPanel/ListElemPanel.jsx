import React from "react";
import "./ListElemPanel.scss";
import { useNavigate } from "react-router";
import useTargetEvent from "../../pages/Panel/store/useTargetEvent";

const ListElemPanel = ({ type, list, listBoards }) => {
  const addProjectID = useTargetEvent((state) => state.addProjectID);
  const addBoardID = useTargetEvent((state) => state.addBoardID);
  const addTaskID = useTargetEvent((state) => state.addTaskID);
  const addSingleBoardID = useTargetEvent((state)=>state.addSingleBoardID)


  const navigate = useNavigate();

  const handleClick = (item) => {
    if (type === "Проекты") {
      addProjectID?.(item.id);

      const projectBoards = listBoards?.filter((b) => b.projectId === item.id);
      if (projectBoards?.length > 0) {
        addBoardID?.(projectBoards[0].id);
      } else {
        addBoardID?.(null);
      }

      navigate(`/panel/project/${item.id}`);
    } else if (type === "Доски") {
      addSingleBoardID?.(item.id);
      navigate(`/panel/board/${item.id}`);
    } else {
      addTaskID?.(item.id);
      navigate(`/panel/tasks/${item.id}`);
    }
  };

  const getTypeAddText = () => {
    if (type === "Проекты") return "проект";
    if (type === "Доски") return "доску";
    return "задачу";
  };

  return (
    <article
      className={`ListElemPanel ${
        type === "Задачи" ? "border-b-0" : "border-b border-[#22333B]"
      }`}
    >
      <h3 className="text-3xl font-bold text-[#22333B]">{type}</h3>
      <ul>
        {list.map((item) => (
          <li
            key={item.id}
            onClick={() => handleClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`/image/${item.icon}`}
              alt="Icon"
              className="item-icon"
              style={{ width: "24px", height: "24px" }}
            />
            <p className="font-medium text-xs text-[#22333B]">{item.title}</p>
          </li>
        ))}
        <li
          className="add-project-item text-xs text-[#22333B]"
          style={{ cursor: "pointer" }}
        >
          {`+ добавить ${getTypeAddText()}`}
        </li>
      </ul>
    </article>
  );
};

export default ListElemPanel;
