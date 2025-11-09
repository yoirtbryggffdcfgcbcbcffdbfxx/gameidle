# Fichier de Contexte Technique pour Gemini - Projet Quantum Core

Ce document est ma "mémoire" technique pour ce projet. Il détaille l'architecture interne, les décisions de conception, les patterns utilisés et les points clés pour me permettre de maintenir, déboguer et étendre l'application avec efficacité et précision.

## 1. Philosophie du Projet & Objectifs

-   **Objectif Principal :** Créer un jeu idle/clicker riche en fonctionnalités, "Quantum Core", en utilisant React, TypeScript et Tailwind CSS.
-   **Contrainte Clé (Zero-Build) :** L'application doit fonctionner sans aucune étape de build (pas de Webpack, Vite, etc.). Cela est accompli en utilisant un `importmap` dans `index.html` pour charger les dépendances React (version 19+) directement depuis un CDN.
-   **Architecture Orientée Hooks :** La logique est entièrement encapsulée dans des hooks React personnalisés. L'objectif est une séparation stricte et claire entre la logique (les "hooks") et la présentation (les "composants").

## 2. Architecture & Patterns de Conception

### 2.1. Le "Hook Façade Pattern" (`useGameEngine`)

Le pilier de l'architecture est le hook `useGameEngine.ts`. Il implémente un pattern "Façade" :

-   **Rôle d'Orchestrateur :** Il est le seul hook que l'interface (le composant `App.tsx`) consomme directement. Il initialise tous les autres hooks de plus bas niveau (`useGameState`, `useSettings`, `useSfx`, `useParticleSystem`, etc.).
-   **Point d'Entrée Unique :** Il agrège l'état, les valeurs dérivées et les fonctions de tous les autres hooks en un seul objet structuré. Cela simplifie grandement le passage de props et la compréhension du flux de données.
-   **Gestion des Effets Croisés :** C'est l'endroit où sont gérés les effets qui combinent plusieurs domaines. Par exemple, `handleBuyUpgrade` dans ce hook appelle `gameState.buyUpgrade` (logique métier), `playSfx` (audio), et `addParticle` (effets visuels). Il gère également le système de notifications interne.

### 2.2. Gestion de l'État (`useGameState`)

-   **Rôle de "Source de Vérité" :** `useGameState.ts` gère l'état fondamental et persistant du jeu (énergie, améliorations, ascension, état du Cœur Quantique, etc.).
-   **Persistance :** Il gère la sérialisation (sauvegarde) et la désérialisation (chargement) de l'état du jeu vers/depuis `localStorage`.
-   **Pattern `useRef` pour État Asynchrone :** Pour éviter les problèmes de "stale closure" dans les `useCallback` (comme `buyUpgrade`), une référence (`energyRef`) est maintenue en parallèle de l'état `energy`. L'état est utilisé pour les rendus React, tandis que la référence est utilisée dans les callbacks pour garantir l'accès à la dernière valeur sans avoir à redéfinir la fonction à chaque changement d'énergie.
-   **Calculs Mémorisés :** Les valeurs dérivées coûteuses (`productionTotal`, `ascensionBonuses`, `canAscend`, etc.) sont calculées avec `useMemo` pour optimiser les performances.

### 2.3. Flux de Données (Unidirectionnel)

Le flux de données est strict :
1.  **Interaction Utilisateur** ->
2.  **Composant UI** appelle une fonction (`onBuyUpgrade`) ->
3.  **Gestionnaire d'Événement** (`handleBuyUpgrade` dans `useGameEngine`) est exécuté ->
4.  **Mutation de l'État** (`buyUpgrade` dans `useGameState`) est appelée ->
5.  **Rendu React :** Le changement d'état déclenche un nouveau rendu ->
6.  **Mise à Jour de l'UI.**

## 3. Analyse des Systèmes Clés

### 3.1. Machine d'État de l'Application (`App.tsx`)

L'application suit un cycle de vie simple géré par l'état `appState` dans `useSettings` :
1.  **`loading`**: État initial, affiche `LoadingScreen`. `useGameEngine` charge les données.
2.  **`cinematic`**: Une fois le chargement terminé (pour une nouvelle partie), affiche `IntroCinematic`.
3.  **`menu`**: Après la cinématique ou au démarrage si une sauvegarde existe. Affiche `MainMenu`.
4.  **`game`**: L'état de jeu principal, affiche `GameUI`.

### 3.2. Architecture Responsive (`GameUI.tsx`)

C'est un point central de l'UI. Le composant détecte la taille de l'écran et maintient un état `isMobile`.
-   **Sur Desktop (`isMobile: false`)**: Affiche une `NavBar` latérale et un layout en deux colonnes (`ControlPanel` et `UpgradeList`).
-   **Sur Mobile (`isMobile: true`)**: Affiche une `MobileNav` en bas de l'écran. Le contenu principal alterne entre `ControlPanel` et `UpgradeList` via un système d'onglets (`activeMobileTab`). Un menu hamburger ouvre le `MobileMenuPopup` pour l'accès aux autres écrans (Succès, Paramètres, etc.).

### 3.3. Système de Tutoriel Dynamique (`TutorialOverlay.tsx`)

-   **Logique de Progression :** La progression des étapes du tutoriel est gérée dans `useGameEngine` et `GameUI.tsx` via des `useEffect` qui observent l'état du jeu (ex: `energy >= 10`). Ceci permet de déclencher la prochaine étape de manière contextuelle.
-   **Positionnement :** Le composant `TutorialOverlay` utilise `useLayoutEffect` et `element.getBoundingClientRect()` pour se positionner dynamiquement par rapport aux éléments du DOM à mettre en évidence.
-   **Découpage de l'Overlay :** Un `clip-path` CSS est utilisé pour créer un "trou" dans l'overlay semi-transparent, attirant l'attention de l'utilisateur sur l'élément d'interface pertinent.

### 3.4. Système de Notifications (`useGameEngine.ts` & `Notification.tsx`)

-   **Gestion d'État :** `useGameEngine` gère un tableau de notifications dans son état. La fonction `addNotification` y ajoute une nouvelle notification avec un ID unique.
-   **Affichage :** Le composant `NotificationCenter` itère sur ce tableau et affiche un `NotificationToast` pour chaque notification.
-   **Auto-destruction :** Chaque `NotificationToast` gère son propre cycle de vie. Il utilise un `setTimeout` interne pour se retirer du DOM après son animation de sortie en appelant la fonction `removeNotification` passée en prop. Le timer peut être mis en pause au survol de la souris pour une meilleure UX.

## 4. Guide pour les Modifications Futures

-   **Ajouter une nouvelle Popup (ex: "Statistiques") :**
    1.  `components/popups/` : Créer `StatsPopup.tsx`.
    2.  `hooks/usePopupManager.ts` : Si un état spécifique est nécessaire, l'ajouter ici.
    3.  `components/GameUI.tsx` :
        -   Ajouter la logique de rendu conditionnel : `{activePopup === 'stats' && <StatsPopup ... />}`.
    4.  `components/NavBar.tsx` (Desktop) :
        -   Ajouter un `NavButton` qui appelle `onMenuClick('stats')`.
    5.  `components/MobileNav.tsx` & `MobileMenuPopup.tsx` (Mobile) :
        -   Ajouter un `MenuButton` dans le `MobileMenuPopup` qui appelle `onMenuClick('stats')`.

-   **Ajouter une nouvelle variable à sauvegarder :**
    1.  `types.ts` : Ajouter la propriété à l'interface `GameState`.
    2.  `hooks/useGameState.ts` :
        -   Ajouter un `useState` pour la nouvelle variable.
        -   Incluez-la dans l'objet `gameState` de la fonction `saveGameState`.
        -   Gérez son chargement (avec une valeur par défaut) dans le `useEffect` initial de chargement.
