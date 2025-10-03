import React from "react";
import "./HeaderTaskBoard.scss";
import ProgressBar from "../../shared/ProgressBar/ProgressBar";
import useActiveStateBoard from "./store/useActiveStateBoard";

const HeaderTaskBoard = () => {
  const active = useActiveStateBoard((state) => state.activeStateBoard);
  const setActive = useActiveStateBoard((state) => state.editActiveStateBoard);

  return (
    <header className="HeaderTaskBoard w-full flex flex-col px-6 gap-3 py-5">
      <div className="topSide flex justify-between w-full">
        <div className="resultBoard flex items-center">
          <img className="w-12 h-12" src="/image/IconProject.png" alt="" />
          <ProgressBar />
        </div>
        <div className="shareBoard flex items-center">
          <button className="bg-[#E6E4D8] text-[#22333B] text-xs font-semibold rounded-lg py-1 px-3">
            + Поделиться
          </button>
        </div>
      </div>
      <div className="bottomSide px-2 flex justify-between w-full">
        <div className="viewBoard flex gap-5">
          <p
            className={`viewBoard__tab text-white ${
              active === "description" ? "active" : ""
            }`}
            onClick={() => setActive("description")}
          >
            Описание
          </p>
          <p
            className={`viewBoard__tab text-white ${active === "board" ? "active" : ""}`}
            onClick={() => setActive("board")}
          >
            Доска
          </p>
        </div>
        <div className="boardFunction flex gap-3">
          <img className="w-4 cursor-pointer" src="/image/IconRestart.svg" alt="IconRestart" />
          <img className="w-4 cursor-pointer" src="/image/IconFull.svg" alt="IconFull" />
          <img className="w-4 cursor-pointer" src="/image/IconSettingBoard.svg" alt="IconSettingBoard" />
        </div>
      </div>
    </header>
  );
};

export default HeaderTaskBoard;
