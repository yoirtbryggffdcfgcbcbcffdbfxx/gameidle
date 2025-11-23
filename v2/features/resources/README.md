# Feature: Resources

## 📋 Responsabilité

Gère l'énergie du joueur (ressource principale) et le tracking de la progression totale.

## 🎯 Règles Métier

### Deux Compteurs Distincts

| Champ | Description | Comportement |
|-------|-------------|--------------|
| `energy` | Énergie actuelle disponible | Augmente (production, clics) et diminue (achats) |
| `totalGenerated` | Énergie totale générée depuis le début | **Augmente uniquement**, jamais de diminution |

**Pourquoi deux compteurs ?**
- `energy` : Pour les achats et l'économie du jeu
- `totalGenerated` : Pour le système d'unlock des upgrades

### Sources d'Énergie

1. **Production Passive** (`TICK`)
   - Ajoute `productionGenerated` toutes les 100ms
   - Calculé via `selectEffectiveProduction`

2. **Clic Manuel** (`CLICK_CORE`)
   - Ajoute `clickPower` à chaque clic
   - Calculé via `selectClickPower`

3. **Ajout Générique** (`RESOURCE_ADD`)
   - Utilisé pour les bonus, événements, etc.

### Dépenses d'Énergie

1. **Achat d'Upgrade** (`UPGRADE_BUY`)
   - Déduit le coût de `energy`
   - **Ne touche PAS à `totalGenerated`**

2. **Dépense Générique** (`RESOURCE_SPEND`)
   - Déduit de `energy`
   - Empêche `energy` de devenir négatif (`Math.max(0, ...)`)

## 📁 Architecture

```
resources/
├── model.ts       # ResourceState (energy, totalGenerated)
├── actions.ts     # RESOURCE_ADD, RESOURCE_SPEND
├── reducer.ts     # Logique de mutation (écoute aussi TICK, CLICK_CORE, UPGRADE_BUY)
└── __tests__/     # Tests unitaires
```

## 🔧 Utilisation

### Ajouter de l'Énergie

```typescript
import { useGameDispatch } from '../../../lib/context';
import { addEnergy } from '../actions';

const dispatch = useGameDispatch();
dispatch(addEnergy(100));
// energy += 100
// totalGenerated += 100
```

### Vérifier l'Énergie Disponible

```typescript
import { useGameSelector } from '../../../lib/context';

const energy = useGameSelector(state => state.resources.energy);
const canAfford = energy >= cost;
```

## ✅ Tests

Lancer les tests :
```bash
npm test resources
```

Couverture :
- ✅ RESOURCE_ADD (incrémente energy et totalGenerated)
- ✅ RESOURCE_SPEND (décrémente energy, pas totalGenerated)
- ✅ CLICK_CORE (cross-feature)
- ✅ TICK (cross-feature)
- ✅ UPGRADE_BUY (cross-feature)
- ✅ Immutabilité

## 🔗 Dépendances

### Cross-Feature (Actions Écoutées)
- **Clicker** : `CLICK_CORE` ajoute de l'énergie
- **Core** : `TICK` ajoute la production passive
- **Upgrades** : `UPGRADE_BUY` déduit le coût

### Utilisé par
- **Upgrades** : Vérifie `energy` pour savoir si un achat est possible
- **UI** : Affiche `energy` et `totalGenerated`
