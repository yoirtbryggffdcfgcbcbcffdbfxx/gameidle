
// Liste des suffixes standards jusqu'au Décillion (10^33)
const SUFFIXES = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export const formatNumber = (num: number, scientificNotation: boolean): string => {
  if (num === 0) return "0";
  if (num < 0) return "-" + formatNumber(-num, scientificNotation);
  if (!isFinite(num)) return "∞";

  // Si l'utilisateur force la notation scientifique dans les options
  if (scientificNotation) {
      if (num < 1000) return Math.floor(num).toString();
      return num.toExponential(2).replace('+', '');
  }

  // Affichage standard pour les petits nombres
  if (num < 1000) return Math.floor(num).toString();

  // On détermine la "puissance de 1000" (Tier 1 = k, Tier 2 = M, etc.)
  const tier = Math.floor(Math.log10(num) / 3);
  
  let suffix = "";
  
  if (tier < SUFFIXES.length) {
      // Utilisation des suffixes classiques définis
      suffix = SUFFIXES[tier];
  } else {
      // Génération infinie de suffixes alphabétiques (aa, ab, ac...) après "Dc"
      const offset = tier - SUFFIXES.length;
      
      // Calcul des lettres (Base 26)
      // On génère 2 lettres pour couvrir une plage immense (26^2 = 676 tiers supplémentaires)
      const firstChar = String.fromCharCode(97 + (Math.floor(offset / 26) % 26)); // a-z
      const secondChar = String.fromCharCode(97 + (offset % 26)); // a-z
      
      suffix = firstChar + secondChar;
  }

  // Calcul de la mantisse (la partie nombre avant le suffixe)
  const divisor = Math.pow(10, tier * 3);
  const mantissa = num / divisor;
  
  // Formatage : 2 décimales max, parseFloat supprime les zéros inutiles (ex: "1.50" devient 1.5)
  return parseFloat(mantissa.toFixed(2)) + suffix;
};

export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds <= 0 || !isFinite(totalSeconds)) {
        return '0s';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0) {
        result += `${minutes}m `;
    }
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        result += `${seconds}s`;
    }

    return result.trim();
};

export const formatLongDuration = (totalSeconds: number): string => {
    if (totalSeconds <= 0 || !isFinite(totalSeconds)) {
        return '0s';
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let result = '';
    if (days > 0) result += `${days}j `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === '') result += `${seconds}s`;

    return result.trim();
};
