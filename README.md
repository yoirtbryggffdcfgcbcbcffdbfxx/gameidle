# Quantum Core - L'Ère de l'Immersion

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/your-repo/quantum-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Quantum Core est un jeu *idle* futuriste conçu pour une immersion totale. Développé avec React 19 et une architecture **zéro-build**, il vous plonge dans une quête pour maîtriser l'énergie quantique, où chaque clic et chaque décision stratégique vous rapprochent de la domination cosmique.**

*(Suggestion : Insérez ici une capture d'écran ou un GIF du jeu en pleine action pour un impact visuel maximal.)*

## Table des Matières

- [🕹️ Mécaniques de Jeu](#️-mécaniques-de-jeu)
- [✨ Fonctionnalités Clés](#-fonctionnalités-clés)
- [🧠 Architecture & Philosophie de Conception](#-architecture--philosophie-de-conception)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🤝 Comment Contribuer & Étendre le Jeu](#-comment-contribuer--étendre-le-jeu)
- [📜 Changelog](#-changelog)

## 🕹️ Mécaniques de Jeu

Le cœur du jeu repose sur une boucle de progression satisfaisante et des décisions stratégiques.

-   **🎬 Introduction Cinématique :** Les nouveaux joueurs sont accueillis par une cinématique pour établir le ton futuriste du jeu.
-   **⚡ Boucle de Gameplay Fondamentale :** Collectez de l'énergie, achetez des améliorations de production, et réinvestissez pour une croissance exponentielle.
-   **⚛️ Le Cœur Quantique :** Une mécanique centrale qui se charge pour déclencher un boost de production massif et temporaire.
-   **✨ Ascension & Fragments Quantiques :** Réinitialisez votre progression pour gagner des **Points d'Ascension** (pour des bonus permanents) et des **Fragments Quantiques** (pour améliorer le Cœur).
-   **🌌 Spécialisation du Cœur (Voies Quantiques) :** Choisissez une voie permanente (Vitesse, Puissance, Équilibre) pour votre Cœur et améliorez-la avec des Fragments.
-   **🏆 Succès & Bonus :** Débloquez des dizaines de succès, chacun offrant un petit bonus permanent et cumulatif.
-   **🏦 La Banque & 🛍️ La Boutique :** Débloquez la **Banque Quantique** pour épargner ou emprunter, et dépensez des Fragments dans la **Boutique Permanente** pour des améliorations utilitaires.

## ✨ Fonctionnalités Clés

-   **🚫 Zéro-Build & Portable :** Lancez le jeu instantanément dans n'importe quel navigateur moderne, sans aucune installation. La simplicité à son apogée.
-   **📱 UI Contextuelle & Adaptative :** Une interface qui se transforme, offrant une navigation optimisée au bas de l'écran sur mobile et sur le côté sur ordinateur.
-   **🛍️ Expériences Immersives :** Fini les menus ennuyeux. La boutique et le Cœur Quantique sont des interfaces narratives en plein écran, avec des animations cinématographiques déclenchées par le défilement.
-   **💥 Micro-interactions Satisfaisantes :** Chaque action est amplifiée par des retours visuels et sonores percutants, rendant la progression exponentiellement plus gratifiante.
-   **🎛️ Contrôles Intuitifs :** Changez le montant et le type d'achat à la volée grâce à des cadrans de contrôle uniques, conçus pour la vitesse et la précision.
-   **🧠 Tutoriel IA Intégré :** Une IA de bord vous guide à travers les mécaniques complexes de manière contextuelle, sans jamais interrompre votre immersion.
-   **🏗️ Architecture Moderne :** Entièrement basé sur les Hooks React pour une logique propre et une séparation claire des préoccupations.

## 🧠 Architecture & Philosophie de Conception

Ce projet adhère à une philosophie de **séparation stricte des préoccupations**, le rendant prédictible, facile à déboguer et simple à étendre. Il a été conçu pour être **portable et sans dépendances**, d'où l'absence de `package.json` ou d'outils de build.

-   **Logique (`/hooks`) :** Le "cerveau" de l'application. Toute la logique métier, la gestion de l'état et les calculs y sont confinés.
-   **Présentation (`/components`) :** La couche "visuelle". Les composants sont responsables uniquement de l'affichage des données et de la capture des interactions utilisateur.
-   **Orchestration (`useGameEngine.ts`) :** Un hook central qui assemble tous les systèmes (état, effets sonores, notifications, etc.) et les expose à l'UI via un `Context`.

Cette structure modulaire et découplée est conçue pour accueillir de nouvelles fonctionnalités sans complexifier le code existant. Pour une analyse approfondie de l'architecture, consultez le guide de l'IA : **`GEMINI.md`**.

## 🛠️ Stack Technique

-   **Framework :** React 19 (via `importmap` depuis un CDN)
-   **Langage :** TypeScript
-   **Styling :** Tailwind CSS (injecté dynamiquement via CSS-in-TS)
-   **Gestion d'État :** Hooks React (`useState`, `useMemo`, `useCallback`)

## 🚀 Démarrage Rapide

Ce projet ne nécessite **aucun outil de build** (comme `npm` ou `yarn`).

1.  Clonez le dépôt.
2.  Naviguez vers le répertoire du projet dans votre terminal.
3.  Démarrez un serveur web local. Si vous avez Python :
    ```bash
    # Python 3
    python -m http.server
    ```
4.  Ouvrez votre navigateur à l'adresse `http://localhost:8000`. C'est tout !

## 🤝 Comment Contribuer & Étendre le Jeu

Les contributions sont les bienvenues ! L'architecture est conçue pour être facilement extensible. Pour toute modification, veuillez lire et respecter les principes architecturaux décrits en détail dans **`GEMINI.md`**.

### Étapes pour Contribuer

1.  **Forkez le dépôt** sur votre compte GitHub.
2.  Créez une nouvelle branche pour votre fonctionnalité ou votre correctif (`git checkout -b feature/ma-super-feature`).
3.  Effectuez vos modifications en respectant l'architecture existante.
4.  Ouvrez une **Pull Request** vers la branche `main` du dépôt original, en décrivant clairement vos changements.

### Exemples d'Extensions Simples

#### Ajouter une nouvelle Amélioration de base :
1.  **Ouvrez `data/upgrades.ts`**.
2.  Ajoutez un nouvel objet au tableau `INITIAL_UPGRADES` en suivant la structure existante.
3.  C'est tout ! Le jeu gérera l'affichage, l'achat et la production automatiquement.

#### Ajouter une nouvelle Amélioration Permanente de la Boutique :
1.  **Ouvrez `data/shop.ts`**.
2.  Ajoutez un nouvel objet `ShopUpgrade` au tableau `SHOP_UPGRADES` avec un `id`, un `nom`, une `description`, un `coût`, une `devise` et une `icône`.
3.  **Trouvez le hook de `state` pertinent** (ex: `hooks/state/usePlayerState.ts`) et lisez la nouvelle amélioration depuis `gameState.purchasedShopUpgrades` pour activer la fonctionnalité correspondante.

## 📜 Changelog

### Version 2.0.0 - "L'Ère de l'Immersion"
-   **Refonte Majeure de l'UI/UX :**
    -   **Boutique Immersive :** La boutique a été transformée en une expérience narrative en plein écran, utilisant le "scroll-snapping" et des animations déclenchées au défilement pour un parcours d'achat cinématographique.
    -   **Micro-interactions :** Le bouton "Collecter" et d'autres éléments clés ont été repensés avec des animations et des effets visuels futuristes pour une meilleure satisfaction de l'utilisateur.
    -   **Cadrans de Contrôle :** De nouveaux composants d'interface (Cadrans) ont été introduits pour une sélection plus rapide et plus intuitive des types et quantités d'achats.
-   **Refactorisation Architecturale :**
    -   **Gestionnaire de Vues (`ViewManager`) :** Introduction d'un système pour gérer les vues de haut niveau (jeu principal, boutique, interface du cœur), améliorant la modularité.
    -   **Hooks d'UI Spécialisés :** Création de hooks réutilisables (`useForge`, `useScrollAnimationTrigger`) pour encapsuler la logique d'interface complexe.
-   **Amélioration de la Documentation :** Mise à jour majeure des fichiers `README.md` et `GEMINI.md` pour refléter la nouvelle architecture et les nouvelles fonctionnalités.
-   **Version Bump** pour marquer cette transition significative vers une expérience utilisateur plus riche et une architecture plus robuste.

### Version 1.9.0 - "L'Ère de la Robustesse"
-   **Refactorisation Architecturale :** Découplage complet de la gestion des popups via un pattern "Contrôleur".
-   **Sécurisation du Code :** Élimination des "magic strings" pour les succès en introduisant un fichier de constantes (`constants/achievements.ts`).
-   **Clarification de la Logique :** Scission des fichiers de calculs monolithiques en unités logiques plus petites et spécialisées.
-   **Version Bump** pour marquer ces changements structurels importants.
