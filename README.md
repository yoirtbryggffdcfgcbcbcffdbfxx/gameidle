# Quantum Core - Idle Game

Quantum Core est un jeu incrémental (idle game) moderne et futuriste construit avec React, TypeScript et Tailwind CSS. Les joueurs génèrent de l'énergie, achètent des améliorations pour automatiser la production, débloquent des succès et visent le Prestige pour débloquer des bonus permanents.

## 🚀 Fonctionnalités Clés

- **Système d'Énergie :** Collectez de l'énergie en cliquant ou via une production passive.
- **Améliorations :** Achetez 7 types d'améliorations, chacune avec un coût croissant et une production accrue.
- **Système de Prestige :** Réinitialisez votre progression pour gagner des points de prestige, qui peuvent être dépensés dans un arbre d'améliorations permanentes.
- **Succès :** Débloquez 15 succès en atteignant divers jalons de production, d'énergie ou de prestige.
- **Sauvegarde Automatique :** La progression est automatiquement sauvegardée dans le `localStorage` du navigateur.
- **Paramètres Personnalisables :**
  - Contrôle du volume des effets sonores (SFX).
  - Activation/désactivation des effets visuels et des animations.
  - Choix entre notation numérique standard et scientifique.
  - Confirmation optionnelle avant le prestige.
  - Plusieurs thèmes visuels (Néon Noir, Classique, Matrix, etc.).
- **Effets Visuels Riches :** Particules fluides, textes flottants, et animations d'interface pour une expérience dynamique.
- **Interface Réactive :** Conçu pour fonctionner aussi bien sur mobile que sur ordinateur de bureau.

## 🛠️ Stack Technique

- **Framework :** React 19 (via importmap, sans build step)
- **Langage :** TypeScript
- **Styling :** Tailwind CSS (via CDN)
- **Police :** 'Press Start 2P' de Google Fonts
- **Déploiement :** Application statique, peut être servie par n'importe quel serveur de fichiers web.

## 📁 Structure du Projet

Le projet est organisé autour d'une architecture modulaire basée sur les hooks React.

```
/
├── components/       # Composants React de l'interface (UI)
│   ├── popups/       # Modales (Paramètres, Succès, etc.)
│   └── ui/           # Petits composants réutilisables (Toast, Particules, etc.)
├── hooks/            # Hooks React personnalisés contenant la logique du jeu
├── data/             # Données initiales statiques (ex: liste des succès)
├── audio/            # Fichiers audio (encodés en base64)
├── utils/            # Fonctions utilitaires pures
├── App.tsx           # Composant principal qui assemble l'application
├── index.tsx         # Point d'entrée de React
├── index.html        # Fichier HTML principal
├── types.ts          # Définitions des types TypeScript globaux
└── constants.ts      # Constantes du jeu (coûts, multiplicateurs, etc.)
```

## 🏛️ Architecture & Flux de Données

L'architecture est entièrement pilotée par les hooks React pour une séparation claire des préoccupations.

1.  **`useGameEngine.ts` (Le Cerveau) :** C'est le hook principal qui orchestre tout. Il importe et utilise tous les autres hooks, assemble l'état global du jeu et expose les données et les gestionnaires d'événements à l'interface utilisateur. C'est ici que la logique de déblocage des succès et les boucles de jeu principales (timers de sauvegarde/production) sont gérées.

2.  **`useGameState.ts` (Le Cœur) :** Gère l'état fondamental du jeu : énergie, améliorations, prestige, etc. Il contient la logique pour les actions principales comme acheter une amélioration (`buyUpgrade`) ou effectuer un prestige (`doPrestige`). Il gère également le chargement et la sauvegarde des données depuis/vers le `localStorage`.

3.  **Hooks Spécialisés :** D'autres hooks gèrent des aspects spécifiques :
    - `useSettings` : Gère les paramètres de l'utilisateur et l'état de l'application (chargement, menu, jeu).
    - `useSfx`, `useParticleSystem`, `useFloatingText` : Gèrent respectivement le son, les particules et les textes flottants.
    - `usePopupManager` : Gère l'affichage des différentes fenêtres modales.
    - `useAchievementQueue` : Gère une file d'attente pour les notifications de succès afin d'éviter qu'elles ne se chevauchent.

4.  **Composants (L'Interface) :** Les composants React sont principalement "bêtes". Ils reçoivent les données et les fonctions de `useGameEngine` via le composant `App` et se contentent d'afficher l'interface et de déclencher les fonctions en réponse aux interactions de l'utilisateur.

## 🔧 Comment Étendre le Jeu

### Ajouter une nouvelle amélioration

1.  **`constants.ts` :** Ajoutez un nouvel objet au tableau `INITIAL_UPGRADES`. Définissez son nom, coût de base, production, etc.
2.  C'est tout ! Le système est conçu pour intégrer dynamiquement les nouvelles améliorations.

### Ajouter un nouveau succès

1.  **`data/achievements.ts` :** Ajoutez un nouvel objet au tableau `INITIAL_ACHIEVEMENTS` avec son nom, sa description et l'état `unlocked: false`.
2.  **`hooks/useGameEngine.ts` :** Dans le `useEffect` dédié aux succès, ajoutez une nouvelle condition `checkAndUnlock(...)` qui vérifie si les critères pour ce nouveau succès sont remplis.

### Ajouter un nouveau thème

1.  **`index.html` :** Dans la balise `<style>`, ajoutez un nouveau sélecteur `:root[data-theme='nouveau-theme']` et définissez les variables CSS personnalisées (`--bg-from`, `--text-main`, etc.).
2.  **`types.ts` :** Ajoutez le nom de votre thème à l'union de types `Settings['theme']`.
3.  **`components/popups/SettingsPopup.tsx` :** Ajoutez une nouvelle `<option>` dans le sélecteur de thème pour que les utilisateurs puissent le choisir.
