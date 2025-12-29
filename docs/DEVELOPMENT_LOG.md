# Cyber Serpent - Project Walkthrough

## Overview
This project is a modernized, high-performance refactor of an 8-bit Snake Game. The codebase has been transformed from a monolithic script into a modular, object-oriented architecture using ES Modules. Major improvements include a Cyberpunk UI overhaul, critical bug fixes for controls, and a complete rewrite of the particle system using Canvas API and Object Pooling for optimal performance.

## Key Changes

### 1. Architecture & Code Quality
- **Modularization**: Split `script.js` into focused modules:
    - `Game.js`: Main controller and loop.
    - `Snake.js`: Snake logic and state.
    - `Renderer.js`: Canvas rendering.
    - `ParticleSystem.js`: Particle effects.
    - `AudioManager.js`: Sound management.
    - `Terminal.js`: UI logging.
    - `Constants.js`: Configuration.
- **Modern JS**: Uses ES6 Classes, Modules, and `requestAnimationFrame` for a smooth game loop.

### 2. Performance Optimization
- **Canvas Particle System**: Replaced the extensive DOM-based particle system (which created thousands of `<div>` elements) with a single full-screen `<canvas>`.
- **Object Pooling**: Implemented an object pool for particles to eliminate garbage collection overhead during intense explosions (e.g., Game Over).
- **Efficient Rendering**: Drawing simplified to canvas primitives, removing heavy CSS calculations for individual particles.

### 3. UI & Theming "Cyber Serpent"
- **Rebranding**: Removed specific "Webflow/GSAP" branding. Replaced with generic "Cyber" and "Neon" themes.
- **Visuals**:
    - **Neon Pink (#FF00FF)** & **Cyan (#00F3FF)** color palette.
    - Generic SVG icons (Bolt & Hexagon) replace branded logos.
    - Grid and CRT effects preserved and enhanced.
- **Accessibility**: Added ARIA labels to all inputs and controls.
- **Responsive**: Grid layout adapts to mobile devices; game canvas scales.

### 4. Bug Fixes
- **Interactive Cat**: The peeping cat sprite is now draggable! You can drag and drop it to any of the four screen borders, and it will snap and re-orient itself to peep from that edge.
- **Controls**: Fixed a critical bug where the snake would not turn vertically/horizontally correctly due to state buffering issues. Logic now correctly synchronizes with the snake's movement tick.
- **Input**: Added full WASD support alongside Arrow keys.
- **Collision Fix**: Resolved an issue where food visuals desynchronized from game state by implementing an explicit state-passing rendering pipeline.
- **Continuous Loop**: Refactored the game loop to run continuously, enabling the interactive "Peeping Cat" to walk and fall even when the game is at the start screen or game over.

## How to Run

Since the project uses ES Modules, it requires a local HTTP server.

1.  **Open Terminal** in the project directory:
    ```bash
    cd "/Users/chinmayharish/Documents/8 b snake"
    ```

2.  **Start Python Server**:
    ```bash
    python3 -m http.server 8000
    ```
    *(If port 8000 is busy, try `python3 -m http.server 8081`)*

3.  **Play**:
    Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

## Verification Checklist

- [x] **Game Loads**: "CYBER SERPENT" title screen appears.
- [x] **Controls Work**: Use Arrow Keys or WASD. Snake turns correctly without "death on turn".
- [x] **Visuals**: Particles (explosions, food spawn) render on the overlay canvas.
- [x] **Performance**: Game remains smooth (60fps) even during massive "Game Over" explosions.
- [x] **Audio**: Sound effects and music toggle work.
- [x] **Collision & Food**: Snake dies correctly at walls (even after resize). Food moves correctly after being eaten.

## Deployment Notes (Vercel)
This project is a standard static specific web application. To deploy on Vercel:
1.  **Repo**: Push code to GitHub.
2.  **Import**: Import the repo in Vercel.
3.  **Config**: No special build commands needed. Vercel automatically detects static HTML/JS.
4.  **Deploy**: Click Deploy.

