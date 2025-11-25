// src/pages/Tariffs/Tariffs.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import "./Tariffs.scss";
import InfoPage from "../../shared/UI/InfoPage/InfoPage";
import TarifCard from "../../entities/TariffCard/TarifCard";
import TableTariff from "../../shared/UI/TableTariff/TableTariff";
import TariffSetting from "../../entities/TariffSetting/TariffSetting";
import { useTariffs } from "@/features/Admin/api/useTariffs";
import useTariffHighlight from "./store/useTariffHighlight";


const mapPlanNameToUi = (name) => {
  if (!name) return "";
  const lower = String(name).toLowerCase();
  if (lower === "default") return "Базовый";
  if (lower === "standard" || lower === "стандарт") return "Стандарт";
  if (lower === "premium" || lower === "премиум") return "Премиум";
  return name;
};    

const Tariffs = () => {
  const { tariffs, getTariffs } = useTariffs();
  const highlightedTariffId = useTariffHighlight((s) => s.highlightedTariffId);
  const toggleHighlightedTariff = useTariffHighlight(
    (s) => s.toggleHighlightedTariff
  );

  const tableRef = React.useRef(null);

  React.useEffect(() => {
    getTariffs();
  }, [getTariffs]);

  const plans = React.useMemo(
    () => (Array.isArray(tariffs) ? [...tariffs].reverse() : []),
    [tariffs]
  );

  const handleDetails = (id) => {
    if (!id) return;
    toggleHighlightedTariff(id);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="TariffsPage flex flex-col justify-center items-center">
      <Helmet>
        <title>Тарифы TaskRiver — планы и цены</title>
        <meta
          name="description"
          content="Сравните тарифы TaskRiver: лимиты проектов, досок, пользователей и хранилища. Подберите подходящий план под вашу команду."
        />
      </Helmet>

      <section className="tariffcInfo flex flex-col justify-center items-center">
        <InfoPage
          texth2={"Выберите тариф"}
          texth3={"который подходит по вашему стилю работы и масштабу команды"}
        />
        <section className="tariffsInfoCards flex flex-col justify-center items-center">
          <section className="tariffCards flex justify-center items-center gap-4 mt-10 mb-5 ">
            {plans.map((plan, index) => (
              <TarifCard
                cardIndex={index}
                key={plan.id}
                id={plan.id}
                statusTarif={mapPlanNameToUi(plan.name)}
                textInfo={
                  plan.userLimit
                    ? `До ${plan.userLimit} пользователей`
                    : "Гибкий тариф для вашей команды"
                }
                price={plan.price}
                selected={highlightedTariffId === plan.id}
                onDetails={handleDetails}
              />
            ))}
          </section>
          <button className="buttonTariff">Пользовательские настройки</button>
        </section>
      </section>

      <section className="tariffsTable" ref={tableRef}>
        <h2>
          Сравни все за и против, и <span>подбери тариф</span>
        </h2>
        <TableTariff plans={plans} />
      </section>

      <section className="tariffsSetting">
        <h2>
          <span>Подбор</span> персональных настроек
        </h2>
        <TariffSetting />
      </section>
    </section>
  );
};

export default Tariffs;
