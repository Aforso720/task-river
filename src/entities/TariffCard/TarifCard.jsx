// src/entities/TariffCard/TarifCard.jsx
import React from "react";
import "./TariffCard.scss";
import { formatPriceInt } from "@/shared/utils/formatPriceInt";

const TarifCard = ({
  id,
  statusTarif,
  textInfo,
  price,
  selected,
  onDetails,
  cardIndex,
}) => {
  const [active, setActive] = React.useState("month");

  const isFree = Number(price) === 0;

  const getCardClass = () => {
    if (cardIndex === 0) return "TariffCardModuleFirst";
    if (cardIndex === 1) return "TariffCardModuleTwo";
    if (cardIndex === 2) return "TariffCardModuleThree";
    return "TariffCardModuleFirst";
  };

  const handleDetailsClick = () => {
    if (onDetails) onDetails(id);
  };

 

  return (
    <div
      className={`${getCardClass()} flex flex-col justify-between items-center`}
      style={
        selected
          ? {
              boxShadow: "0 0 0 2px #8C6D51",
              transform: "translateY(-2px)",
              transition: "box-shadow 0.15s ease, transform 0.15s ease",
            }
          : { transition: "box-shadow 0.15s ease, transform 0.15s ease" }
      }
    >
      <div>
        <h3 className="mt-5">{statusTarif}</h3>
        <p className="textCard">{textInfo}</p>
      </div>

      {!isFree && (
        <div className="bandCard flex justify-center gap-10 items-center">
          <span
            className={
              (active === "month" ? "activeTariff " : "") +
              "flex justify-center items-center"
            }
            onClick={() => setActive("month")}
          >
            месяц
          </span>
          <span
            className={
              (active === "year" ? "activeTariff " : "") +
              "flex justify-center items-center"
            }
            onClick={() => setActive("year")}
          >
            год
          </span>
        </div>
      )}

      <p className="priceCard">
        {formatPriceInt(active === "year" ? (price || 0) * 12 : price)}₽
      </p>

      <button>Подключить</button>

      {!isFree && <p className="contact-us">Связаться с нами</p>}

      <span className="aboutCard cursor-pointer" onClick={handleDetailsClick}>
        Подробнее
      </span>
    </div>
  );
};

export default TarifCard;
