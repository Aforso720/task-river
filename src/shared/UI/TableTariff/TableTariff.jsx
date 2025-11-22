// src/shared/UI/TableTariff/TableTariff.jsx
import React from 'react';
import './TableTariff.scss';
import useTariffHighlight from '@/pages/Tariffs/store/useTariffHighlight';

const fmtNum = (v) => (v === 0 || v ? String(v) : '—');
const fmtPrice = (v) =>
  v === 0 || v ? `${Number(v).toLocaleString('ru-RU')} ₽` : '—';

const mapPlanNameToUi = (name) => {
  if (!name) return '';
  const lower = String(name).toLowerCase();
  if (lower === 'default') return 'Базовый';
  if (lower === 'standard' || lower === 'стандарт') return 'Стандарт';
  if (lower === 'premium' || lower === 'премиум') return 'Премиум';
  return name;
};

const TableTariff = ({ plans = [] }) => {
  const highlightedTariffId = useTariffHighlight((s) => s.highlightedTariffId);
  const toggleHighlightedTariff = useTariffHighlight((s) => s.toggleHighlightedTariff);

  const rows = [
    {
      key: 'price',
      label: 'Цена',
      get: (p) => fmtPrice(p.price),
    },
    {
      key: 'boardLimit',
      label: 'Лимит досок',
      get: (p) => fmtNum(p.boardLimit),
    },
    {
      key: 'projectLimit',
      label: 'Лимит проектов',
      get: (p) => fmtNum(p.projectLimit),
    },
    {
      key: 'projectBoardLimit',
      label: 'Лимит досок в проекте',
      get: (p) => fmtNum(p.projectBoardLimit),
    },
    {
      key: 'userLimit',
      label: 'Лимит пользователей',
      get: (p) => fmtNum(p.userLimit),
    },
    {
      key: 'storageLimitMb',
      label: 'Хранилище (MB)',
      get: (p) => fmtNum(p.storageLimitMb),
    },
    {
      key: 'role_READER',
      label: 'Лимит роли READER',
      get: (p) => fmtNum(p?.roleLimits?.READER),
    },
    {
      key: 'role_EDITOR',
      label: 'Лимит роли EDITOR',
      get: (p) => fmtNum(p?.roleLimits?.EDITOR),
    },
    {
      key: 'role_ADMIN',
      label: 'Лимит роли ADMIN',
      get: (p) => fmtNum(p?.roleLimits?.ADMIN),
    },
  ];

  return (
    <table className="tariff-table">
      <thead>
        <tr className="errr">
          <th></th>
          {plans.map((plan) => {
            const isActive = plan.id === highlightedTariffId;
            return (
              <th
                key={plan.id}
                className={
                  'font-semibold text-2xl' +
                  (isActive ? ' tariff-table__colHeader--highlight' : '')
                }
                onClick={() => toggleHighlightedTariff(plan.id)}
              >
                {mapPlanNameToUi(plan.name)}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.key} className={idx % 2 === 0 ? 'trt' : ''}>
            <td className="text-xl font-semibold">{row.label}</td>
            {plans.map((plan) => {
              const isActive = plan.id === highlightedTariffId;
              return (
                <td
                  className={
                    'text-xl' +
                    (isActive ? ' tariff-table__cell--highlight' : '')
                  }
                  key={`${plan.id}-${row.key}`}
                >
                  {row.get(plan)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>

      {/* <tfoot>
        <tr>
          <td className="rtr"></td>
          {plans.map((p) => {
            const isActive = p.id === highlightedTariffId;
            return (
              <td
                key={`${p.id}-upgrade`}
                className={
                  'rtr' +
                  (isActive ? ' tariff-table__cell--highlight' : '')
                }
              >
                <button onClick={() => toggleHighlightedTariff(p.id)}>
                  Улучшить
                </button>
              </td>
            );
          })}
        </tr>
      </tfoot> */}
    </table>
  );
};

export default TableTariff;
