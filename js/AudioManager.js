export class AudioManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.audioContext = null;
        this.sfxNodes = {};
        this.audioBuffers = {};

        this.elements = {
            backgroundMusic: document.getElementById("background-music"),
            eatSound: document.getElementById("eat-sound"),
            gameOverSound: document.getElementById("game-over-sound"),
            levelUpSound: document.getElementById("level-up-sound"),
            meteorSound: document.getElementById("meteor-sound"),
            explosionSound: document.getElementById("explosion-sound"),
            gsapSound: document.getElementById("gsap-sound"),
            webflowSound: document.getElementById("webflow-sound")
        };

        this.init = this.init.bind(this);
        this.setupListeners();
    }

    setupListeners() {
        document.body.addEventListener("click", this.init, { once: true });
        document.body.addEventListener("keydown", this.init, { once: true });
        // Touch listener should be added to canvas in Game class or here if we access it
    }

    init() {
        if (!this.audioContext && (window.AudioContext || window.webkitAudioContext)) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext && this.audioContext.state === "suspended") {
            this.audioContext
                .resume()
                .catch((e) => console.warn("AudioContext resume failed:", e));
        }
        this.preloadAllAudio();
    }

    async preloadAudioBuffer(audioElement) {
        if (
            !this.audioContext ||
            !audioElement ||
            !audioElement.src ||
            this.audioBuffers[audioElement.src]
        ) {
            return;
        }
        try {
            const response = await fetch(audioElement.src);
            const arrayBuffer = await response.arrayBuffer();
            const decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBuffers[audioElement.src] = decodedBuffer;
        } catch (e) {
            console.error(`Error preloading audio ${audioElement.src}: ${e}`);
        }
    }

    preloadAllAudio() {
        if (!this.audioContext || this.audioContext.state !== "running") {
            return;
        }
        const soundsToPreload = [
            this.elements.eatSound,
            this.elements.explosionSound,
            this.elements.gameOverSound,
            this.elements.levelUpSound,
            this.elements.gsapSound,
            this.elements.webflowSound
        ];
        soundsToPreload.forEach((el) => this.preloadAudioBuffer(el));
    }

    playSoundWithPitch(audioElement, relativeVolume = 1.0, pitchMin = 0.9, pitchMax = 1.1) {
        if (!this.gameState.audioEnabled || !audioElement) return;

        if (this.audioContext && this.audioContext.state === "suspended") {
            this.audioContext
                .resume()
                .catch((e) => console.warn("AudioContext resume failed during play:", e));
        }

        const isWebAudioReady =
            this.audioContext &&
            this.audioContext.state === "running" &&
            this.audioBuffers[audioElement.src];

        if (!isWebAudioReady) {
            if (audioElement.play) {
                audioElement.currentTime = 0;
                audioElement.volume = relativeVolume * this.gameState.sfxVolume;
                audioElement
                    .play()
                    .catch((e) =>
                        console.warn(`HTMLAudio fallback play error (${audioElement.id}):`, e)
                    );
            }
            return;
        }

        if (this.sfxNodes[audioElement.id]) {
            try {
                this.sfxNodes[audioElement.id].stop();
                this.sfxNodes[audioElement.id].disconnect();
            } catch (e) { }
            delete this.sfxNodes[audioElement.id];
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = this.audioBuffers[audioElement.src];
        gainNode.gain.value = relativeVolume * this.gameState.sfxVolume;
        source.playbackRate.value = Math.random() * (pitchMax - pitchMin) + pitchMin;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        try {
            source.start(0);
            this.sfxNodes[audioElement.id] = source;
            source.onended = () => {
                if (this.sfxNodes[audioElement.id] === source)
                    delete this.sfxNodes[audioElement.id];
                try {
                    source.disconnect();
                    gainNode.disconnect();
                } catch (e) { }
            };
        } catch (e) {
            console.error(`Error starting Web Audio source (${audioElement.id}):`, e);
            if (audioElement.play) {
                audioElement.currentTime = 0;
                audioElement.volume = relativeVolume * this.gameState.sfxVolume;
                audioElement
                    .play()
                    .catch((playError) =>
                        console.warn(
                            `HTMLAudio ultimate fallback error (${audioElement.id}):`,
                            playError
                        )
                    );
            }
        }
    }

    toggleMusic(enabled) {
        if (enabled) {
            if (this.audioContext && this.audioContext.state === "suspended")
                this.audioContext.resume().catch(e => console.warn(e));

            this.elements.backgroundMusic.volume = this.gameState.musicVolume;
            this.elements.backgroundMusic.play().catch(e => console.warn(e));
        } else {
            this.elements.backgroundMusic.pause();
            Object.values(this.sfxNodes).forEach((node) => {
                try {
                    node.stop();
                    node.disconnect();
                } catch (e) { }
            });
            this.sfxNodes = {};
        }
    }

    setMusicVolume(volume) {
        this.elements.backgroundMusic.volume = volume;
    }
}
