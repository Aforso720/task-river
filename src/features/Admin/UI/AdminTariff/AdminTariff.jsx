import React from "react";
import "./AdminTariff.scss";
import { useTariffs } from "../../api/useTariffs";
import { useAdminTariffModal } from "../../store/useAdminTariffModal";
import AdminTariffModal from "../AdminTariffModal/AdminTariffModal";

const AdminTariff = () => {
  const { tariffs, loading, getTariffs, deleteTariff } = useTariffs();
  const { openModal, modalState } = useAdminTariffModal();

  React.useEffect(() => {
    getTariffs();
  }, [getTariffs]);

  if (modalState) {
    return <AdminTariffModal />;
  }

  return (
    <section className="AdminTariff mt-10 gap-5">
      <ul className="flex justify-center items-center gap-5">
        {loading
          ? null
          : tariffs.map((item) => (
              <li
                key={item.id}
                className="w-72 h-80 rounded-[30px] font-semibold p-5 flex flex-col items-center justify-center"
              >
                <div className="flex flex-col justify-center items-center">
                  <p className="text-4xl text-[#8C6D51]">{item.name}</p>
                </div>

                <span className="my-10 max-w-64 font-light text-5xl text-[#8C6D51]">
                  {item.price}₽
                </span>

                <div className="flex gap-5">
                  <button
                    onClick={() =>
                      openModal("Редактирование тарифа", { editingTariff: item })
                    }
                    className="text-[#E6E4D8] rounded-[20px] bg-[#8C6D51] text-2xl px-4 py-1 text-center"
                  >
                    Редактировать
                  </button>

                  <button
                    className="bg-[#FFD8D8] h-11 w-11 flex items-center justify-center rounded-[7px] border-[1px] border-[#FF4A4A]"
                    onClick={() => deleteTariff(item.id)}
                    title="Удалить тариф"
                  >
                    <img src="/image/Corzina.svg" alt="Корзина" />
                  </button>
                </div>
              </li>
            ))}
      </ul>

      {tariffs.length >= 3 ? null : (
        <article className="w-72 h-80 rounded-[30px] flex items-center justify-center">
          <button
            onClick={() => openModal("Добавить тариф")}
            className="text-3xl font-semibold text-[#E6E4D8] bg-[#8C6D51CC] h-20 w-40 rounded-[20px] flex items-center justify-center"
          >
            Добавить тариф
          </button>
        </article>
      )}
    </section>
  );
};

export default AdminTariff;
