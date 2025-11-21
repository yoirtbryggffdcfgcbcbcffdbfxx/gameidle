# Guide de l'IA & Architecture Interne - Projet Quantum Core

Ce document est ma "mémoire" technique et mon manuel d'ingénierie pour ce projet. Il détaille l'architecture, les patterns de conception et les guides de modification pour me permettre de maintenir, déboguer et étendre l'application avec une efficacité et une précision maximales. Il est la **source de vérité** pour toute décision de développement.

## 1. Philosophie & Contraintes Clés

-   **🚫 Zéro-Build :** L'application doit fonctionner sans étape de build, en utilisant un `importmap` pour charger React 19+ depuis un CDN.
-   **🏗️ Architecture Orientée Hooks :** Séparation stricte entre la logique (les `hooks/`) et la présentation (les `components/`). Les composants doivent être aussi "bêtes" que possible : ils affichent des données et remontent des événements.
-   **➡️ Flux de Données Unidirectionnel :** Le cycle de vie d'une interaction est toujours prédictible et facile à suivre.

### 1.bis. Principes Directeurs d'UI/UX

-   **L'Immersion avant la superposition :** Préférer les vues en plein écran (`ShopView`, `QuantumCoreView`) aux popups traditionnels pour les fonctionnalités majeures. Cela crée une expérience plus cinématographique et moins disruptive.
-   **Le Contexte est Roi :** L'interface doit s'adapter non seulement à la taille de l'écran, mais aussi à la tâche de l'utilisateur. La navigation mobile en bas de l'écran est un exemple clé.
-   **Le Feedback est non négociable :** Chaque interaction de l'utilisateur (clic, survol, achat) doit être accompagnée d'un retour visuel et/ou sonore immédiat et satisfaisant. Les animations et les particules ne sont pas un bonus, mais une partie intégrante du *game feel*.


## 2. Structure du Projet

L'organisation des fichiers suit une logique de séparation des préoccupations stricte.

-   `/components` : Contient tous les composants React (la **vue**).
    -   `/ui` : Composants génériques et réutilisables (boutons, cartes).
    -   `/popups` : Modales et popups de confirmation.
        -   `/controllers` : **Composants "Contrôleurs"** qui gèrent la logique d'affichage de chaque popup.
    -   `/views` : Composants de haut niveau qui représentent une "vue" ou un "écran" entier de l'application (`MainGameView`, `ShopView`).
-   `/hooks` : Le "cerveau" de l'application (la **logique**).
    -   `/state` : Hooks gérant un domaine métier (joueur, ascension). Ils contiennent la **logique de mutation de l'état** et les **calculs de valeurs dérivées**.
    -   `/handlers` : Hooks servant de **couche d'action** entre l'UI et l'état. Ils orchestrent les actions utilisateur et leurs **effets secondaires** (sons, particules).
    -   `/ui` : Hooks gérant des logiques purement liées à l'UI (`useDragToScroll`, `useForge`).
-   `/data` : Données statiques du jeu (listes d'améliorations, succès).
-   `/constants` : Constantes du jeu (identifiants de succès, clés de sauvegarde).
-   `/contexts` : Le `GameContext` React.
-   `/utils` : Fonctions utilitaires pures et partagées (formatage, calculs).
-   `/styles` : Fichiers CSS-in-TS, organisés par thème, base, et composants.

## 3. Architecture & Patterns de Conception

### 3.1. Le Flux de Données (Interaction -> Rendu)

Le flux est prédictible et central à la compréhension du projet.

```plaintext
                                      [GameContext]
                                            ^
                                            | (Fournit l'état et les handlers)
                                            |
      [1. UI INTERACTION] ------------> [2. COMPONENT]
 (clic, défilement, etc.)           (ex: Button.tsx)
                                            |
      (Appelle le handler approprié)        |
                                            v
                                      [3. HANDLER]
                               (ex: usePlayerHandlers.ts)
                                            |
(Valide, déclenche effets secondaires: sons, particules, notifs...)
                                            |
                                            v
                                      [4. ACTION]
                               (ex: usePlayerState.ts)
                                            |
              (Calcule le nouvel état de manière pure)
                                            v
                                     [setGameState]
        (Déclenché dans le hook principal useGameState.ts)
                                            |
                                            v
[REACT RE-RENDER] <--- (Le nouvel état est propagé) <--- [5. MISE À JOUR DE L'ÉTAT]
```

### 3.2. L'Orchestration : Le Duo `useGameEngine` & `useGameOrchestrator`

C'est le pilier de l'architecture, agissant comme une **façade** qui masque la complexité interne.

-   **`useGameEngine.ts` (L'Assembleur) :** C'est le point d'entrée unique consommé par `App.tsx`. Sa seule responsabilité est d'**initialiser et d'assembler** tous les hooks (état, handlers, effets UI, etc.) en un seul objet de contexte structuré. Il ne contient aucune logique de jeu lui-même.
-   **`useGameOrchestrator.ts` (Le Chef d'Orchestre du Runtime) :** Ce hook est le "cœur battant" de l'application une fois qu'elle est en cours d'exécution. Il prend en entrée l'état et les actions assemblés par `useGameEngine` et les **connecte entre eux**. C'est lui qui :
    -   Héberge la **boucle de jeu principale** (`useGameLoop`).
    -   Déclenche les **vérifications de succès** à chaque tick.
    -   Gère les **effets `useEffect` globaux** qui dépendent de l'évolution de l'état (ex: débloquer des tutoriels, gérer l'auto-sauvegarde).


### 3.3. Gestion de l'État : Le Duo `useGameState` & les Hooks de `state`

-   **`hooks/useGameState.ts` :** La **source de vérité**. Gère l'objet `GameState` principal, sa persistance (`localStorage`), et délègue la logique métier à des sous-hooks spécialisés.
-   **`hooks/state/*.ts` :** Chaque hook gère un domaine (joueur, ascension, etc.). Ils exposent des `actions` (mutations pures de l'état) et des `getComputed` (calculs de valeurs dérivées).

### 3.4. La Couche d'Action : Les `hooks/handlers/*.ts`

Ces hooks forment une couche d'abstraction cruciale. Ils traduisent les intentions de l'UI en actions métier tout en y ajoutant les **effets secondaires**, découplant ainsi complètement la logique de la présentation.

### 3.5. Gestion des Vues : `ViewManager.tsx` & `useViewManager.ts`

**Problème :** Gérer plusieurs "écrans" (jeu, boutique, etc.) peut complexifier le rendu principal.

**Solution :**
1.  **`useViewManager.ts` :** Un hook qui gère un état `activeView`. Il expose des handlers pour changer de vue (ex: `enterShopInterface`, `exitShopInterface`).
2.  **`ViewManager.tsx` :** Un composant simple qui lit `activeView` du contexte et rend le composant de vue correspondant (`MainGameView`, `ShopView`, etc.).

Ce pattern permet de garder `App.tsx` propre et de gérer les transitions entre les écrans principaux de manière centralisée et claire. Il distingue deux types de vues :
-   **Vue "dans le flux" (`MainGameView`) :** La vue principale avec son propre défilement interne.
-   **Vues "superposées" (`ShopView`, `QuantumCoreView`) :** Des expériences en plein écran qui remplacent temporairement la vue principale.

### 3.6. Stratégie de Style : CSS-in-TS

**Problème :** Maintenir des fichiers CSS séparés peut être fastidieux et ne bénéficie pas de la modularité de TypeScript.

**Solution :**
1.  Les styles sont écrits dans des fichiers `.css.ts` sous forme de template literals exportés.
2.  Un fichier `utils/injectCss.ts` importe toutes ces chaînes de caractères, les concatène et les injecte dans une seule balise `<style>` dans le `<head>` au démarrage de l'application.

**Avantages :**
-   **Portabilité :** Tout le code de l'application est en TypeScript.
-   **Performance :** Une seule injection, pas de requêtes multiples.
-   **Organisation :** Les styles sont co-localisés avec la logique mais séparés par fonctionnalité (`themes`, `components`, `animations`).

## 4. Cookbook pour les Modifications Futures

### Tâche : Ajouter une nouvelle statistique (ex: "Chance de Critique")

1.  **`types.ts`** : Ajouter `criticalChance: number` à `GameState`.
2.  **`utils/helpers.ts`** : Initialiser `criticalChance: 0` dans `getInitialState`.
3.  **`utils/bonusCalculations.ts`** : Intégrer les bonus d'ascension/succès qui affectent `criticalChance`.
4.  **`hooks/handlers/usePlayerHandlers.ts`** : Dans `onCollect`, ajouter la logique de coup critique.
5.  **`components/command_center/GameStatsDisplay.tsx`** : Ajouter un `StatCard` pour l'afficher.

### Tâche : Ajouter une nouvelle Vue Principale (ex: "Laboratoire")

1.  **`components/views/LabView.tsx` :** Créer le composant pour la nouvelle interface en plein écran.
2.  **`hooks/useViewManager.ts` :**
    -   Ajouter `'lab'` au type de l'état `activeView`.
    -   Créer les handlers `enterLabInterface` et `exitLabInterface` qui appellent `setActiveView`.
3.  **`components/ViewManager.tsx` :** Ajouter un `case 'lab': return <LabView />;` dans le switch.
4.  **`components/views/MainGameView.tsx` :** Ajouter un bouton flottant ou un autre point d'entrée qui appelle `handlers.enterLabInterface`.

### Tâche : Ajouter une nouvelle section à la Boutique (ex: "Skins")

1.  **`components/ShopInterface.tsx`** :
    -   Ajouter une nouvelle balise `<section>` pour les skins, avec `scrollSnapAlign: 'start'` et la classe `scroll-reveal-section`.
    -   Créer un nouveau composant `SkinsSection.tsx` et l'importer ici.
2.  **`components/shop/SkinsSection.tsx` (Nouveau fichier) :**
    -   Créer l'interface pour l'achat de skins. Il utilisera des composants comme `PermanentUpgradeCard` comme modèle.
    -   Utiliser `useGameContext` pour accéder à l'état (ex: `gameState.purchasedSkins`) et aux handlers (ex: `handlers.onBuySkin`).
3.  **`types.ts` :** Ajouter `purchasedSkins: string[]` à `GameState`.
4.  **`utils/helpers.ts` :** Initialiser `purchasedSkins: []` dans `getInitialState`.
5.  **`hooks/state/useShopState.ts` :** Ajouter une nouvelle action `buySkin`.
6.  **`hooks/handlers/useShopHandlers.ts` :** Créer un nouveau handler `onBuySkin` qui appelle l'action `buySkin` et ajoute les effets secondaires (son, message).
7.  **`hooks/useGameEngine.ts` :** Exposer le nouveau handler `onBuySkin` via l'objet `handlers`.
8.  **Appliquer les skins :** Dans les composants concernés (ex: `QuantumCore.tsx`), lire `gameState.purchasedSkins` et appliquer les styles conditionnels.

## 5. Directives Fondamentales pour le Développement Futur

### Directive 1 : Modularité Stricte (1 Feature = 1 Ensemble de Fichiers)

Pour toute nouvelle fonctionnalité majeure (ex: Système de Guildes, Mini-jeu de Piratage), il est **interdit** de surcharger les fichiers existants (`usePlayerState`, `MainGameView`). Vous DEVEZ créer de nouveaux fichiers dédiés.

**La règle est : 1 Logique Métier = 1 Fichier State + 1 Fichier Handler + N Fichiers Composants.**

*   **Mauvais :** Ajouter la logique de "Guildes" dans `usePlayerState.ts`.
*   **Bon :** Créer `hooks/state/useGuildState.ts` et `hooks/handlers/useGuildHandlers.ts`.

Cela permet à l'IA et au développeur de :
1.  Travailler sur une fonctionnalité sans risquer de casser le reste du jeu.
2.  Garder un contexte court et pertinent lors des modifications.
3.  Faciliter les tests et le débogage.

### Directive 2 : Principe de Responsabilité Unique (SRP)

Chaque fichier doit avoir **une seule et unique raison de changer**. La logique de calcul des bonus (`utils/bonusCalculations.ts`) est séparée de la logique de gameplay (`utils/gameplayCalculations.ts`). C'est un pattern à suivre.

### Directive 3 : Maintenir le Découplage via les Handlers

La séparation entre **Composants (Vue)**, **Handlers (Action + Effets)** et **Hooks d'État (Logique Pure)** est le pilier de la robustesse de l'application. Toute nouvelle fonctionnalité doit impérativement respecter cette séparation.