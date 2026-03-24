# Fruit Crushed Ice - Game Research

## Overview

**Game name:** Fruit Crushed Ice (水果碎碎冰)
**Reference URL:** https://g.fromgame.com/game/539/
**Genre:** Match-3 puzzle game
**Engine:** Cocos2D-JS (HTML5 web game)
**Platform:** Browser-based, works on mobile and desktop

Fruit Crushed Ice is a classic match-3 puzzle game where players swap adjacent fruits on a grid to create lines of three or more matching fruits. Matched fruits are cleared from the board, new fruits fall in from above, and the player works to complete level objectives within a limited number of moves.

---

## Goal of the Game

The player must complete level-specific objectives (e.g., reach a target score, clear ice tiles, collect specific fruits) within a limited number of moves. Levels increase in difficulty as the player progresses.

---

## Core Gameplay Mechanics

### Grid Layout

- The game board is a grid (typically 7x7 or 8x8) filled with different types of fruits.
- Fruits are randomly generated and fall from the top to fill empty spaces.

### Player Actions

1. **Swap** - The player taps/clicks a fruit and swaps it with an adjacent fruit (up, down, left, or right). The swap is only valid if it results in a match of 3 or more identical fruits in a row or column.
2. **Activate special items** - Tap or swap special items created from combos to trigger their effects.
3. **Use boosters** - Pre-game or in-game boosters can be used to help clear difficult levels.

### Matching Rules

- A valid match requires **3 or more** identical fruits aligned horizontally or vertically.
- Matched fruits are removed from the board and the player earns points.
- Fruits above the cleared area fall down to fill gaps, and new fruits generate from the top.
- **Cascade/chain reactions** occur when falling fruits create new matches automatically, earning bonus points.

---

## Scoring System

- **Basic match (3 fruits):** Base points awarded per fruit cleared.
- **Larger matches (4+ fruits):** Bonus points multiplier for bigger matches.
- **Chain reactions/cascades:** Each successive cascade in a chain earns increasingly higher point multipliers.
- **Special item activations:** Clearing fruits with special items awards bonus points.
- **Moves remaining:** Unused moves at the end of a level are converted to bonus points.
- **Star rating:** Each level awards 1-3 stars based on the score achieved. Higher star ratings unlock better rewards.

---

## Special Items and Power-ups

Special items are created by making matches larger than 3 fruits or in specific shapes:

| Match Type | Shape | Special Item Created | Effect |
|---|---|---|---|
| **3-match** | Straight line | None (basic clear) | Clears the matched fruits |
| **4-match** | Straight line | **Striped Fruit** | Clears an entire row or column depending on match direction |
| **5-match** | L-shape | **Wrapped Fruit (Bomb)** | Explodes in a 3x3 area around it |
| **5-match** | T-shape | **Wrapped Fruit (Bomb)** | Explodes in a 3x3 area around it |
| **5-match** | Straight line | **Rainbow Fruit** | Clears ALL fruits of one chosen color from the board |

### Combining Special Items

Swapping two special items together creates powerful combo effects:

| Combination | Effect |
|---|---|
| Striped + Striped | Clears both a full row and a full column |
| Wrapped + Wrapped | Large explosion (5x5 area) |
| Striped + Wrapped | Clears 3 rows and 3 columns in a cross pattern |
| Rainbow + any fruit | Clears all fruits of that color |
| Rainbow + Striped | Turns all fruits of one color into striped fruits, then activates them |
| Rainbow + Wrapped | Turns all fruits of one color into wrapped fruits, then activates them |
| Rainbow + Rainbow | Clears the entire board |

### Boosters (Pre-game / In-game Tools)

Typical boosters available in this genre include:

- **Shovel/Hand** - Remove a single fruit or obstacle from the board.
- **Bomb** - Explode a targeted area of the board.
- **Shuffle** - Rearrange all fruits on the board randomly.
- **Extra moves** - Add additional moves to the current level.

---

## Level Objectives

Levels can have various objective types:

1. **Score target** - Reach a minimum score within the move limit.
2. **Clear ice/frost** - Fruits are trapped under ice layers. Match fruits on top of ice tiles to break the ice. Some ice has multiple layers requiring multiple matches.
3. **Collect specific fruits** - Gather a required number of specific fruit types.
4. **Drop ingredients** - Move special items (e.g., cherries, hazelnuts) to the bottom of the board by clearing fruits beneath them.
5. **Clear obstacles** - Remove blockers such as ice blocks, chains, or stones that occupy board spaces.

---

## Win and Loss Conditions

### Win Condition
- Complete all level objectives within the allotted number of moves.
- Remaining moves are converted to bonus points (random special items activate on the board).

### Loss Condition
- Run out of moves before completing the level objectives.
- The player can then choose to retry the level or use boosters/extra moves to continue.

---

## Obstacles and Challenges

As levels progress, various obstacles are introduced:

- **Ice tiles** - Fruits sit on top of ice that must be broken by matching on those tiles. Can have 1-3 layers.
- **Stone blocks** - Immovable blocks that take up grid space and cannot be matched.
- **Chains/locks** - Fruits are locked in place and cannot be swapped until the chain is broken by matching adjacent fruits.
- **Chocolate/spreading blockers** - Obstacles that spread to adjacent tiles each turn if not cleared.
- **Licorice/barriers** - Block connections between adjacent fruits.

---

## Fruits Used

Common fruit types in the game (typically 5-6 varieties per level):

- Apple (red)
- Orange (orange)
- Grape (purple)
- Lemon (yellow)
- Watermelon (green)
- Blueberry (blue)
- Cherry (pink/red)
- Kiwi (green)

The number of fruit types per level affects difficulty - fewer types make matching easier, more types make it harder.

---

## Mobile Considerations

Since the goal is to recreate this for mobile devices:

- **Touch input:** Swipe gestures to swap fruits (swipe direction determines swap direction).
- **Screen orientation:** Portrait mode is standard for match-3 games on mobile.
- **Responsive grid:** Grid should scale to fit various screen sizes while keeping fruits easily tappable (minimum ~44px touch targets).
- **Animations:** Satisfying animations for matches, cascades, and special item activations are key to engagement.
- **Sound effects:** Audio feedback for matches, combos, and level completion enhances the experience.
- **No ads:** A core requirement - the game should be ad-free for a clean parent-friendly experience.
- **Offline play:** The game should work without an internet connection.

---

## Summary

Fruit Crushed Ice follows the well-established match-3 puzzle formula. The core loop is: swap fruits to make matches, create special items from larger matches, use special items strategically to clear obstacles and complete objectives, and progress through increasingly challenging levels. The combination of simple mechanics with deepening strategic complexity is what makes this genre compelling and replayable.
