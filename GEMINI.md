# Guide de l'IA & Architecture Interne - Projet Quantum Core

Ce document est ma "mémoire" technique et mon manuel d'ingénierie pour ce projet. Il détaille l'architecture, les patterns de conception et les guides de modification pour me permettre de maintenir, déboguer et étendre l'application avec une efficacité et une précision maximales.

## 1. Philosophie & Contraintes Clés

-   **Zéro-Build :** L'application doit fonctionner sans étape de build, en utilisant un `importmap` pour charger React 19+ depuis un CDN.
-   **Architecture Orientée Hooks :** Séparation stricte entre la logique (les `hooks/`) et la présentation (les `components/`). Les composants doivent être aussi "bêtes" que possible.
-   **Flux de Données Unidirectionnel :** `Interaction UI -> Appel de Handler -> Mutation de l'État -> Nouveau Rendu`.

## 2. Principes Directeurs pour l'IA

Ces principes sont fondamentaux pour notre collaboration et mon efficacité en tant que développeur principal IA.

### 2.1. Une Base de Code "IA-First"

Le principe le plus important est que **la base de code est optimisée pour être lue, analysée et modifiée par une IA**. Cela a des implications concrètes :

-   **Clarté et Expliciteté avant tout :** Le code doit être simple, direct et éviter toute "magie". Le flux de données doit être traçable.
-   **Modularité Stricte :** Privilégier des fichiers et des fonctions de petite taille, avec une seule responsabilité. C'est essentiel pour que je puisse isoler les modifications et éviter les effets de bord.
-   **Typage Rigoureux :** TypeScript n'est pas une option. Les types (`types.ts`) sont mon schéma de la base de données de l'application. Une structure de types solide est la fondation de ma compréhension.
-   **La Structure est la Documentation :** Une structure de fichiers et de répertoires logique (`hooks/state`, `hooks/actions`, `components/ui`) est une forme de documentation que je peux parser et comprendre instantanément.

### 2.2. Analyse Impartiale & Prise de Décision

Pour toute demande de modification non triviale, ma réponse doit inclure une analyse impartiale. Je dois systématiquement présenter :

-   **Les "Pour" (Avantages) :** Comment la modification répond à la demande, les bénéfices pour l'utilisateur, les améliorations architecturales, etc.
-   **Les "Contre" (Inconvénients & Compromis) :** L'impact sur la performance, l'augmentation de la complexité du code, les risques de régression, les potentiels impacts négatifs sur l'expérience utilisateur, le temps de développement estimé.

Cela vous permet de prendre une décision éclairée sur la base de tous les éléments.

### 2.3. Proactivité Architecturale & Création de Fichiers

Je ne dois pas être limité par la structure de fichiers existante. Si une nouvelle fonctionnalité ou un refactoring nécessite de **créer de nouveaux fichiers, de nouveaux hooks, ou même de nouveaux répertoires**, je suis non seulement autorisé mais **encouragé** à le faire.

L'objectif est de maintenir la propreté et la modularité de l'architecture. Ajouter de la complexité à un fichier existant par peur d'en créer un nouveau est une mauvaise pratique qui doit être évitée.

## 3. Architecture & Patterns de Conception

### 3.1. Le "Hook Façade Pattern" (`useGameEngine.ts`)

C'est le pilier de l'architecture. Il agit comme une **façade** :

-   **Orchestrateur Central :** C'est le seul hook consommé directement par l'UI (`App.tsx`). Il initialise et coordonne tous les autres hooks de plus bas niveau.
-   **Point d'Entrée Unique :** Il agrège l'état et les fonctions de `useGameState`, `useSettings`, `useSfx`, etc., en un seul objet structuré.
-   **Gestionnaire d'Effets Croisés :** C'est ici que les interactions qui traversent plusieurs domaines sont gérées. Par exemple, `handleBuyUpgrade` dans `useGameEngine` appelle une action de `useGameState`, `playSfx` (audio), et `addParticle` (effets visuels).

### 3.2. Gestion de l'État (`useGameState.ts`)

-   **Source de Vérité :** Gère l'état fondamental et persistant du jeu (`GameState`).
-   **Persistance :** Gère la sauvegarde et le chargement du jeu depuis `localStorage`.
-   **Logique d'État Déléguée :** Il utilise des sous-hooks spécialisés (`usePlayerState`, `usePrestigeState`, `useBankState`) pour calculer les états dérivés (valeurs calculées) et gérer les mutations d'état. C'est une application du principe de responsabilité unique.

### 3.3. Hiérarchie des Composants & Flux de Props

1.  **`App.tsx`** : Consomme `useGameEngine`. Gère la machine d'état de l'application (`loading`, `cinematic`, `menu`, `game`).
2.  **`GameContext.ts` / `GameUI.tsx`** : Le contexte React est utilisé pour éviter le "prop drilling". `GameUI` reçoit l'objet `game` complet et le met à disposition de tous ses enfants via le `GameContext.Provider`.
3.  **Composants de Section (`ForgeSection`, etc.)** : Consomment le `GameContext` via le hook `useGameContext()` pour extraire uniquement les données et les fonctions dont ils ont besoin.

## 4. Cookbook pour les Modifications Futures

### Tâche : Ajouter une nouvelle statistique (ex: "Chance de Critique")

1.  **`types.ts`** : Ajouter `criticalClickChance: number` à l'interface `GameState`.
2.  **`utils/helpers.ts`** : Mettre à jour `getInitialState` pour initialiser `criticalClickChance: 0`.
3.  **`hooks/state/usePlayerState.ts`** (ou un nouveau `useCombatState.ts`) : Ajouter la logique de calcul qui utilise cette statistique.
4.  **`constants.ts`** : Créer de nouvelles améliorations (Ascension, Cœur) qui modifient cette stat.
5.  **`hooks/state/usePrestigeState.ts`** : Mettre à jour `getComputed` pour que les bonus d'ascension/succès affectent `criticalClickChance`.
6.  **Composant UI** : Ajouter un affichage pour la nouvelle statistique.

### Tâche : Déboguer un problème d'état (ex: la production n'est pas correcte)

1.  **Point de départ : `hooks/state/usePrestigeState.ts`**.
2.  Inspecter la fonction `getComputed`. C'est là que toutes les valeurs dérivées sont calculées.
3.  Vérifier chaque source de données qui contribue au calcul :
    -   `gameState.upgrades`
    -   `gameState.purchasedAscensionUpgrades` -> `ASCENSION_UPGRADES`
    -   `gameState.achievements`
    -   `gameState.isCoreDischarging`
4.  Grâce à la centralisation des calculs, le débogage est confiné à ce fichier.
