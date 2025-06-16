import React from 'react'
import './BlockNews.scss'

const BlockNews = ({newsSocial,extraClass}) => {
  return (
    <section className={`${extraClass ? 'bg-[#896A4F]' : 'bg-[#22333B]'}  ' blokNews flex flex-col items-center'`}>
                    <h4 className='text-2xl font-bold'>{extraClass ? 'Telegram Updates' : "VK Updates"}</h4>
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
                                    <img src="public\image\LikePost.png" alt="" />
                                    <span>{news.like}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
    </section>
  )
}

export default BlockNews
