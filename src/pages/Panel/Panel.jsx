import React from "react";
import { Helmet } from "react-helmet-async";
import "./Panel.scss";
import SideBar from "../../widgets/SideBar/SideBar";
import HeaderSideBar from "../../widgets/HeaderSideBar/HeaderSideBar";
import ListElemPanel from "../../widgets/ListElemPanel/ListElemPanel";
import TasksBoard from "../../widgets/TasksBoard/TasksBoard";
import SideBarTasks from "../../widgets/SiderBarTasks/SideBarTasks";
import Templates from "../../entities/Templates/Templates";
import NotesInTask from "../../entities/NotesInTask/NotesInTask";
import AddElemModal from "../../widgets/AddElemModal/AddElemModal";
import useModalAddElemStore from "../../widgets/AddElemModal/useModalAddElemStore";
import { useGetElemPanel } from "./api/useGetElemPanel";

import { Routes, Route, useMatch, Navigate, useLocation } from "react-router";

import useTargetEvent from "./store/useTargetEvent";
import Setting from "../../features/Setting/UI/Setting";
import useAuthStore from "@/features/Auth/api/loginRequest";

const Panel = () => {
  const { finishedAuth } = useAuthStore();
  const ModalAddElemState = useModalAddElemStore(
    (state) => state.ModalAddElemState
  );

  const activeTaskId = useTargetEvent((state) => state.activeTaskId);
  const activeBoardId = useTargetEvent((state) => state.activeBoardId);
  const activeProjectId = useTargetEvent((state) => state.activeProjectId);

  const matchProject = useMatch("panel/project/:projectId");
  const matchBoard = useMatch("panel/board/:boardId");
  const matchTask = useMatch("panel/tasks/:taskId");

  const showSidebarTasks = matchProject || matchBoard || matchTask;

  const { projects, boards, tasks, getAllElemPanel , loading:loadingElem } = useGetElemPanel();

  React.useEffect(() => {
    getAllElemPanel();
  }, [getAllElemPanel]);

  const myLocation = useLocation();

  if (!finishedAuth) return null;

  return (
    <section className="PanelPage">
      <Helmet>
        <title>Панель управления | TaskRiver</title>
        <meta
          name="description"
          content="Панель управления TaskRiver: проекты, доски и задачи в одном месте. Управляйте рабочими процессами вашей команды."
        />
      </Helmet>

      <SideBar />
      <div className="wrapperSidebar">
        {showSidebarTasks && (
          <SideBarTasks projects={projects} boards={boards} tasks={tasks} loading={loadingElem}/>
        )}
        <section className="mainPanelPage">
          {myLocation.pathname === "/panel/setting" ? null : <HeaderSideBar />}
          <div className="panelsСontainer">
            <Routes>
              <Route
                path="/menu"
                element={
                  <>
                    <ListElemPanel
                      type={"Проекты"}
                      list={projects}
                      listBoards={boards}
                      loading={loadingElem}
                    />
                    <ListElemPanel
                      type={"Доски"}
                      list={boards.filter((item) => item.projectId === null)}
                      loading={loadingElem}
                    />
                    <ListElemPanel type={"Задачи"} list={tasks} loading={loadingElem}  />
                  </>
                }
              />

              <Route
                path="/project"
                element={
                  activeProjectId ? (
                    <Navigate
                      to={`/panel/project/${activeProjectId}`}
                      replace
                    />
                  ) : (
                    <div className="w-full h-full ml-5 text-4xl text-[#22333B]">
                      Проект не выбран
                    </div>
                  )
                }
              />
              <Route
                path="/project/:projectId"
                element={<TasksBoard boards={boards} />}
              />

              <Route
                path="/board"
                element={
                  activeBoardId ? (
                    <Navigate to={`/panel/board/${activeBoardId}`} replace />
                  ) : (
                    <div className="w-full h-full ml-5 text-4xl text-[#22333B]">
                      Доска не выбрана
                    </div>
                  )
                }
              />
              <Route path="/board/:boardId" element={<TasksBoard />} />

              <Route
                path="/tasks"
                element={
                  activeTaskId ? (
                    <Navigate to={`/panel/tasks/${activeTaskId}`} replace />
                  ) : (
                    <div className="w-full h-full ml-5 text-4xl text-[#22333B]">
                      Задача не выбрана
                    </div>
                  )
                }
              />
              <Route path="/tasks/:taskId" element={<NotesInTask />} />

              <Route path="/market" element={<Templates />} />

              <Route path="/setting" element={<Setting />} />
            </Routes>
          </div>
        </section>
      </div>

      {ModalAddElemState && <AddElemModal />}
    </section>
  );
};

export default Panel;
