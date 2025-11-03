import React from "react";
import "./AdminTariff.scss";
import { useTariffs } from "../../api/useTariffs";

const AdminTariff = () => {
  const { tariffs , loading , getTariffs } = useTariffs();
  
  React.useEffect(() => {
    getTariffs();
  }, []);

  if (false){
    return (
      <section className="flex justify-center  w-[80%]">
        <header className="flex justify-between items-center w-full">
          <img src="/image/ArrowBack.svg" className="cursor-pointer" alt="Назад" />    
          <h2 className="text-[#8C6D51] font-semibold text-4xl">Бесплатный</h2>
          <div className="flex gap-3 h-10">
            <button className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-xl px-2 py-1 text-center">
              Сохранить
            </button>
            <button className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-xl px-2 py-1 text-center">
              Создать копию
            </button>
            <button className="bg-[#FFD8D8] h-10 w-10 flex items-center justify-center rounded-[7px] border-[1px] border-[#FF4A4A]">
              <img src="/image/Corzina.svg" alt="Корзина" />
            </button>
          </div>
        </header>
      </section>
    );
  }

  return(
    <section className="AdminTariff mt-10 gap-5">
      <ul className="flex gap-5">
        {/* {!loading
          ? null
          : tariffs.map((item) => (
              <li className="w-72 h-80 rounded-[30px]">
                <div>
                  <p></p>
                  <span></span>
                </div>
                <span></span>
                <div>
                  <button></button>
                  <button></button>
                </div>
              </li>
            ))} */}
        <li className="w-72 h-80 rounded-[30px] font-semibold p-5 flex flex-col items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <p className="text-4xl text-[#8C6D51]">Бесплатный</p>
            <span className="text-xs">
              Бесплатно навсегда для 10 пользователей
            </span>
          </div>
          <span className="font-light text-[96px] text-[#8C6D51]">0₽</span>
          <div className="flex gap-5">
            <button className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-2xl px-4 py-1 text-center">
              Редактировать
            </button>
            <button className="bg-[#FFD8D8] h-11 w-11 flex items-center justify-center rounded-[7px] border-[1px] border-[#FF4A4A]">
              <img src="/image/Corzina.svg" alt="Корзина" />
            </button>
          </div>
        </li>
      </ul>
      <article className="w-72 h-80 rounded-[30px] flex items-center justify-center">
        <button className="text-3xl font-semibold text-[#E6E4D8] bg-[#8C6D51CC] h-20 w-40 rounded-[20px] flex items-center justify-center">
          Добавить тариф
        </button>
      </article>
    </section>
  );
};

export default AdminTariff;
