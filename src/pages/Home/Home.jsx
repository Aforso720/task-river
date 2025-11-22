import React from "react";
import { Helmet } from "react-helmet-async";
import "./Home.scss";
import VideoSetting from "@shared/UI/VideoSetting/VideoSetting";
import SliderHome from "@widgets/SliderHome/SliderHome.jsx";
import TextAuthHome from "@/entities/TextAuthHome/TextAuthHome";

const Home = () => {
  return (
    <section className="HomePage flex flex-col justify-center items-center">
      <Helmet>
        <title>TaskRiver — управление задачами и проектами</title>
        <meta
          name="description"
          content="TaskRiver помогает командам планировать проекты, управлять задачами и визуализировать работу с помощью удобных досок и современного интерфейса."
        />
      </Helmet>

      <section className="authHome flex justify-between items-center gap-5">
        <TextAuthHome />
        <SliderHome />
      </section>
      <VideoSetting />
      <section className="aboutHome flex flex-col justify-between items-center">
        <h2 className="text-5xl">Немного о нас</h2>
        <div className="infoAboutHome flex justify-between items-center">
          <p className="text-2xl font-bold ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <img src="image/HomeBlock.png" alt="" />
        </div>
      </section>
    </section>
  );
};

export default Home;
