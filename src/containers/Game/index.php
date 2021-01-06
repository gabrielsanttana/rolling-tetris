<?php
  require_once '../../services/authentication.php';
  require_once '../../services/dao/GameLogDAO.php';
  require_once '../../services/dao/PlayerDAO.php';
  require_once '../../services/models/GameLog.php';
  require_once '../../services/models/Player.php';
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <link rel="stylesheet" href="../../globalStyles.css" />
  <link rel="stylesheet" href="./styles.css" />
  <title>Rolling Tetris</title>
</head>

<body>
  <header>
    <img src="../../images/tetris-logo.png" alt="Tetris" />

    <h1>Rolling Tetris</h1>

    <nav>
      <div class="nav-item">
        <a href="../Edit/index.php">Editar perfil</a>
      </div>
      <div class="nav-item">
        <a href="../Ranking/index.php">Ranking global</a>
      </div>
      <div class="nav-item"><a href="../../services/logout.php">Sair</a></div>
    </nav>
  </header>

  <main>
    <section id="gameSection">
      <header>
        <div>
          <div>
            <strong>Tempo de partida: </strong><span id="gameTime">0s</span>
          </div>

          <div>
            <strong>Pontuação: </strong><span id="currentScore">0</span>
          </div>

          <div>
            <strong>Linhas eliminadas: </strong><span id="clearedLines">0</span>
          </div>

          <div>
            <strong>Dificuldade: </strong><span id="difficulty">Fácil</span>
          </div>
        </div>
      </header>

      <div id="boardSizeChooser">
        <div class="inputRadioBlock">
          <input type="radio" id="smallBoard" name="boardSize" value="small" checked />
          <label for="smallBoard">Pequeno</label>
        </div>

        <div class="inputRadioBlock">
          <input type="radio" id="bigBoard" name="boardSize" value="big" />
          <label for="bigBoard">Grande</label>
        </div>

        <p>Pressione Z para rotacionar as peças</p>
      </div>

      <div class="gameContainer">
        <canvas id="screen"></canvas>
      </div>

      <footer>
        <button type="button" id="startGameButton">Iniciar</button>
      </footer>
    </section>

    <section id="tableSection">
      <table>
        <thead>
          <tr>
            <th>Jogador</th>
            <th>Pontuação</th>
            <th>Nível atingido</th>
            <th>Duração</th>
          </tr>
        </thead>

        <tbody>
          <?php
              $user = unserialize($_SESSION['user']);
              $user_id = $user->getId();
              $user_name = $user->getName();
              $gameLogArray = GameLogDAO::getGameLogByUserId($user_id);

              foreach($gameLogArray as $gameLog){
                $score = $gameLog->getScore();
                $difficulty = $gameLog->getDifficultyFormatted();
                $game_time_seconds = $gameLog->getGameTimeSecondFormatted();
                echo "<tr>";
                echo "  <td>$user_name</td>";
                echo "  <td>$score</td>";
                echo "  <td>$difficulty</td>";
                echo "  <td>$game_time_seconds</td>";
                echo "</tr>";
              }
            ?>
        </tbody>
      </table>
    </section>
  </main>

  <script type="module">
  import createGame from '../../components/Game/index.js';
  import createKeyboardListener from '../../components/Game/keyboardListener.js';
  import createRenderScreen from '../../components/Game/renderScreen.js';

  const screen = document.getElementById('screen');
  const gameTime = document.getElementById('gameTime');
  const currentScore = document.getElementById('currentScore');
  const clearedLines = document.getElementById('clearedLines');
  const difficulty = document.getElementById('difficulty');

  const smallBoardRadio = document.getElementById('smallBoard');
  const bigBoardRadio = document.getElementById('bigBoard');
  const boardSizeChooser = document.getElementById('boardSizeChooser');
  const startGameButton = document.getElementById('startGameButton');

  const board = {
    small: {
      height: 20,
      width: 10
    },
    big: {
      height: 44,
      width: 22
    }
  };

  const game = createGame(board.small.height, board.small.width);
  screen.height = board.small.height;
  screen.width = board.small.width;

  const keyboardListener = createKeyboardListener(document);
  keyboardListener.subscribe(game.moveTetrimino);

  const renderScreen = createRenderScreen(
    screen,
    game,
    requestAnimationFrame,
    currentScore,
    clearedLines,
    difficulty,
    gameTime,
    boardSizeChooser,
    startGameButton
  );

  game.subscribe(renderScreen.updateGameStatus);

  startGameButton.addEventListener('click', () => {
    game.start();
  });
  smallBoardRadio.addEventListener('click', () => {
    screen.classList.remove('bigBoard');
    screen.classList.add('smallBoard');
    screen.height = board.small.height;
    screen.width = board.small.width;
    game.setBoardSize(board.small.height, board.small.width);
  });
  bigBoardRadio.addEventListener('click', () => {
    screen.classList.remove('smallBoard');
    screen.classList.add('bigBoard');
    screen.height = board.big.height;
    screen.width = board.big.width;
    game.setBoardSize(board.big.height, board.big.width);
  });
  </script>
</body>

</html>