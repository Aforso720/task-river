  import React from "react";
  import "./Panel.scss";
  import SideBar from "../../widgets/SideBar/SideBar";
  import HeaderSideBar from "../../widgets/HeaderSideBar/HeaderSideBar";
  import ListElemPanel from "../../widgets/ListElemPanel/ListElemPanel";
  import TasksBoard from "../../widgets/TasksBoard/TasksBoard";
  import SideBarTasks from "../../widgets/SiderBarTasks/SideBarTasks";
  import Templates from "../../entities/Templates/Templates";
  import NotesInTask from "../../entities/NotesInTask/NotesInTask";
  import AddElemModal from "../../widgets/AddElemModal/AddElemModal";
  import useModalAddElemStore from '../../widgets/AddElemModal/useModalAddElemStore';

  import { Routes, Route, useMatch, Navigate , useLocation } from "react-router";
  import { data } from "./data";

  import useTargetEvent from "./store/useTargetEvent";
  import Setting from "../../features/Setting/UI/Setting";
  import useAuthStore from "@/features/Auth/api/loginRequest";

  const Panel = () => {
    const {finishedAuth} = useAuthStore()

    const ModalAddElemState = useModalAddElemStore((state)=>state.ModalAddElemState)
    const activeProjectId = useTargetEvent((state) => state.activeProjectId);
    const activeSingleBoardId = useTargetEvent(
      (state) => state.activeSingleBoardId
    );
    const activeTaskId = useTargetEvent((state) => state.activeTaskId);
    const matchProject = useMatch("panel/project/:projectId");
    const matchBoard = useMatch("panel/board/:boardId");
    const matchTask = useMatch("panel/tasks/:taskId");

    const showSidebarTasks = matchProject || matchBoard || matchTask;

    const { projects, boards, tasks } = data;

    const myLocation = useLocation()

    if(finishedAuth) return null

    return (
      <section className="PanelPage">
        <SideBar />
        <div className="wrapperSidebar">
          {showSidebarTasks && (
            <SideBarTasks projects={projects} boards={boards} tasks={tasks} />
          )}
          <section className="mainPanelPage">
            {myLocation.pathname === '/panel/setting' ? 
            null : 
            <HeaderSideBar />
            }
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
                      />
                      <ListElemPanel
                        type={"Доски"}
                        list={boards.filter((board) => board.projectId === null)}
                      />
                      <ListElemPanel
                        type={"Задачи"}
                        list={tasks.filter((task) => task.boardId === null)}
                      />
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
                <Route path="/project/:projectId" element={<TasksBoard />} />

                <Route
                  path="/board"
                  element={
                    activeSingleBoardId ? (
                      <Navigate
                        to={`/panel/board/${activeSingleBoardId}`}
                        replace
                      />
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

                <Route path='/market' element={<Templates />}/>

                <Route path='/setting' element={<Setting />}/>
              </Routes>
            </div>
          </section>
        </div>
        
        {ModalAddElemState && <AddElemModal />}

      </section>
    );
  };

  export default Panel;
