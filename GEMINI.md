# Fichier de Contexte Technique pour Gemini - Projet Quantum Core

Ce document est ma "mémoire" pour ce projet. Il détaille l'architecture interne, les décisions de conception et les points clés pour me permettre de reprendre le développement rapidement et avec précision.

## 1. Objectif du Projet

Créer un jeu de type "idle/clicker" nommé "Quantum Core" en utilisant React, TypeScript et Tailwind CSS. L'application doit fonctionner sans étape de build (via `importmap` et CDN) et être entièrement contenue dans un ensemble de fichiers statiques.

## 2. Philosophie de l'Architecture

L'architecture repose sur une séparation stricte de la logique et de la présentation, en utilisant une composition de hooks React personnalisés.

-   **Logique Centralisée (`useGameEngine`) :** Un seul hook, `useGameEngine`, sert de "façade" pour toute la logique du jeu. Il compose tous les autres hooks et expose un objet unique contenant l'état, les valeurs calculées et les gestionnaires d'événements à l'interface utilisateur. L'UI n'interagit jamais directement avec les hooks de bas niveau.
-   **Hooks Spécialisés et Découplés :** Chaque hook a une responsabilité unique et bien définie (ex: `useGameState` pour les données du jeu, `useSfx` pour le son, `useParticleSystem` pour les effets visuels). Cela rend le code plus facile à maintenir et à déboguer.
-   **Flux de Données Unidirectionnel :** L'état est géré dans les hooks -> passé à `App.tsx` -> propagé aux composants enfants via les props. Les interactions de l'utilisateur déclenchent des fonctions (passées en props) qui mettent à jour l'état dans les hooks, ce qui provoque un nouveau rendu.
-   **État vs UI :** Les composants React sont majoritairement des composants de présentation "bêtes". Ils reçoivent des données et ne savent pas comment elles sont calculées ou modifiées.

## 3. Analyse des Hooks Principaux

Ceci est le cœur de la logique applicative.

### `hooks/useGameEngine.ts`
-   **Rôle :** **Orchestrateur / Cerveau**. C'est le point d'intégration de toute la logique.
-   **Fonctionnement :**
    1.  Initialise tous les autres hooks (`useGameState`, `useSettings`, `useSfx`, etc.).
    2.  Passe des dépendances entre les hooks si nécessaire (ex: `settings.visualEffects` est passé à `useParticleSystem`).
    3.  Contient les `useEffect` qui nécessitent des informations de plusieurs hooks, comme la **boucle de déblocage des succès** (qui a besoin de `totalUpgradesOwned`, `energy`, etc. de `useGameState`) et les **timers globaux** (sauvegarde, production de texte flottant).
    4.  Définit les **gestionnaires d'événements complexes** (`handleCollect`, `handleBuyUpgrade`) qui combinent plusieurs actions (jouer un son, créer une particule, modifier l'état du jeu).
    5.  Retourne un objet unique et structuré que `App.tsx` peut consommer.

### `hooks/useGameState.ts`
-   **Rôle :** **Gestionnaire d'État / Base de Données**. Il est responsable de l'état persistant du jeu.
-   **Fonctionnement :**
    -   Gère les états fondamentaux : `energy`, `upgrades`, `prestigeCount`, `achievements`, `purchasedPrestigeUpgrades`.
    -   Contient la logique de **chargement (`useEffect` initial)** et de **sauvegarde (`saveGameState`)** via `localStorage`.
    -   Expose les fonctions de mutation de l'état principal : `buyUpgrade`, `doPrestige`, `buyPrestigeUpgrade`, `resetGame`.
    -   Calcule les valeurs dérivées (`useMemo`) comme `productionTotal`, `canPrestige`, `prestigeGain`.
    -   **Point critique :** `energy` utilise `_setEnergy` et `energyRef` pour s'assurer que les callbacks comme `buyUpgrade` (qui sont mémorisés avec `useCallback`) aient toujours accès à la valeur la plus récente de l'énergie sans avoir besoin d'être redéclarés.

### `hooks/useSettings.ts`
-   **Rôle :** **Gestionnaire de Configuration et d'État de l'Application**.
-   **Fonctionnement :**
    -   Gère l'état `settings` (thème, volume, etc.).
    -   Gère l'état global de l'application : `appState` (`'loading'`, `'menu'`, `'game'`). C'est ce qui contrôle l'affichage de l'écran de chargement, du menu principal ou de l'interface de jeu.
    -   Applique le thème au `document.documentElement` via un `useEffect`.

### `hooks/useAchievementQueue.ts`
-   **Rôle :** **Contrôleur de File d'Attente pour les Notifications**.
-   **Fonctionnement :**
    -   Empêche l'affichage simultané de plusieurs toasts de succès.
    -   Maintient une `queue` (file d'attente) d'objets `Achievement`.
    -   Lorsqu'un succès est ajouté et qu'aucun n'est actuellement affiché, il le sort de la file, l'affiche (`setCurrentAchievementToast`), et lance un timer.
    -   À la fin du timer, il cache le toast (`setCurrentAchievementToast(null)`) et attend la fin de l'animation de sortie avant de déverrouiller la file pour le prochain succès.

## 4. Cheatsheet pour les Modifications Futures

-   **Pour modifier une valeur de jeu fondamentale (ex: coût de base d'une amélioration) :**
    -   Aller dans `constants.ts`. Modifier `INITIAL_UPGRADES`.

-   **Pour changer la formule de calcul du coût des améliorations :**
    -   Aller dans `utils/helpers.ts` et modifier la fonction `calculateCost`.

-   **Pour ajouter une nouvelle variable à sauvegarder :**
    1.  Ajouter la propriété à l'interface `GameState` dans `types.ts`.
    2.  Ajouter un `useState` pour cette variable dans `hooks/useGameState.ts`.
    3.  L'inclure dans l'objet `gameState` de la fonction `saveGameState` dans `useGameState.ts`.
    4.  Gérer son chargement dans le `useEffect` initial de `useGameState.ts`.

-   **Pour ajouter un nouveau type d'amélioration de prestige :**
    1.  `constants.ts` : Ajouter l'amélioration au tableau `PRESTIGE_UPGRADES`.
    2.  `types.ts` : Ajouter le nouveau type à `PrestigeUpgrade['effect']['type']`.
    3.  `hooks/useGameState.ts` : Dans le `useMemo` de `prestigeBonuses`, ajouter un `case` au `switch` pour gérer le nouvel effet.

-   **Pour déboguer un problème de rendu visuel :**
    -   Inspecter les composants dans `components/`.
    -   Si le problème est lié à une animation ou un effet (particules, texte flottant), vérifier les hooks `useParticleSystem` ou `useFloatingText` et les composants `FlowingParticle.tsx` et `FloatingText.tsx`.
