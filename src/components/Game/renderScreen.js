export default function renderScreen(screen, game, requestAnimationFrame) {
  const context = screen.getContext('2d');
  context.fillStyle = 'white';
  context.clearRect(0, 0, game.state.width, game.state.height);

  for (const tetriminoId in game.state.tetriminos) {
    game.state.tetriminos[tetriminoId].blocks.forEach(block => {
      context.fillStyle = game.state.tetriminos[tetriminoId].color;
      context.fillRect(block.x, block.y, 1, 1);
    });
  }

  if (game.state.is_upsidedown) {
    screen.style = 'transform: rotate(180deg)';
  } else {
    screen.style = 'transform: rotate(0deg)';
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame);
  });
}
