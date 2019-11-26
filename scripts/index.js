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

    const positionsBySymbol = (symbol) => {
      const positions = [];
      grid.forEach((value, pos) => {
        if (value === symbol) {
          positions.push(pos);
        }
      });
      return positions;
    };

    const getWinCombo = (symbol) => {
      const positions = positionsBySymbol(symbol);
      for (const combo of winCombs) {
        if (combo.every((c) => positions.includes(c))) {
          return combo;
        }
      }
    };

    const isWon = (symbol) => {
      if (getWinCombo(symbol)) {
        return true;
      }
      return false;
    };

    const isFull = () => !grid.some((pos) => pos === null);

    const isEmptyCell = (pos) => !grid[pos];

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

    const isGameOver = () => board.isWon(getActivePlayer().getSymbol()) || board.isFull();

    const getWinner = () => board.isWon(getActivePlayer().getSymbol()) && players[0];

    const getWinCombo = () => board.getWinCombo(getActivePlayer().getSymbol());

    const turn = (pos) => {
      const cellID = pos.charAt(pos.length - 1);
      if (!board.isEmptyCell(cellID)) return;
      const symbol = getActivePlayer().getSymbol();
      board.mark(cellID, symbol);
      return { pos, symbol };
    };

    return {
      switchPlayer,
      getActivePlayer,
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

  const getDOMSelectors = () => DOMSelectors;
  const markPosition = ({ pos, symbol }) => {
    const cell = document.querySelector(`#${pos}`);
    cell.innerText = symbol;
  };

  const result = (player = null) => {
    const resultNode = document.querySelector(DOMSelectors.result);
    if (player) {
      resultNode.innerHTML = `
            <p style="color: ${player.getSymbol() === 'X' ? 'blue' : 'yellow'}>
              ${player.getName()} has won!
              </p>
            `;
    }
  };

  const showWinCombo = (combo) => {
    combo.forEach((pos) => {
      const el = document.querySelector(`#cell${pos}`);
      el.style.background = 'green';
    });
  };

  const clearBoard = () => {
    const cells = document.querySelectorAll(DOMSelectors.allcells);

    cells.forEach((cell) => {
      cell.innerText = '';
      cell.style.background = 'white';
    });
  };

  return {
    DOMSelectors,
    getDOMSelectors,
    markPosition,
    showWinCombo,
    result,
    clearBoard,
  };
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMSelectors();

  const resetGame = () => {
    UI.clearBoard();
  };

  const startGame = () => {
    resetGame();
    const name1 = document.querySelector(DOM.player1Name).value;
    const name2 = document.querySelector(DOM.player2Name).value;

    const player1 = Data.Player(name1, 'X');
    const player2 = Data.Player(name2, 'O');

    const game = Data.Game(Data.Board(), player1, player2);
    const boardNode = document.querySelector(DOM.board);

    const runGame = (event) => {
      const clickedCell = event.target.id;

      if (clickedCell === undefined) return;

      const mark = game.turn(clickedCell);

      if (mark !== undefined) {
        UI.markPosition(mark);

        if (game.isGameOver()) {
          const winner = game.getWinner();
          if (winner) {
            UI.showWinCombo(game.getWinCombo());
          }
          UI.result(winner);
          boardNode.removeEventListener('click', runGame);
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
