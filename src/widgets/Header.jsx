import React from 'react';
import { Link, useLocation } from 'react-router';
import useAuthModalStore from '../features/Auth/store/authModal';

const Header = () => {
  const location = useLocation();
  const {openModalAuthState }=useAuthModalStore();

  const navItems = [
    { label: 'Главное', path: '/' },
    { label: 'Тарифы', path: '/tariffs' },
    { label: 'Обучение', path: '/education' },
    { label: 'Обновление', path: '/updates' },
    { label: 'О нас', path: '/about' },
  ];

  return (
    <header className="Header flex justify-between items-center px-8 py-2">
      
      <Link to='/panel/menu'>
        <img src="image/LogoHead.svg" alt="Logotip" className='cursor-pointer' />
      </Link>

      <nav>
        <ul className="navHeader flex justify-center items-center gap-4">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? 'activeNav' : ''}
            >
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <h2>
        <img src="image/user.svg" alt="User" onClick={openModalAuthState} />
      </h2>
    </header>
  );
};

export default Header;
