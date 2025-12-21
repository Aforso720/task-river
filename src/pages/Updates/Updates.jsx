import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Uptades.scss";
import InfoPage from "../../shared/UI/InfoPage/InfoPage";
import VideoSetting from "../../shared/UI/VideoSetting/VideoSetting";
import { useSocial } from "@/features/Admin/api/useSocial";

const Updates = () => {
  const {getSocials , socials , error} = useSocial();
  const [expandedPostId, setExpandedPostId] = useState(null);

  React.useEffect(()=>{
    getSocials()
  },[])

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error("Ошибка при форматировании даты:", error);
      return dateString;
    }
  };

  const handleReadMoreClick = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const getShortDescription = (description) => {
    if (!description) return "";
    if (description.length <= 150) return description;
    return description.substring(0, 150) + "...";
  };

  return (
    <section className="UpdatesPages flex flex-col items-center justify-center">
      <Helmet>
        <title>Обновления TaskRiver — новые функции и новости</title>
        <meta
          name="description"
          content="Следите за обновлениями TaskRiver: новые функции, фиксы, изменения интерфейса и новости сервиса."
        />
      </Helmet>

      <InfoPage
        texth2={"Обновление"}
        texth3={"Следите за всеми изменениями и новыми возможностями TaskRiver"}
      />
      <VideoSetting />
      <section className="catalogUpdate flex flex-col justify-center items-center w-full">
        <h2 className="text-5xl mb-12">
          Категории <span>обновлений</span>
        </h2>
        <section className="listOfUpdates flex justify-center items-center flex-col w-full max-w-[1200px] mb-10">
          <div className="w-full space-y-8">
            {error ? 
              <h1 className="text-5xl text-[#22333B] font-semibold">Авторизируйтесь для просмотра новостей</h1>
            : (
              socials.map((updt) => (
                <article
                  className="relative bg-[#E6E4D8] rounded-[30px] shadow-lg shadow-black/25 p-8 font-['TT_Travels_Trl',sans-serif] transition-all duration-300 hover:shadow-xl hover:shadow-black/30 w-full"
                  key={updt.id}
                >
                  {/* Заголовок и дата */}
                  <div className="mb-6">
                    <h4 className="text-3xl text-[#22333B] font-bold mb-3 line-clamp-2 leading-tight">
                      {updt.title}
                    </h4>
                    <div className="h-px bg-[#8C6D51]/30 my-3"></div>
                    <span className="text-base text-[#8C6D51] font-medium tracking-wide">
                      Дата публикации: {formatDate(updt.createdAt)}
                    </span>
                  </div>

                  {/* Описание */}
                  <div className="mb-6">
                    <p className="text-lg text-[#22333B] leading-relaxed">
                      {expandedPostId === updt.id 
                        ? updt.description 
                        : getShortDescription(updt.description)}
                    </p>
                  </div>


                  {/* Кнопка подробнее */}
                  <div className="flex justify-start items-center">
                    <button
                      onClick={() => handleReadMoreClick(updt.id)}
                      className="text-xl font-bold bg-[#8C6D51] text-[#E6E4D8] rounded-[30px] px-8 py-3 hover:bg-[#7A5D44] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      {expandedPostId === updt.id ? "Свернуть" : "Подробнее"}
                    </button>
                  </div>

                  {/* Разделитель */}
                  <div className="h-px bg-[#8C6D51]/20 mt-8"></div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </section>
  );
};

export default Updates;