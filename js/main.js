import { Game } from './Game.js';

let gameInstance;

window.onload = () => {
    gameInstance = new Game();
    gameInstance.initLoading();
};
