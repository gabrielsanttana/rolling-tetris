export default function createGame(height, width) {
  const INITIAL_TIME_ROUND = 500;
  const LIMIT_TIME_ROUND = 100;
  const SPEED_INCREASE_TIME_ROUND = 100;
  const TIME_ROUND_SCORE_INTERVAL = 300;
  const SCORE_BONUS = 10;

  const observers = [];

  const state = {
    hasGameStarted: false,
    tetriminos: {},
    currentTetriminoId: null,
    height: height,
    width: width,
    time_round: INITIAL_TIME_ROUND,
    list_shapes: ['I', 'O', 'T', 'J', 'L', 'Q', 'U'],
    score: 0,
    is_upsidedown: false,
    total_cleared_lines_count: 0,
    time: 0,
  };

  let gameTimer;

  const startGameTimer = () => {
    gameTimer = setInterval(() => {
      ++state.time;
      handleUpdateStatusGame('time');
    }, 1000);
  };

  const stopGameTimer = () => clearInterval(gameTimer);

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    observers.forEach((observerFunction) => {
      observerFunction(command);
    });
  }

  function setBoardSize(height, width) {
    state.height = height;
    screen.height = height;
    state.width = width;
    screen.width = width;
  }

  function start() {
    if (!state.hasGameStarted) {
      startGameTimer();

      addTetrimino(
        state.list_shapes[Math.floor(Math.random() * state.list_shapes.length)],
      );
      window.setTimeout(passRound, state.time_round);
      state.hasGameStarted = true;
      handleUpdateStatusGame('startGame');
    } else {
      endGame();
    }
  }

  function endGame() {
    state.tetriminos = {};
    state.currentTetriminoId = null;
    state.time_round = INITIAL_TIME_ROUND;
    state.score = 0;
    state.is_upsidedown = false;
    state.total_cleared_lines_count = 0;
    state.time = 0;
    state.hasGameStarted = false;

    handleUpdateStatusGame('restartGameState');
    stopGameTimer();
  }

  function getLevelDifficulty() {
    const levelDifficulty = Math.floor(state.score / TIME_ROUND_SCORE_INTERVAL);

    switch (levelDifficulty) {
      case 0:
        return 'Fácil';

      case 1:
        return 'Média';

      case 2:
        return 'Difícil';

      case 3:
        return 'Extrema';

      default:
        return 'Insana';
    }
  }

  function passRound() {
    if (state.currentTetriminoId) {
      const moved = moveDown(state.currentTetriminoId);

      if (!moved) {
        checkGameStatus();

        if (state.hasGameStarted) {
          const addedTetriminoId = addTetrimino(
            state.list_shapes[
              Math.floor(Math.random() * state.list_shapes.length)
            ],
          );

          if (!addedTetriminoId) {
            alert('GAME OVER');
            endGame();

            return;
          }
        }
      }
    }

    if (state.hasGameStarted) {
      window.setTimeout(passRound, state.time_round);
    }
  }

  function handleUpdateStatusGame(status_changed) {
    const command = {
      type: 'update-status-game',
      status_changed,
    };

    notifyAll(command);
  }

  function checkGameStatus() {
    let allBlocks = [];
    //Create Array with all Blocks
    for (const tetrimino in state.tetriminos) {
      state.tetriminos[tetrimino].blocks.forEach((block) => {
        allBlocks.push(block);
      });
    }

    let cleared_lines_count = 0;
    let current_tetrimino_type =
      state.tetriminos[state.currentTetriminoId].type;
    //Check if there is Lines to Clean
    for (const row of Array(state.height).keys()) {
      let blockInRow = allBlocks.filter((block) => {
        if (block.y === row) {
          return true;
        }
        return null;
      });
      let colInRow = blockInRow.map((block) => block.x);

      let clearLine = true;
      for (const col of Array(state.width).keys()) {
        if (colInRow.indexOf(col) === -1) {
          clearLine = false;
        }
      }
      if (clearLine) {
        clearRow(row);
        cleared_lines_count++;
      }
    }

    /*Contagem do total de linhas eliminadas*/
    state.total_cleared_lines_count += cleared_lines_count;
    if (cleared_lines_count > 0) {
      handleUpdateStatusGame('total_cleared_lines_count');
    }

    /*Calculo da pontuação do usuario*/
    let point_scored = SCORE_BONUS * Math.pow(cleared_lines_count, 2);
    state.score += point_scored;
    if (point_scored > 0) {
      handleUpdateStatusGame('score');
    }

    /*Calculo da velocidade/dificuldade do jogo*/
    let new_time_round =
      INITIAL_TIME_ROUND -
      Math.floor(state.score / TIME_ROUND_SCORE_INTERVAL) *
        SPEED_INCREASE_TIME_ROUND;
    if (new_time_round > LIMIT_TIME_ROUND) {
      state.time_round = new_time_round;
    } else {
      state.time_round = LIMIT_TIME_ROUND;
    }
    if (Math.floor(state.score / TIME_ROUND_SCORE_INTERVAL) > 0) {
      handleUpdateStatusGame('time_round');
    }

    /*Verifica se o bloco é especial e se deve rotacionar o tabuleiro*/
    if (current_tetrimino_type === 'Q' && cleared_lines_count > 0) {
      state.is_upsidedown = !state.is_upsidedown;
    }

    function clearRow(row) {
      //Clear Row
      for (const tetrimino in state.tetriminos) {
        let newBlocks = state.tetriminos[tetrimino].blocks.filter((block) => {
          if (block.y === row) {
            return false;
          }
          return true;
        });
        if (newBlocks.length === 0) {
          delete state.tetriminos[tetrimino];
        } else {
          state.tetriminos[tetrimino].blocks = newBlocks;
        }
      }

      //Move Down Tetriminos blocks that are above the line
      for (const tetrimino in state.tetriminos) {
        state.tetriminos[tetrimino].blocks.forEach((block) => {
          if (block.y < row) {
            block.y += 1;
          }
        });
      }
    }
  }

  function createBlock(positionX, positionY) {
    return {x: positionX, y: positionY};
  }

  function addTetrimino(type) {
    const shape = {
      color: '#0000ff',
      type: type,
      degrees: 0,
      blocks: [],
    };

    const acceptedShapes = {
      I: () => {
        let leftBlock = createBlock(state.width / 2 - 2, 0);
        let middleLeftBlock = createBlock(state.width / 2 - 1, 0);
        let middleRightBlock = createBlock(state.width / 2, 0);
        let rightBlock = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [
          leftBlock,
          middleLeftBlock,
          middleRightBlock,
          rightBlock,
        ];
        shape.color = '#0000ff';
        shape.degrees = 0;
      },
      O: () => {
        let topLeftBlock = createBlock(state.width / 2, -1);
        let topRightBlock = createBlock(state.width / 2 + 1, -1);
        let bottomLeftBlock = createBlock(state.width / 2, 0);
        let bottomRightBlock = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [
          topLeftBlock,
          topRightBlock,
          bottomLeftBlock,
          bottomRightBlock,
        ];
        shape.color = '#00ff00';
      },
      T: () => {
        let topBlock = createBlock(state.width / 2, -1);
        let leftBlock = createBlock(state.width / 2 - 1, 0);
        let middleBlock = createBlock(state.width / 2, 0);
        let rightBlock = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [topBlock, leftBlock, middleBlock, rightBlock];
        shape.color = '#ff0000';
      },
      S: () => {
        let block_1_0 = createBlock(state.width / 2, -1);
        let block_2_0 = createBlock(state.width / 2 + 1, -1);
        let block_0_1 = createBlock(state.width / 2 - 1, 0);
        let block_1_1 = createBlock(state.width / 2, 0);
        shape.blocks = [block_1_1, block_1_0, block_2_0, block_0_1];
        shape.color = '#00ffff';
      },
      Z: () => {
        let block_0_0 = createBlock(state.width / 2 - 1, -1);
        let block_1_0 = createBlock(state.width / 2, -1);
        let block_1_1 = createBlock(state.width / 2, 0);
        let block_2_1 = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [block_0_0, block_1_0, block_1_1, block_2_1];
        shape.color = '#ffff00';
      },
      J: () => {
        let block_0_0 = createBlock(state.width / 2 - 1, -1);
        let block_0_1 = createBlock(state.width / 2 - 1, 0);
        let block_1_1 = createBlock(state.width / 2, 0);
        let block_2_1 = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [block_1_1, block_0_0, block_0_1, block_2_1];
        shape.color = '#ff00ff';
      },
      L: () => {
        let block_2_0 = createBlock(state.width / 2 + 1, -1);
        let block_0_1 = createBlock(state.width / 2 - 1, 0);
        let block_1_1 = createBlock(state.width / 2, 0);
        let block_2_1 = createBlock(state.width / 2 + 1, 0);
        shape.blocks = [block_1_1, block_2_0, block_0_1, block_2_1];
        shape.color = '#f5841b';
      },
      U: () => {
        /*block_y_x -- y start from bottom and x start from left*/
        let block_1_0 = createBlock(state.width / 2 - 1, -1);
        let block_0_0 = createBlock(state.width / 2 - 1, 0);
        let block_0_1 = createBlock(state.width / 2, 0); //Eixo da peça
        let block_0_2 = createBlock(state.width / 2 + 1, 0);
        let block_1_2 = createBlock(state.width / 2 + 1, -1);
        shape.blocks = [block_0_1, block_1_0, block_0_0, block_0_2, block_1_2];
        shape.color = '#00ffff';
      },
      Q: () => {
        /*block_y_x -- y start from bottom and x start from left*/
        let block_0_0 = createBlock(state.width / 2, 0);
        shape.blocks = [block_0_0];
        shape.color = '#ffff00';
      },
    };

    const createShape = acceptedShapes[type];

    if (createShape) {
      createShape();
      let id = Math.random().toString(36).substr(2, 9);

      const isDuplicate = () => {
        let allBlocks = [];

        let stateTetriminosMock = Object.assign({}, state.tetriminos);

        stateTetriminosMock[id] = shape;

        for (const tetrimino in stateTetriminosMock) {
          stateTetriminosMock[tetrimino].blocks.forEach((block) => {
            allBlocks.push(block);
          });
        }

        let AllBlocksOnArray = allBlocks.map(
          (block) => block.x + '-' + block.y,
        );
        let isDuplicate = AllBlocksOnArray.some(function (item, index) {
          return (
            AllBlocksOnArray.filter((element) => element === item).length > 1
          );
        });

        return isDuplicate;
      };

      if (isDuplicate()) {
        return null;
      } else {
        state.tetriminos[id] = shape;

        state.currentTetriminoId = id;

        return id;
      }
    }
  }

  function moveDown(tetriminoId) {
    const tetrimino = state.tetriminos[tetriminoId];

    function blocksCanMoveDown() {
      let blocks = state.tetriminos[tetriminoId].blocks;
      let newBlocks = [];
      let auxBlock = {};
      blocks.forEach((blockTetriminoMoving, index) => {
        auxBlock = {};
        Object.assign(auxBlock, blockTetriminoMoving);
        auxBlock.y += 1;
        newBlocks.push(auxBlock);
      });

      let canMove = blocksHasValidPosition(newBlocks, tetriminoId);

      return canMove;
    }
    if (tetrimino && blocksCanMoveDown()) {
      state.tetriminos[tetriminoId].blocks.forEach((block, index) => {
        state.tetriminos[tetriminoId].blocks[index].y = block.y + 1;
      });
      return true;
    }
    return false;
  }

  function moveLeft(tetriminoId) {
    const tetrimino = state.tetriminos[tetriminoId];

    function blocksCanMoveLeft() {
      let blocks = state.tetriminos[tetriminoId].blocks;
      let newBlocks = [];
      let auxBlock = {};
      blocks.forEach((blockTetriminoMoving, index) => {
        auxBlock = {};
        Object.assign(auxBlock, blockTetriminoMoving);
        auxBlock.x -= 1;
        newBlocks.push(auxBlock);
      });

      let canMove = blocksHasValidPosition(newBlocks, tetriminoId);

      return canMove;
    }

    if (tetrimino && blocksCanMoveLeft()) {
      state.tetriminos[tetriminoId].blocks.forEach((block, index) => {
        state.tetriminos[tetriminoId].blocks[index].x = block.x - 1;
      });
      return true;
    }
    return false;
  }

  function moveRight(tetriminoId) {
    const tetrimino = state.tetriminos[tetriminoId];

    function blocksCanMoveRight() {
      let blocks = state.tetriminos[tetriminoId].blocks;
      let newBlocks = [];
      let auxBlock = {};
      blocks.forEach((blockTetriminoMoving, index) => {
        auxBlock = {};
        Object.assign(auxBlock, blockTetriminoMoving);
        auxBlock.x += 1;
        newBlocks.push(auxBlock);
      });

      let canMove = blocksHasValidPosition(newBlocks, tetriminoId);

      return canMove;
    }

    if (tetrimino && blocksCanMoveRight()) {
      state.tetriminos[tetriminoId].blocks.forEach((block, index) => {
        state.tetriminos[tetriminoId].blocks[index].x = block.x + 1;
      });
      return true;
    }
    return false;
  }

  function moveTetrimino(command) {
    const acceptedMoves = {
      Z(tetriminoId) {
        rotateTetrimino(tetriminoId);
      },
      z(tetriminoId) {
        rotateTetrimino(tetriminoId);
      },
      ArrowRight(tetriminoId) {
        state.is_upsidedown ? moveLeft(tetriminoId) : moveRight(tetriminoId);
      },
      ArrowDown(tetriminoId) {
        !state.is_upsidedown && moveDown(tetriminoId);
      },
      ArrowUp() {
        state.is_upsidedown && moveDown(tetriminoId);
      },
      ArrowLeft(tetriminoId) {
        state.is_upsidedown ? moveRight(tetriminoId) : moveLeft(tetriminoId);
      },
    };

    const keyPressed = command.keyPressed;
    const tetriminoId = state.currentTetriminoId;
    const tetrimino = state.tetriminos[tetriminoId];
    const moveFunction = acceptedMoves[keyPressed];

    if (tetrimino && moveFunction) {
      moveFunction(tetriminoId);
    }
  }

  function blocksHasValidPosition(blocksNewPosition, tetriminoId) {
    let hasValidPosition = true;

    blocksNewPosition.forEach((blockNewPosition, index) => {
      if (
        blockNewPosition.x >= state.width ||
        blockNewPosition.x < 0 ||
        blockNewPosition.y >= state.height
      ) {
        hasValidPosition = false;
        // break
      }
    });

    for (const tetriminoKey in state.tetriminos) {
      if (tetriminoKey !== tetriminoId) {
        const tetrimino = state.tetriminos[tetriminoKey];
        tetrimino.blocks.forEach((blockTetrimino) => {
          blocksNewPosition.forEach((blockNewPosition, index) => {
            if (
              blockTetrimino.y === blockNewPosition.y &&
              blockTetrimino.x === blockNewPosition.x
            ) {
              hasValidPosition = false;
              // break
            }
          });
        });
      }
    }
    return hasValidPosition;
  }

  function rotateTetrimino(tetriminoId) {
    const acceptedShapes = {
      I: (tetriminoId) => {
        let topBlock,
          middleTopBlock,
          middleBottomBlock,
          bottomBlock,
          leftBlock,
          middleLeftBlock,
          middleRightBlock,
          rightBlock;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            leftBlock = tetrimino.blocks[0];

            topBlock = createBlock(leftBlock.x + 2, leftBlock.y - 1);
            middleTopBlock = createBlock(leftBlock.x + 2, leftBlock.y);
            middleBottomBlock = createBlock(leftBlock.x + 2, leftBlock.y + 1);
            bottomBlock = createBlock(leftBlock.x + 2, leftBlock.y + 2);

            newBlocks = [
              topBlock,
              middleTopBlock,
              middleBottomBlock,
              bottomBlock,
            ];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            topBlock = tetrimino.blocks[0];

            leftBlock = createBlock(topBlock.x - 2, topBlock.y + 2);
            middleLeftBlock = createBlock(topBlock.x, topBlock.y + 2);
            middleRightBlock = createBlock(topBlock.x - 1, topBlock.y + 2);
            rightBlock = createBlock(topBlock.x + 1, topBlock.y + 2);

            newBlocks = [
              leftBlock,
              middleLeftBlock,
              middleRightBlock,
              rightBlock,
            ];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            leftBlock = tetrimino.blocks[0];

            topBlock = createBlock(leftBlock.x + 1, leftBlock.y - 2);
            middleTopBlock = createBlock(leftBlock.x + 1, leftBlock.y - 1);
            middleBottomBlock = createBlock(leftBlock.x + 1, leftBlock.y);
            bottomBlock = createBlock(leftBlock.x + 1, leftBlock.y + 1);

            newBlocks = [
              topBlock,
              middleTopBlock,
              middleBottomBlock,
              bottomBlock,
            ];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            topBlock = tetrimino.blocks[0];

            leftBlock = createBlock(topBlock.x - 1, topBlock.y + 1);
            middleLeftBlock = createBlock(topBlock.x, topBlock.y + 1);
            middleRightBlock = createBlock(topBlock.x + 1, topBlock.y + 1);
            rightBlock = createBlock(topBlock.x + 2, topBlock.y + 1);

            newBlocks = [
              leftBlock,
              middleLeftBlock,
              middleRightBlock,
              rightBlock,
            ];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      O: () => {
        //Rotação do O não altera nada
      },
      T: () => {
        let topBlock, leftBlock, middleBlock, rightBlock, bottomBlock;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            topBlock = tetrimino.blocks[0];
            middleBlock = tetrimino.blocks[2];
            rightBlock = tetrimino.blocks[3];

            bottomBlock = createBlock(middleBlock.x, middleBlock.y + 1);

            newBlocks = [topBlock, middleBlock, rightBlock, bottomBlock];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            middleBlock = tetrimino.blocks[1];
            rightBlock = tetrimino.blocks[2];
            bottomBlock = tetrimino.blocks[3];

            leftBlock = createBlock(middleBlock.x - 1, middleBlock.y);

            newBlocks = [leftBlock, middleBlock, rightBlock, bottomBlock];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            leftBlock = tetrimino.blocks[0];
            middleBlock = tetrimino.blocks[1];
            bottomBlock = tetrimino.blocks[3];

            topBlock = createBlock(middleBlock.x, middleBlock.y - 1);

            newBlocks = [topBlock, leftBlock, middleBlock, bottomBlock];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            topBlock = tetrimino.blocks[0];
            leftBlock = tetrimino.blocks[1];
            middleBlock = tetrimino.blocks[2];

            rightBlock = createBlock(middleBlock.x + 1, middleBlock.y);

            newBlocks = [topBlock, leftBlock, middleBlock, rightBlock];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      S: () => {
        let block_0_0,
          block_1_0,
          block_2_0,
          block_0_1,
          block_1_1,
          block_2_1,
          block_0_2,
          block_1_2,
          block_2_2;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_2_2 = createBlock(block_1_1.x + 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_2_1, block_2_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            block_1_1 = tetrimino.blocks[0];

            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_0_2 = createBlock(block_1_1.x - 1, block_1_1.y + 1);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_2_1, block_0_2, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            block_1_1 = tetrimino.blocks[0];

            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y - 1);
            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_0_0, block_0_1, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_2_0 = createBlock(block_1_1.x + 1, block_1_1.y - 1);
            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);

            newBlocks = [block_1_1, block_1_0, block_2_0, block_0_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      Z: () => {
        let block_0_0,
          block_1_0,
          block_2_0,
          block_0_1,
          block_1_1,
          block_2_1,
          block_0_2,
          block_1_2,
          block_2_2;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            block_1_1 = tetrimino.blocks[0];

            block_2_0 = createBlock(block_1_1.x + 1, block_1_1.y - 1);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_2_0, block_2_1, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            block_1_1 = tetrimino.blocks[0];

            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);
            block_2_2 = createBlock(block_1_1.x + 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_0_1, block_1_2, block_2_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_0_2 = createBlock(block_1_1.x - 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_0_1, block_0_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            block_1_1 = tetrimino.blocks[0];

            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y - 1);
            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);

            newBlocks = [block_1_1, block_0_0, block_1_0, block_2_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      J: () => {
        let block_0_0,
          block_1_0,
          block_2_0,
          block_0_1,
          block_1_1,
          block_2_1,
          block_0_2,
          block_1_2,
          block_2_2;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_2_0 = createBlock(block_1_1.x + 1, block_1_1.y - 1);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_2_0, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            block_1_1 = tetrimino.blocks[0];

            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_2_2 = createBlock(block_1_1.x + 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_0_1, block_2_1, block_2_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_0_2 = createBlock(block_1_1.x - 1, block_1_1.y + 1);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_0_2, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            block_1_1 = tetrimino.blocks[0];

            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y - 1);
            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);

            newBlocks = [block_1_1, block_0_0, block_0_1, block_2_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      L: () => {
        let block_0_0,
          block_1_0,
          block_2_0,
          block_0_1,
          block_1_1,
          block_2_1,
          block_0_2,
          block_1_2,
          block_2_2;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);
            block_2_2 = createBlock(block_1_1.x + 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_1_2, block_2_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;

          case 90:
            block_1_1 = tetrimino.blocks[0];

            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_0_2 = createBlock(block_1_1.x - 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_0_1, block_2_1, block_0_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;

          case 180:
            block_1_1 = tetrimino.blocks[0];

            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y - 1);
            block_1_0 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_1_2 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_0_0, block_1_0, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;

          case 270:
            block_1_1 = tetrimino.blocks[0];

            block_0_1 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_2_0 = createBlock(block_1_1.x + 1, block_1_1.y - 1);
            block_2_1 = createBlock(block_1_1.x + 1, block_1_1.y);

            newBlocks = [block_1_1, block_0_1, block_2_0, block_2_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      U: () => {
        let block_0_0,
          block_1_0,
          block_2_0,
          block_0_1,
          block_1_1,
          block_2_1,
          block_0_2,
          block_1_2,
          block_2_2;
        let newBlocks = [];
        switch (tetrimino.degrees) {
          case 0:
            block_1_0 = tetrimino.blocks[0];

            block_2_0 = createBlock(block_1_0.x, block_1_0.y - 1);
            block_2_1 = createBlock(block_1_0.x + 1, block_1_0.y - 1);
            block_0_0 = createBlock(block_1_0.x, block_1_0.y + 1);
            block_0_1 = createBlock(block_1_0.x + 1, block_1_0.y + 1);

            newBlocks = [block_1_0, block_2_0, block_2_1, block_0_0, block_0_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 90;
            }
            break;
          case 90:
            block_1_1 = tetrimino.blocks[0];

            block_1_0 = createBlock(block_1_1.x - 1, block_1_1.y);
            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y + 1);
            block_1_2 = createBlock(block_1_1.x + 1, block_1_1.y);
            block_0_2 = createBlock(block_1_1.x + 1, block_1_1.y + 1);

            newBlocks = [block_1_1, block_1_0, block_0_0, block_1_2, block_0_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 180;
            }
            break;
          case 180:
            block_1_1 = tetrimino.blocks[0];

            block_2_0 = createBlock(block_1_1.x - 1, block_1_1.y - 1);
            block_2_1 = createBlock(block_1_1.x, block_1_1.y - 1);
            block_0_0 = createBlock(block_1_1.x - 1, block_1_1.y + 1);
            block_0_1 = createBlock(block_1_1.x, block_1_1.y + 1);

            newBlocks = [block_1_1, block_2_0, block_2_1, block_0_0, block_0_1];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 270;
            }
            break;
          case 270:
            block_0_1 = tetrimino.blocks[0];

            block_0_0 = createBlock(block_0_1.x - 1, block_0_1.y);
            block_1_0 = createBlock(block_0_1.x - 1, block_0_1.y - 1);
            block_0_2 = createBlock(block_0_1.x + 1, block_0_1.y);
            block_1_2 = createBlock(block_0_1.x + 1, block_0_1.y - 1);

            newBlocks = [block_0_1, block_0_0, block_1_0, block_0_2, block_1_2];

            if (blocksHasValidPosition(newBlocks, tetriminoId)) {
              state.tetriminos[tetriminoId].blocks = newBlocks;
              state.tetriminos[tetriminoId].degrees = 0;
            }
            break;
        }
      },
      Q: () => {
        //Rotação do Q não altera nada
      },
    };

    const tetrimino = state.tetriminos[tetriminoId];
    const rotateTetrimino = acceptedShapes[tetrimino.type];

    if (tetrimino && rotateTetrimino) {
      rotateTetrimino(tetriminoId);
    }
  }

  return {
    state,
    start,
    addTetrimino,
    moveDown,
    moveTetrimino,
    subscribe,
    getLevelDifficulty,
    setBoardSize,
  };
}
