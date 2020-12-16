<?php
  require '../../services/authent.php';
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
        <div class="nav-item"><a href="../Register/index.php">Editar perfil</a></div>
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
            <tr>
              <td><strong>4#</strong></td>
              <td><strong>Keyla</strong></td>
              <td>1</td>
              <td>Médio</td>
              <td>0s</td>
            </tr>
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
            <tr>
              <td>1#</td>
              <td>Vitor Prado</td>
              <td>500</td>
              <td>Médio</td>
              <td>56s</td>
            </tr>
            <tr>
              <td>2#</td>
              <td>Vitor Prado</td>
              <td>300</td>
              <td>Médio</td>
              <td>40s</td>
            </tr>
            <tr>
              <td>3#</td>
              <td>Vitor Prado</td>
              <td>100</td>
              <td>Facil</td>
              <td>10s</td>
            </tr>
            <tr>
              <td><strong>4#</strong></td>
              <td><strong>Keyla</strong></td>
              <td>90</td>
              <td>Facil</td>
              <td>9s</td>
            </tr>
            <tr>
              <td>5#</td>
              <td>Maycon Douglas</td>
              <td>80</td>
              <td>Facil</td>
              <td>8s</td>
            </tr>
            <tr>
              <td>6#</td>
              <td>Maycon Douglas</td>
              <td>70</td>
              <td>Facil</td>
              <td>7s</td>
            </tr>
            <tr>
              <td>7#</td>
              <td>Maycon Douglas</td>
              <td>60</td>
              <td>Facil</td>
              <td>6s</td>
            </tr>
            <tr>
              <td>8#</td>
              <td>Maycon Douglas</td>
              <td>50</td>
              <td>Facil</td>
              <td>5s</td>
            </tr>
            <tr>
              <td>9#</td>
              <td>Maycon Douglas</td>
              <td>45</td>
              <td>Facil</td>
              <td>5s</td>
            </tr>
            <tr>
              <td>10#</td>
              <td>Gabriel Hacker</td>
              <td>10</td>
              <td>Facil</td>
              <td>3s</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>
