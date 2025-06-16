import React from 'react'
import { Link } from 'react-router'

const Header = () => {
  const [ navActive , setNavActive] = React.useState(0);

  return (
    <header className='
    Header
    flex justify-between items-center px-8 py-2
    '>
        <img src="image\LogoHead.png" alt="Logotip" />
        <nav>
          <ul className='navHeader flex justify-center items-center gap-4'>
            <li className={navActive == 0 ? "activeNav" : ''} onClick={()=>setNavActive(0)}>
              <Link to="/">Главное</Link>
            </li>
            <li className={navActive == 1 ? "activeNav" : ''} onClick={()=>setNavActive(1)}>
              <Link to="/tariffs">Тарифы</Link>
            </li>
            <li className={navActive == 2 ? "activeNav" : ''} onClick={()=>setNavActive(2)}>
              <Link to="/education">Обучение</Link>
            </li>
            <li className={navActive == 3 ? "activeNav" : ''} onClick={()=>setNavActive(3)}>
              <Link to="/updates">Обновление</Link>
            </li>
            <li className={navActive == 4 ? "activeNav" : ''} onClick={()=>setNavActive(4)}>
              <Link to="/about">О нас</Link>
            </li>
          </ul>
        </nav>
        <h2> <img src="image/UserHead.png" alt="" /></h2> 
    </header>
  )
}

export default Header