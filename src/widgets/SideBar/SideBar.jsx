import React from 'react';
import './SideBar.scss';
import { Link } from 'react-router';

const SideBar = () => {
  const [activeItem, setActiveItem] = React.useState('panel'); 

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <aside className='sideBar'>
      <ul>
        <Link><li className='mb-5'><img src="/image/LogoIcon.svg" alt="Logo" /></li></Link>
        <Link to='/panel'>
          <li 
            className={`sideBar-item ${activeItem === 'panel' ? 'active' : ''}`}
            onClick={() => handleItemClick('panel')}
          >
            <img src="/image/PanelIcon.svg" alt="Menu" />
          </li>
        </Link>
        <Link>
          <li 
            className={`sideBar-item ${activeItem === 'project' ? 'active' : ''}`}
            onClick={() => handleItemClick('project')}
          >
            <img src="/image/ProjectIcon.svg" alt="Project" />
          </li>
        </Link>
        <Link>
          <li 
            className={`sideBar-item ${activeItem === 'board' ? 'active' : ''}`}
            onClick={() => handleItemClick('board')}
          >
            <img src="/image/BoardIcon.svg" alt="Boards" />
          </li>
        </Link>
        <Link>
          <li 
            className={`sideBar-item ${activeItem === 'task' ? 'active' : ''}`}
            onClick={() => handleItemClick('task')}
          >
            <img src="/image/TaskIcon.svg" alt="Tasks" />
          </li>
        </Link>
        <Link>
          <li 
            className={`sideBar-item my-1 ${activeItem === 'market' ? 'active' : ''}`}
            onClick={() => handleItemClick('market')}
          >
            <img src="/image/MarketIcon.svg" alt="Market" />
          </li>
        </Link>
        <Link>
          <li 
            className={`sideBar-item p-2 ${activeItem === 'theme' ? 'active' : ''}`}
            onClick={() => handleItemClick('theme')}
          >
            <img src="/image/ThemeIcon.svg" alt="Thema" />
          </li>
        </Link>
      </ul>
      <Link>
        <div className={`sideBar-item ${activeItem === 'setting' ? 'active' : ''}`}>
          <img src="/image/SettingICon.svg" alt="Setting" />
        </div>
      </Link>
    </aside>
  )
}

export default SideBar;