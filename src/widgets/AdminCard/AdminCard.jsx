import React from "react";
import "./AdminCard.scss";
import { useNavigate } from "react-router";

const AdminCard = () => {
  const cards = [
    { title: "Управление блогом", url: "blog" },
    { title: "Настройки тарифов", url: "tariff" },
    { title: "Управление пользователями", url: "users" },
  ];

  const navigate = useNavigate();
  const linkCard = (url) => navigate(url); 

  return (
    <section className="flex justify-evenly items-center mt-20 gap-5 p-5">
      {cards.map((item) => (
        <section
          key={item.url}
          className="AdminCard border-[3px] rounded-3xl border-[#22333B]  flex items-center justify-center"
        >
          <h4
            onClick={() => linkCard(item.url)}
            className="bg-[#8C6D51] h-36 text-[#E6E4D8] w-full flex items-center justify-center text-5xl font-medium text-center cursor-pointer"
          >
            {item.title}
          </h4>
        </section>
      ))}
    </section>
  );
};

export default AdminCard;
