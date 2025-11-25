 export const formatPriceInt = (value) => {
    const num = Number(value || 0);
    const rounded = Math.floor(num);
    return rounded.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };