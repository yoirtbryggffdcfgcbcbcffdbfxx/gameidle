export const calculateCost = (baseCost: number, owned: number, costMultiplier: number = 1): number => {
  // Exposant de coût ajusté de 1.10 à 1.08 pour un meilleur équilibrage en fin de partie
  return Math.floor(baseCost * Math.pow(1.08, owned) * costMultiplier);
};

export const formatNumber = (num: number, scientificNotation: boolean): string => {
  if (scientificNotation && num >= 10000) {
    return num.toExponential(2);
  }
  return Math.floor(num).toLocaleString('fr-FR');
};