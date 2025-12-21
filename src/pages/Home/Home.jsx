import React from "react";
import { Helmet } from "react-helmet-async";
import "./Home.scss";
import VideoSetting from "@shared/UI/VideoSetting/VideoSetting";
import SliderHome from "@widgets/SliderHome/SliderHome.jsx";
import TextAuthHome from "@/entities/TextAuthHome/TextAuthHome";

const Home = () => {
  return (
    <section className="HomePage flex flex-col justify-center items-center w-full">
      <Helmet>
        <title>TaskRiver — управление задачами и проектами</title>
        <meta
          name="description"
          content="TaskRiver помогает командам планировать проекты, управлять задачами и визуализировать работу с помощью удобных досок и современного интерфейса."
        />
      </Helmet>

      <section
        className="
          authHome
          flex justify-between items-center gap-5
          h-[685px] mt-[30px] mb-[90px]
          sm:w-full sm:px-10 sm:h-[300px]
          md:w-full md:px-5 md:h-[500px]
          lg:h-[685px] lg:w-[1140px] 
          xl:w-[1140px] xl:h-[685px]
        "
      >
        <TextAuthHome />
        <SliderHome />
      </section>
      <VideoSetting />
      <section
        className="aboutHome
          flex flex-col justify-between items-center
          w-[1140px] h-[525px] my-[90px]
          md:w-full md:h-full md:px-5 md:my-10 gap-5 lg:w-[1140px] xl:w-[1140px]"
      >
        <h2 className="text-5xl">Немного о нас</h2>

        <div className="infoAboutHome flex justify-between items-center w-full gap-5">
          <p className="text-2xl font-bold w-[625px] h-[252px]">
            TaskRiver — это удобный сервис для управления задачами и проектами.
            Он помогает визуализировать работу с помощью досок, колонок и
            карточек, следить за прогрессом и не теряться в потоке дел. Мы
            делаем интерфейс понятным, добавляем скелетоны, адаптивную верстку и
            аккуратные детали, чтобы с продуктом было комфортно работать и в
            команде, и в одиночку.
          </p>
          <img
            src="image/HomeBlock.png"
            alt="Иллюстрация TaskRiver"
            className="md:w-[300px] lg:w-[350px] xl:w-[400px]"
          />
        </div>
      </section>
    </section>
  );
};

export default Home;
