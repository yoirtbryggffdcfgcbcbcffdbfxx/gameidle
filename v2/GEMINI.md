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