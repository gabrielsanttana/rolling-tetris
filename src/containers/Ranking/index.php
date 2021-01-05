<?php
  require_once '../../services/authent.php';
  require_once '../../services/dao/GameLogDAO.php';
  require_once '../../services/dao/PlayerDAO.php';
  require_once '../../services/models/GameLog.php';
  require_once '../../services/models/Player.php';

  
  $user = unserialize($_SESSION['user']);
  $user_id = $user->getId();
  $user_name = $user->getName();

  $page = 0;
  if(isset($_GET['page'])){
    $page = $_GET['page'];
  }

  $gameLogArray = GameLogDAO::getGameLogPagination($page,6);

  $isLastPage = false;
  if(count($gameLogArray) <6){
    $isLastPage = true;
  }

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
        <div class="nav-item"><a href="../Edit/index.php">Editar perfil</a></div>
        <div class="nav-item">
          <a href="../Game/index.php">Game</a>
        </div>
        <div class="nav-item"><a href="../../services/logout.php">Sair</a></div>
      </nav>
    </header>

    <main>
      <section id="tableSection">
        <h2>Meu ranking:</h2>
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Jogador</th>
              <th>Pontuação</th>
              <th>Nível atingido</th>
              <th>Duração</th>
            </tr>
          </thead>

          <tbody>
            
            <?php
                $gameLog = GameLogDAO::getBestGameLogByUserId($user_id);

                if($gameLog != null){
                    $rank = $gameLog->getRank();
                    $score = $gameLog->getScore();
                    $difficulty = $gameLog->getDifficultyFormatted();
                    $game_time_seconds = $gameLog->getGameTimeSecondFormatted();
                    echo "<tr>";
                    echo "  <td><strong>$rank#</strong></td>";
                    echo "  <td><strong>$user_name</strong></td>";
                    echo "  <td>$score</td>";
                    echo "  <td>$difficulty</td>";
                    echo "  <td>$game_time_seconds</td>";
                    echo "</tr>";
                }
            ?>
          </tbody>
        </table>
        <h2>Ranking global:</h2>
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Jogador</th>
              <th>Pontuação</th>
              <th>Nível atingido</th>
              <th>Duração</th>
            </tr>
          </thead>

          <tbody>
            <?php
                foreach($gameLogArray as $gameLog){
                  $rank = $gameLog->getRank();
                  $score = $gameLog->getScore();
                  $difficulty = $gameLog->getDifficultyFormatted();
                  $game_time_seconds = $gameLog->getGameTimeSecondFormatted();
                  $player_name = PlayerDAO::getPlayerById($gameLog->getUserId())->getName();
                  echo "<tr>";
                  echo "  <td>$rank#</td>";
                  echo "  <td>$player_name</td>";
                  echo "  <td>$score</td>";
                  echo "  <td>$difficulty</td>";
                  echo "  <td>$game_time_seconds</td>";
                  echo "</tr>";
                }
            ?>
          </tbody>
        </table>

        <!-- PAGINAÇÃO -->
        <div id="paginator">
          <div id="lastPage">
            <?php
            if($page > 0)
              echo "<a href='index.php?page=" . ($page-1) . "'>Página anterior</a>";
            ?>
          </div>
          <div id="nextPage">
            <?php
              if(!$isLastPage)
                echo "<a href='index.php?page=" . ($page+1) . "'>Próxima Página</a>";
            ?>
          </div>
        </div>
        <!-- FIM DA PAGINAÇÃO-->
      </section>

      
      

    </main>
  </body>
</html>
