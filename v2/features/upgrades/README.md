# Feature: Upgrades

## 📋 Responsabilité

Gère le système d'améliorations achetables du jeu (générateurs, clickers, boosters).

## 🎯 Règles Métier

### Coût Exponentiel
Le coût d'un upgrade augmente exponentiellement avec le nombre possédé :

```typescript
cost = baseCost * (1.15 ^ owned)
```

**Exemple :**
- Premier achat (owned=0) : `100 * (1.15^0) = 100`
- Cinquième achat (owned=4) : `100 * (1.15^4) = 175`
- Dixième achat (owned=9) : `100 * (1.15^9) = 356`

### Système de Tiers

Les tiers sont des paliers qui offrent des réductions :
- **Palier 10** : Premier tier
- **Palier 25** : Deuxième tier
- **Palier 100** : Troisième tier

Lorsqu'un tier est atteint :
1. Le `tier` est incrémenté
2. Un discount de **10%** est appliqué au prochain achat via `nextLevelCostOverride`
3. La production est multipliée par `3^tier`

**Exemple :**
```typescript
// Avant tier 1
baseProduction = 10
owned = 10
tier = 0
production = 10 * (3^0) * 10 = 100

// Après tier 1
tier = 1
production = 10 * (3^1) * 10 = 300  // x3 !
```

### Système d'Unlock

Un upgrade est visible si :
1. **Énergie totale** : `totalGenerated >= unlockCost`
2. **Parent requis** : Si `requiredUpgradeId` est défini, le parent doit être possédé (`owned > 0`)
3. **Déjà possédé** : Un upgrade possédé reste toujours visible

**Exemple :**
```typescript
// Gen1 : Visible dès le début
unlockCost = 0
requiredUpgradeId = undefined

// Gen2 : Visible si totalGenerated >= 1000 ET gen1.owned > 0
unlockCost = 1000
requiredUpgradeId = 'gen1'
```

### Types d'Upgrades

| Type | Description | Effet |
|------|-------------|-------|
| `PRODUCTION` | Générateurs passifs | Ajoute énergie/seconde |
| `CLICK` | Améliorations de clic | Augmente énergie par clic |
| `BOOSTER` | Multiplicateurs | Multiplie la production globale (%) |

## 📁 Architecture

```
upgrades/
├── model.ts          # Types et état initial
├── actions.ts        # UPGRADE_BUY, UPGRADE_BUY_TIER
├── reducer.ts        # Logique d'achat et de tier
├── selectors.ts      # Calculs de coût, production, visibilité
├── data.ts           # Données des upgrades (validées avec Zod)
├── components/       # UI (UpgradeCard, UpgradeList, etc.)
└── __tests__/        # Tests unitaires
```

## 🔧 Utilisation

### Acheter un Upgrade

```typescript
import { useGameDispatch } from '../../../lib/context';
import { buyUpgrade } from '../actions';
import { selectUpgradeCost } from '../selectors';

const dispatch = useGameDispatch();
const upgrade = /* ... */;
const cost = selectUpgradeCost(upgrade.baseCost, upgrade.owned, upgrade.nextLevelCostOverride);

dispatch(buyUpgrade(upgrade.id, cost));
```

### Calculer la Production

```typescript
import { selectBaseProduction } from '../selectors';

const production = selectBaseProduction(state);
// Retourne la production totale en énergie/seconde
```

### Filtrer les Upgrades Visibles

```typescript
import { selectVisibleUpgrades } from '../selectors';

const visibleUpgrades = selectVisibleUpgrades(state);
// Retourne uniquement les upgrades débloqués
```

## ✅ Tests

Lancer les tests :
```bash
npm test upgrades
```

Couverture :
- ✅ Selectors (coût, production, visibilité)
- ✅ Reducer (achat, tier, immutabilité)

## 🔗 Dépendances

### Cross-Feature
- **Resources** : Déduit l'énergie lors d'un achat (`UPGRADE_BUY`)
- **UI** : Filtre par catégorie (`activeCategory`)

### Utilisé par
- **Lib Selectors** : `selectEffectiveProduction` utilise `selectBaseProduction` et `selectBoosterBonus`
