import React from 'react'

const Footer = () => {
  return (
    <footer className='Footer flex justify-center'> 
      <div className='px-8 py-2 w-[1140px] h-full flex justify-between items-center'>
        <img src="image\LogoFoot.png" />
        <div className='flex justify-center items-center p-10'>
          <p className='text-[#e6e4d8] text-xl'>«Проект выполнен при поддержке «Фонда содействия инновациям» в рамках программы «Студенческий стартап» федерального проекта «Платформа университетского технологического предпринимательства»."</p>
          <img src="image\photo_2026-04-01_13-44-29.jpg" className='w-60 h-40 rounded-md' alt="" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
