import React from "react";
import "./AdminBlog.scss";

const AdminBlog = () => {
  const [listNavActive, setListNavActive] = React.useState(1);
  const arrOfUpdates = [
    {
      title: "Вышло расширение Таймтрекинг",
      date: "28.01.2001",
      descr:
        "Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы",
      image: "image/HomePagePhoto.png",
    },
    {
      title: "Вышло расширение Таймтрекинг",
      date: "28.01.2001",
      descr:
        "Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы",
      image: "image/HomePagePhoto.png",
    },
    {
      title: "Вышло расширение Таймтрекинг",
      date: "28.01.2001",
      descr:
        "Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы",
      image: "image/HomePagePhoto.png",
    },
    {
      title: "Вышло расширение Таймтрекинг",
      date: "28.01.2001",
      descr:
        "Новое расширение помогает узнать, сколько времени занимает работа над конкретной задачей и на что уходит время команжы",
      image: "image/HomePagePhoto.png",
    },
  ];

  return (
    <section className="AdminBlog flex justify-center items-center flex-col">
      <div className="">
        <ul className="listsNavUpdates flex justify-center items-center gap-6 font-bold ">
          <li
            className={
              (listNavActive == 1 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(1)}
          >
            Все
          </li>
          <li
            className={
              (listNavActive == 2 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(2)}
          >
            Функции
          </li>
          <li
            className={
              (listNavActive == 3 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(3)}
          >
            Фиксы
          </li>
          <li
            className={
              (listNavActive == 4 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(4)}
          >
            Обновления интерфейса
          </li>
        </ul>
        <button className="bg-[#8C6D51] font-bold text-2xl rounded-[30px] text-[#E6E4D8] px-[10px] py-[10px] ">
          Добавить пост
        </button>
      </div>
      {arrOfUpdates.map((updt, id) => (
        <article
          className="updatesPost flex justify-center items-center "
          key={id}
        >
          <section className="flex flex-col justify-center items-center h-full py-3 px-5">
            <h4 className="text-3xl font-bold">{updt.title}</h4>
            <span className="text-xs">{updt.date}</span>
            <p className="text-xl font-semibold">{updt.descr}</p>
            <button className="text-xl font-bold">Подробнее</button>
          </section>
          <img src={updt.image} alt="Картинки поста" />
        </article>
      ))}
    </section>
  );
};

export default AdminBlog;
