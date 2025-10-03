import React from "react";
import "./Templates.scss";

const Templates = () => {
  const listTemplates = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <section className="Templates py-10 px-14">
      <ul>
        {listTemplates.map((index) => (
          <li className="templatesCard w-80 h-60" key={index}>
            <img
              className="w-80 h-48 rounded-2xl"
              src="/image/TestImage.png"
              alt="Template Image"
            />
            <div className="aboutTemplates">
              <div className="titleTemplates">
                <p className="font-medium">Гибкий Канбан-шаблон</p>
                <p className="text-xs font-light">
                  от Productivity Labs • Бесплатно
                </p>
              </div>
              <div className="ratingTemplates h-full justify-center gap-2 items-center">
                <div className="flex  items-center  cursor-pointer gap-1">
                  <img
                    className="w-3 h-2"
                    src="/image/LikeIcon.png"
                    alt="Лайки"
                  />
                  <span className="text-xs font-light">8,5 тыс.</span>
                </div>
                <div className="flex  items-center  cursor-pointer gap-1">
                  <img
                    className="w-3 h-2"
                    src="/image/UserIcon.png"
                    alt="Пользователи"
                  />
                  <span className="text-xs font-light">1, 42 тыс.</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Templates;
