export default function createRenderScreen(
  screen,
  game,
  requestAnimationFrame,
  currentScore,
  clearedLines,
  difficulty,
) {
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

  function updateGameStatus(command) {
    console.log('updateGameStatus : ');
    console.log(command);
    const command_type = command.type;
    if (command_type === 'update-status-game') {
      const status_changed = command.status_changed;
      switch (status_changed) {
        case 'score':
          currentScore.innerHTML = game.state.score;
          break;
        case 'total_cleared_lines_count':
          clearedLines.innerHTML = game.state.total_cleared_lines_count;
          break;
        case 'time_round':
          difficulty.innerHTML = game.state.time_round;
          break;
      }
    }
  }

  requestAnimationFrame(() => {
    createRenderScreen(
      screen,
      game,
      requestAnimationFrame,
      currentScore,
      clearedLines,
      difficulty,
    );
  });

  return {
    updateGameStatus,
  };
}
