import React from 'react'
import './Uptades.scss'
import InfoPage from '../../shared/UI/InfoPage/InfoPage'
import VideoSetting from '../../shared/UI/VideoSetting/VideoSetting'

const Updates = () => {
  const [listNavActive , setListNavActive] = React.useState(1); 

  const arrOfUpdates = [
    {
        title:'Вышло расширение Таймтрекинг',
        date : '28.01.2001',
        descr : 'Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы',
        image: 'image/HomePagePhoto.png',
    },
    {
        title:'Вышло расширение Таймтрекинг',
        date : '28.01.2001',
        descr : 'Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы',
        image: 'image/HomePagePhoto.png',
    },
    {
        title:'Вышло расширение Таймтрекинг',
        date : '28.01.2001',
        descr : 'Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы',
        image: 'image/HomePagePhoto.png',
    },
    {
        title:'Вышло расширение Таймтрекинг',
        date : '28.01.2001',
        descr : 'Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы',
        image: 'image/HomePagePhoto.png',
    },
  ]

  const newsSocial = [
    {
        group:'VK Channel',
        date :'2 hours ago',
        info: 'Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
        like : 23,
    },
     {
        group:'VK Channel',
        date :'2 hours ago',
        info: 'Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
        like : 23,
    },
     {
        group:'VK Channel',
        date :'2 hours ago',
        info: 'Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
        like : 23,
    },
  ]

  return (
   <section className='UpdatesPages flex flex-col items-center justify-center'>
    <InfoPage texth2={'Обновление'} texth3={'Следите за всеми изменениями и новыми возможностями TaskRiver'}/>
    <VideoSetting/>
    <section className='catalogUpdate flex flex-col justify-center items-center'>
        <h2 className=' text-5xl  '>Категории <span>обновлений</span></h2>
        <section className='listOfUpdates flex justify-center items-center flex-col'>
            <ul className='listsNavUpdates flex justify-center items-center gap-6 font-bold '>
                <li className={( listNavActive == 1 ? "activeListNav " : '') + "listNavUpdates text-2xl"} onClick={()=>setListNavActive(1)}>Все</li>
                <li className={( listNavActive == 2 ? "activeListNav " : '') + "listNavUpdates text-2xl"} onClick={()=>setListNavActive(2)}>Функции</li>
                <li className={( listNavActive == 3 ? "activeListNav " : '') + "listNavUpdates text-2xl"} onClick={()=>setListNavActive(3)}>Фиксы</li>
                <li className={( listNavActive == 4 ? "activeListNav " : '') + "listNavUpdates text-2xl"} onClick={()=>setListNavActive(4)}>Обновления интерфейса</li>
            </ul>
            {arrOfUpdates.map((updt,id) => (
                <article className='updatesPost flex justify-center items-center ' key={id}>
                    <section className='flex flex-col justify-center items-center h-full py-3 px-5'>
                        <h4 className='text-3xl font-bold'>{updt.title}</h4>
                        <span className='text-xs'>{updt.date}</span>
                        <p className='text-xl font-semibold'>{updt.descr}</p>
                        <button className='text-xl font-bold'>Подробнее</button>
                    </section>
                    <img src={updt.image} alt="Картинки поста"/>
                </article>
            ))}
        </section>
    </section>
    <article className=' newsSocial flex flex-col justify-center items-center gap-5'>
            <h3 className='text-3xl font-bold'>Последние новости</h3>
            <section className='flex justify-center items-center gap-10 my-5'>
                <section className='blokNews flex flex-col items-center'>
                    <h4 className='text-2xl font-bold'>VK Updates</h4>
                    <ul >
                        {newsSocial.map((news,id) => (
                            <li className="newsPost p-4" key={id}>
                                <div className='headNews flex items-center'>
                                    <img src="vite.svg" alt="" />
                                    <h5 className='text-xl font-bold flex flex-col ml-4'>{news.group}
                                        <span className='text-xs'>{news.date}</span>
                                    </h5>
                                </div>
                                <p className='my-5'>{news.info}</p>
                                <div className='likeNews'>
                                    <img src="" alt="" />
                                    <span>{news.like}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
                 <section className='blokNews'>
                    <h4>VK Updates</h4>
                    <ul>
                        {newsSocial.map((news,id) => (
                            <li className="newsPost" key={id}>
                                <h5>{news.group}</h5>
                                <span>{news.date}</span>
                                <p>{news.info}</p>
                                <div>
                                    <img src="" alt="" />
                                    <span>{news.like}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
                <section></section>
            </section>
    </article>
   </section>
  )
}

export default Updates
