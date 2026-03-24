# Fruit Crushed Ice - Implementation Plan

## Overview

This document outlines the implementation plan for building Fruit Crushed Ice as a **PWA with Phaser.js + Capacitor**, hosted on **Supabase**. Game mechanics and requirements are defined in [RESEARCH.md](./RESEARCH.md).

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Game Engine** | Phaser 3.80+ | 2D game framework with scene management, tweening, input handling, audio |
| **Language** | TypeScript | Type safety, IDE support |
| **Build Tool** | Vite | Fast dev server, optimized production builds |
| **Offline/PWA** | Workbox | Service worker generation, asset pre-caching |
| **Native Wrapper** | Capacitor | iOS/Android app store distribution via native WebView |
| **Asset Formats** | WebP (images), OGG/MP3 (audio), JSON (level data) | Compressed, web-optimized formats |
| **State Persistence** | IndexedDB via localForage | Level progress, settings, star ratings |
| **Hosting** | Supabase (Storage + Edge Functions) | Static site hosting for PWA, optional backend for leaderboards |
| **Testing** | Vitest (unit), Playwright (E2E) | Unit tests for game logic, E2E for critical user flows |
| **CI/CD** | GitHub Actions | Automated build, test, deploy pipeline |

---

## Project Structure

```
fruit-crush/
  src/
    scenes/
      BootScene.ts          # Asset loading, splash screen
      MenuScene.ts          # Main menu, level select
      GameScene.ts          # Core gameplay
      LevelCompleteScene.ts # Score summary, star rating
    objects/
      Fruit.ts              # Fruit sprite with type, position, special state
      Board.ts              # Grid management, fruit placement, gravity
      SpecialItem.ts        # Striped, wrapped, rainbow fruit logic
      Obstacle.ts           # Ice, stone, chain, chocolate obstacle types
    utils/
      matchDetection.ts     # Find matches of 3+ on the grid
      cascadeLogic.ts       # Handle gravity and chain reactions
      scoring.ts            # Point calculation, multipliers, star rating
      levelLoader.ts        # Parse level JSON definitions
      swapValidator.ts      # Validate if a swap produces a match
      shuffleBoard.ts       # Reshuffle when no valid moves remain
    config/
      gameConfig.ts         # Phaser game config (canvas size, physics, etc.)
      levels/
        level001.json       # Per-level definitions (grid size, objectives, obstacles, move limit)
        level002.json
        ...
    assets/
      sprites/              # Fruit sprites, special item sprites, obstacle sprites
      audio/                # Match sounds, cascade sounds, level complete, background music
      fonts/                # Custom fonts
  public/
    index.html
    manifest.json           # PWA manifest (name, icons, theme color, display: standalone)
    favicon.ico
  tests/
    unit/
      matchDetection.test.ts
      cascadeLogic.test.ts
      scoring.test.ts
      swapValidator.test.ts
      shuffleBoard.test.ts
      board.test.ts
      specialItem.test.ts
    e2e/
      gameplay.spec.ts      # Swap, match, cascade, level complete flows
      navigation.spec.ts    # Menu, level select, back navigation
      offline.spec.ts       # Verify game works without network
  capacitor/                # Generated native project files (iOS/Android)
  vite.config.ts
  tsconfig.json
  package.json
```

---

## Implementation Phases

### Phase 1: Project Setup

1. Initialize Vite + TypeScript project
2. Install Phaser 3, configure `vite.config.ts` for Phaser compatibility
3. Create `BootScene` that loads a placeholder sprite sheet
4. Configure Workbox for service worker generation in the Vite build
5. Set up `manifest.json` for PWA (standalone display, portrait orientation, theme color)
6. Set up Vitest and write a smoke test
7. Set up GitHub Actions CI (build + test on every PR)

### Phase 2: Core Grid and Match-3 Logic

This is the most critical phase. All game mechanics reference [RESEARCH.md - Core Gameplay Mechanics](./RESEARCH.md#core-gameplay-mechanics).

1. **Board initialization** — Generate an NxN grid (default 8x8) populated with random fruits (5-6 types per level). Ensure no initial matches exist on board generation.
2. **Match detection** — Scan the grid for horizontal and vertical runs of 3+ identical fruits. Must handle simultaneous matches across multiple rows/columns.
3. **Swap mechanic** — Player selects a fruit, swaps with an adjacent fruit. If the swap produces a match, execute it. If not, animate the swap back (invalid move).
4. **Fruit clearing** — Remove matched fruits from the grid with a clear animation.
5. **Gravity/cascade** — Fruits above cleared spaces fall down. New fruits generate at the top. Re-scan for matches after each cascade. Repeat until no more matches exist.
6. **Move counter** — Decrement moves on each valid swap. Display remaining moves.

**Tests for Phase 2:**
- `matchDetection.test.ts`: Detect horizontal match, vertical match, L-shape, T-shape, 5-in-a-row, no match, simultaneous matches
- `cascadeLogic.test.ts`: Single cascade, multi-chain cascade, fruits fill from top correctly
- `swapValidator.test.ts`: Valid swap, invalid swap (no match), swap at grid edges
- `board.test.ts`: Board generates without initial matches, board refills correctly

### Phase 3: Special Items

Reference: [RESEARCH.md - Special Items and Power-ups](./RESEARCH.md#special-items-and-power-ups).

1. **Striped Fruit** — Created from a 4-match in a line. Clears an entire row or column (direction based on match orientation).
2. **Wrapped Fruit (Bomb)** — Created from an L-shape or T-shape 5-match. Explodes in a 3x3 area.
3. **Rainbow Fruit** — Created from a 5-in-a-row. Clears all fruits of the chosen color.
4. **Special + Special combos** — Implement all combination effects (Striped+Striped, Wrapped+Wrapped, Striped+Wrapped, Rainbow+any, Rainbow+Rainbow).

**Tests for Phase 3:**
- `specialItem.test.ts`: Each special item creation condition, each activation effect, all 7 combo pair effects, special item created during cascade

### Phase 4: Touch Input and Animations

1. **Swipe detection** — Register touch start/end positions, determine swipe direction (up/down/left/right). Minimum swipe distance threshold to avoid accidental swaps.
2. **Swap animation** — Tween the two fruits smoothly into each other's positions (~200ms).
3. **Match clear animation** — Scale down + fade out matched fruits.
4. **Cascade animation** — Fruits fall with easing (bounce or ease-out). Stagger timing so cascades feel sequential.
5. **Special item activation animation** — Row/column laser for striped, explosion ring for wrapped, color sweep for rainbow.
6. **Score pop-ups** — Floating score numbers at match location.
7. **Haptic feedback** — Via Capacitor Haptics plugin on match and special item activation.

### Phase 5: Level System and Objectives

Reference: [RESEARCH.md - Level Objectives](./RESEARCH.md#level-objectives).

1. **Level data format** — JSON files defining: grid size, fruit types available, move limit, objectives, obstacle layout, star score thresholds.
2. **Objective types:**
   - Score target: reach N points
   - Collect fruits: gather N of a specific fruit type
   - Clear ice: break all ice tiles on the board
   - Drop ingredients: move ingredients to the bottom row
   - Clear obstacles: remove all instances of an obstacle type
3. **Objective HUD** — Display current progress toward objectives during gameplay.
4. **Level complete** — When all objectives are met, trigger bonus phase (remaining moves convert to random special item activations), show star rating (1-3 stars).
5. **Level fail** — When moves run out without completing objectives, offer retry.
6. **Level select screen** — Grid of levels showing locked/unlocked state and star rating. Unlock levels sequentially.
7. **Design 10-20 initial levels** with progressive difficulty.

### Phase 6: Obstacles

Reference: [RESEARCH.md - Obstacles and Challenges](./RESEARCH.md#obstacles-and-challenges).

1. **Ice tiles (1-3 layers)** — Underlay beneath fruits. Matching on an ice tile removes one layer. Visual crack progression per layer.
2. **Stone blocks** — Immovable, non-matchable grid cells. Board generation and match detection must account for blocked cells.
3. **Chains/locks** — Fruits in chains cannot be swapped. Matching adjacent fruits breaks the chain.
4. **Chocolate/spreading blockers** — Spread to one adjacent tile per turn if not cleared. Cleared by matching adjacent fruits.
5. **Licorice/barriers** — Block the connection between two adjacent cells, preventing swaps across the barrier.

### Phase 7: Scoring and Progression

Reference: [RESEARCH.md - Scoring System](./RESEARCH.md#scoring-system).

1. **Base scoring:** 3-match = base points, 4-match = 2x, 5-match = 3x.
2. **Cascade multiplier:** Each successive cascade in a chain multiplies points (1x, 2x, 3x...).
3. **Special item bonus:** Additional points for special item activations.
4. **End-of-level bonus:** Remaining moves converted to special item activations with bonus points.
5. **Star rating thresholds:** Defined per level in JSON. 1 star = objective complete, 2-3 stars = score-based.
6. **Persist progress:** Save level completion, star ratings, and high scores to IndexedDB via localForage.

### Phase 8: PWA and Offline Support

1. **Service worker** — Workbox pre-caches all game assets (HTML, JS, CSS, sprites, audio, level JSON) during install.
2. **Cache-first strategy** — Serve from cache, fall back to network. Update cache in background when online.
3. **manifest.json** — App name, icons (192x192, 512x512), theme color, background color, `display: standalone`, `orientation: portrait`.
4. **Install prompt** — Show "Add to Home Screen" prompt on supported browsers.
5. **Offline indicator** — Small icon/badge showing offline status (informational only, game is fully playable).

### Phase 9: Supabase Hosting and Deployment

1. **Static hosting** — Deploy the Vite production build (`dist/`) to Supabase Storage as a static site.
2. **CI/CD pipeline** — GitHub Actions workflow: on push to `main`, run tests, build, deploy to Supabase.
3. **Custom domain** (optional) — Configure a custom domain via Supabase dashboard.
4. **Edge Functions** (future) — Optional Supabase Edge Functions for leaderboard API if multiplayer/social features are added later.

### Phase 10: Capacitor Native Wrapping

1. **Initialize Capacitor** — `npx cap init` with the Vite build output directory.
2. **Add platforms** — `npx cap add ios` and `npx cap add android`.
3. **Configure plugins:**
   - `@capacitor/haptics` for vibration feedback
   - `@capacitor/preferences` for native storage (fallback/complement to IndexedDB)
   - `@capacitor/splash-screen` for launch screen
   - `@capacitor/status-bar` for fullscreen immersive mode
4. **Build and sync** — `npx cap sync` after each web build.
5. **Test on devices** — Verify on physical iOS and Android devices.
6. **App store submission** — Prepare store listings, screenshots, and submit for review.

---

## Edge Cases

### Grid and Matching
- **No valid moves on board** — After a cascade settles, scan the board for any possible valid swap. If none exist, shuffle the board automatically and notify the player.
- **Initial board generation with matches** — When generating a new board, re-roll fruits that would create immediate matches so the player starts with a clean board.
- **Simultaneous matches from a single swap** — A swap can produce matches on both the source and destination positions. Both must be detected and resolved in one turn.
- **T-shape and L-shape detection** — A 5-fruit match in an L or T shape should create a wrapped fruit, not two separate 3-matches. Prioritize larger/shaped matches over smaller ones.
- **Special item creation during cascades** — If a cascade creates a 4+ match, the special item should still be generated at the correct position (bottom-most or center of the match).

### Special Items
- **Special item vs. special item swap with no match** — Swapping two special items should always activate their combo effect, even if no color match would result.
- **Rainbow fruit + rainbow fruit** — Must clear the entire board. Handle the case where this triggers during a cascade.
- **Chain reaction from special items** — A special item activation can trigger other special items. Must handle recursive/cascading activations without infinite loops (set a maximum cascade depth).
- **Special item on obstacle tile** — Activating a special item that targets a tile with an obstacle should damage/clear the obstacle.

### Obstacles
- **Chocolate spread with no valid targets** — If chocolate is surrounded by stone blocks and other chocolate, it cannot spread. Skip the spread step.
- **Ingredient at board edge** — Ingredients must only drop out at designated exit columns at the bottom row.
- **Chain on a fruit involved in the only valid match** — Breaking the chain must happen before the match can resolve.
- **Ice under a stone block** — Ice should not exist under stone blocks. Level validation should prevent this.

### Performance and Platform
- **Low-end device performance** — Limit particle effects and simultaneous tweens. Use sprite sheets (texture atlases) to minimize draw calls. Target 30fps minimum.
- **iOS Safari PWA quirks** — Service worker cache can be evicted after 7 days of inactivity on iOS. Prompt users to open the app periodically or use Capacitor build for iOS.
- **Screen size variation** — Grid must scale proportionally. Use Phaser's `Scale.FIT` mode with a fixed aspect ratio. Ensure touch targets remain >= 44px.
- **Audio autoplay restrictions** — Browsers block autoplay audio. Play audio only after the first user interaction (tap to start on menu screen).
- **IndexedDB storage limits** — Safari has ~50MB quota for IndexedDB in PWA mode. Level progress data is tiny, but cache all assets within budget.

### Game Logic
- **Move count edge case** — If a swap triggers a cascade that completes the objective, the level should end as won even if it was the last move.
- **Bonus phase animation** — End-of-level bonus converts remaining moves to special items one at a time. If many moves remain, speed up the animation to avoid long waits.
- **Level data validation** — Verify level JSON on load: grid dimensions match obstacle layout, objectives are achievable, move count is positive, star thresholds are ascending.

---

## Test Plan

### Unit Tests (Vitest)

| Test File | Covers |
|---|---|
| `matchDetection.test.ts` | 3-match, 4-match, 5-match, L-shape, T-shape, no match, multiple simultaneous matches, matches at grid edges |
| `cascadeLogic.test.ts` | Single cascade, multi-chain cascade, correct fill from top, cascade with obstacles blocking gravity |
| `scoring.test.ts` | Base scoring, cascade multipliers, special item bonuses, end-of-level bonus calculation, star rating thresholds |
| `swapValidator.test.ts` | Valid swap, invalid swap (no match produced), swap at grid boundary, swap with locked/chained fruit |
| `shuffleBoard.test.ts` | Shuffle produces valid moves, shuffle preserves special items, shuffle triggers when no moves available |
| `board.test.ts` | Initial generation has no matches, grid respects obstacle layout, board correctly identifies no-valid-moves state |
| `specialItem.test.ts` | Creation conditions for each type, activation effects for each type, all combo pair effects (7 combinations), recursive activation depth limit |
| `levelLoader.test.ts` | Valid level JSON parses correctly, invalid level JSON throws descriptive error, objective types load correctly |

### E2E Tests (Playwright)

| Test File | Covers |
|---|---|
| `gameplay.spec.ts` | Perform a swap, verify match animation plays, verify score updates, complete a level, verify star rating |
| `navigation.spec.ts` | Menu loads, level select shows correct lock/star states, back button works, scene transitions are smooth |
| `offline.spec.ts` | Load game, go offline (network emulation), verify game still plays, verify progress saves locally |

### Manual Testing Checklist

- [ ] Test on iOS Safari (PWA mode)
- [ ] Test on Android Chrome (PWA mode)
- [ ] Test Capacitor build on physical iOS device
- [ ] Test Capacitor build on physical Android device
- [ ] Verify haptic feedback on special item activation
- [ ] Verify audio plays after first interaction
- [ ] Verify "Add to Home Screen" prompt appears
- [ ] Play through 10+ levels to validate difficulty progression

---

## Clarifying Questions

The following questions should be reviewed and answered before or during implementation:

1. **Level count target** — How many levels should be included in the initial release? (Suggested: 20-30 levels with progressive difficulty.)
2. **Art style** — Should we use simple geometric/flat fruit sprites, or aim for a more polished illustrated style? Do we have a designer, or should we use open-source/AI-generated assets?
3. **Audio** — Do we want background music in addition to sound effects? Should there be a mute/volume toggle?
4. **Boosters** — Should boosters (shovel, bomb, shuffle, extra moves) be included in the initial release, or deferred? If included, how are they earned (free on level fail, or earned through star collection)?
5. **Supabase features beyond hosting** — Should we set up Supabase Auth and a database for player profiles and leaderboards, or keep it purely static hosting for now?
6. **Monetization** — The game is ad-free, but are there any other monetization considerations (e.g., one-time purchase on app stores)?
7. **Accessibility** — Should we support colorblind mode (fruit shapes/patterns in addition to colors)? Any other accessibility requirements?
8. **Target devices** — What is the minimum supported device? (Suggested: iPhone 8 / Android devices from 2018+, to set performance budget.)
9. **Capacitor priority** — Should iOS/Android app store builds be part of the initial release, or is web-only PWA sufficient to start?

---

## Previous Options Considered

The following alternatives were evaluated before selecting PWA with Phaser.js + Capacitor. They are preserved here for reference.

### Option: Flutter with Flame Engine (Native-First)

Build the game natively using Flutter and the Flame game engine.

**Tech Stack:**
- **Framework:** [Flutter](https://flutter.dev/) with [Flame](https://flame-engine.org/) game engine
- **Language:** Dart
- **Offline Support:** Native — no internet required by default
- **State Management:** Riverpod or Bloc for game state
- **Storage:** Hive or SharedPreferences for level progress

**Pros:**
- True native performance — Flutter's Impeller rendering engine delivers smooth 60fps animations
- Official Casual Games Toolkit — Flutter provides templates and tooling specifically for puzzle and casual games
- Proven match-3 implementations exist (e.g., [Flutter Crush](https://github.com/boeledi/flutter_crush))
- Offline by default — native apps don't need service workers or special caching; all assets are bundled
- App store distribution is straightforward
- Single codebase for iOS, Android, web, and desktop

**Cons:**
- Dart learning curve — the team would need to learn Dart if not already familiar
- Flame is less mature than Phaser for 2D game development — fewer examples and smaller community
- Larger app size — Flutter apps have a higher baseline size (~15-20MB minimum) compared to a web-wrapped game
- Web export quality — while Flutter supports web, the web build is heavier and less optimized than a native web game
- Slower iteration — hot reload helps, but web-based game development with Phaser allows faster browser-based iteration and debugging

### Option: React Native with Custom Canvas (Hybrid)

Build the app shell in React Native with the game rendered on a canvas.

**Tech Stack:**
- **App Shell:** [React Native](https://reactnative.dev/)
- **Game Rendering:** [react-native-skia](https://shopify.github.io/react-native-skia/) or embedded WebView with Phaser
- **Language:** TypeScript
- **Offline Support:** Native — assets bundled with the app

**Pros:**
- Familiar to JavaScript/React developers
- Native app shell with good platform integration
- Large NPM ecosystem for non-game features

**Cons:**
- Not designed for games — React Native lacks built-in game loop, tweening, scene management, and sprite handling
- Complex animation workarounds — match-3 cascade animations, special item effects, and particle systems would require dropping into native code or using a WebView bridge
- Two rendering contexts — mixing React Native UI with a game canvas creates complexity
- No game-specific toolkit — everything must be built from scratch or via third-party libraries
- Worst of both worlds risk — neither the full native performance of Flutter nor the rapid game development of Phaser

### Comparison Matrix

| Criteria | PWA + Phaser | Flutter + Flame | React Native |
|---|---|---|---|
| **Development Speed** | Fast | Medium | Slow |
| **Match-3 Suitability** | Excellent | Good | Poor |
| **Animation Performance** | Good (WebGL) | Excellent (Impeller) | Fair |
| **Offline Support** | Good (service workers) | Excellent (native) | Excellent (native) |
| **App Store Distribution** | Via Capacitor/PWABuilder | Native | Native |
| **Learning Curve** | Low (JS/TS) | Medium (Dart) | Low (JS/TS) |
| **Community/Examples** | Large (Phaser ecosystem) | Growing (Flame) | Limited (for games) |
| **Bundle Size** | Small (~5-15MB total) | Medium (~20-30MB) | Medium (~15-25MB) |
| **Web Deployment** | Native web app | Possible but heavy | Not practical |

### Why PWA + Phaser.js Was Chosen

1. **Purpose-built for this exact game type** — Phaser is a 2D game framework with built-in support for everything a match-3 game needs: sprite management, tweening for swap/cascade animations, touch input with swipe detection, audio, and scene management for level transitions.
2. **Fastest path to a playable game** — With Phaser's extensive example library and match-3 being one of the most common game genres, development can move quickly without building foundational game systems from scratch.
3. **TypeScript support** — Aligns with modern development practices and the project's code conventions.
4. **Capacitor for native distribution** — Wraps the web game as a native app with access to device APIs (haptics, local storage), while keeping a single web codebase.

---

## References

- [Phaser 3 Documentation](https://phaser.io/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Supabase Hosting Documentation](https://supabase.com/docs/guides/storage)
- [localForage Documentation](https://localforage.github.io/localForage/)
- [Phaser Match-3 Example](https://phaser.io/examples)
- [PWA Game Development Guide](https://meliorgames.com/game-development/pwa-game-development-how-to-create-a-progressive-web-game/)
