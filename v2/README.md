# Architecture V2 - Quantum Core

## 🎯 Objectif

Le dossier `v2/` implémente une architecture **Redux-like** avec un typage strict TypeScript, optimisée pour la maintenabilité et la collaboration IA-friendly.

**Score de maintenabilité : 10/10** ⭐

## 📋 Protocole 20/20

Le code suit 6 règles non-négociables définies dans [`GEMINI.md`](./GEMINI.md) :

1. **Typage de Fer** : Pas de `any`, union discriminée `GameAction`
2. **Performance Chirurgicale** : `React.memo`, selectors atomiques
3. **Architecture Atomique** : Une feature = Un dossier isolé
4. **Zéro Prop-Drilling** : Hooks `useGameSelector` et `useGameDispatch`
5. **Styling Hybride** : Tailwind (layout) + Vanilla CSS (esthétique)
6. **Conventions de Nommage** : Actions (SCREAMING_SNAKE_CASE), Selectors (`select`), Composants (PascalCase)

## 🗂️ Structure

```
v2/
├── features/           # Features isolées
│   ├── upgrades/       # Système d'améliorations
│   ├── resources/      # Gestion de l'énergie
│   ├── core/           # Core quantique (boost)
│   ├── ui/             # Interface et animations
│   └── clicker/        # Système de clic manuel
├── lib/                # Code partagé
│   ├── types.ts        # GameAction, Reducer
│   ├── store.ts        # RootState, rootReducer
│   ├── selectors.ts    # Selectors cross-feature
│   ├── schemas.ts      # Validation Zod
│   └── context.tsx     # React Context
├── layout/             # Composants de mise en page
├── hooks/              # Hooks personnalisés
└── GEMINI.md           # Règles du Protocole 20/20
```

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

### Tests

```bash
npm test              # Lancer tous les tests
npm run test:ui       # Interface de tests
npm run test:coverage # Rapport de couverture
```

### Build

```bash
npm run build
```

## 🧩 Ajouter une Feature

Suivez le workflow détaillé dans [`.agent/workflows/add-feature.md`](../.agent/workflows/add-feature.md).

**Résumé :**
1. Créer `features/[nom]/model.ts` (types + état initial)
2. Créer `features/[nom]/actions.ts` (actions typées)
3. **IMPORTANT** : Ajouter les actions à `GameAction` dans `lib/types.ts`
4. Créer `features/[nom]/reducer.ts` (logique pure)
5. Intégrer dans `lib/store.ts` (RootState + rootReducer)
6. Créer `features/[nom]/selectors.ts` (calculs dérivés)
7. Créer `features/[nom]/components/` (UI avec React.memo)
8. Documenter avec JSDoc

## 📚 Features Disponibles

| Feature | Description | README |
|---------|-------------|--------|
| **Upgrades** | Améliorations achetables (générateurs, clickers, boosters) | [📖](./features/upgrades/README.md) |
| **Resources** | Gestion de l'énergie (energy, totalGenerated) | [📖](./features/resources/README.md) |
| **Core** | Core quantique avec boost x5 | [📖](./features/core/README.md) |
| **UI** | Interface, responsive, animations | [📖](./features/ui/README.md) |

## 🧪 Tests

Couverture actuelle : **>80%** pour selectors et reducers.

### Tests par Feature

```bash
npm test upgrades    # Tests des upgrades
npm test resources   # Tests des resources
npm test lib         # Tests des selectors globaux
```

### Écrire un Test

```typescript
import { describe, it, expect } from 'vitest';
import { selectUpgradeCost } from '../selectors';

describe('selectUpgradeCost', () => {
  it('should calculate cost with exponential scaling', () => {
    const cost = selectUpgradeCost(100, 5);
    expect(cost).toBe(201); // 100 * (1.15^5)
  });
});
```

## ✅ Validation des Données

Les données critiques sont validées avec **Zod** au build :

```typescript
// v2/features/upgrades/data.ts
export const UPGRADES_DATA = RAW_UPGRADES_DATA.map(upgrade => {
  const result = UpgradeSchema.safeParse(upgrade);
  if (!result.success) {
    throw new Error(`Validation échouée pour ${upgrade.id}`);
  }
  return result.data;
});
```

Si une erreur est détectée, le build échouera avec un message clair.

## 🔗 Ressources

- **Protocole 20/20** : [`GEMINI.md`](./GEMINI.md)
- **Workflow Add Feature** : [`.agent/workflows/add-feature.md`](../.agent/workflows/add-feature.md)
- **Types Centraux** : [`lib/types.ts`](./lib/types.ts)
- **Store** : [`lib/store.ts`](./lib/store.ts)

## 🤝 Contribution

1. Respecter le **Protocole 20/20** ([`GEMINI.md`](./GEMINI.md))
2. Ajouter des **tests unitaires** pour toute nouvelle feature
3. Documenter avec **JSDoc**
4. Valider les données avec **Zod** si applicable

---

**Maintenu avec ❤️ pour une collaboration IA-friendly**
