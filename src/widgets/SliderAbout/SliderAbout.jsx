import React, { useState } from "react";
import "./SliderAbout.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderAbout = () => {
  const videos = [
    "/video/chrome_hxA6wGESEK.mp4",
    "/video/chrome_SOelhnTsQY.mp4"
  ];

  return (
    <section className="sectionSlaiderAbout">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="slaiderAbout"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            <video 
              src={video} 
              autoPlay 
              loop 
              muted
              playsInline
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
};

export default SliderAbout;