import React from "react";
import { useLocation } from "react-router";
import "./SideBarTasks.scss";
import useTargetEvent from "../../pages/Panel/store/useTargetEvent";

const SideBarTasks = ({ projects, boards, tasks }) => {
  const location = useLocation();
  const addProjectID = useTargetEvent((state) => state.addProjectID);
  const addBoardID = useTargetEvent((state) => state.addBoardID);
  const addTaskID = useTargetEvent((state) => state.addTaskID);

  const activeProjectId = useTargetEvent((state) => state.activeProjectId);
  const activeBoardId = useTargetEvent((state) => state.activeBoardId);
  const activeTaskId = useTargetEvent((state) => state.activeTaskId);

  const isBoardRoute = location.pathname.startsWith("/panel/board/");
  const isTasksRoute = location.pathname.startsWith("/panel/tasks");
  
  const activeBoards = isBoardRoute 
    ? boards.filter((item) => item.projectId === null) 
    : boards.filter((item) => item.projectId === activeProjectId); 

  // Фильтруем задачи: для маршрута задач берем только задачи с boardId === null
  const activeTasks = isTasksRoute 
    ? tasks.filter((task) => task.boardId === null) 
    : tasks.filter((task) => task.boardId === activeBoardId); 

  return (
    <aside className="SideBarTasks pt-14 px-5">
      {!isBoardRoute && !isTasksRoute && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">Проекты</h5>
          <div className="cardsSideBarTasks">
            {projects.map((project) => (
              <div
                className={`cardItemSideBar ${
                  activeProjectId === project.id ? "active" : ""
                }`}
                key={project.id}
                onClick={() => addProjectID(project.id)}
              >
                <img src={`/image/${project.icon}`} alt={project.title} />
                <p>{project.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isTasksRoute && activeBoards.length > 0 && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">Доски</h5>
          <div className="cardsSideBarTasks">
            {activeBoards.map((board) => (
              <div
                className={`cardItemSideBar ${
                  activeBoardId === board.id ? "active" : ""
                }`}
                key={board.id}
                onClick={() => addBoardID(board.id)}
              >
                <img src={`/image/${board.icon}`} alt={board.title} />
                <p>{board.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {isTasksRoute && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">Личные задачи</h5>
          <div className="cardsSideBarTasks">
            {activeTasks.map((task) => (
              <div
                className={`cardItemSideBar ${
                  activeTaskId === task.id ? "active" : ""
                }`}
                key={task.id}
                onClick={() => addTaskID(task.id)}
              >
                <img src={`/image/${task.icon}`} alt={task.title} />
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default SideBarTasks;