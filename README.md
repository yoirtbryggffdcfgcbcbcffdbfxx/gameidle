# Quantum Core - Un Jeu Idle Addictif

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](https://github.com/your-repo/quantum-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

Quantum Core est un jeu incrémental futuriste développé avec React, TypeScript, et Tailwind CSS. Les joueurs génèrent de l'énergie, achètent des améliorations, débloquent des succès, et visent l'Ascension pour débloquer de puissants bonus permanents.

## Table des Matières

- [🕹️ Mécaniques de Jeu](#️-mécaniques-de-jeu)
- [✨ Fonctionnalités Clés](#-fonctionnalités-clés)
- [🛠️ Stack Technique](#️-stack-technique)
- [📁 Structure du Projet](#-structure-du-projet)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🤝 Comment Contribuer & Étendre le Jeu](#-comment-contribuer--étendre-le-jeu)
- [🌟 Feuille de Route](#-feuille-de-route)

## 🕹️ Mécaniques de Jeu

Le cœur du jeu repose sur une boucle de progression satisfaisante et des décisions stratégiques.

-   **Introduction Cinématique :** Les nouveaux joueurs sont accueillis par une cinématique pour établir le ton futuriste du jeu.

-   **Boucle de Gameplay :** Commencez par collecter manuellement de l'énergie. Utilisez cette énergie pour acheter des améliorations qui génèrent passivement plus d'énergie. Réinvestissez vos gains pour voir votre production exploser.

-   **Le Cœur Quantique :** Une mécanique centrale qui se charge avec le temps. Une fois plein, il peut être activé pour fournir un boost massif et temporaire à toute la production d'énergie.

-   **Ascension (Système de Prestige) :** Lorsque vous atteignez la capacité maximale d'énergie, vous pouvez **Ascensionner**. Cette puissante réinitialisation recommence votre partie mais vous accorde deux monnaies permanentes :
    -   **Points d'Ascension :** Dépensez-les dans un arbre de compétences dédié pour des bonus globaux puissants (plus de production, clics plus forts, coûts réduits).
    -   **Fragments Quantiques :** Utilisez-les dans le **Réacteur** pour améliorer en permanence le Cœur Quantique lui-même (charge plus rapide, boost plus puissant).

-   **Succès :** Débloquez des dizaines de succès uniques en atteignant divers jalons. Chaque succès débloqué offre un petit bonus permanent et cumulatif à vos statistiques !

## ✨ Fonctionnalités Clés

-   **Zéro-Build :** Fonctionne directement dans le navigateur sans étape de compilation, grâce aux `importmaps`.
-   **Design Responsive Unifié :** Une expérience de défilement sur une seule page qui s'adapte à toutes les tailles d'écran, avec une navigation `Scrollspy` pour se déplacer facilement entre les sections.
-   **Tutoriel Dynamique :** Un système de tutoriel contextuel guide les nouveaux joueurs à travers les mécaniques de base.
-   **Personnalisation :** Plusieurs thèmes visuels, contrôle du volume, notation scientifique, et plus encore.
-   **Architecture Moderne :** Entièrement basé sur les Hooks React pour une logique propre et une séparation claire des préoccupations.

## 🛠️ Stack Technique

-   **Framework :** React 19 (via `importmap` depuis un CDN)
-   **Langage :** TypeScript
-   **Styling :** Tailwind CSS (via CDN)
-   **Gestion d'État :** Hooks React (`useState`, `useMemo`, `useCallback`)

## 📁 Structure du Projet

Le projet utilise une structure modulaire orientée par fonctionnalité.

```
/
├── components/       # Composants React (UI)
│   ├── popups/       # Popups (Paramètres, Succès, Crédits...)
│   ├── ui/           # Éléments d'UI réutilisables (SkillTree, ToggleSwitch...)
│   └── ...
├── hooks/            # Hooks React personnalisés (toute la logique du jeu)
│   ├── useGameEngine.ts # Le hook "façade" qui orchestre tout
│   ├── useGameState.ts  # Gestion de l'état principal du jeu
│   └── ...
├── data/             # Données statiques du jeu (succès)
├── audio/            # Fichiers audio encodés en Base64
├── utils/            # Fonctions d'aide pures (formatage de nombres)
├── App.tsx           # Composant principal, gère la machine d'état de l'application
├── index.tsx         # Point d'entrée de React
├── types.ts          # Définitions globales des types TypeScript
└── constants.ts      # Constantes du jeu et valeurs d'équilibrage
```

## 🚀 Démarrage Rapide

Ce projet ne nécessite aucun outil de build.

1.  Clonez le dépôt.
2.  Naviguez vers le répertoire du projet dans votre terminal.
3.  Démarrez un serveur web local. Si vous avez Python :
    ```bash
    # Python 3
    python -m http.server
    ```
4.  Ouvrez votre navigateur à l'adresse `http://localhost:8000`.

## 🤝 Comment Contribuer & Étendre le Jeu

L'architecture est conçue pour être facilement extensible. La philosophie de base est la **séparation des préoccupations** :
-   **Les `hooks/`** contiennent toute la **logique** et l'**état**.
-   **Les `components/`** sont aussi "bêtes" que possible. Ils reçoivent des données et des fonctions en props et s'occupent uniquement de l'**affichage**.

### Ajouter une nouvelle Amélioration de base :

1.  **Ouvrez `constants.ts`**.
2.  Ajoutez un nouvel objet au tableau `INITIAL_UPGRADES`.
3.  C'est tout ! Le jeu gérera l'affichage, l'achat et la production automatiquement.

### Ajouter un nouveau Succès :

1.  **Ouvrez `data/achievements.ts`** et ajoutez votre nouvel objet de succès au tableau `INITIAL_ACHIEVEMENTS`.
2.  **Ouvrez `hooks/useGameState.ts`** et trouvez le `useEffect` qui vérifie les succès.
3.  Ajoutez un nouvel appel à `checkAchievement("Votre Nouveau Succès", condition_pour_le_debloquer);` avec la condition appropriée.

### Ajouter une nouvelle Amélioration d'Ascension :

1.  **Ouvrez `types.ts`** si vous avez besoin d'un nouveau type d'effet.
2.  **Ouvrez `constants.ts`** et ajoutez un nouvel objet au tableau `ASCENSION_UPGRADES`. Définissez sa `position`, son `coût`, son `effet` et ses prérequis (`required`).
3.  **Ouvrez `hooks/useGameState.ts`** et dans le `useMemo` `ascensionBonuses`, ajoutez un `case` dans le `switch` pour appliquer l'effet de votre nouvelle amélioration.

## 🌟 Feuille de Route

-   [ ] Calcul de la progression hors ligne
-   [ ] Plus de paliers d'Ascension avec de nouvelles mécaniques
-   [ ] Sauvegarde dans le cloud / Exportation
-   [ ] Plus de thèmes visuels et d'options de personnalisation
