import React, { useState } from 'react';
import './TariffSetting.scss';

const TariffSetting = () => {
  const [period, setPeriod] = useState(3); 
  const [employees, setEmployees] = useState(10);
  const [fileSize, setFileSize] = useState(200); 

  return (
    <div className="tariff-container">
      <div className="slider-group">
        <label>Период</label>
        <input
          type="range"
          min="1"
          max="24"
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
        />
        <div className="slider-values">
          <span>1 месяц</span>
          <span>{period} мес</span>
          <span>2 года</span>
        </div>
      </div>

      {/* Количество сотрудников */}
      <div className="slider-group">
        <label>Количество сотрудников</label>
        <input
          type="range"
          min="5"
          max="100"
          value={employees}
          onChange={(e) => setEmployees(parseInt(e.target.value))}
        />
        <div className="slider-values">
          <span>5</span>
          <span>{employees}</span>
          <span>100</span>
        </div>
      </div>

      {/* Размер загрузки файлов */}
      <div className="slider-group">
        <label>Размер загрузки файлов</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={fileSize}
          onChange={(e) => setFileSize(parseInt(e.target.value))}
        />
        <div className="slider-values">
          <span>100 мб</span>
          <span>{fileSize} мб</span>
          <span>2 гб</span>
        </div>
      </div>

      {/* Кнопки */}
      <div className="button-group">
        <button className="save-btn">Сохранить</button>
        <button className="connect-btn">Подключить</button>
      </div>
    </div>
  );
};

export default TariffSetting;
