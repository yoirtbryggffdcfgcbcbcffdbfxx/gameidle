# Fichier de Contexte Technique pour Gemini - Projet Quantum Core

Ce document est ma "mémoire" technique pour ce projet. Il détaille l'architecture interne, les décisions de conception, les patterns utilisés et les points clés pour me permettre de maintenir, déboguer et étendre l'application avec efficacité et précision.

## 1. Philosophie du Projet & Objectifs

-   **Objectif Principal :** Créer un jeu idle/clicker riche en fonctionnalités, "Quantum Core", en utilisant React, TypeScript et Tailwind CSS.
-   **Contrainte Clé (Zero-Build) :** L'application doit fonctionner sans aucune étape de build (pas de Webpack, Vite, etc.). Cela est accompli en utilisant un `importmap` dans `index.html` pour charger les dépendances React directement depuis un CDN. Cette approche favorise la simplicité, le prototypage rapide et l'accessibilité.
-   **Architecture Orientée Hooks :** La logique est entièrement encapsulée dans des hooks React personnalisés. L'objectif est une séparation stricte et claire entre la logique (les "hooks") et la présentation (les "composants"), rendant le code plus modulaire, testable et facile à raisonner.

## 2. Architecture & Patterns de Conception

### 2.1. Le "Hook Façade Pattern" (`useGameEngine`)

Le piler de l'architecture est le hook `useGameEngine.ts`. Il implémente un pattern "Façade" :

-   **Rôle d'Orchestrateur :** Il est le seul hook que l'interface (le composant `App.tsx`) consomme directement. Il initialise tous les autres hooks de plus bas niveau ( `useGameState`, `useSettings`, `useSfx`, etc.).
-   **Point d'Entrée Unique :** Il agrège l'état, les valeurs dérivées et les fonctions de tous les autres hooks en un seul objet structuré. Cela simplifie grandement le passage de props et la compréhension du flux de données.
-   **Gestion des Effets Croisés :** C'est l'endroit idéal pour les `useEffect` qui dépendent de plusieurs domaines logiques. Par exemple, la boucle de vérification des succès a besoin de données de `useGameState` (énergie, production) et de fonctions de `useNotifier` pour afficher les notifications.

### 2.2. Gestion de l'État (`useGameState`)

-   **Rôle de "Source de Vérité" :** `useGameState.ts` gère l'état fondamental et persistant du jeu (énergie, améliorations, ascension, etc.). C'est le cœur de la logique métier.
-   **Persistance :** Il gère la sérialisation (sauvegarde) et la désérialisation (chargement) de l'état du jeu vers/depuis `localStorage`.
-   **Pattern `useRef` pour État Asynchrone :** Pour éviter les problèmes de "stale closure" dans les `useCallback` (comme `buyUpgrade`), une référence (`energyRef`) est maintenue en parallèle de l'état `energy`. L'état est utilisé pour les rendus React, tandis que la référence est utilisée dans les callbacks pour garantir l'accès à la dernière valeur sans avoir à redéfinir la fonction à chaque changement d'énergie.
-   **Calculs Mémorisés :** Les valeurs dérivées coûteuses (`productionTotal`, `ascensionBonuses`, etc.) sont calculées avec `useMemo` pour optimiser les performances et n'être recalculées que lorsque leurs dépendances changent.

### 2.3. Flux de Données (Unidirectionnel)

Le flux de données est strict et facile à suivre :

1.  **Interaction Utilisateur** (ex: clic sur "Acheter") ->
2.  **Composant UI** (`UpgradeItem.tsx`) appelle une fonction passée en prop (`onBuyUpgrade`) ->
3.  **Gestionnaire d'Événement** (`handleBuyUpgrade` dans `useGameEngine.ts`) est exécuté. Il peut combiner plusieurs actions (jouer un son, créer des particules) ->
4.  **Mutation de l'État** (`buyUpgrade` dans `useGameState.ts`) est appelée, modifiant l'état (énergie, `upgrades`) ->
5.  **Rendu React :** Le changement d'état déclenche un nouveau rendu des composants qui dépendent de ces données ->
6.  **Mise à Jour de l'UI :** L'interface reflète le nouvel état du jeu.

## 3. Analyse des Systèmes Clés

### 3.1. Calculs & Équilibrage

-   Toutes les valeurs d'équilibrage "magiques" sont centralisées dans `constants.ts` (coûts de base, multiplicateurs, taux).
-   La formule de coût des améliorations (`utils/helpers.ts`) est un point central de l'équilibrage du jeu. L'ajustement de son exposant (ex: de `1.15` à `1.10`) a un impact global sur le rythme de progression.

### 3.2. Systèmes de Progression Parallèles

Le jeu possède deux boucles de prestige distinctes pour augmenter la profondeur stratégique :

-   **Ascension :** Focalisée sur les bonus globaux. La monnaie (`Points d'Ascension`) s'obtient en atteignant le cap d'énergie.
-   **Réacteur du Cœur :** Focalisé sur l'amélioration d'une mécanique de jeu active (le boost). La monnaie (`Fragments Quantiques`) s'obtient en même temps que les points d'ascension, liant les deux systèmes.

### 3.3. Systèmes d'Effets Visuels (UI)

-   **`useParticleSystem` & `useFloatingText` :** Ces hooks gèrent des tableaux d'objets représentant les effets actifs.
-   **Nettoyage Automatique :** Chaque composant d'effet (`FlowingParticle`, `FloatingText`) est responsable de son propre cycle de vie. Il reçoit une fonction `onComplete` en prop et l'appelle à la fin de son animation. Cette fonction, définie dans `useGameEngine`, retire l'effet du tableau d'état, ce qui le retire du DOM et prévient les fuites de mémoire.

## 4. Guide pour les Modifications Futures

-   **Ajouter une nouvelle Amélioration du Cœur :**
    1.  `types.ts` : Si nécessaire, ajoutez un nouveau type d'effet à `CoreUpgrade['effect']['type']`.
    2.  `constants.ts` : Ajoutez un nouvel objet au tableau `CORE_UPGRADES`.
    3.  `hooks/useGameState.ts` : Dans le `useMemo` de `coreBonuses`, ajoutez un `case` au `switch` pour appliquer le nouvel effet.

-   **Ajouter une nouvelle variable à sauvegarder :**
    1.  `types.ts` : Ajoutez la propriété à l'interface `GameState`.
    2.  `hooks/useGameState.ts` :
        -   Ajoutez un `useState` pour la nouvelle variable.
        -   Incluez-la dans l'objet `gameState` de la fonction `saveGameState`.
        -   Gérez son chargement (avec une valeur par défaut) dans le `useEffect` initial de chargement.

-   **Modifier une formule de jeu (ex: gains d'ascension) :**
    -   Localisez le `useMemo` correspondant dans `hooks/useGameState.ts` (ex: `ascensionGain`).
    -   Ajustez la formule de calcul. La mémorisation garantira que la valeur est mise à jour automatiquement lorsque ses dépendances changent.

## 5. Optimisations de Performance

-   **`React.memo` :** Utilisé sur des composants fréquemment rendus avec des props potentiellement identiques, comme `UpgradeItem`, pour éviter des rendus inutiles lorsque la liste est longue.
-   **`useCallback` :** Utilisé pour toutes les fonctions passées en props aux composants enfants. Cela est crucial pour que `React.memo` fonctionne correctement.
-   **`useMemo` :** Utilisé pour les calculs dérivés complexes afin d'éviter de les ré-exécuter à chaque rendu.
-   **Gestion des Timers :** Tous les `setInterval` et `setTimeout` sont créés dans des `useEffect` et systématiquement nettoyés dans la fonction de retour pour éviter les fuites de mémoire et les effets de bord inattendus.
-   **Système de Particules :** Le nombre de particules générées par interaction est volontairement limité pour ne pas surcharger le DOM et le moteur de rendu du navigateur.
