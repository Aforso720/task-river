import React from 'react'
import './SliderHome.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderHome = () => {
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
        <SwiperSlide>
            {/* <img src="/image/chrome_HJ4cvL0Cnw.png" className='object-cover h-full' alt="" /> */}
        </SwiperSlide>
        <SwiperSlide>
            2
        </SwiperSlide>
        <SwiperSlide>
            3
        </SwiperSlide>
        <SwiperSlide>
            4
        </SwiperSlide>
    </Swiper>
  )
}

export default SliderHome
