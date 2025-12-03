import React from "react";
import { useLocation } from "react-router";
import "./SideBarTasks.scss";
import useTargetEvent from "../../pages/Panel/store/useTargetEvent";
import SkeletonSideBar from "@/shared/Skeletons/SkeletonSideBar";

const SideBarTasks = ({ projects, boards, tasks, loading }) => {
  const location = useLocation();

  const addProjectID = useTargetEvent((state) => state.addProjectID);
  const addBoardID = useTargetEvent((state) => state.addBoardID);
  const addGroupBoardId = useTargetEvent((state) => state.addGroupBoardId);
  const addTaskID = useTargetEvent((state) => state.addTaskID);

  const activeProjectId = useTargetEvent((state) => state.activeProjectId);
  const activeBoardId = useTargetEvent((state) => state.activeBoardId);
  const activeGroupBoardId = useTargetEvent((state) => state.activeGroupBoardId);
  const activeTaskId = useTargetEvent((state) => state.activeTaskId);

  const isBoardRoute = location.pathname.startsWith("/panel/board");
  const isTasksRoute = location.pathname.startsWith("/panel/tasks");

  const activeBoards = isBoardRoute
    ? boards.filter((item) => item.projectId === null)
    : boards.filter((item) => item.projectId === activeProjectId);

  const activeTasks = isTasksRoute
    ? tasks.filter((task) => task.boardId === null)
    : tasks.filter((task) => task.boardId === activeBoardId);

  const isBoardActive = (board) =>
    isBoardRoute ? activeBoardId === board.id : activeGroupBoardId === board.id;

  const handleBoardClick = (board) => {
    if (isBoardRoute) {
      addBoardID(board.id);
    } else {
      addGroupBoardId(board.id);
    }
  };

  return (
    <aside className="SideBarTasks pt-14 px-5">
      {!isBoardRoute && !isTasksRoute && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">Проекты</h5>
          <div className="cardsSideBarTasks">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="cardItemSideBar"
                    key={`projects-skeleton-${index}`}
                  >
                    <SkeletonSideBar />
                  </div>
                ))
              : projects.map((project) => (
                  <div
                    className={`cardItemSideBar ${
                      activeProjectId === project.id ? "active" : ""
                    }`}
                    key={project.id}
                    onClick={() => addProjectID(project.id)}
                  >
                    {project.icon && (
                      <img
                        src={`/image/${project.icon}`}
                        alt={project.name}
                      />
                    )}
                    <p>{project.name}</p>
                  </div>
                ))}
          </div>
        </section>
      )}
      {!isTasksRoute && activeBoards.length > 0 && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">Доски</h5>
          <div className="cardsSideBarTasks">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="cardItemSideBar"
                    key={`boards-skeleton-${index}`}
                  >
                    <SkeletonSideBar />
                  </div>
                ))
              : activeBoards.map((board) => (
                  <div
                    className={`cardItemSideBar ${
                      isBoardActive(board) ? "active" : ""
                    }`}
                    key={board.id}
                    onClick={() => handleBoardClick(board)}
                  >
                    {board.icon && (
                      <img src={`/image/${board.icon}`} alt={board.name} />
                    )}
                    <p>{board.name}</p>
                  </div>
                ))}
          </div>
        </section>
      )}
      {isTasksRoute && (
        <section className="navInSideBar">
          <h5 className="text-2xl text-[#22333B] font-bold mb-5">
            Личные задачи
          </h5>
          <div className="cardsSideBarTasks">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="cardItemSideBar"
                    key={`tasks-skeleton-${index}`}
                  >
                    <SkeletonSideBar />
                  </div>
                ))
              : activeTasks.map((task) => (
                  <div
                    className={`cardItemSideBar ${
                      activeTaskId === task.id ? "active" : ""
                    }`}
                    key={task.id}
                    onClick={() => addTaskID(task.id)}
                  >
                    {task.icon && (
                      <img src={`/image/${task.icon}`} alt={task.name} />
                    )}
                    <p>{task.name}</p>
                  </div>
                ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default SideBarTasks;
