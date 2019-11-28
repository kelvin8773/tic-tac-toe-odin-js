const DataModule = (() => {
  const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
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
    startbutton: '#startbtn',
    restbutton: '#restbtn',
    board: '#gameboard',
    allcells: '.cell',
    message: '#message-line',
    result: '.result',
    player1Name: '[name=player1]',
    player2Name: '[name=player2]',
  };
  const startBtn = document.querySelector(DOMSelectors.startbutton);

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
        startBtn.className = 'btn btn-danger btn-lg mx-auto';
        break;
      case 'finish':
        startBtn.innerText = 'Restart';
        startBtn.className = 'btn btn-info btn-lg mx-auto';
        break;
      default:
        startBtn.innerText = 'Start';
        startBtn.className = 'btn btn-primary btn-lg mx-auto';
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
    markPosition,
    showWinCombo,
    showMessage,
    updateStartButton,
    clearBoard,
  };
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMSelectors();

  const resetGame = () => {
    UI.clearBoard();
    UI.updateStartButton();
  };

  const startGame = () => {
    resetGame();
    const name1 = document.querySelector(DOM.player1Name).value;
    const name2 = document.querySelector(DOM.player2Name).value;

    const player1 = Data.Player(name1, 'X');
    const player2 = Data.Player(name2, 'O');

    const game = Data.Game(Data.Board(), player1, player2);
    const boardNode = document.querySelector(DOM.board);
    UI.showMessage('Game Started, Player1 First!');

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

    boardNode.addEventListener('click', runGame);
  };

  const init = () => {
    document
      .querySelector(DOM.startbutton)
      .addEventListener('click', startGame);
  };

  return { init };
})(DataModule, UIModule);

Controller.init();
