export default function createRenderScreen(
  screen,
  game,
  requestAnimationFrame,
  currentScore,
  clearedLines,
  difficulty,
  gameTime,
  boardSizeChooser,
  startGameButton,
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

  if (game.state.hasGameStarted) {
    boardSizeChooser.hidden = true;
  } else {
    boardSizeChooser.hidden = false;
  }

  function updateGameStatus(command) {
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
          difficulty.innerHTML = game.getLevelDifficulty();
          break;
        case 'time':
          gameTime.innerHTML = `${game.state.time}s`;
          break;
        case 'restartGameState':
          currentScore.innerHTML = game.state.score;
          clearedLines.innerHTML = game.state.total_cleared_lines_count;
          difficulty.innerHTML = game.getLevelDifficulty();
          gameTime.innerHTML = `${game.state.time}s`;
          startGameButton.innerHTML = 'Iniciar';
          break;
        case 'startGame':
          startGameButton.innerHTML = 'Encerrar';
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
      gameTime,
      boardSizeChooser,
      startGameButton,
    );
  });

  return {
    updateGameStatus,
  };
}
