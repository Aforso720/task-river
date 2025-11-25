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
      <h4 className='text-2xl font-semibold text-[#22333B] dark:text-[#E6E4D8]'>Профиль</h4>
      <div className='flex gap-10 flex-col items-center'>
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
        <section className=''>
          <h5 className='HeadArticle'>Информация профиля</h5>
          <article className='h-[444px] flex flex-col justify-evenly'>
            {formElem.map((elem)=>(
             <div className='flex flex-col px-14' key={elem.id}>
              <label className='text-[#00000099] flex' htmlFor={elem.id}>{elem.title}
                <img src="/image/PenSettingsvg.svg" className='ml-2 cursor-pointer' alt="Карандаш" />
              </label>
              <input className='' type="text" id={elem.id} placeholder={elem.name}/>
            </div>
            ))}
          </article>
        </section>

        <section>
          <h5 className='HeadArticle'>Контактные данные</h5>
          <article className='h-24 flex items-center'>
            <div className='flex flex-col px-14 '>
              <label className='text-[#00000099] flex' htmlFor='contact'>
                Адрес электронной почты
                <img src="/image/PenSettingsvg.svg" className='ml-2 cursor-pointer' alt="Карандаш" />
              </label>
              <input className='' type="text" id='contact' placeholder='imp.dev@inbox.ru'/>
            </div>
          </article>
        </section>
        
      </div>
    </section>
  )
}

export default SettingProfile
