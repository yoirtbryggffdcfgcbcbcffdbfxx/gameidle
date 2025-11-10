# Guide de l'IA & Architecture Interne - Projet Quantum Core

Ce document est ma "mémoire" technique et mon manuel d'ingénierie pour ce projet. Il détaille l'architecture, les patterns de conception et les guides de modification pour me permettre de maintenir, déboguer et étendre l'application avec une efficacité et une précision maximales.

## 1. Philosophie & Contraintes Clés

-   **🚫 Zéro-Build :** L'application doit fonctionner sans étape de build, en utilisant un `importmap` pour charger React 19+ depuis un CDN.
-   **🏗️ Architecture Orientée Hooks :** Séparation stricte entre la logique (les `hooks/`) et la présentation (les `components/`). Les composants doivent être aussi "bêtes" que possible et se contenter d'afficher des données et de remonter des événements.
-   **➡️ Flux de Données Unidirectionnel :** Le cycle de vie d'une interaction est toujours : `Interaction UI` -> `Appel d'un Handler` -> `Action qui modifie l'état` -> `Recalcul des états dérivés` -> `Nouveau rendu de l'UI`.

## 2. Architecture & Patterns de Conception

### 2.1. L'Orchestrateur Central : `useGameEngine.ts`

C'est le pilier de l'architecture. Il agit comme une **façade** qui masque la complexité interne.

-   **Point d'Entrée Unique :** C'est le seul hook consommé directement par l'UI de haut niveau (`App.tsx`). Il initialise et coordonne tous les autres hooks.
-   **Agrégateur :** Il rassemble l'état, les valeurs calculées (`computedState`), les gestionnaires d'événements (`handlers`), et les systèmes d'UI (`particles`, `notifications`) en un seul objet structuré, qui est ensuite fourni à l'application via un `GameContext`.
-   **Gestionnaire d'Effets Croisés :** C'est ici que les interactions qui traversent plusieurs domaines sont gérées. Par exemple, l'achat d'une amélioration (`onBuyUpgrade`) déclenche une action métier, un effet sonore (`playSfx`), un effet visuel (`addParticle`), et une vérification de succès.

### 2.2. La Gestion de l'État : Le Duo `useGameState` & les Hooks de `state`

La logique de l'état est intentionnellement divisée pour une meilleure organisation.

#### `hooks/useGameState.ts`
-   **Source de Vérité :** Gère l'objet `GameState` principal. C'est le seul endroit où `useState<GameState>` est appelé.
-   **Persistance :** Gère la sauvegarde et le chargement du jeu depuis `localStorage`.
-   **Agrégateur de Logique d'État :** Il n'implémente pas lui-même la logique complexe, mais il **délègue** cette responsabilité à des sous-hooks spécialisés.

#### `hooks/state/*.ts` (ex: `usePlayerState`, `usePrestigeState`, `useBankState`)
-   **Responsabilité Unique :** Chaque hook est responsable d'un domaine métier spécifique.
    -   `usePlayerState` : Clics, achats d'améliorations de base.
    -   `usePrestigeState` : Ascension, Cœur Quantique, bonus globaux.
    -   `useBankState` : Banque, épargne, prêts.
-   **Fonctions Pures :** Ils exposent des fonctions `getComputed(gameState)` qui prennent l'état actuel et retournent des valeurs dérivées (ex: `productionTotal`, `canAscend`). Ces calculs sont purs et centralisés, ce qui facilite grandement le débogage.
-   **Actions :** Ils exposent des `actions` qui contiennent la logique de mutation de l'état (ex: `buyUpgrade`, `doAscension`).

### 2.3. La Couche d'Action : Les `hooks/handlers/*.ts`

Ces hooks forment une couche d'abstraction entre l'UI et la logique d'état.

-   **Traducteurs d'Intention :** Ils prennent les événements bruts de l'UI (ex: un clic de souris) et les traduisent en appels d'actions métier, tout en y ajoutant les effets secondaires (sons, particules, notifications).
-   **Découplage :** Ils permettent aux composants de rester simples. Un bouton n'a pas besoin de savoir comment jouer un son ou créer une particule ; il appelle simplement `handlers.onBuyUpgrade()`.
-   **Exemple :** `usePlayerHandlers.ts` expose `onBuyUpgrade`. Cette fonction appelle `actions.buyUpgrade` (de `usePlayerState`), puis `playSfx('buy')`, `addParticle(...)`, etc.

### 2.4. Le Flux de Données Complet

```
[Component.tsx]
      ↓ (clic)
[usePlayerHandlers.ts] -> onBuyUpgrade()
      ├─ playSfx(), addParticle() ... (effets secondaires)
      ↓
[useGameState.ts] -> actions.buyUpgrade()
      ↓
[usePlayerState.ts] -> logique de buyUpgrade()
      ↓
setGameState(newState)
      ↓
[React Rerender]
      ↓
[useGameState.ts] -> Les hooks de `state` recalculent les valeurs `computed` avec le nouvel état.
      ↓
[useGameEngine.ts] -> Assemble le nouvel objet de contexte.
      ↓
[Component.tsx] -> Reçoit les nouvelles props et affiche l'état à jour.
```

## 3. Cookbook pour les Modifications Futures

### Tâche : Ajouter une nouvelle statistique (ex: "Chance de Critique")

1.  **`types.ts`** : Ajouter `criticalChance: number` à l'interface `GameState`.
2.  **`utils/helpers.ts`** : Mettre à jour `getInitialState` pour initialiser `criticalChance: 0`.
3.  **`hooks/state/usePrestigeState.ts`** : Mettre à jour `getComputed` pour que les bonus d'ascension/succès affectent la chance de critique.
4.  **`data/ascension.ts`** : Créer des améliorations qui augmentent cette statistique.
5.  **`hooks/handlers/usePlayerHandlers.ts`** : Dans `onCollect`, ajouter la logique pour gérer un coup critique en se basant sur la valeur de `computedState.criticalChance`.
6.  **`components/CoreSection.tsx`** : Ajouter un `StatDisplay` pour la nouvelle statistique.

### Tâche : Ajouter une nouvelle action utilisateur (ex: "Recycler une amélioration")

1.  **`hooks/state/usePlayerState.ts`** : Ajouter une nouvelle fonction `recycleUpgrade` dans les `actions` qui contient la logique pure de modification de `GameState`.
2.  **`hooks/handlers/usePlayerHandlers.ts`** : Créer un nouveau handler `onRecycleUpgrade` qui appelle `actions.recycleUpgrade` et ajoute les effets secondaires (son, notification).
3.  **`components/UpgradeItem.tsx`** : Ajouter un bouton "Recycler" qui appelle `handlers.onRecycleUpgrade`.

### Tâche : Déboguer un problème de calcul (ex: la production n'est pas correcte)

1.  **Point de départ UNIQUE : `hooks/state/usePrestigeState.ts`**.
2.  Inspecter la fonction `getComputed` et la manière dont `productionTotal` est calculé.
3.  Vérifier chaque source de données : `gameState.upgrades`, `gameState.purchasedAscensionUpgrades`, `gameState.achievements`, bonus du Cœur, etc.
4.  La centralisation de tous les calculs dans les hooks `state` rend le débogage prédictible et confiné à un seul endroit.
