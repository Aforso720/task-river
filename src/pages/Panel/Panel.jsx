import React from "react";
import "./Panel.scss";
import SideBar from "../../widgets/SideBar/SideBar";
import HeaderSideBar from "../../widgets/HeaderSideBar/HeaderSideBar";
import ListElemPanel from "../../widgets/ListElemPanel/ListElemPanel";
import TasksBoard from "../../widgets/TasksBoard/TasksBoard";
import { Routes, Route} from "react-router";
import {projects} from './data'

const Panel = () => {
  const [openBoards, setOpenBoards] = React.useState(false);
  const [openTasks, setOpenTasks] = React.useState(false);

  const [activeProject, setActiveProject] = React.useState(null);
  const [activeBoard, setActiveBoard] = React.useState(null);



  const renderProjectList = () => (
    <ListElemPanel
      type="1"
      project={projects}
      setOpenBoards={(projectId) => {
        setActiveProject(projectId);
        setOpenBoards(true);
        setOpenTasks(false);
      }}
    />
  );

  const renderBoardList = () => {
    const project = projects.find((p) => p.id === activeProject);
    return (
      <ListElemPanel
        type="2"
        project={project?.boards || []}
        setOpenTasks={(boardId) => {
          setActiveBoard(boardId);
          setOpenTasks(true);
        }}
      />
    );
  };

  const renderTaskList = () => {
    const project = projects.find((p) => p.id === activeProject);
    const board = project?.boards.find((b) => b.id === activeBoard);
    return <ListElemPanel type="3" project={board?.tasks || []} />;
  };

  return (
    <section className="PanelPage">
      <SideBar />
      <section className="mainPanelPage">
        <HeaderSideBar />
        <div className="panelsСontainer">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {renderProjectList()}
                  {openBoards && renderBoardList()}
                  {openTasks && renderTaskList()}
                </>
              }
            />
            <Route path="/tasks/:taskId" element={<TasksBoard />} />
          </Routes>
        </div>
      </section>
    </section>
  );
};

export default Panel;
