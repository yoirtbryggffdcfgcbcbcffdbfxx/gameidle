# Quantum Core - An Addictive Idle Game

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](https://github.com/your-repo/quantum-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

Quantum Core is a futuristic incremental idle game built with React, TypeScript, and Tailwind CSS. Players generate energy, buy upgrades to automate production, unlock achievements, and aim for Ascension to unlock powerful permanent bonuses.

## 🚀 Gameplay Mechanics

The core of the game revolves around a satisfying loop of progression and strategic decisions.

-   **Cinematic Intro:** New players are greeted with a skippable cinematic intro to set the futuristic and high-stakes tone of the game.

-   **Core Loop:** Start by manually collecting energy. Use that energy to buy upgrades that generate more energy passively. Re-invest your earnings into more powerful upgrades to watch your production skyrocket.

-   **The Quantum Core:** A central mechanic that charges over time. Once fully charged, it can be activated to provide a massive, temporary boost to all energy production, allowing you to break through tough upgrade cost barriers.

-   **Ascension (Prestige System):** When you reach the maximum energy capacity, you can **Ascend**. This powerful reset starts your game over but grants you two permanent currencies:
    -   **Ascension Points:** Spend these on a dedicated screen for powerful global bonuses, such as increased click power, higher overall production, or reduced upgrade costs.
    -   **Quantum Shards:** Spend these in the **Reactor** to permanently improve the Quantum Core itself, making it charge faster or provide an even stronger boost.

-   **Achievements:** Unlock over 20 unique achievements by reaching various milestones in energy, production, or total upgrades. Each unlocked achievement provides a small, permanent, and stacking bonus to your stats!

-   **Responsive Design:** A fully responsive UI that works across all screen sizes. The game is designed as a single-page scrolling experience with distinct sections for the Core, Forge, Command Center, and more. A dynamic scrollspy navigation on the right side of the screen allows for easy jumping between sections.

-   **Customization & Settings:** Tailor your experience with a variety of settings, including multiple visual themes, SFX volume control, scientific notation, and more.

## 🛠️ Technical Deep Dive

-   **Framework:** React 19 (served via importmap, no build step required)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (via CDN for simplicity)
-   **Architecture:** The entire application is architected around a modern, hook-based system for clean separation of concerns. A primary `useGameEngine` hook acts as a central coordinator, managing game state, side effects, and user interactions.

## 📁 Project Structure

The project uses a modular, feature-oriented structure.

```
/
├── components/
│   ├── popups/       # Popup components (Settings, Achievements, Credits...)
│   ├── ui/           # Reusable UI elements (ToggleSwitch, AchievementCard...)
│   ├── AscensionSection.tsx # UI for the Ascension portal
│   ├── GameUI.tsx      # Main game UI, orchestrates all sections
│   ├── IntroCinematic.tsx
│   ├── MainMenu.tsx
│   ├── ReactorSection.tsx # UI for the Quantum Core reactor
│   ├── ScrollspyNav.tsx # Right-side navigation
│   ├── TutorialTooltip.tsx # The tutorial component
│   ├── UpgradeList.tsx
│   └── ...
├── hooks/            # Custom React hooks containing all game logic
│   ├── useGameEngine.ts # The central "façade" hook
│   ├── useGameState.ts  # Core state management (energy, upgrades)
│ └── ...
├── data/             # Static game data (achievements)
├── audio/            # Base64 encoded audio files
│   └── sfx.ts
├── utils/            # Pure helper functions (number formatting)
├── App.tsx           # Main component, handles app state (loading, cinematic, game)
├── index.tsx         # React entry point
├── types.ts          # Global TypeScript type definitions
└── constants.ts      # Core game constants and balancing values
```

## 💻 How to Run Locally

This project requires no build tools like Webpack or Vite. You can run it with any simple local web server.

1.  Clone the repository.
2.  Navigate to the project directory in your terminal.
3.  Start a local server. If you have Python installed, you can use:
    ```bash
    # Python 3
    python -m http.server
    ```
4.  Open your browser and go to `http://localhost:8000`.

## 🔧 Extending the Game

The architecture is designed to be easily extensible.

### Adding a new Upgrade:
1.  Open `constants.ts`.
2.  Add a new upgrade object to the `INITIAL_UPGRADES` array.
3.  The game will automatically handle the rest!

### Adding a new Achievement:
1.  Open `data/achievements.ts` and add your new achievement to the `INITIAL_ACHIEVEMENTS` array.
2.  Open `hooks/useGameState.ts` and inside the main `useEffect`, add a new `checkAndUnlock(...)` call with the condition required to unlock it.

## 🌟 Future Roadmap

-   [ ] Offline progress calculation
-   [ ] More Ascension tiers with new upgrades and mechanics
-   [ ] A persistent research tree
-   [ ] Cloud save/export functionality
-   [ ] More visual themes and customization options
