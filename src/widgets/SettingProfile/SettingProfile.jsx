import React from 'react'
import './SettingProfile.scss'

const SettingProfile = () => {
  const formElem = [
    {
      id:0,
      title:'Полное ФИО',
      name:'Махтамерзаев Мансур Султанович',
    },
    {
      id:1,
      title:'Публичное имя',
      name:'Гроза UI/UX',
    },
    {
      id:2,
      title:'Должность',
      name:'Веб-дизайнер',
    },
    {
      id:3,
      title:'Отдел',
      name:'Импульс',
    },
    {
      id:4,
      title:'Организация',
      name:'Грозненский Государственный нефтяной-технический университет им. академика М.Д. Миллионщикова',
    },
    {
      id:5,
      title:'Расположение',
      name:'Чеченская республика, г. Грозный, ул. Исаева, 100',
    },
  ]
  return (
    <section className='SettingProfile p-5'>
      <h4 className='text-2xl font-semibold text-[#22333B]'>Профиль</h4>
      <div className='flex gap-10 flex-col items-center '>
        <section>
          <h5 className='HeadArticle'>Фото профиля</h5>
          <article className='h-52'>
            <img className='photoProf' src="/image/LogoIcon.svg" alt="Фото из профиля" />
            <div className='topBlock'></div>
            <div className='bottomBlock'>
              <p>Кто может видеть фото профиля?</p>
            </div>
          </article>
        </section>

        <section>
          <h5 className='HeadArticle'>Информация профиля</h5>
          <article className='h-[444px]'>
            {formElem.map((elem)=>{
             <>
              <label htmlFor={elem.id}>formElem</label>
              <input type="text" id={elem.id} placeholder={elem.name}/>
            </>
            })}
          </article>
        </section>

        <section>
          <h5 className='HeadArticle'>Контактные данные</h5>
          <article></article>
        </section>
        
      </div>
    </section>
  )
}

export default SettingProfile
