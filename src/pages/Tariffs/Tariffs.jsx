import React from 'react'
import './Tariffs.scss'
import InfoPage from '../../shared/UI/InfoPage/InfoPage'
import TarifCard from '../../entities/TariffCard/TarifCard'
import TableTariff from '../../shared/UI/TableTariff/TableTariff'

const Tariffs = () => {
  return (
    <section className='TariffsPage flex flex-col justify-center items-center'>
        <section className='tariffcInfo flex flex-col justify-center items-center'>
            <InfoPage texth2={'Выберите тариф'} texth3={'который подходит по вашему стилю работы и масштабу команды'}/>
            <section className='tariffsInfoCards flex flex-col justify-center items-center'>
                <section className='tariffCards flex justify-center items-center gap-4 mt-10 mb-5 '>
                    <TarifCard price={0} priceDate={false} statusTarif={"Бесплатно"} textInfo={'Бесплатно навсегда для 10 пользователей'}/>
                    <TarifCard price={2000} priceDate={true} statusTarif={"Старндарт"} textInfo={'Все, что вам нужно, чтобы начать'}/>
                    <TarifCard price={5000} priceDate={true} statusTarif={"Премиум"} textInfo={'Объедините несколько команд'}/>
                </section>
                <button className='buttonTariff'>Пользовательские настройки</button>
            </section>
        </section>
        <section className='tariffsTable'>
            <h2>Сравни все за и против, и <span>подбери тариф</span></h2>
            <TableTariff/>
        </section>
        <section className='tariffsSetting'>
            <h2><span>Подбор</span> персональных настроек</h2>
            <form action=""></form>
        </section>
    </section>
  )
}

export default Tariffs
