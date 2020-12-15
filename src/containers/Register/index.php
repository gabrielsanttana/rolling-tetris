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
    <section class="registerWrapper">
      <form action="../../services/api.php" method="POST">
        <input id="method" name="method" type="text" hidden value="registerPlayer"/>

        <label for="name">Nome completo</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Digite seu nome completo"
          autofocus
        />

        <label for="birthdate">Data de nascimento</label>
        <input
          type="date"
          name="birthdate"
          id="birthdate"
          placeholder="Digite sua data de nascimento"
        />

        <label for="cpf">CPF</label>
        <input type="text" name="cpf" id="cpf" placeholder="Digite sua senha" />

        <label for="phoneNumber">Telefone</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Digite seu telefone"
        />

        <label for="email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
        />

        <label for="username">Nome de usuário</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Digite seu nome de usuário"
        />

        <label for="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
        />

        <button type="submit" value="registerPlayer">Cadastrar</button>
      </form>
    </section>
  </body>
</html>
