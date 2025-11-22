import React from 'react'
import './SettingSafe.scss'

const SettingSafe = () => {
  return (
    <section className='px-5 py-7 w-full flex justify-center items-center flex-col relative'>
      <h3 className='text-[#000000] font-semibold text-2xl left-5 top-7 absolute'>Безопасность</h3>
      <section className='flex items-center gap-2 flex-col w-1/2 h-full px-5 py-7 mt-10'>
        <h4 className='text-[#000000] font-semibold text-2xl'>Изменить пароль</h4>
        <p className='font-light text-xs text-[#000000]'>При изменении пароля вы останетесь в системе на этом устройстве, но, возможно, выйдете из системы на других устройствах.</p>
        <form action="" className='mt-5 flex flex-col gap-2 w-full'>
          <label className='font-normal text-14px' htmlFor="">Текущий пароль</label>
          <input className='p-2 bg-[#E6E4D8]' type="password" placeholder='Введите текущий пароль' />
          <label className='font-normal text-14px' htmlFor="">Новый пароль</label>
          <input className='p-2 bg-[#E6E4D8]' type="password" placeholder='Введите новый пароль' />
          <button className='text-[#E6E4D8] font-medium text-xl bg-[#22333B] rounded-[8px] py-2 px-[10px]'>Сохранить изменения</button>
        </form>
      </section>
    </section>
  )
}

export default SettingSafe
