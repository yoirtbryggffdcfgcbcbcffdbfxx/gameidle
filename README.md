# Quantum Core - Un Jeu Idle Addictif

[![Version](https://img.shields.io/badge/version-1.8.0-blue.svg)](https://github.com/your-repo/quantum-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

**[▶️ Jouer à Quantum Core (Lien de Démo)](https://lien-vers-votre-jeu.com)**

Quantum Core est un jeu incrémental futuriste développé avec React, TypeScript, et Tailwind CSS. Les joueurs génèrent de l'énergie, achètent des améliorations, débloquent des succès, et visent l'Ascension pour débloquer de puissants bonus permanents et spécialiser leur Cœur Quantique.

*(Suggestion : Insérez ici une capture d'écran ou un GIF du jeu pour un impact visuel maximal.)*

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

-   **⚡ Boucle de Gameplay Fondamentale :**
    -   Commencez par collecter manuellement de l'énergie.
    -   Utilisez cette énergie pour acheter des améliorations qui génèrent passivement plus d'énergie.
    -   Réinvestissez vos gains pour voir votre production exploser de manière exponentielle.

-   **⚛️ Le Cœur Quantique :**
    -   Une mécanique centrale qui se charge avec le temps.
    -   Une fois plein, activez-le pour un **boost massif et temporaire** à toute la production d'énergie, crucial pour surmonter les paliers de coût.

-   **✨ Ascension & Fragments Quantiques :**
    -   Lorsque vous atteignez la capacité maximale d'énergie, vous pouvez **Ascensionner**.
    -   Cette puissante réinitialisation recommence votre partie mais vous accorde deux monnaies permanentes :
        -   **Points d'Ascension :** Dépensez-les dans un arbre de compétences pour des bonus globaux (plus de production, clics plus forts, coûts réduits).
        -   **Fragments Quantiques :** Achetez-les avec de l'énergie ou gagnez-les en Ascensionnant. Ils sont la clé pour améliorer le Cœur.

-   **🌌 Spécialisation du Cœur (Voies Quantiques) :**
    -   Après votre première Ascension, choisissez une **Voie permanente** pour votre Cœur (Vitesse, Puissance ou Équilibre).
    -   Utilisez les Fragments Quantiques pour progresser dans cette voie, débloquant des améliorations spécialisées pour le Cœur.

-   **🏆 Succès & Bonus :**
    -   Débloquez des dizaines de succès en atteignant divers jalons.
    -   Chaque succès offre un petit bonus permanent et cumulatif à vos statistiques.

-   **🏦 La Banque & 🛍️ La Boutique :**
    -   Débloquez la **Banque Quantique** pour épargner votre énergie ou contracter des prêts.
    -   Dépensez des Fragments dans la **Boutique Permanente** pour des améliorations utilitaires qui persistent à travers toutes les ascensions.

## ✨ Fonctionnalités Clés

-   **🚫 Zéro-Build :** Fonctionne directement dans le navigateur sans étape de compilation, grâce aux `importmaps`.
-   **📱 Design Adaptatif Contextuel :** Une expérience de défilement sur une seule page qui s'adapte à tous les écrans. La navigation est contextuelle : en bas sur mobile pour l'ergonomie, en haut pour les filtres, et sur le côté pour la navigation principale.
-   **🎨 Personnalisation Visuelle :** Changez l'apparence du jeu avec plusieurs thèmes visuels.
-   **🧠 Tutoriel IA Dynamique :** Une IA de bord guide les nouveaux joueurs à travers les mécaniques de base de manière contextuelle et non intrusive.
-   **🏗️ Architecture Moderne :** Entièrement basé sur les Hooks React pour une logique propre et une séparation claire des préoccupations.

## 🧠 Architecture & Philosophie de Conception

Ce projet adhère à une philosophie de **séparation stricte des préoccupations**.

-   **Logique (`/hooks`) :** Le "cerveau" de l'application. Toute la logique métier, la gestion de l'état et les calculs y sont confinés.
-   **Présentation (`/components`) :** La couche "visuelle". Les composants sont responsables uniquement de l'affichage des données et de la capture des interactions utilisateur.
-   **Orchestration (`useGameEngine.ts`) :** Un hook central qui assemble tous les systèmes (état, effets sonores, notifications, etc.) et les expose à l'UI via un `Context`.

Cette structure rend le code prédictible, facile à déboguer et simple à étendre. Pour une analyse approfondie, consultez le guide de l'IA : `GEMINI.md`.

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

Les contributions sont les bienvenues ! L'architecture est conçue pour être facilement extensible en suivant la philosophie de **séparation des préoccupations**.

Pour toute modification, veuillez lire et respecter les principes architecturaux décrits en détail dans **`GEMINI.md`**. Ce document est la source de vérité pour le développement.

### Étapes pour Contribuer

1.  **Forkez le dépôt** sur votre compte GitHub.
2.  Créez une nouvelle branche pour votre fonctionnalité ou votre correctif (`git checkout -b feature/ma-super-feature`).
3.  Effectuez vos modifications en respectant l'architecture existante.
4.  Ouvrez une **Pull Request** vers la branche `main` du dépôt original, en décrivant clairement vos changements.

### Exemples d'Extensions Simples

#### Ajouter une nouvelle Amélioration de base :
1.  **Ouvrez `data/upgrades.ts`**.
2.  Ajoutez un nouvel objet au tableau `INITIAL_UPGRADES`.
3.  C'est tout ! Le jeu gérera l'affichage, l'achat et la production automatiquement.

#### Ajouter un nouveau Succès :
1.  **Ouvrez `data/achievements.ts`** et ajoutez votre nouvel objet de succès.
2.  **Ouvrez `hooks/state/useAchievements.ts`** et dans la fonction `checkAll`, ajoutez la condition de déblocage pour votre nouveau succès.

## 📜 Changelog

### Version 1.8.0 - "Cohérence Contextuelle"
-   **Amélioration de l'UI/UX Mobile :** Refonte de la navigation dans les sections "Forge" et "Centre de Commandement" pour une expérience plus cohérente et ergonomique.
-   **Système de Notifications Affiné :** Les indicateurs de notification "point rouge" sont maintenant plus intelligents.
-   **Interface Épurée :** Suppression des statistiques redondantes.
-   **Amélioration de la Documentation :** Mise à jour majeure des fichiers `README.md` et `GEMINI.md`.
-   **Correction de Bugs Majeurs :** Correction de conditions de concurrence dans les boutiques.
-   **Fiabilité Améliorée :** Le raccourci du panneau de développeur (`Ctrl+Shift+D`) a été rendu plus fiable.