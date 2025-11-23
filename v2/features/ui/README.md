# Feature: UI

## 📋 Responsabilité

Gère l'état de l'interface utilisateur, les animations et le responsive (mobile/desktop).

## 🎯 Composants de l'État

### Responsive (Mobile/Desktop)

```typescript
isMobile: boolean              // Détecté via useDeviceLayout
activeMobileTab: MobileTab     // 'REACTOR' | 'FORGE'
```

**Comportement :**
- **Desktop** : Affichage split-screen (Reactor + Forge côte à côte)
- **Mobile** : Affichage par onglets (un seul panneau visible à la fois)

### Filtrage des Upgrades

```typescript
activeCategory: UpgradeCategory  // 'ALL' | 'PRODUCTION' | 'CLICK' | 'BOOSTER'
```

Permet de filtrer les upgrades affichés dans la forge.

### Floating Texts

```typescript
floatingTexts: FloatingTextData[]
```

Textes animés qui apparaissent au-dessus du core lors des clics.

**Structure :**
```typescript
interface FloatingTextData {
  id: string;        // UUID
  x: number;         // Position X en pixels
  y: number;         // Position Y en pixels
  text: string;      // Texte à afficher (ex: '+150')
  color: string;     // Couleur hexadécimale
}
```

### Plasma Flash

```typescript
lastPlasmaFlash: number  // Timestamp du dernier flash
```

Utilisé pour throttler les animations de flash du core.

## 📁 Architecture

```
ui/
├── model.ts       # UIState, MobileTab, UpgradeCategory, FloatingTextData
├── actions.ts     # UI_ADD_FLOATING_TEXT, UI_SET_MOBILE_TAB, etc.
├── reducer.ts     # Logique de mutation
└── components/    # VisualEffectsLayer, MobileNavBar
```

## 🔧 Utilisation

### Ajouter un Floating Text

```typescript
import { useGameDispatch } from '../../../lib/context';
import { spawnFloatingText } from '../actions';

const dispatch = useGameDispatch();
dispatch(spawnFloatingText(x, y, '+150', '#00ff00'));
```

### Changer d'Onglet Mobile

```typescript
import { setMobileTab } from '../actions';

dispatch(setMobileTab('FORGE'));
```

### Filtrer par Catégorie

```typescript
import { setCategory } from '../actions';

dispatch(setCategory('PRODUCTION'));
```

## 🔗 Dépendances

### Utilisé par
- **Upgrades** : `selectVisibleUpgrades` filtre par `activeCategory`
- **Layout** : `RefactorGame` utilise `isMobile` et `activeMobileTab` pour le responsive
