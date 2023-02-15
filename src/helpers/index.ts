export const plural = (value: number, variants: string[]): string => {
  let n = Math.abs(value);
  n %= 100;
  if (n >= 5 && n <= 20)
  {
    return variants[2];
  }
  n %= 10;
  if (n === 1)
  {
    return variants[0];
  }
  if (n >= 2 && n <= 4)
  {
    return variants[1];
  }
  return variants[2];
};
