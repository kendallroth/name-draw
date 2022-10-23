export const randomNumber = (min: number, max: number, inclusive = false): number => {
  const inclusiveModifier = inclusive ? 1 : 0;
  return Math.floor(Math.random() * (max - min + inclusiveModifier) + min);
};
