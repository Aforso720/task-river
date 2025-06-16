import React from 'react';
import './SideBar.scss';
import { Link } from 'react-router';

const SideBar = () => {
  return (
    <aside className='sideBar'>
      <ul>
        <Link><li className='mb-5'><img src="/image/LogoPanel.png" alt="Logo" /></li></Link>
        <Link to='/panel'><li><img src="/image/MenuSideBar.png" alt="Menu" /></li></Link>
        <Link><li><img src="/image/ProjectSideBar.png" alt="Project" /></li></Link>
        <Link><li><img src="/image/DosksSideBar.png" alt="Boards" /></li></Link>
        <Link><li><img src="/image/PenSideBar.png" alt="Tasks" /></li></Link>
        <Link><li className='my-1'><img src="/image/MarketSideBar.png" alt="Market" /></li></Link>
        <Link><li><img src="/image/ThemaSideBar.png" alt="Thema" /></li></Link>
      </ul>
      <Link><img src="/image/SettingSideBar.png" alt="Setting" /></Link>
    </aside>
  )
}

export default SideBar;
