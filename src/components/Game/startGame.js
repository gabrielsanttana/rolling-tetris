import createGame from './game.js';
import createKeyboardListener from './keyboard-listener.js';
import renderScreen from './render-screen.js';

const screen = document.getElementById('screen');

const game = createGame(200, 50);
game.start();

const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.MoveTetrimino);

const renderScreen = createRenderScreen(screen, game, requestAnimationFrame);

game.subscribe(renderScreen.updateGameStatus);
