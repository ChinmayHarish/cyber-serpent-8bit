import { CONSTANTS } from './Constants.js';

export class Renderer {
    constructor(elements, gameState) {
        this.elements = elements;
        this.gameState = gameState;
        this.ctx = elements.gameCanvas.getContext("2d");
        this.gsapLogoImg = null;
        this.webflowLogoImg = null;
        this.gsapPixelArtSrc = null; // Used for cat throwing
        this.webflowPixelArtSrc = null;
        this.PIXEL_ART_SIZE = CONSTANTS.PIXEL_ART_SIZE;
    }

    init() {
        this.initializeLogos();
        this.createPixelRevealGrid();
        this.updateGridOverlay();
    }

    createImageFromSVG(svgString, type, callback) {
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);

            const offscreenCanvas = document.createElement("canvas");
            offscreenCanvas.width = this.PIXEL_ART_SIZE;
            offscreenCanvas.height = this.PIXEL_ART_SIZE;
            const offCtx = offscreenCanvas.getContext("2d");
            offCtx.imageSmoothingEnabled = false;
            offCtx.drawImage(img, 0, 0, this.PIXEL_ART_SIZE, this.PIXEL_ART_SIZE);
            const pixelatedDataURL = offscreenCanvas.toDataURL();

            if (type === "gsap") {
                this.gsapLogoImg = img;
                this.gsapPixelArtSrc = pixelatedDataURL;
            } else if (type === "webflow") {
                this.webflowLogoImg = img;
                this.webflowPixelArtSrc = pixelatedDataURL;
            }
            if (callback) callback(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error(`Failed to load SVG logo: ${type}`);
            if (callback) callback(null);
        };
        img.src = url;
    }

    initializeLogos() {
        // Neon Core (Pink Bolt)
        const neonSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2L6 18H16V30L28 14H18V2Z" fill="#ffff00"/></svg>`;
        // Cyber Node (Cyan Hexagon)
        const cyberSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4L26 10V22L16 28L6 22V10L16 4Z" fill="#00f3ff"/></svg>`;

        this.createImageFromSVG(neonSVG, "gsap"); // Mapped to 'gsap' key for compatibility
        this.createImageFromSVG(cyberSVG, "webflow"); // Mapped to 'webflow' key for compatibility
    }

    createPixelRevealGrid() {
        if (!this.elements.pixelRevealContainer) return;
        this.elements.pixelRevealContainer.innerHTML = "";
        const { innerWidth, innerHeight } = window;
        const blockSize = innerHeight * 0.1;
        const numRows = 10;
        const numCols = Math.ceil(innerWidth / blockSize);
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement("div");
            row.className = "pixel-reveal-row";
            for (let j = 0; j < numCols; j++) {
                const block = document.createElement("div");
                block.className = "pixel-reveal-block";
                block.style.opacity = "1";
                row.appendChild(block);
            }
            this.elements.pixelRevealContainer.appendChild(row);
        }
    }

    animatePixelReveal() {
        // Need gsap globally available
        const rows = document.querySelectorAll(".pixel-reveal-row");
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(this.elements.pixelRevealContainer, {
                    autoAlpha: 0,
                    duration: 0.5,
                    onComplete: () => (this.elements.pixelRevealContainer.style.display = "none")
                });
            }
        });
        const rowBlocks = [];
        rows.forEach((row) => {
            rowBlocks.push(Array.from(row.querySelectorAll(".pixel-reveal-block")));
        });
        rowBlocks.forEach((blocks, rowIndex) => {
            const shuffle = (array) => {
                let currentIndex = array.length, randomIndex;
                while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
                }
                return array;
            };
            const shuffledBlocks = shuffle([...blocks]);
            shuffledBlocks.forEach((block, blockIndex) => {
                tl.to(
                    block,
                    {
                        opacity: 0,
                        duration: 0.1,
                        delay: 0.02 * (rowIndex + blockIndex),
                        ease: "power1.out"
                    },
                    0
                );
            });
        });
        return tl;
    }

    updateGridOverlay() {
        if (!this.elements.gridOverlay) return;
        const gameCanvasRect = this.elements.gameCanvas.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        Object.assign(this.elements.gridOverlay.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundSize: `${this.gameState.gridSize}px ${this.gameState.gridSize}px`,
            backgroundPosition: `${gameCanvasRect.left - bodyRect.left}px ${gameCanvasRect.top - bodyRect.top
                }px`
        });
    }

    draw(externalState) {
        const state = externalState || this.gameState;
        const { width, height } = this.elements.gameCanvas;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.strokeStyle = "rgba(79, 156, 255, 0.3)";
        this.ctx.lineWidth = 1;

        // Draw Grid
        for (let i = 0; i <= state.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * state.gridSize, 0);
            this.ctx.lineTo(i * state.gridSize, height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * state.gridSize);
            this.ctx.lineTo(width, i * state.gridSize);
            this.ctx.stroke();
        }

        // Draw Food
        const food = state.food;
        const foodX = food.x * state.gridSize;
        const foodY = food.y * state.gridSize;

        if (food.type === "gsap" && this.gsapLogoImg) {
            this.ctx.drawImage(this.gsapLogoImg, foodX, foodY, state.gridSize, state.gridSize);
        } else if (food.type === "webflow" && this.webflowLogoImg) {
            this.ctx.drawImage(this.webflowLogoImg, foodX, foodY, state.gridSize, state.gridSize);
        } else {
            this.ctx.fillStyle = food.color || this.getRandomBrightColor();
            this.ctx.fillRect(foodX, foodY, state.gridSize, state.gridSize);
        }

        if (state.snakeDisintegrating) return;

        // Draw Snake
        state.snake.forEach((segment, i) => {
            const alpha = i === 0 ? 1 : Math.max(0.4, 1 - i * 0.04);
            const segmentX = segment.x * state.gridSize;
            const segmentY = segment.y * state.gridSize;

            let fillStyleColor = state.currentSnakeColor;
            if (i !== 0) {
                this.ctx.globalAlpha = alpha;
            } else {
                this.ctx.globalAlpha = 1.0;
            }

            this.ctx.fillStyle = fillStyleColor;
            this.ctx.fillRect(segmentX, segmentY, state.gridSize, state.gridSize);
            this.ctx.globalAlpha = 1.0;

            if (i === 0) this.drawSnakeHead(segmentX, segmentY, state);
        });
    }

    drawRoundedRect(x, y, width, height, radius, color) {
        // Deprecated but kept if needed for other UI, though unused now for snake
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawSnakeHead(segmentX, segmentY, state) {
        state = state || this.gameState;
        this.ctx.fillStyle = "#ffffff";
        const eyeSizeBase = Math.max(2.5, state.gridSize / 7.5);
        const time = Date.now() * 0.008;
        const blinkAmount = Math.sin(time * 0.5) > 0.9 ? 0.2 : 1;
        const eyeHeight = eyeSizeBase * blinkAmount;
        let eyeWidth = eyeSizeBase;

        const eyeOffsetFactor = 0.25;
        const gridSize = state.gridSize;

        const eyePositions = {
            right: [
                segmentX + gridSize - eyeWidth - gridSize * eyeOffsetFactor,
                segmentY + gridSize * eyeOffsetFactor,
                segmentX + gridSize - eyeWidth - gridSize * eyeOffsetFactor,
                segmentY + gridSize - eyeHeight - gridSize * eyeOffsetFactor
            ],
            left: [
                segmentX + gridSize * eyeOffsetFactor,
                segmentY + gridSize * eyeOffsetFactor,
                segmentX + gridSize * eyeOffsetFactor,
                segmentY + gridSize - eyeHeight - gridSize * eyeOffsetFactor
            ],
            up: [
                segmentX + gridSize * eyeOffsetFactor,
                segmentY + gridSize * eyeOffsetFactor,
                segmentX + gridSize - eyeWidth - gridSize * eyeOffsetFactor,
                segmentY + gridSize * eyeOffsetFactor
            ],
            down: [
                segmentX + gridSize * eyeOffsetFactor,
                segmentY + gridSize - eyeHeight - gridSize * eyeOffsetFactor,
                segmentX + gridSize - eyeWidth - gridSize * eyeOffsetFactor,
                segmentY + gridSize - eyeHeight - gridSize * eyeOffsetFactor
            ]
        };
        const [x1, y1, x2, y2] = eyePositions[state.direction] || eyePositions.right;
        if (x1 !== undefined) {
            this.ctx.fillRect(x1, y1, eyeWidth, eyeHeight);
            this.ctx.fillRect(x2, y2, eyeWidth, eyeHeight);
        }
    }

    getRandomBrightColor() {
        const pixelColors = ["#FFFF00", "#40E0D0", "#FFFFFF", "#FF8000", "#32CD32"];
        return pixelColors[Math.floor(Math.random() * pixelColors.length)];
    }
}
