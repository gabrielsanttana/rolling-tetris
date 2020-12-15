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
    <section class="loginWrapper">
      <form action="../../services/api.php" method="POST">

        <input id="method" name="method" type="text" hidden value="login"/>

        <label for="user">Usuário</label>
        <input
          type="text"
          name="user"
          id="user"
          placeholder="Digite seu usuário"
          autofocus
        />

        <label for="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
        />

        <button type="submit">Entrar</button>

        <div class="registerContainer">
          <a href="../Register/index.html">Quero me cadastrar</a>
        </div>
      </form>
    </section>
  </body>
</html>
