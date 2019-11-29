const DataModule = (() => {
  const Player = (name, symbol) => {
    const selfName = name;
    const selfSymbol = symbol;
    let score = 0;
    const getName = () => selfName;
    const getSymbol = () => selfSymbol;
    const getScore = () => score;
    const addScore = () => {
      score += 1;
    };

    return {
      getName,
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

    return {
      mark,
      getWinCombo,
      isFull,
      isWon,
      isEmptyCell,
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
      const cellID = pos.charAt(pos.length - 1);
      if (!board.isEmptyCell(cellID)) return;
      const symbol = getActivePlayer().getSymbol();
      board.mark(cellID, symbol);
      return { pos, symbol };
    };

    return {
      switchPlayer,
      getActivePlayer,
      getNextPlayer,
      isGameOver,
      getWinner,
      turn,
      getWinCombo,
    };
  };

  return { Player, Board, Game };
})();

const UIModule = (() => {
  const DOMSelectors = {
    startButton: '#btn-start',
    nextButton: '#btn-next',
    board: '#gameboard',
    allcells: '.cell',
    message: '#message-line',
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

  const updatePlayersName = () => {
    player1Display.innerText = player1Input.value;
    player2Display.innerText = player2Input.value;
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
    const cell = document.querySelector(`#${pos}`);
    cell.innerText = symbol;
  };

  const showMessage = message => {
    const messageNode = document.querySelector(DOMSelectors.message);
    messageNode.innerText = message;
  };

  const updateStartButton = (status = '') => {
    switch (status) {
      case 'start':
        startBtn.innerText = 'Reset';
        startBtn.className = 'btn btn-danger btn-lg';
        break;
      case 'finish':
        startBtn.innerText = 'Play Again!';
        startBtn.className = 'btn btn-info btn-block';
        break;
      default:
        startBtn.innerText = 'Start';
        startBtn.className = 'btn btn-primary btn-lg';
    }
  };

  const showWinCombo = combo => {
    combo.forEach(pos => {
      const el = document.querySelector(`#cell${pos}`);
      el.style.background = 'lightseagreen';
    });
  };

  const clearBoard = () => {
    const cells = document.querySelectorAll(DOMSelectors.allcells);

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
  let player1 = Data.Player(UI.getPlayersName('player1'), 'X');
  let player2 = Data.Player(UI.getPlayersName('player2'), 'O');
  let game = Data.Game(Data.Board(), player1, player2);
  console.log(UI.getPlayersName('player1'));

  const boardNode = document.querySelector(DOM.board);

  const runGame = event => {
    UI.showMessage(`${game.getNextPlayer().getName()}, It is your Turn.`);
    UI.updateStartButton('start');
    const clickedCell = event.target.id;

    if (clickedCell === undefined) return;

    const mark = game.turn(clickedCell);

    if (mark !== undefined) {
      UI.markPosition(mark);

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
        boardNode.removeEventListener('click', runGame);
        UI.updateStartButton('finish');
      }
      game.switchPlayer();
    }
  };

  const resetGame = () => {
    player1 = Data.Player(UI.getPlayersName('player1'), 'X');
    player2 = Data.Player(UI.getPlayersName('player2'), 'O');

    game = Data.Game(Data.Board(), player1, player2);

    UI.clearBoard();
    UI.updateStartButton();
    UI.updatePlayersName();

    UI.updatePlayerScore(player1);
    UI.updatePlayerScore(player2);

    UI.showMessage(`Game Started, ${UI.getPlayersName()}, You Go First!`);

    boardNode.addEventListener('click', runGame);
  };

  const startGame = () => {
    game = Data.Game(Data.Board(), player1, player2);

    UI.clearBoard();
    UI.updateStartButton();

    UI.updatePlayersName();

    UI.updatePlayerScore(player1);
    UI.updatePlayerScore(player2);

    UI.showMessage('Game Started!');

    boardNode.addEventListener('click', runGame);
  };

  const init = () => {
    document
      .querySelector(DOM.startButton)
      .addEventListener('click', startGame);
    document.querySelector(DOM.nextButton).addEventListener('click', resetGame);
  };

  return { init };
})(DataModule, UIModule);

Controller.init();
