import React from "react";
import "./SliderAbout.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const SliderAbout = () => {
  return (
    <section className="sectionSlaiderAbout">
      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        loop={true}
        className="slaiderAbout"
      >
        <SwiperSlide><img src="image/HomePagePhoto.png" alt="Возможности TaskRiver" /></SwiperSlide>
        <SwiperSlide><img src="image/HomePagePhoto.png" alt="Возможности TaskRiver" /></SwiperSlide>
        <SwiperSlide><img src="image/HomePagePhoto.png" alt="Возможности TaskRiver" /></SwiperSlide>
        <SwiperSlide><img src="image/HomePagePhoto.png" alt="Возможности TaskRiver" /></SwiperSlide>
      </Swiper>
    </section>
  );
};

export default SliderAbout;
