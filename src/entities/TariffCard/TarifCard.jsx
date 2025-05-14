import React from 'react'
import './TariffCard.scss'

const TarifCard = ({statusTarif, textInfo, price}) => {
const [active,setActive] = React.useState('month')

  const getCardClass = () => {
    if (statusTarif === "Бесплатно") {
      return "TariffCardModuleFirst";
    } else if (statusTarif === "Старндарт") {
      return "TariffCardModuleTwo";
    } else if (statusTarif === "Премиум") {
      return "TariffCardModuleThree";
    }
    return "TariffCardModuleFirst"; 
  };

  return (
    <div className={`${getCardClass()} flex flex-col justify-between items-center`}>
      <div>
        <h3 className='mt-5'>{statusTarif}</h3>
        <p className='textCard'>{textInfo}</p>
      </div>
      {statusTarif !== "Бесплатно" && (
        <div className='bandCard flex justify-center gap-10 items-center'>
          <span 
            className={(active === "month" ? "activeTariff " : "") + "flex justify-center items-center"}
            onClick={() => setActive('month')}
          >месяц</span>
          <span 
            className={(active === "year" ? "activeTariff " : "") + "flex justify-center items-center"}
            onClick={() => setActive("year")}
          >год</span>
        </div>
      )}
      <p className='priceCard'>
        {price}₽
      </p>
      <button>Подключить</button>
      {statusTarif !== "Бесплатно" && (
        <p className="contact-us">Связаться с нами</p>
      )}
      <span className='aboutCard'>Посмотреть возможности</span>
    </div>
  )
}

export default TarifCard