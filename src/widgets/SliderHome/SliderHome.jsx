import React from 'react'
import './SliderHome.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderHome = () => {
 
  const array = [
    '/image/BannerFR.png',
    '/image/BannerTH.png',
    '/image/BannerTw.png',
  ]

  return (
    <Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={50}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    loop={true}
    className='slaiderHome'
  >
            {array.map((img)=>(
              <SwiperSlide key={img}>
                <img src={img} className='object-cover h-full' alt="Баннер" />
              </SwiperSlide>
            ))}
    </Swiper>
  )
}

export default SliderHome
