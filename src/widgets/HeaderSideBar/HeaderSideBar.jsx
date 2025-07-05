import React from 'react'
import './HeaderSideBar.scss'

const HeaderSideBar = () => {
  return (
    <header className='HeaderSideBar'>
      <section className='BlockSearchPanel'>
        <img src="/image/Search.png" alt="Search" />
        <input className='inputSearch text-xs' type="text" placeholder='Поиск' />
      </section>
      <section className='profilePanel gap-3'>
        <div className='iconArr gap-2'>
            <img src="/image/MailIcon.png" alt="Mail" />
            <img src="/image/СallIcon.png" alt="Call" />
        </div>
        <img className='AvatarHeader' src="/image/LogoHead.png" alt="Avatar" />
        <p className='text-2xl text-[#22333B] font-bold'>Qwerty A.</p>
      </section>
    </header>
  )
}

export default HeaderSideBar;
