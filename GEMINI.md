# Guide de l'IA & Architecture Interne - Projet Quantum Core

Ce document est ma "mémoire" technique et mon manuel d'ingénierie pour ce projet. Il détaille l'architecture, les patterns de conception et les guides de modification pour me permettre de maintenir, déboguer et étendre l'application avec une efficacité et une précision maximales.

## 1. Philosophie & Contraintes Clés

-   **Zéro-Build :** L'application doit fonctionner sans étape de build, en utilisant un `importmap` pour charger React 19+ depuis un CDN.
-   **Architecture Orientée Hooks :** Séparation stricte entre la logique (les `hooks/`) et la présentation (les `components/`). Les composants doivent être aussi "bêtes" que possible.
-   **Flux de Données Unidirectionnel :** `Interaction UI -> Appel de Handler -> Mutation de l'État -> Nouveau Rendu`.

## 2. Architecture & Patterns de Conception

### 2.1. Le "Hook Façade Pattern" (`useGameEngine.ts`)

C'est le pilier de l'architecture. Il agit comme une **façade** :

-   **Orchestrateur Central :** C'est le seul hook consommé directement par l'UI (`App.tsx`). Il initialise et coordonne tous les autres hooks de plus bas niveau.
-   **Point d'Entrée Unique :** Il agrège l'état et les fonctions de `useGameState`, `useSettings`, `useSfx`, etc., en un seul objet structuré.
-   **Gestionnaire d'Effets Croisés :** C'est ici que les interactions qui traversent plusieurs domaines sont gérées. Par exemple, `handleBuyUpgrade` dans `useGameEngine` appelle `gameState.buyUpgrade` (logique métier), `playSfx` (audio), et `addParticle` (effets visuels).

### 2.2. Gestion de l'État (`useGameState.ts`)

-   **Source de Vérité :** Gère l'état fondamental et persistant du jeu (énergie, améliorations, ascension, etc.).
-   **Persistance :** Gère la sauvegarde et le chargement du jeu depuis `localStorage`.
-   **Calculs Mémorisés (`useMemo`) :** Toutes les valeurs dérivées coûteuses (`productionTotal`, `ascensionBonuses`, `canAscend`) sont calculées avec `useMemo` pour optimiser les performances et ne se recalculer qu'en cas de nécessité.

### 2.3. Hiérarchie des Composants & Flux de Props

1.  **`App.tsx`** : Consomme `useGameEngine`. Gère la machine d'état de l'application (`loading`, `cinematic`, `menu`, `game`).
2.  **`GameUI.tsx`** : Reçoit l'intégralité de l'objet de `useGameEngine` et le déstructure pour le distribuer à ses enfants. C'est le hub principal de l'UI en jeu.
3.  **Composants de Section (`CoreSection`, `ForgeSection`, etc.)** : Reçoivent les sous-ensembles de props pertinents de `GameUI`.
4.  **Composants d'UI (`UpgradeItem`, `SkillTree`, etc.)** : Reçoivent uniquement les données et les callbacks dont ils ont besoin.

## 3. Cookbook pour les Modifications Futures

Ceci est un guide pratique pour les modifications courantes afin d'assurer la cohérence architecturale.

### Tâche : Ajouter une nouvelle statistique permanente (ex: "Chance de Critique sur Clic")

1.  **`types.ts`** : Ajouter `criticalClickChance: number` à l'interface `GameState`.
2.  **`hooks/useGameState.ts`** :
    -   Dans `getInitialState`, ajouter `criticalClickChance: 0`.
    -   S'assurer qu'elle est sauvegardée et chargée correctement dans les `useEffect` de persistance.
    -   Dans `ascensionBonuses` ou `achievementBonuses` (`useMemo`), ajouter la logique pour que les améliorations/succès modifient cette nouvelle statistique.
    -   Dans `doAscension`, décider si cette statistique doit être réinitialisée ou conservée.
3.  **`constants.ts`** : Ajouter de nouvelles `AscensionUpgrade` ou `CoreUpgrade` dont l'effet est de modifier `criticalClickChance`.
4.  **`hooks/useGameEngine.ts`** :
    -   Dans `handleCollect`, implémenter la logique du critique en utilisant la nouvelle statistique de `gameState`.
5.  **`components/GameUI.tsx`** (ou un sous-composant) : Afficher la nouvelle statistique pour que le joueur puisse la voir.

### Tâche : Ajouter une nouvelle section à l'UI (ex: "Laboratoire")

1.  **Créer le composant** : `components/LabSection.tsx`. Il doit accepter les props nécessaires depuis `GameUI`.
2.  **`components/GameUI.tsx`** :
    -   Dans le `useMemo` pour `sections`, ajouter `{ id: 'lab', name: 'Laboratoire' }`.
    -   Dans le `main` du JSX, ajouter `<LabSection {...props} />` à l'intérieur d'une `<section id="lab" ...>`.
3.  C'est tout. Le `ScrollspyNav` se mettra à jour automatiquement.

### Tâche : Déboguer un problème d'état (ex: la production n'est pas correcte)

1.  **Point de départ : `hooks/useGameState.ts`**.
2.  Inspecter le `useMemo` de `productionTotal`.
3.  Vérifier chaque dépendance de ce `useMemo` :
    -   `gameState.upgrades` : Les `owned` et `production` sont-ils corrects ?
    -   `ascensionBonuses` : La valeur de `productionMultiplier` est-elle correcte ? Vérifier les `AscensionUpgrade` achetées.
    -   `achievementBonuses` : La valeur de `production` est-elle correcte ? Vérifier les succès débloqués.
    -   `gameState.isCoreDischarging` et `coreBonuses` : Le boost du cœur est-il appliqué au bon moment ?
4.  Tracer le flux de la prop `productionTotal` depuis `useGameEngine` -> `GameUI` -> `StatDisplay` pour s'assurer qu'elle n'est pas modifiée en cours de route.

## 4. Équilibrage du Jeu

Les principales sources pour l'équilibrage du jeu sont centralisées dans :
-   **`constants.ts`** : Coûts de base, production, effets des améliorations d'ascension/cœur. La constante `TICK_RATE` influence la vitesse de jeu.
-   **`data/achievements.ts`** : Valeurs des bonus de succès.
-   **`utils/helpers.ts`** : La fonction `calculateCost` contient la formule de croissance des coûts des améliorations (ex: `Math.pow(1.08, owned)`). C'est un levier très puissant pour l'équilibrage.
