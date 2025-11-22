# Guide de l'IA & Architecture Interne - Projet Quantum Core

## Architecture V2 : Flux Modulaire (La "Voie de l'IA")

Pour la V2, nous abandonnons l'approche "Hooks Spaghetti" pour une architecture **Flux Modulaire stricte**.
Cette structure est conçue pour minimiser la charge cognitive de l'IA et maximiser la sécurité du typage.

### 1. Structure des Dossiers
Tout code V2 doit résider dans `v2/` et suivre ce schéma :

```text
v2/
├── lib/                  # Le moteur (agnostique du jeu)
│   ├── store.ts          # Le combineReducer et le Context
│   └── types.ts          # Types utilitaires
├── features/             # Les fonctionnalités métier
│   ├── resources/        # Ex: Gestion de l'énergie
│   │   ├── model.ts      # State Interface & Initial State
│   │   ├── actions.ts    # Action Types & Creators
│   │   ├── reducer.ts    # Pure Logic Function
│   │   └── components/   # UI Components
│   ├── clicker/          # Ex: Le bouton central
│   └── ...
└── RefactorGame.tsx      # Point d'entrée et assemblage
```

### 2. Règles d'Or (The Iron Rules)

1.  **Pureté des Reducers :** Un reducer ne doit JAMAIS avoir d'effets de bord (pas de `localStorage`, pas de `Date.now()`, pas de `Math.random()`). Ces valeurs doivent être passées via le `payload` de l'action.
2.  **Action Globales, Réaction Locales :** Une action `CLICK_CORE` peut être écoutée par plusieurs reducers.
    *   Le `resourcesReducer` écoute `CLICK_CORE` pour augmenter l'énergie.
    *   Le `statsReducer` écoute `CLICK_CORE` pour incrémenter le compteur de clics.
3.  **Typage Discriminant :** Toutes les actions doivent être des Unions Discriminées (`type Action = { type: 'A' } | { type: 'B' }`).

### 3. État Global
L'état global V2 ressemblera à ceci :
```typescript
interface RootState {
  resources: ResourceState;
  clicker: ClickerState;
  // ...
}
```
Ne jamais modifier l'état directement. Toujours `dispatch` une action.
