import React from 'react'
import './Home.scss'
import VideoSetting from '@shared/UI/VideoSetting/VideoSetting'
import SliderHome from '@widgets/SliderHome/SliderHome.jsx'

const Home = () => {
  return (
    <section className='HomePage flex flex-col justify-center items-center'>
      <section className='authHome flex justify-between items-center gap-5'>
        <section className='textAuthHome flex flex-col justify-between items-center'>
          <h3 className='text-5xl align-top'> <b>Здесь</b> будет текст</h3>
          <div className='footTextAuthHome gap-2'>
            <p className='text-1xl'>Рабочий электронный адрес</p>
            <input className='px-3 text-2xl' type="email" placeholder='you@mail.ru'/>
            <p className='text-1x1'>Находите коллег и разделяйте работу и личную жизнь благодаря рабочему адресу электронной почты.</p>
            <button className='text-2xl'>Регистрация</button>
          </div>
        </section>
        <SliderHome/>
      </section>
        <VideoSetting/>
      <section className='aboutHome flex flex-col justify-between items-center'>
        <h2 className='text-5xl'>Немного о нас</h2>
        <div className='infoAboutHome flex justify-between items-center'>
            <p className='text-2xl font-bold '>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum.</p>
            <img src="image/HomeBlock.png" alt="" />
        </div>
      </section>
    </section>
  )
}

export default Home
