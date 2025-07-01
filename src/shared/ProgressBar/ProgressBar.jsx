import React from "react";
import useListTaskInBoard from "../../entities/HeaderTaskBoard/store/useListTaskInBoard";
import "./ProgressBar.scss";

const ProgressBar = () => {
  const total = useListTaskInBoard((state) => state.listTaskBoard);
  const done = useListTaskInBoard((state) => state.doneTasks);

  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="ProgressBar">
      <div className="ProgressBar__label order-1">{progress}% завершено</div>
      <div className="ProgressBar__track">
        <div className="ProgressBar__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
