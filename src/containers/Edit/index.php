<?php
  require_once '../../services/authentication.php';
  require_once '../../services/dao/GameLogDAO.php';
  require_once '../../services/dao/PlayerDAO.php';
  require_once '../../services/models/GameLog.php';
  require_once '../../services/models/Player.php';

  $user = unserialize($_SESSION['user']);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <a href="../Ranking/index.php">Ranking global</a>
      </div>
      <div class="nav-item">
        <a href="../Game/index.php">Game</a>
      </div>
      <div class="nav-item"><a href="../../services/logout.php">Sair</a></div>
    </nav>
  </header>

  <section class="editWrapper">
    <form action="../../services/api.php" method="POST">
      <input id="method" name="method" type="text" hidden value="editPlayer" />

      <label for="name">Nome completo</label>
      <input type="text" name="name" id="name" placeholder="Digite seu nome completo" value="<?php 
            echo $user->getName();
          ?>" autofocus />

      <label for="birthdate">Data de nascimento</label>
      <input type="text" value="<?php 
            echo $user->getBirthdate();
          ?>" disabled />

      <label for="cpf">CPF</label>
      <input type="text" value="<?php 
            echo $user->getCpf();
          ?>" disabled />

      <label for="phoneNumber">Telefone</label>
      <input type="text" name="phoneNumber" id="phoneNumber" placeholder="Digite seu telefone" value="<?php 
            echo $user->getPhoneNumber();
          ?>" />

      <label for="email">E-mail</label>
      <input type="email" name="email" id="email" placeholder="Digite seu e-mail" value="<?php 
            echo $user->getEmail();
          ?>" />

      <label for="username">Nome de usuário</label>
      <input type="text" value="<?php 
            echo $user->getUsername();
          ?>" disabled />

      <label for="password">Senha</label>
      <input type="password" name="password" id="password" placeholder="Digite nova senha" value="" />
      <label for="password">Deixe em branco para não mudar</label>

      <label for="passwordConfirmation">Confimar senha</label>
      <input type="password" name="passwordConfirmation" id="passwordConfirmation"
        placeholder="Digite sua senha para confirmar a edição" value="" />
      <label for="passwordConfirmation">Deixe em branco para não mudar</label>

      <button type="submit">Editar informações</button>
    </form>
  </section>
</body>

</html>