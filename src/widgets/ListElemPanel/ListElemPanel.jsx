import React from 'react';
import './ListElemPanel.scss';
import { useNavigate } from "react-router";

import IconProject from '../../../public/image/IconProject.png';
import IconWorld from '../../../public/image//IconWorld.png';
import IconBurger from '../../../public/image//IconBurger.png';
import IconFinger from '../../../public/image//IconFinger.png';

const ListElemPanel = ({ type, project, setOpenBoards, setOpenTasks, onAddClick }) => {
  const navigate = useNavigate();

  const getTitle = () => {
    switch (type) {
      case '1': return 'Проекты';
      case '2': return 'Доски';
      case '3': return 'Задачи';
      default: return 'Проекты';
    }
  };

  const getAddButtonText = () => {
    switch (type) {
      case '1': return '+ Добавить проект';
      case '2': return '+ Добавить доску';
      case '3': return '+ Добавить задачу';
      default: return '+ Добавить проект';
    }
  };

  // Получаем иконку по типу элемента
  const getIcon = (item) => {
    if (type === '1') {
      // Для проектов используем иконку из item.icon
      switch (item.icon) {
        case 'IconWorld.png': return IconWorld;
        case 'IconBurger.png': return IconBurger;
        case 'IconFinger.png': return IconFinger;
        default: return IconProject;
      }
    } else if (type === '2') {
      // Для досок наследуем иконку проекта
      return item.icon ? 
        (item.icon === 'IconWorld.png' ? IconWorld : 
         item.icon === 'IconBurger.png' ? IconBurger : 
         item.icon === 'IconFinger.png' ? IconFinger : IconProject) 
        : IconProject;
    } else {
      // Для задач также наследуем иконку
      return item.icon ? 
        (item.icon === 'IconWorld.png' ? IconWorld : 
         item.icon === 'IconBurger.png' ? IconBurger : 
         item.icon === 'IconFinger.png' ? IconFinger : IconProject) 
        : IconProject;
    }
  };

  const handleItemClick = (id) => {
    if (type === '1' && setOpenBoards) {
      setOpenBoards(id);
    } else if (type === '2' && setOpenTasks) {
      setOpenTasks(id);
    } else if (type === '3') {
      navigate(`/panel/tasks/${id}`);
    }
  };

  return (
    <article className='ListElemPanel'>
      <h3 className='text-3xl font-bold text-[#22333B]'>{getTitle()}</h3>
      <ul>
        {project.map((item, index) => (
          <li
            key={item.id || index}
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={getIcon(item)} 
              alt="Icon" 
              className="item-icon"
              style={{ width: '24px', height: '24px' }}
            />
            <p className='font-medium text-xs text-[#22333B]'>{item.title}</p>
          </li>
        ))}

        <li
          className='add-project-item text-xs text-[#22333B]'
          style={{ cursor: 'pointer' }}
          onClick={() => onAddClick && onAddClick()}
        >
          {getAddButtonText()}
        </li>
      </ul>
    </article>
  );
};

export default ListElemPanel;