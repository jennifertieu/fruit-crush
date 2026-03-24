# Fruit Crushed Ice - Mobile Game Plan

## Overview

This document evaluates options for building Fruit Crushed Ice as a mobile game that works offline, based on the game requirements outlined in [RESEARCH.md](./RESEARCH.md). Three primary approaches are considered, with a recommended tech stack at the end.

---

## Option 1: PWA with Phaser.js (Web-First)

Build the game as a Progressive Web App using a JavaScript game framework, wrapped for app store distribution.

### Tech Stack

- **Game Engine:** [Phaser 3.80+](https://phaser.io/) — full-featured 2D game framework with built-in scene management, tweening, input handling, and audio
- **Language:** TypeScript
- **Offline Support:** Service workers via [Workbox](https://developer.chrome.com/docs/workbox/) for asset caching
- **Native Wrapper:** [Capacitor](https://capacitorjs.com/) or [PWABuilder](https://www.pwabuilder.com/) for app store distribution
- **Build Tool:** Vite

### Pros

- **Fastest development time** — Phaser provides built-in tweening (critical for tile-swap animations), touch/swipe input handling, scene management, and audio out of the box
- **Single codebase** deploys to web, iOS, and Android
- **Large ecosystem** — 1800+ examples, active community, extensive documentation
- **TypeScript support** built-in
- **Phaser is purpose-built for 2D games** like match-3 puzzles, with proven examples in this genre
- **Small bundle** — Phaser is ~1.2MB, and game assets for a match-3 are typically 5-15MB total
- **Capacitor** provides native device access (haptics, local storage) while keeping the web codebase

### Cons

- **iOS PWA limitations** — service workers run with restrictions on iOS Safari; storage quotas are tighter than Chrome
- **No native rendering** — runs in a WebView/canvas, which may feel slightly less smooth than a fully native solution on low-end devices
- **App store approval** — Apple has historically been stricter with web-wrapped apps, though Capacitor apps generally pass review

### Offline Strategy

1. Register a service worker that pre-caches all game assets (HTML, CSS, JS, images, sounds) during the `install` event
2. Use a cache-first strategy to serve assets from cache and fall back to the network
3. Store level progress in IndexedDB or localStorage
4. Keep the cache small — use compressed textures (WebP) and audio (OGG/MP3) with progressive loading for later levels

---

## Option 2: Flutter with Flame Engine (Native-First)

Build the game natively using Flutter and the Flame game engine.

### Tech Stack

- **Framework:** [Flutter](https://flutter.dev/) with [Flame](https://flame-engine.org/) game engine
- **Language:** Dart
- **Offline Support:** Native — no internet required by default
- **State Management:** Riverpod or Bloc for game state
- **Storage:** Hive or SharedPreferences for level progress

### Pros

- **True native performance** — Flutter's Impeller rendering engine delivers smooth 60fps animations
- **Official Casual Games Toolkit** — Flutter provides templates and tooling specifically for puzzle and casual games
- **Proven match-3 implementations** exist (e.g., [Flutter Crush](https://github.com/boeledi/flutter_crush))
- **Offline by default** — native apps don't need service workers or special caching; all assets are bundled
- **App store distribution** is straightforward
- **Single codebase** for iOS, Android, web, and desktop
- **~46% market share** among cross-platform mobile developers in 2026

### Cons

- **Dart learning curve** — the team would need to learn Dart if not already familiar
- **Flame is less mature** than Phaser for 2D game development — fewer examples and smaller community
- **Larger app size** — Flutter apps have a higher baseline size (~15-20MB minimum) compared to a web-wrapped game
- **Web export quality** — while Flutter supports web, the web build is heavier and less optimized than a native web game
- **Slower iteration** — hot reload helps, but web-based game development with Phaser allows faster browser-based iteration and debugging

---

## Option 3: React Native with Custom Canvas (Hybrid)

Build the app shell in React Native with the game rendered on a canvas.

### Tech Stack

- **App Shell:** [React Native](https://reactnative.dev/)
- **Game Rendering:** [react-native-skia](https://shopify.github.io/react-native-skia/) or embedded WebView with Phaser
- **Language:** TypeScript
- **Offline Support:** Native — assets bundled with the app

### Pros

- **Familiar to JavaScript/React developers**
- **Native app shell** with good platform integration
- **Large NPM ecosystem** for non-game features

### Cons

- **Not designed for games** — React Native lacks built-in game loop, tweening, scene management, and sprite handling
- **Complex animation workarounds** — match-3 cascade animations, special item effects, and particle systems would require dropping into native code or using a WebView bridge
- **Two rendering contexts** — mixing React Native UI with a game canvas creates complexity
- **No game-specific toolkit** — everything must be built from scratch or via third-party libraries
- **Worst of both worlds risk** — neither the full native performance of Flutter nor the rapid game development of Phaser

---

## Comparison Matrix

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

---

## Recommendation: PWA with Phaser.js + Capacitor

**Option 1 (PWA + Phaser.js)** is the recommended approach for the following reasons:

### Why Phaser.js

1. **Purpose-built for this exact game type** — Phaser is a 2D game framework with built-in support for everything a match-3 game needs: sprite management, tweening for swap/cascade animations, touch input with swipe detection, audio, and scene management for level transitions.

2. **Fastest path to a playable game** — With Phaser's extensive example library and match-3 being one of the most common game genres, development can move quickly without building foundational game systems from scratch.

3. **TypeScript support** — Aligns with modern development practices and the project's code conventions.

### Why Capacitor for Native Distribution

1. **Wraps the web game as a native app** — The Phaser game runs in a native WebView with access to device APIs (haptics, notifications, local storage).
2. **App store distribution** — Publish to both Apple App Store and Google Play Store.
3. **Maintained by the Ionic team** — Active development, good documentation, and a large community.

### Why Not Flutter

While Flutter has excellent performance and a casual games toolkit, the match-3 game genre is well within the capabilities of web-based rendering (WebGL). The overhead of learning Dart and using the less mature Flame engine doesn't justify the marginal performance gain for a puzzle game that doesn't require physics simulation or complex 3D rendering.

### Recommended Tech Stack Summary

| Layer | Technology |
|---|---|
| **Game Engine** | Phaser 3.80+ |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Offline/PWA** | Workbox (service worker tooling) |
| **Native Wrapper** | Capacitor |
| **Asset Format** | WebP (images), OGG/MP3 (audio), JSON (level data) |
| **State Persistence** | IndexedDB via Capacitor Preferences or localForage |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **CI/CD** | GitHub Actions |

### Project Structure (Proposed)

```
fruit-crush/
  src/
    scenes/          # Phaser scenes (Boot, Menu, Game, LevelComplete)
    objects/          # Game objects (Fruit, Board, SpecialItem)
    utils/            # Helpers (scoring, match detection, cascade logic)
    config/           # Game config, level definitions
    assets/           # Sprites, audio, fonts
  public/
    manifest.json     # PWA manifest
    sw.js             # Service worker (generated by Workbox)
  capacitor/          # Native project files (iOS/Android)
  tests/              # Unit and integration tests
```

### Next Steps

1. Initialize a Phaser 3 + TypeScript + Vite project
2. Implement the core grid and match-3 logic
3. Add touch input (swipe to swap)
4. Build fruit sprites and swap/cascade animations
5. Implement special items (striped, wrapped, rainbow)
6. Add level objectives and progression
7. Configure PWA with service worker for offline support
8. Wrap with Capacitor for native app store builds
9. Test on iOS and Android devices

---

## References

- [Phaser 3 Documentation](https://phaser.io/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Flutter Casual Games Toolkit](https://docs.flutter.dev/resources/games-toolkit)
- [PWA Game Development Guide](https://meliorgames.com/game-development/pwa-game-development-how-to-create-a-progressive-web-game/)
- [PWA iOS Limitations 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Phaser vs PixiJS Comparison](https://aircada.com/blog/pixijs-vs-phaser-3)
- [Flutter Crush (Match-3 in Flutter)](https://github.com/boeledi/flutter_crush)
