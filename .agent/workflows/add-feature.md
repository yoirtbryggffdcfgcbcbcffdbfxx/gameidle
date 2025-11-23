---
description: Comment ajouter une nouvelle feature au dossier V2
---

# Workflow : Ajouter une Nouvelle Feature

Ce guide vous accompagne étape par étape pour ajouter une nouvelle feature au dossier `v2/` en respectant le **Protocole 20/20**.

## 📋 Checklist Rapide

- [ ] Créer la structure de dossiers
- [ ] Créer `model.ts` (types + état initial)
- [ ] Créer `actions.ts` (actions typées)
- [ ] Ajouter les actions à `GameAction` dans `lib/types.ts`
- [ ] Créer `reducer.ts` (logique pure)
- [ ] Intégrer le reducer dans `lib/store.ts`
- [ ] Créer `selectors.ts` (calculs dérivés)
- [ ] Créer les composants UI dans `components/`
- [ ] **Créer `__tests__/` avec tests unitaires** ⚠️ **OBLIGATOIRE**
- [ ] **Créer `README.md` pour la feature** ⚠️ **OBLIGATOIRE**
- [ ] Documenter avec JSDoc

---

## 🚀 Étapes Détaillées

### 1. Créer la Structure de Dossiers

```bash
mkdir v2/features/[nom-feature]
mkdir v2/features/[nom-feature]/components
```

**Exemple :** Pour une feature "achievements"
```bash
mkdir v2/features/achievements
mkdir v2/features/achievements/components
```

---

### 2. Créer `model.ts`

Définir les types et l'état initial de la feature.

```typescript
/**
 * État global de la feature [NomFeature].
 * 
 * [Description de ce que gère cette feature]
 */
export interface [NomFeature]State {
    /** [Description du champ] */
    [champ]: [type];
}

/**
 * État initial de la feature [NomFeature].
 */
export const initial[NomFeature]State: [NomFeature]State = {
    [champ]: [valeur initiale],
};
```

**Exemple concret :**
```typescript
export interface AchievementsState {
    /** Liste des achievements débloqués */
    unlocked: string[];
}

export const initialAchievementsState: AchievementsState = {
    unlocked: [],
};
```

---

### 3. Créer `actions.ts`

Définir les actions et leurs créateurs.

```typescript
/**
 * Union discriminée de toutes les actions liées à [NomFeature].
 */
export type [NomFeature]Action =
    | { type: '[ACTION_NAME]'; payload: { [champs] } };

/**
 * Créateur d'action pour [description].
 * 
 * @param [param] - [Description]
 * @returns Action [ACTION_NAME]
 */
export const [nomAction] = ([params]): [NomFeature]Action => ({
    type: '[ACTION_NAME]',
    payload: { [champs] }
});
```

**Exemple concret :**
```typescript
export type AchievementAction =
    | { type: 'ACHIEVEMENT_UNLOCK'; payload: { id: string } };

export const unlockAchievement = (id: string): AchievementAction => ({
    type: 'ACHIEVEMENT_UNLOCK',
    payload: { id }
});
```

---

### 4. Ajouter à `GameAction` dans `lib/types.ts`

**CRITIQUE** : Sans cette étape, TypeScript ne détectera pas les erreurs !

```typescript
// 1. Importer le type d'action
import { [NomFeature]Action } from '../features/[nom-feature]/actions';

// 2. Ajouter à l'union GameAction
export type GameAction = 
    | TickAction 
    | ResourceAction 
    | UpgradeAction 
    | ClickerAction
    | UIAction
    | CoreAction
    | [NomFeature]Action; // ← AJOUTER ICI
```

---

### 5. Créer `reducer.ts`

Implémenter la logique de mutation de l'état.

```typescript
import { [NomFeature]State } from './model';
import { GameAction } from '../../lib/types';

/**
 * Reducer pour la feature [NomFeature].
 * 
 * @param state - État actuel
 * @param action - Action dispatchée
 * @returns Nouvel état
 */
export const [nomFeature]Reducer = (
    state: [NomFeature]State, 
    action: GameAction
): [NomFeature]State => {
    switch (action.type) {
        case '[ACTION_NAME]':
            return {
                ...state,
                // Logique de mutation
            };

        default:
            return state;
    }
};
```

---

### 6. Intégrer dans `lib/store.ts`

Ajouter la feature au store global.

```typescript
// 1. Importer state, initialState et reducer
import { [NomFeature]State, initial[NomFeature]State } from '../features/[nom-feature]/model';
import { [nomFeature]Reducer } from '../features/[nom-feature]/reducer';

// 2. Ajouter à RootState
export interface RootState {
    resources: ResourceState;
    upgrades: UpgradesState;
    ui: UIState;
    core: CoreState;
    [nomFeature]: [NomFeature]State; // ← AJOUTER ICI
}

// 3. Ajouter à initialRootState
export const initialRootState: RootState = {
    resources: initialResourceState,
    upgrades: initialUpgradesState,
    ui: initialUIState,
    core: initialCoreState,
    [nomFeature]: initial[NomFeature]State, // ← AJOUTER ICI
};

// 4. Ajouter au rootReducer
export const rootReducer = (state: RootState, action: GameAction): RootState => {
    return {
        resources: resourceReducer(state.resources, action),
        upgrades: upgradesReducer(state.upgrades, action),
        ui: uiReducer(state.ui, action),
        core: coreReducer(state.core, action),
        [nomFeature]: [nomFeature]Reducer(state.[nomFeature], action), // ← AJOUTER ICI
    };
};
```

---

### 7. Créer `selectors.ts` (Optionnel mais Recommandé)

Pour les calculs dérivés et la logique de sélection.

```typescript
import { RootState } from '../../lib/store';

/**
 * [Description du selector]
 * 
 * @param state - État global
 * @returns [Description du retour]
 */
export const select[NomCalcul] = (state: RootState): [Type] => {
    // Logique de calcul
};
```

---

### 8. Créer les Composants UI

Dans `components/`, créer les composants React.

**Règles importantes :**
- ✅ Exporter avec `React.memo` pour optimiser les renders
- ✅ Utiliser `useGameSelector` pour accéder au state
- ✅ Utiliser `useGameDispatch` pour dispatcher des actions
- ❌ PAS de prop-drilling

```typescript
import React from 'react';
import { useGameSelector, useGameDispatch } from '../../../lib/context';

export const [NomComposant] = React.memo(() => {
    const data = useGameSelector(state => state.[nomFeature].[champ]);
    const dispatch = useGameDispatch();

    const handleAction = () => {
        dispatch([nomAction]([params]));
    };

    return (
        <div>
            {/* UI */}
        </div>
    );
});
```

---

### 9. Documenter avec JSDoc

Ajouter des JSDoc complets pour :
- ✅ Tous les types et interfaces
- ✅ Tous les créateurs d'actions
- ✅ Le reducer
- ✅ Tous les selectors

**Voir les fichiers existants pour des exemples.**

---

### 10. Créer les Tests Unitaires ⚠️ **OBLIGATOIRE**

Dans `__tests__/`, créer les tests pour selectors et reducer.

#### Structure
```bash
mkdir v2/features/[nom-feature]/__tests__
```

#### Tests du Reducer
```typescript
// __tests__/reducer.test.ts
import { describe, it, expect } from 'vitest';
import { [nomFeature]Reducer } from '../reducer';
import { [NomFeature]State } from '../model';
import { GameAction } from '../../../lib/types';

describe('[NomFeature] Reducer', () => {
  it('should handle [ACTION_NAME]', () => {
    const state: [NomFeature]State = { /* ... */ };
    const action: GameAction = { type: '[ACTION_NAME]', payload: { /* ... */ } };
    
    const newState = [nomFeature]Reducer(state, action);
    
    expect(newState.[champ]).toBe(/* valeur attendue */);
  });

  it('should maintain immutability', () => {
    const state: [NomFeature]State = { /* ... */ };
    const action: GameAction = { type: '[ACTION_NAME]', payload: { /* ... */ } };
    
    const newState = [nomFeature]Reducer(state, action);
    
    expect(newState).not.toBe(state);
  });
});
```

#### Tests des Selectors (si applicable)
```typescript
// __tests__/selectors.test.ts
import { describe, it, expect } from 'vitest';
import { select[NomCalcul] } from '../selectors';
import { RootState } from '../../../lib/store';

describe('[NomFeature] Selectors', () => {
  it('should calculate [description]', () => {
    const state: RootState = { /* ... */ };
    
    const result = select[NomCalcul](state);
    
    expect(result).toBe(/* valeur attendue */);
  });
});
```

**Lancer les tests :**
```bash
npm test [nom-feature]
```

---

### 11. Créer le README de la Feature ⚠️ **OBLIGATOIRE**

Créer `README.md` dans le dossier de la feature.

#### Template
```markdown
# Feature: [NomFeature]

## 📋 Responsabilité

[Description de ce que gère cette feature]

## 🎯 Règles Métier

[Expliquer les règles importantes, formules, comportements]

## 📁 Architecture

\```
[nom-feature]/
├── model.ts          # Types et état initial
├── actions.ts        # Actions
├── reducer.ts        # Logique de mutation
├── selectors.ts      # Calculs dérivés
├── components/       # UI
├── __tests__/        # Tests unitaires
└── README.md         # Cette documentation
\```

## 🔧 Utilisation

### [Exemple d'utilisation 1]

\```typescript
// Code d'exemple
\```

### [Exemple d'utilisation 2]

\```typescript
// Code d'exemple
\```

## ✅ Tests

Lancer les tests :
\```bash
npm test [nom-feature]
\```

## 🔗 Dépendances

### Cross-Feature
- **[Feature]** : [Description de l'interaction]

### Utilisé par
- **[Feature]** : [Description de l'utilisation]
```

**Exemples de README complets :**
- `v2/features/upgrades/README.md`
- `v2/features/resources/README.md`

---

## ✅ Vérification Finale

Avant de considérer la feature comme terminée :

1. **Typage** : Aucun `any` dans le code
2. **GameAction** : L'action est bien ajoutée à l'union
3. **Store** : Le reducer est bien intégré au `rootReducer`
4. **JSDoc** : Tous les exports publics sont documentés
5. **Memo** : Les composants UI sont exportés avec `React.memo`
6. **Tests** : ✅ **Au moins 80% de couverture pour selectors et reducer**
7. **README** : ✅ **Documentation complète de la feature**
8. **Build** : Le code compile sans erreur TypeScript

---

## 📚 Ressources

- **Exemples de features complètes** : `v2/features/upgrades/`, `v2/features/resources/`
- **Protocole 20/20** : `v2/GEMINI.md`
- **Types centraux** : `v2/lib/types.ts`
- **Store** : `v2/lib/store.ts`
