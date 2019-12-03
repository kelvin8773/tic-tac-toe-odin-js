const DataModule = (() => {
  const Player = (name, symbol) => {
    let score = 0;
    let myName = name;

    const getName = () => myName;
    const setName = (name) => myName = name;
    const getSymbol = () => symbol;

    const getScore = () => score;
    const addScore = () => {
      score += 1;
    };

    return {
      getName,
      setName,
      getSymbol,
      getScore,
      addScore,
    };
  };

  const Board = () => {
    const grid = new Array(9).fill(null);
    const winCombs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
    ];

    const mark = (pos, symbol) => {
      grid[pos] = symbol;
    };

    const positionsBySymbol = symbol => {
      const positions = [];
      grid.forEach((value, pos) => {
        if (value === symbol) {
          positions.push(pos);
        }
      });
      return positions;
    };

    const getWinCombo = symbol => {
      const positions = positionsBySymbol(symbol);
      return winCombs.find(value => value.every(c => positions.includes(c)));
    };

    const isWon = symbol => {
      if (getWinCombo(symbol)) {
        return true;
      }
      return false;
    };

    const isFull = () => !grid.some(pos => pos === null);

    const isEmptyCell = pos => !grid[pos];

    const getEmptyCell = () => {
      let allEmptyCells = [];
      grid.forEach((value, index) => { if (value === null) allEmptyCells.push(index) })
      return allEmptyCells;
    }

    return {
      mark,
      getWinCombo,
      isFull,
      isWon,
      isEmptyCell,
      getEmptyCell,
    };
  };

  const Game = (board, ...players) => {
    const switchPlayer = () => players.reverse();
    const getActivePlayer = () => players[0];
    const getNextPlayer = () => players[1];

    const isGameOver = () =>
      board.isWon(getActivePlayer().getSymbol()) || board.isFull();

    const getWinner = () =>
      board.isWon(getActivePlayer().getSymbol()) && players[0];

    const getWinCombo = () => board.getWinCombo(getActivePlayer().getSymbol());

    const turn = pos => {
      if (!board.isEmptyCell(pos)) return;
      const symbol = getActivePlayer().getSymbol();
      board.mark(pos, symbol);
      return { pos, symbol };
    };

    const getEmptyCell = () => {
      let allEmptyCells = board.getEmptyCell();
      console.log(allEmptyCells);
      return allEmptyCells[0];
    }

    return {
      switchPlayer,
      getActivePlayer,
      getNextPlayer,
      isGameOver,
      getWinner,
      turn,
      getWinCombo,
      getEmptyCell,
    };
  };

  return { Player, Board, Game };
})();

const UIModule = (() => {
  const DOMSelectors = {
    startButton: '#btn-start',
    resetButton: '#btn-reset',
    board: '#gameBoard',
    allCells: '.cell',
    message: '#message-line',
    gameHelper: '#gameHelper',
  };
  const startBtn = document.querySelector(DOMSelectors.startButton);

  const player1Input = document.querySelector('#player1-input');
  const player2Input = document.querySelector('#player2-input');
  const player1Display = document.querySelector('#player1-display');
  const player2Display = document.querySelector('#player2-display');
  const player1Score = document.querySelector('#player1-score');
  const player2Score = document.querySelector('#player2-score');

  const getPlayersName = player => {
    switch (player) {
      case 'player1':
        return player1Input.value;
      case 'player2':
        return player2Input.value;
      default:
        return 'Anonymous';
    }
  };

  const updatePlayersName = (player) => {
    if (player.getSymbol() === 'X') {
      player1Display.innerText = player.getName();
    }
    if (player.getSymbol() === 'O') {
      player2Display.innerText = player.getName();
    }
  };

  const updatePlayerScore = player => {
    if (player.getSymbol() === 'X') {
      player1Score.innerText = player.getScore();
    } else {
      player2Score.innerText = player.getScore();
    }
  };

  const getDOMSelectors = () => DOMSelectors;
  const markPosition = ({ pos, symbol }) => {
    const cell = document.querySelector(`#cell${pos}`);
    cell.innerText = symbol;
  };

  const showMessage = message => {
    const messageNode = document.querySelector(DOMSelectors.message);
    messageNode.innerText = message;
  };

  const updateStartButton = (status = '') => {
    switch (status) {
      case 'start':
        startBtn.innerText = 'Restart';
        startBtn.className = 'btn btn-warning btn-lg btn-block';
        break;
      case 'finish':
        startBtn.innerText = 'Play Again!';
        startBtn.className = 'btn btn-success btn-lg btn-block';
        break;
      default:
        startBtn.innerText = 'Start';
        startBtn.className = 'btn btn-primary btn-lg btn-block';
    }
  };

  const showWinCombo = combo => {
    combo.forEach(pos => {
      const el = document.querySelector(`#cell${pos}`);
      el.style.background = 'lightseagreen';
    });
  };

  const clearBoard = () => {
    const cells = document.querySelectorAll(DOMSelectors.allCells);

    cells.forEach(c => {
      c.innerText = '';
      c.style.background = 'white';
    });
  };

  return {
    DOMSelectors,
    getDOMSelectors,
    getPlayersName,
    updatePlayersName,
    updatePlayerScore,
    markPosition,
    showWinCombo,
    showMessage,
    updateStartButton,
    clearBoard,
  };
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMSelectors();

  const player1 = Data.Player(UI.getPlayersName('player1'), 'X');
  const player2 = Data.Player(UI.getPlayersName('player2'), 'O');
  let gameSwitch = false;
  let AI = false;

  const resetGame = () => {
    window.location.reload(true);
  };

  const startGame = () => {
    const name1 = UI.getPlayersName('player1');
    const name2 = UI.getPlayersName('player2');

    if (name1 !== 'Player1') { player1.setName(name1) };
    if (name2 !== 'Player2') {
      if (name2 == 'AI') { AI = true }
      player2.setName(name2)
    };

    UI.clearBoard();

    const game = Data.Game(Data.Board(), player1, player2);
    const boardNode = document.querySelector(DOM.board);

    if (gameSwitch) {
      game.switchPlayer();
      UI.showMessage(`Play Again! Now ~ ${game.getActivePlayer().getName()} ~ First!!`);
      gameSwitch = false;
    } else {
      UI.showMessage(`Game Started! ~ ${game.getActivePlayer().getName()} ~, You First!`);
      gameSwitch = true;
    };

    UI.updateStartButton('start')
    UI.updatePlayersName(player1);
    UI.updatePlayersName(player2);

    const runGame = event => {
      const clickedCell = event.target.id;
      if (clickedCell === undefined) return;

      let pos = clickedCell.charAt(clickedCell.length - 1);

      if (AI && game.getActivePlayer().getName() === 'AI') {
        pos = game.getEmptyCell();
      }

      const mark = game.turn(pos);

      if (mark !== undefined) {
        UI.markPosition(mark);
        UI.showMessage(` ~ ${game.getNextPlayer().getName()} ~, you are Next!!!`);

        if (game.isGameOver()) {
          const winner = game.getWinner();
          if (winner) {
            UI.showWinCombo(game.getWinCombo());
            winner.addScore();
            UI.updatePlayerScore(winner);
            UI.showMessage(`Congratulation! ${winner.getName()} won!`);
          } else {
            UI.showMessage('The Board is full, please try again!');
          }
          UI.updateStartButton('finish');
          boardNode.removeEventListener('click', runGame);
        }
        game.switchPlayer();
      }

    };

    boardNode.addEventListener('click', runGame);
  };


  const init = () => {
    document
      .querySelector(DOM.startButton)
      .addEventListener('click', startGame);
    document.querySelector(DOM.resetButton).addEventListener('click', resetGame);
  };

  return { init };
})(DataModule, UIModule);

Controller.init();
