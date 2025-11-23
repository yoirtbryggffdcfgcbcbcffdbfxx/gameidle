# Feature: Core

## 📋 Responsabilité

Gère le système de charge/activation du core quantique qui boost la production.

## 🎯 Règles Métier

### États du Core

| Statut | Description | Condition |
|--------|-------------|-----------|
| `CHARGING` | En charge | `charge < 100` |
| `READY` | Prêt à activer | `charge === 100` |
| `ACTIVE` | Activé (boost actif) | Après activation manuelle |

### Système de Charge

- **Vitesse** : `2.5%` par seconde (configuré dans `CORE_CONFIG.CHARGE_RATE_PER_SEC`)
- **Temps de charge complet** : 40 secondes (100 / 2.5)
- **Automatique** : La charge se fait automatiquement via `TICK`

### Activation

Lorsque le joueur active le core (`status = ACTIVE`) :
1. **Boost de production** : Production multipliée par **x5** (`CORE_CONFIG.MULTIPLIER_ACTIVE`)
2. **Durée** : 10 secondes (`CORE_CONFIG.DISCHARGE_DURATION_MS`)
3. **Décharge** : Après 10 secondes, retour à `CHARGING` avec `charge = 0`

### Configuration

```typescript
export const CORE_CONFIG = {
  CHARGE_RATE_PER_SEC: 2.5,        // % par seconde
  DISCHARGE_DURATION_MS: 10000,    // 10 secondes
  MULTIPLIER_ACTIVE: 5,            // x5 production
};
```

## 📁 Architecture

```
core/
├── model.ts          # CoreState, CoreStatus, CORE_CONFIG
├── actions.ts        # CORE_ACTIVATE, tickCore
├── reducer.ts        # Logique de charge/décharge
├── selectors.ts      # selectCoreMultiplier, selectIsReady, selectCountdown
├── __tests__/        # Tests unitaires
└── components/       # UI du core
```

## 🔧 Utilisation

### Vérifier si le Core est Prêt

```typescript
import { useGameSelector } from '../../../lib/context';
import { selectIsReady } from '../selectors';

const isReady = useGameSelector(selectIsReady);
// true si charge = 100%
```

### Activer le Core

```typescript
import { useGameDispatch } from '../../../lib/context';
import { activateCore } from '../actions';

const dispatch = useGameDispatch();
const isReady = useGameSelector(selectIsReady);

if (isReady) {
  dispatch(activateCore());
}
```

### Afficher le Multiplicateur

```typescript
import { selectCoreMultiplier } from '../selectors';

const multiplier = useGameSelector(selectCoreMultiplier);
// 5 si core actif, 1 sinon
```

### Afficher le Countdown

```typescript
import { selectCountdown } from '../selectors';

const countdown = useGameSelector(selectCountdown);
// Temps restant en secondes (0 si pas actif)
```

### Calculer la Production avec Boost

```typescript
import { selectEffectiveProduction } from '../../../lib/selectors';

const production = selectEffectiveProduction(state);
// Inclut automatiquement le boost x5 si core actif
```

## ✅ Tests

Lancer les tests :
```bash
npm test core
```

**Résultats :**
- ✅ 21 tests passent
- ✅ Couverture : reducer (11 tests), selectors (10 tests)

**Tests du Reducer :**
- Charge automatique (TICK)
- Passage à READY à 100%
- Décharge pendant activation
- Retour à CHARGING après 10 secondes
- Activation manuelle (CORE_ACTIVATE)
- Immutabilité

**Tests des Selectors :**
- `selectCoreMultiplier` (1 ou 5)
- `selectIsReady` (true/false)
- `selectCountdown` (secondes restantes)

## 🔗 Dépendances

### Utilisé par
- **Lib Selectors** : `selectGlobalMultiplier` applique le boost x5 si `status === 'ACTIVE'`
- **UI** : Affiche la charge et permet l'activation
