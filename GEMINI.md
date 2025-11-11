# Guide de l'IA & Architecture Interne - Projet Quantum Core

Ce document est ma "mémoire" technique et mon manuel d'ingénierie pour ce projet. Il détaille l'architecture, les patterns de conception et les guides de modification pour me permettre de maintenir, déboguer et étendre l'application avec une efficacité et une précision maximales. Il est la **source de vérité** pour toute décision de développement.

## 1. Philosophie & Contraintes Clés

-   **🚫 Zéro-Build :** L'application doit fonctionner sans étape de build, en utilisant un `importmap` pour charger React 19+ depuis un CDN.
-   **🏗️ Architecture Orientée Hooks :** Séparation stricte entre la logique (les `hooks/`) et la présentation (les `components/`). Les composants doivent être aussi "bêtes" que possible : ils affichent des données et remontent des événements.
-   **➡️ Flux de Données Unidirectionnel :** Le cycle de vie d'une interaction est toujours prédictible et facile à suivre.
-   **🧠 UI Contextuelle :** Le design n'est pas uniforme mais **cohérent**. Le pattern de navigation utilisé dépend du contexte de la tâche (ex: onglets en haut pour filtrer, en bas pour changer de vue principale).

## 2. Structure du Projet

L'organisation des fichiers suit une logique de séparation des préoccupations stricte.

-   `/components` : Contient tous les composants React (la **vue**).
    -   `/components/ui` : Composants génériques et réutilisables (boutons, cartes, etc.).
    -   `/components/popups` : Modales et popups.
-   `/hooks` : Le "cerveau" de l'application (la **logique**).
    -   `/hooks/state` : Hooks gérant un domaine métier (joueur, ascension). Ils contiennent la **logique de mutation de l'état** et les **calculs de valeurs dérivées**.
    -   `/hooks/handlers` : Hooks servant de **couche d'action** entre l'UI et l'état. Ils orchestrent les actions utilisateur et leurs **effets secondaires** (sons, particules).
    -   `/hooks/ui` : Hooks gérant des logiques purement liées à l'UI (scrollspy, etc.).
-   `/data` : Fichiers contenant les données statiques du jeu (listes d'améliorations, succès). C'est le moyen le plus simple d'ajouter du contenu.
-   `/contexts` : Contient le `GameContext` React, qui expose l'état et les handlers.
-   `/utils` : Fonctions utilitaires pures et partagées (formatage, calculs).
-   `/styles` : Fichiers CSS-in-TS, organisés par thème, base, et composants.

## 3. Architecture & Patterns de Conception

### 3.1. L'Orchestrateur Central : `useGameEngine.ts`

C'est le pilier de l'architecture. Il agit comme une **façade** qui masque la complexité interne.

-   **Point d'Entrée Unique :** C'est le seul hook consommé directement par `App.tsx`. Il initialise et coordonne tous les autres hooks.
-   **Agrégateur :** Il rassemble l'état, les valeurs calculées (`computedState`), les gestionnaires d'événements (`handlers`), et les systèmes d'UI en un seul objet structuré, fourni via `GameContext`.
-   **Gestionnaire d'Effets Croisés :** C'est ici que les interactions qui traversent plusieurs domaines sont gérées (ex: un achat déclenche une modification d'état, un son, une particule et une vérification de succès).

### 3.2. La Gestion de l'État : Le Duo `useGameState` & les Hooks de `state`

#### `hooks/useGameState.ts`
-   **Source de Vérité :** Gère l'objet `GameState` principal. C'est le seul endroit où `useState<GameState>` est appelé.
-   **Persistance :** Gère la sauvegarde et le chargement du jeu depuis `localStorage`.
-   **Délégation :** Il n'implémente pas la logique complexe lui-même, mais **délègue** cette responsabilité à des sous-hooks spécialisés (`usePlayerState`, `usePrestigeState`, etc.).

#### `hooks/state/*.ts` (ex: `usePlayerState.ts`)
-   **Responsabilité Unique :** Chaque hook gère un domaine métier (joueur, ascension, banque, boutique, cœur quantique).
-   **Fonctions Pures :** Ils exposent des fonctions `getComputed(gameState)` qui prennent l'état actuel et retournent des valeurs dérivées (ex: `productionTotal`).
-   **Actions :** Ils exposent des `actions` qui contiennent la logique de mutation de l'état (ex: `buyUpgrade`).

### 3.3. La Couche d'Action : Les `hooks/handlers/*.ts`

Ces hooks forment une couche d'abstraction cruciale entre l'UI et la logique d'état.

-   **Traducteurs d'Intention :** Ils prennent les événements bruts de l'UI (ex: un clic) et les traduisent en appels d'actions métier, tout en y ajoutant les **effets secondaires** (sons, particules, notifications).
-   **Découplage :** Ils permettent aux composants de rester simples. Un bouton appelle `handlers.onBuyUpgrade()`, sans se soucier de la complexité sous-jacente.

### 3.4. Le Flux de Données Complet (Interaction -> Rendu)

Le flux est prédictible, ce qui le rend facile à déboguer.

```
       [UI INTERACTION]
              |
              v
[1. COMPONENT] --- (appelle) ---> [2. HANDLER]
  (ex: Button.tsx)              (ex: usePlayerHandlers.ts)
                                        |
      (valide & déclenche effets)       |
                                        v
                                    [3. ACTION]
                               (ex: usePlayerState.ts)
                                        |
       (calcule le nouvel état)         |
                                        v
                                  [setGameState]
                                        |
                                        v
      [NOUVEAU RENDU] <--- (avec le nouvel état) --- [REACT]
```

### 3.5. Pattern : Prévention des Race Conditions

**Problème :** Les mises à jour d'état de React (`setGameState`) sont asynchrones. Tenter de lire l'état immédiatement après `setGameState` lira une ancienne valeur ("stale state"), ce qui peut causer des bugs lors d'actions rapides (ex: un achat rapide est refusé car le solde n'a pas encore été mis à jour dans l'état que le handler a lu).

**Solution :** La séparation stricte entre le **Handler** et l'**Action**.

1.  **Le Handler pré-valide :** Il effectue toutes les vérifications de validité (ex: `a-t-on assez d'énergie ?`) en se basant sur l'état le plus récent qu'il a reçu en props.
2.  **L'Action mute l'état :** Elle exécute la logique de mutation de manière atomique. Elle suppose que la validation a déjà eu lieu et se contente de calculer et de définir le nouvel état.

Ce pattern garantit que les retours utilisateur sont immédiats et basés sur l'état au moment précis de l'interaction, **éliminant complètement les problèmes de concurrence et de "stale state"**.

### 3.6. Philosophie UI/UX

-   **Navigation Contextuelle :** La disposition des éléments de navigation dépend du cas d'usage pour une ergonomie optimale.
    -   **En Haut (Filtres) :** Dans la `Forge`, les onglets filtrent le contenu affiché juste en dessous.
    -   **En Bas (Vues) :** Dans le `Centre de Commandement` sur mobile, les onglets basculent entre des vues complètes et distinctes, optimisant pour la zone du pouce.

-   **Feedback Immédiat :** Chaque interaction utilisateur doit provoquer un retour sensoriel immédiat (son, particule, texte flottant). C'est le rôle de la couche de **Handlers** d'orchestrer ce feedback, renforçant le sentiment de réactivité.

## 4. Cookbook pour les Modifications Futures

### Tâche : Ajouter une nouvelle statistique (ex: "Chance de Critique")

1.  **`types.ts`** : Ajouter `criticalChance: number` à l'interface `GameState`.
2.  **`utils/helpers.ts`** : Mettre à jour `getInitialState` pour initialiser `criticalChance: 0`.
3.  **`hooks/state/usePrestigeState.ts`** : Dans `getComputed`, intégrer les bonus d'ascension/succès qui affectent `criticalChance`.
4.  **`data/ascension.ts`** : Créer des améliorations d'ascension qui augmentent cette statistique.
5.  **`hooks/handlers/usePlayerHandlers.ts`** : Dans `onCollect`, ajouter la logique pour gérer un coup critique en se basant sur `computedState.criticalChance`.
6.  **`components/CoreSection.tsx`** : Ajouter un `StatDisplay` pour afficher la nouvelle statistique.

### Tâche : Ajouter une nouvelle section principale (ex: "Laboratoire")

1.  **`data/labUpgrades.ts`** : Créer un fichier de données pour les améliorations du laboratoire.
2.  **`types.ts`** : Ajouter un type `LabUpgrade` et un tableau `labUpgrades: LabUpgrade[]` à `GameState`.
3.  **`utils/helpers.ts`** : Mettre à jour `getInitialState` pour le laboratoire.
4.  **`hooks/state/useLabState.ts`** : Créer un nouveau hook de gestion d'état pour le laboratoire, suivant le modèle de `usePlayerState.ts`. Il contiendra les `actions` (ex: `buyLabUpgrade`) et `getComputed`.
5.  **`hooks/handlers/useLabHandlers.ts`** : Créer un hook de handlers pour le laboratoire.
6.  **`hooks/useGameState.ts`** : Intégrer `useLabState` dans le gestionnaire principal.
7.  **`hooks/useGameEngine.ts`** : Intégrer `useLabHandlers` dans l'orchestrateur et exposer les nouveaux handlers.
8.  **`components/LabSection.tsx`** : Créer le composant React pour la nouvelle section.
9.  **`components/GameUI.tsx`** :
    -   Ajouter la nouvelle section à la liste `sections` pour le `ScrollspyNav`.
    -   Ajouter le composant `<LabSection />` dans le `main`.
10. **`data/tutorial.ts`** : (Optionnel) Ajouter des étapes de tutoriel pour la nouvelle section.