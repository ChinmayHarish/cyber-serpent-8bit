import { CONSTANTS } from './Constants.js';

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 1.0;
        this.decay = 0.02;
        this.color = '#FFFFFF';
        this.size = 2;
        this.gravity = 0;
        this.friction = 0.98;
        this.active = false;
        this.shape = 'rect'; // 'rect' or 'circle'
        this.rotation = 0;
        this.angularVelocity = 0;
        this.initialSize = 2;
        this.scaleTarget = 1;
    }
}

export class ParticleSystem {
    constructor(elements, gameState, audioManager) {
        this.canvas = elements.particleCanvas;
        this.ctx = this.canvas.getContext("2d");
        this.gameState = gameState;
        this.audioManager = audioManager;

        this.particles = [];
        this.pool = [];
        this.maxParticles = 800;

        if (this.canvas) {
            this.resize();
            window.addEventListener("resize", () => this.resize());
        }

        // Populate pool
        for (let i = 0; i < 200; i++) {
            this.pool.push(new Particle());
        }
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.particles.forEach(p => { p.active = false; this.pool.push(p); });
        this.particles = [];
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getParticle() {
        let p = this.pool.pop();
        if (!p) {
            p = new Particle();
        } else {
            p.reset();
        }
        return p;
    }

    update() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.vy *= p.friction;

            p.rotation += p.angularVelocity;

            // Life
            p.life -= p.decay;

            if (p.life <= 0) {
                p.active = false;
                this.particles.splice(i, 1);
                this.pool.push(p);
                continue;
            }

            // Draw
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;

            // Allow size scaling
            const currentSize = p.size * (p.life); // Simple shrink

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, currentSize / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
            }

            this.ctx.restore();
        }
        this.ctx.globalAlpha = 1.0;
    }

    // API equivalent to old methods

    createFoodSpawnEffect() {
        const foodCenterX = this.gameState.food.x * this.gameState.gridSize + this.gameState.gridSize / 2;
        const foodCenterY = this.gameState.food.y * this.gameState.gridSize + this.gameState.gridSize / 2;
        const canvasRect = this.elements.gameCanvas.getBoundingClientRect();
        const worldX = canvasRect.left + foodCenterX;
        const worldY = canvasRect.top + foodCenterY;

        const particleColor = this.gameState.food.type === "pixel"
            ? this.gameState.food.color
            : this.gameState.food.type === "gsap" ? "#ffff00" : "#00f3ff";

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const speed = Math.random() * 2 + 1;

            this.createParticle(worldX, worldY, particleColor, {
                velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                gravity: 0.1,
                friction: 0.95
            }, {
                size: 4,
                duration: 0.6
            });
        }
    }

    createEnhancedBurst(x, y, colors, type) {
        const canvasRect = this.elements.gameCanvas.getBoundingClientRect();
        const worldX = canvasRect.left + x;
        const worldY = canvasRect.top + y;

        const count = Math.floor((25 + this.gameState.comboCount * 9) * this.gameState.burstIntensity);

        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 5 + 2) * (1 + this.gameState.comboCount * 0.2);

            this.createParticle(worldX, worldY, color, {
                velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                gravity: type === "gsap" ? 0.3 : 0.2, // Heavier gravity for "gsap" (Neon)
                friction: 0.96,
                angularVelocity: Math.random() * 10 - 5
            }, {
                size: Math.random() * 6 + 2,
                duration: 1.5 + Math.random() * 0.5,
                shape: type === "webflow" ? 'circle' : 'rect'
            });
        }
    }

    createShakeParticles(intensityMultiplier = 1) {
        // Creates particles randomly on screen
        const canvasRect = this.elements.gameCanvas.getBoundingClientRect();
        const count = Math.floor(10 * intensityMultiplier);

        for (let i = 0; i < count; i++) {
            const x = canvasRect.left + Math.random() * canvasRect.width;
            const y = canvasRect.top + Math.random() * canvasRect.height;
            const color = `hsl(${Math.random() * 360}, 100%, 60%)`;

            this.createParticle(x, y, color, {
                velocity: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
                gravity: 0,
                friction: 0.9,
            }, {
                size: Math.random() * 3 + 1,
                duration: 0.5
            });
        }
    }

    disintegrateSnake() {
        const canvasRect = this.elements.gameCanvas.getBoundingClientRect();

        this.gameState.snake.forEach((segment, index) => {
            const worldX = canvasRect.left + segment.x * this.gameState.gridSize + this.gameState.gridSize / 2;
            const worldY = canvasRect.top + segment.y * this.gameState.gridSize + this.gameState.gridSize / 2;

            let color = this.gameState.currentSnakeColor;

            this.createParticle(worldX, worldY, color, {
                velocity: { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
                gravity: 0.2,
                friction: 0.98,
                angularVelocity: Math.random() * 20 - 10
            }, {
                size: this.gameState.gridSize * 0.8,
                duration: 1.5,
                delay: index * 0.05 // Delay handled by setting life > 1 or timeout? 
                // Timeout is easier but blocks the thread less if we just spawn them all now with different velocities?
                // Or just spawn them all now, it looks cool.
            });
        });
    }

    // Generic create method to replace _createDOMParticle
    createParticle(x, y, color, physics, options) {
        if (this.particles.length >= this.maxParticles) return;

        const p = this.getParticle();
        p.active = true;
        p.x = x;
        p.y = y;
        p.color = color;

        // velocity can be object {x,y} or number? 
        // Game.js passes "velocity" number and "angle".
        // My implementation above generates x/y components.
        // If passed generic 'physics' object from Game.js (legacy), adapt it.

        if (typeof physics.velocity === 'number') {
            const angleRad = (physics.angle || 0) * (Math.PI / 180);
            p.vx = Math.cos(angleRad) * physics.velocity * 0.016; // Adjust for pixels/frame
            p.vy = Math.sin(angleRad) * physics.velocity * 0.016;
            p.gravity = (physics.gravity || 0) * 0.001;
            p.friction = 1 - (physics.friction || 0); // DOM friction was small number to sub? or mult?
            // DOM code used physics2D plugin. Friction 0.02 usually meant 1-0.02? Or 0.98?
            // Let's assume friction is dampening factor.
            p.friction = 0.96;
            p.angularVelocity = (physics.angularVelocity || 0);
        } else {
            p.vx = physics.velocity.x;
            p.vy = physics.velocity.y;
            p.gravity = physics.gravity || 0;
            p.friction = physics.friction || 0.98;
            p.angularVelocity = physics.angularVelocity || 0;
        }

        // Options adaptation
        // options.width -> size (parse px?)
        if (typeof options.width === 'string') p.size = parseFloat(options.width);
        else p.size = options.size || 2;

        p.life = 1.0;
        p.decay = 1 / ((options.duration || 1.0) * 60);
        p.shape = options.shape || 'rect';

        this.particles.push(p);
    }
}
