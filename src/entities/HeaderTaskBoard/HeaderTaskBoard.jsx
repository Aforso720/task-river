import React from "react";
import "./HeaderTaskBoard.scss";
import ProgressBar from "../../shared/ProgressBar/ProgressBar";
import useActiveStateBoard from "./store/useActiveStateBoard";
import { useWorkMembers } from "@/features/Kanban/api/useWorkMembers";
import useTargetEvent from "@/pages/Panel/store/useTargetEvent";
import ModalWorkUsers from "../ModalWorkUsers/ModalWorkUsers";
import useModalWorkUsersStore from "../ModalWorkUsers/store/useModalWorkUsersStore";

const HeaderTaskBoard = () => {
  const active = useActiveStateBoard((state) => state.activeStateBoard);
  const setActive = useActiveStateBoard((state) => state.editActiveStateBoard);

  const { activeBoardId, activeProjectId } = useTargetEvent();

  const { getMemberProject, membersProject } = useWorkMembers();

  const openUsersModal = useModalWorkUsersStore((s) => s.openModal);

  // подгружаем участников проекта
  React.useEffect(() => {
    if (!activeProjectId) return;
    getMemberProject(activeProjectId).catch((e) =>
      console.error("Не удалось получить участников проекта:", e)
    );
  }, [activeProjectId, getMemberProject]);

  const getDisplayName = (m) =>
    m.fullName || m.username || m.email || "Без имени";

  const getInitials = (m) => {
    const name = getDisplayName(m);
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    const initials = (first + second).toUpperCase();
    return initials || "U";
  };

  const visibleMembers = (membersProject || []).slice(0, 3);
  const extraCount =
    (membersProject?.length || 0) > 3 ? membersProject.length - 3 : 0;

  return (
    <header className="HeaderTaskBoard w-full flex flex-col px-6 gap-3 py-5">
      <div className="topSide flex justify-between w-full">
        <div className="resultBoard flex items-center">
          {/* <img className="w-12 h-12" src="/image/IconProject.png" alt="" /> */}
          <ProgressBar />
        </div>

        <div className="shareBoard flex items-center gap-2">
          {/* СТЕК АВАТАРОК УЧАСТНИКОВ */}
          <div className="flex items-center -space-x-2 mr-2">
            {visibleMembers.length > 0 ? (
              <>
                {visibleMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={openUsersModal}
                    className="w-8 h-8 rounded-full bg-[#8C6D51] text-[#E6E4D8] text-xs font-semibold flex items-center justify-center border border-[#E6E4D8] shadow-sm cursor-pointer"
                    title={getDisplayName(member)}
                  >
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={getDisplayName(member)}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(member)
                    )}
                  </button>
                ))}

                {extraCount > 0 && (
                  <button
                    type="button"
                    onClick={openUsersModal}
                    className="w-8 h-8 rounded-full bg-[#22333B] text-[#E6E4D8] text-xs font-semibold flex items-center justify-center border border-[#E6E4D8] cursor-pointer"
                    title={`Ещё ${extraCount} участник(ов)`}
                  >
                    +{extraCount}
                  </button>
                )}
              </>
            ) : (
              // если участников нет — показываем пустой кружок с "+"
              <button
                type="button"
                onClick={openUsersModal}
                className="w-8 h-8 rounded-full bg-[#8C6D51] text-[#E6E4D8] text-lg font-semibold flex items-center justify-center border border-[#E6E4D8] cursor-pointer"
                title="Добавить участников"
              >
                +
              </button>
            )}
          </div>

          {/* КНОПКА ПОДЕЛИТЬСЯ */}
          <button
            className="bg-[#E6E4D8] text-[#22333B] text-xs font-semibold rounded-lg py-1 px-3"
            onClick={openUsersModal}
          >
            + Поделиться
          </button>
        </div>
      </div>

      <div className="bottomSide px-2 flex justify-between w-full">
        <div className="viewBoard flex gap-5">
          {/* <p
            className={`viewBoard__tab text-white ${
              active === "description" ? "active" : ""
            }`}
            onClick={() => setActive("description")}
          >
            Описание
          </p>
          <p
            className={`viewBoard__tab text-white ${
              active === "board" ? "active" : ""
            }`}
            onClick={() => setActive("board")}
          >
            Доска
          </p> */}
        </div>
        <div className="boardFunction flex gap-3">
          <img
            className="w-4 cursor-pointer"
            src="/image/IconRestart.svg"
            alt="IconRestart"
          />
          <img
            className="w-4 cursor-pointer"
            src="/image/IconFull.svg"
            alt="IconFull"
          />
          <img
            className="w-4 cursor-pointer"
            src="/image/IconSettingBoard.svg"
            alt="IconSettingBoard"
          />
        </div>
      </div>

      {/* Модалка участников проекта */}
      <ModalWorkUsers membersProject={membersProject} />
    </header>
  );
};

export default HeaderTaskBoard;
