# Cyber Serpent 🐍

![Cyber Serpent Preview](https://github.com/user-attachments/assets/placeholder)

> A high-performance, cyberpunk-themed modernization of the classic 8-bit Snake game, built with Vanilla JavaScript and HTML5 Canvas.

## ✨ Features

*   **High Performance**: Custom WebCanvas renderer running at a smooth 60 FPS.
*   **Object Pooling**: Zero-garbage collection particle system for massive explosions without lag.
*   **Cyberpunk Aesthetics**: Neon visual style, CRT glitch effects, and dynamic coloring.
*   **Interactive Sprite**: Features a draggable, gravity-aware "Peeping Cat" that watches your gameplay.
*   **Responsive**: Fully playable on Desktop (WASD/Arrows) and Mobile (Touch/Grid auto-scale).
*   **Audio**: Integrated synthesizer sound effects and background ambience.

## 🛠️ Tech Stack

*   **Core**: HTML5, CSS3, Vanilla JavaScript (ES Modules).
*   **Rendering**: HTML5 Canvas API (2D Context).
*   **Animation**: GSAP (GreenSock Animation Platform) for UI transitions.
*   **Fonts**: 'Press Start 2P' (Google Fonts).

## 🚀 Getting Started

### Local Development

Since this project uses ES Modules, it requires a local HTTP server to run (browsers block file:// access to modules for security).

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/chinmay-harish/cyber-serpent.git
    cd cyber-serpent
    ```

2.  **Start a local server**:
    *   **Python 3**:
        ```bash
        python3 -m http.server 8000
        ```
    *   **Node.js (http-server)**:
        ```bash
        npx http-server .
        ```

3.  **Play**:
    Open `http://localhost:8000` in your browser.

## 🎮 Controls

*   **WASD / Arrow Keys**: Move Snake.
*   **On-Screen D-Pad**: Tap ▲ ▼ ◀ ▶ (Mobile Only).
*   **Touch Swipe**: Swipe anywhere on screen.
*   **Mouse Drag**: Pick up and throw the Cat sprite.
*   **Space**: Pause / Resume.

## 🚀 Live Demo

**Play Now**: [https://cyber-serpent-8bit.vercel.app](https://cyber-serpent-8bit.vercel.app)

## 📦 Deployment

This is a static web application. It can be deployed instantly on Vercel, Netlify, or GitHub Pages.

**Vercel / Netlify**:
1.  Import this repository.
2.  Deploy (No build command required).

## 📖 Documentation

*   [Development Log & Walkthrough](docs/DEVELOPMENT_LOG.md) - Detailed breakdown of architecture, changes, and debugging.


## 👨‍💻 Author

RModernized by **Chinmay Harish**.
