export const parsePrice = (value: any): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
