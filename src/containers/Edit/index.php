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
          <a href="../Edit/index.html">Editar perfil</a>
        </div>
        <div class="nav-item">
          <a href="../Ranking/index.html">Ranking global</a>
        </div>
        <div class="nav-item"><a href="../Login/index.html">Sair</a></div>
      </nav>
    </header>

    <section class="editWrapper">
      <form action="../Game/index.html">
        <label for="name">Nome completo</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Digite seu nome completo"
          value="Gabriel Gomes de Santana"
          autofocus
        />

        <label for="birthdate">Data de nascimento</label>
        <input
          type="text"
          name="birthdate"
          id="birthdate"
          placeholder="Digite sua data de nascimento"
          value="10/10/1970"
          disabled
        />

        <label for="cpf">CPF</label>
        <input
          type="text"
          name="cpf"
          id="cpf"
          placeholder="Digite seu CPF"
          value="senha123"
          disabled
        />

        <label for="phoneNumber">Telefone</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Digite seu telefone"
          value="199956565656"
        />

        <label for="email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
          value="eu@eu.com"
        />

        <label for="username">Nome de usuário</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Digite seu nome de usuário"
          value="euzinho"
          disabled
        />

        <label for="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Digite nova senha"
          value=""
        />
        <label for="password">Deixe em branco para não mudar</label>

        <label for="password">Confimar senha</label>
        <input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          placeholder="Digite sua senha para confirmar a edição"
          value=""
        />
        <label for="password">Deixe em branco para não mudar</label>

        <button type="submit">Editar informações</button>
      </form>
    </section>
  </body>
</html>
