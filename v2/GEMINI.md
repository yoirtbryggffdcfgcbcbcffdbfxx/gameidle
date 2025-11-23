# Protocole 20/20 - Architecture V2

Ce document définit les standards **non-négociables** pour tout code ajouté dans le dossier `v2/`. L'objectif est de maintenir une note de maintenabilité et de performance de 20/20.

## 1. Typage de Fer (The Iron Typing Rule)
*   **Interdiction formelle du type `any`.**
*   Toutes les actions Redux doivent faire partie de l'union discriminée `GameAction` dans `v2/lib/types.ts`.
*   Chaque reducer doit utiliser cette union pour garantir l'exhaustivité.

```typescript
// ✅ Correct
export type GameAction = 
  | { type: 'TICK'; payload: { delta: number } }
  | { type: 'BUY_ITEM'; payload: { id: string } };

// ❌ Incorrect
export type GameAction = any;
```

## 2. Performance Chirurgicale (Render Optimization)
Le jeu tourne sur une boucle ("Tick") fréquente. Chaque milliseconde compte.
*   **Composants Feuilles :** Tout composant de présentation (UI) **DOIT** être exporté avec `React.memo`.
*   **Sélecteurs Atomiques :** Les composants ne doivent s'abonner qu'à la stricte partie du state dont ils ont besoin via `useGameSelector`.
*   **Calculs :** Tous les calculs dérivés (prix, totaux) doivent se faire dans `v2/lib/selectors.ts` ou être mémoïsés.

## 3. Architecture Atomique (Atomic Design)
*   **Structure :** Une feature = Un dossier.
*   **Isolation :** Une feature ne doit pas importer directement le code interne d'une autre feature.
*   **Fichiers requis par feature :**
    *   `model.ts` : Types et État initial.
    *   `actions.ts` : Créateurs d'actions.
    *   `reducer.ts` : Logique pure.
    *   `components/` : UI.

## 4. Zéro Prop-Drilling (Context Architecture)
*   **Le "God Component" est interdit.** `RefactorGame.tsx` ne doit pas passer de props `energy` ou `onBuy` à travers 3 couches de composants.
*   **Autonomie :** Les composants doivent utiliser les hooks `useGameSelector` et `useGameDispatch` pour accéder aux données et modifier l'état.
*   **Conséquence :** Le fichier principal reste propre et ne sert que de squelette de mise en page (Layout).

```tsx
// ✅ Correct (Le composant va chercher sa donnée)
const EnergyDisplay = () => {
  const energy = useGameSelector(state => state.resources.energy);
  return <div>{energy}</div>
}

// ❌ Incorrect (Le parent doit tout gérer)
const EnergyDisplay = ({ energy }) => <div>{energy}</div>
```

## 5. Stratégie de Styling Hybride (Tailwind + Vanilla CSS)
Le projet utilise une approche **hybride** pour le styling. Chaque technologie a son rôle précis :

### Tailwind CSS → Structure & Layout
*   **Positionnement :** `flex`, `grid`, `absolute`, `relative`, etc.
*   **Espacement :** `p-4`, `m-2`, `gap-3`, `space-x-2`, etc.
*   **Responsive :** `md:flex-row`, `lg:grid-cols-3`, etc.
*   **Disposition :** Organisation visuelle des composants

### Vanilla CSS → Esthétique & Identité Visuelle
*   **Couleurs personnalisées** et palettes du thème
*   **Gradients complexes** (`linear-gradient`, `radial-gradient`)
*   **Animations et transitions** personnalisées
*   **Effets visuels** (glassmorphism, shadows, glow, etc.)
*   **Thème global** et variables CSS

```tsx
// ✅ Correct (Hybride)
<button className="flex items-center gap-2 p-4" style={{ /* CSS custom */ }}>
  {/* Tailwind pour layout, CSS pour couleurs/effets */}
</button>

// ❌ Incorrect (Tout en Tailwind sans esthétique custom)
<button className="flex items-center gap-2 p-4 bg-blue-500">
  {/* Manque l'identité visuelle du projet */}
</button>
```

**Règle d'or :** Tailwind organise, Vanilla CSS embellit.

## 6. Conventions de Nommage (Naming Consistency)
Des noms cohérents facilitent la navigation et la compréhension du code par les développeurs et les IA.

### Actions (SCREAMING_SNAKE_CASE)
*   **Format :** `VERB_NOUN` en majuscules avec underscores
*   **Verbes courants :** `ADD`, `REMOVE`, `SET`, `UPDATE`, `BUY`, `UNLOCK`, `TRIGGER`

```typescript
// ✅ Correct
export type UpgradeAction =
    | { type: 'UPGRADE_BUY'; payload: { id: string } }
    | { type: 'UPGRADE_UNLOCK'; payload: { id: string } }
    | { type: 'RESOURCE_ADD'; payload: { amount: number } };

// ❌ Incorrect
export type UpgradeAction =
    | { type: 'buyUpgrade'; payload: { id: string } }  // camelCase
    | { type: 'unlock'; payload: { id: string } }      // Manque le nom
    | { type: 'ADD_RESOURCE'; payload: { amount: number } }; // Ordre inversé
```

### Créateurs d'Actions (camelCase)
*   **Format :** Verbe à l'infinitif + nom (ex: `buyUpgrade`, `addEnergy`)
*   **Cohérence :** Le nom doit refléter le type d'action

```typescript
// ✅ Correct
export const buyUpgrade = (id: string) => ({ type: 'UPGRADE_BUY', payload: { id } });
export const addEnergy = (amount: number) => ({ type: 'RESOURCE_ADD', payload: { amount } });

// ❌ Incorrect
export const upgrade = (id: string) => ({ type: 'UPGRADE_BUY', payload: { id } }); // Trop vague
export const BuyUpgrade = (id: string) => ({ type: 'UPGRADE_BUY', payload: { id } }); // PascalCase
```

### Selectors (camelCase avec préfixe `select`)
*   **Format :** `select` + nom descriptif (ex: `selectUpgradeCost`, `selectClickPower`)
*   **Retour booléen :** Préfixe `is` ou `has` (ex: `selectIsUpgradeAffordable`)

```typescript
// ✅ Correct
export const selectUpgradeCost = (baseCost: number, owned: number) => { /* ... */ };
export const selectClickPower = (state: RootState) => { /* ... */ };
export const selectIsUpgradeAffordable = (state: RootState, id: string) => { /* ... */ };

// ❌ Incorrect
export const upgradeCost = (baseCost: number, owned: number) => { /* ... */ }; // Manque 'select'
export const getClickPower = (state: RootState) => { /* ... */ }; // Utiliser 'select' pas 'get'
export const affordableUpgrade = (state: RootState, id: string) => { /* ... */ }; // Pas clair
```

### Composants React (PascalCase)
*   **Format :** Nom descriptif en PascalCase (ex: `EnergyDisplay`, `UpgradeCard`)
*   **Éviter :** Noms trop génériques (`Button`, `Container`) sans contexte

```tsx
// ✅ Correct
export const EnergyDisplay = React.memo(() => { /* ... */ });
export const UpgradeCard = React.memo(() => { /* ... */ });
export const CoreButton = React.memo(() => { /* ... */ });

// ❌ Incorrect
export const energy = React.memo(() => { /* ... */ }); // camelCase
export const ENERGY_DISPLAY = React.memo(() => { /* ... */ }); // SCREAMING_SNAKE_CASE
export const Display = React.memo(() => { /* ... */ }); // Trop vague
```

### Types et Interfaces (PascalCase)
*   **Interfaces d'état :** Suffixe `State` (ex: `ResourceState`, `UpgradesState`)
*   **Types d'actions :** Suffixe `Action` (ex: `ResourceAction`, `UIAction`)
*   **Types de données :** Nom descriptif (ex: `Upgrade`, `FloatingTextData`)

```typescript
// ✅ Correct
export interface ResourceState { /* ... */ }
export type UpgradeAction = /* ... */;
export interface Upgrade { /* ... */ }

// ❌ Incorrect
export interface resources { /* ... */ }; // camelCase
export type upgradeActions { /* ... */ }; // camelCase + pluriel incorrect
export interface IUpgrade { /* ... */ }; // Préfixe 'I' déconseillé en TypeScript
```

**Règle d'or :** La cohérence prime sur la préférence personnelle.