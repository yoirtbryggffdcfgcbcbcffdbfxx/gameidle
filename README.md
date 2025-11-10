# Quantum Core - Un Jeu Idle Addictif

[![Version](https://img.shields.io/badge/version-1.7.0-blue.svg)](https://github.com/your-repo/quantum-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

**[▶️ Jouer à Quantum Core (Lien de Démo)](https://lien-vers-votre-jeu.com)**

Quantum Core est un jeu incrémental futuriste développé avec React, TypeScript, et Tailwind CSS. Les joueurs génèrent de l'énergie, achètent des améliorations, débloquent des succès, et visent l'Ascension pour débloquer de puissants bonus permanents.

## Table des Matières

- [🕹️ Mécaniques de Jeu](#️-mécaniques-de-jeu)
- [✨ Fonctionnalités Clés](#-fonctionnalités-clés)
- [🧠 Philosophie de Conception](#-philosophie-de-conception)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🤝 Comment Contribuer & Étendre le Jeu](#-comment-contribuer--étendre-le-jeu)

## 🕹️ Mécaniques de Jeu

Le cœur du jeu repose sur une boucle de progression satisfaisante et des décisions stratégiques.

-   **Introduction Cinématique :** Les nouveaux joueurs sont accueillis par une cinématique pour établir le ton futuriste du jeu.

-   **Boucle de Gameplay :** Commencez par collecter manuellement de l'énergie. Utilisez cette énergie pour acheter des améliorations qui génèrent passivement plus d'énergie. Réinvestissez vos gains pour voir votre production exploser.

-   **Le Cœur Quantique :** Une mécanique centrale qui se charge avec le temps. Une fois plein, il peut être activé pour fournir un boost massif et temporaire à toute la production d'énergie.

-   **Ascension (Système de Prestige) :** Lorsque vous atteignez la capacité maximale d'énergie, vous pouvez **Ascensionner**. Cette puissante réinitialisation recommence votre partie mais vous accorde deux monnaies permanentes :
    -   **Points d'Ascension :** Dépensez-les dans un arbre de compétences dédié pour des bonus globaux puissants (plus de production, clics plus forts, coûts réduits).
    -   **Fragments Quantiques :** Utilisez-les dans le **Réacteur** pour améliorer le Cœur Quantique, ou dans la **Boutique** pour acheter des améliorations fonctionnelles et des objets cosmétiques permanents.

-   **Succès :** Débloquez des dizaines de succès uniques en atteignant divers jalons. Chaque succès débloqué offre un petit bonus permanent et cumulatif à vos statistiques !

-   **La Banque :** Une fois un certain seuil de production atteint, débloquez la Banque Quantique. Épargnez votre énergie pour gagner des intérêts passifs ou contractez des prêts pour une croissance explosive, à vos risques et périls.

## ✨ Fonctionnalités Clés

-   **Zéro-Build :** Fonctionne directement dans le navigateur sans étape de compilation, grâce aux `importmaps`.
-   **Design Responsive Unifié :** Une expérience de défilement sur une seule page qui s'adapte à toutes les tailles d'écran, avec une navigation `Scrollspy` pour se déplacer facilement entre les sections.
-   **Personnalisation Visuelle :** Dépensez vos Fragments Quantiques duremment gagnés dans la boutique pour débloquer des thèmes d'interface et des curseurs de souris uniques.
-   **Tutoriel Dynamique :** Un système de tutoriel contextuel guide les nouveaux joueurs à travers les mécaniques de base.
-   **Architecture Moderne :** Entièrement basé sur les Hooks React pour une logique propre et une séparation claire des préoccupations.

## 🧠 Philosophie de Conception

Ce projet adhère à trois principes fondamentaux :

1.  **Simplicité d'Exécution :** Pas d'outils de build complexes. Le jeu doit pouvoir être lancé avec un simple serveur web statique, le rendant accessible et facile à maintenir.
2.  **Séparation Stricte des Préoccupations :** La logique du jeu (l'état, les calculs, les règles) est entièrement contenue dans les **Hooks** (`/hooks`). Les composants (`/components`) sont responsables uniquement de l'affichage et de la capture des interactions utilisateur.
3.  **Modularité & Extensibilité :** L'architecture est conçue pour être facilement étendue. Ajouter de nouvelles fonctionnalités (améliorations, succès, mécaniques) se fait de manière prévisible en modifiant des fichiers de constantes et en ajoutant une logique ciblée.

## 🛠️ Stack Technique

-   **Framework :** React 19 (via `importmap` depuis un CDN)
-   **Langage :** TypeScript
-   **Styling :** Tailwind CSS (injecté dynamiquement via JavaScript)
-   **Gestion d'État :** Hooks React (`useState`, `useMemo`, `useCallback`)

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

L'architecture est conçue pour être facilement extensible en suivant la philosophie de **séparation des préoccupations**.

### Ajouter une nouvelle Amélioration de base :

1.  **Ouvrez `constants.ts`**.
2.  Ajoutez un nouvel objet au tableau `INITIAL_UPGRADES`.
3.  C'est tout ! Le jeu gérera l'affichage, l'achat et la production automatiquement.

### Ajouter un nouveau Succès :

1.  **Ouvrez `data/achievements.ts`** et ajoutez votre nouvel objet de succès.
2.  **Ouvrez `hooks/state/useAchievements.ts`** et dans la fonction `checkAll`, ajoutez la condition de déblocage pour votre nouveau succès.
