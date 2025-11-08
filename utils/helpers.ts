export const calculateCost = (baseCost: number, owned: number, costMultiplier: number = 1): number => {
  // Adjusted cost exponent from 1.15 to 1.10 for better late-game balancing
  return Math.floor(baseCost * Math.pow(1.10, owned) * costMultiplier);
};

export const formatNumber = (num: number, scientificNotation: boolean): string => {
  if (scientificNotation && num >= 10000) {
    return num.toExponential(2);
  }
  return Math.floor(num).toLocaleString('fr-FR');
};