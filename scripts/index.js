const DataModule = (() => {

    const Player = (name, symbol) => {
        const getName = () => name;
        const getSymbol = () => symbol;

        return { getName, getSymbol }
    };

    const Board = () => {
        const grid = new Array(9).fill(null);
        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6]
        ];

        const markSymbol = (symbol, position) => {
            if (grid[position] == null) {
                grid[position] = symbol;
            }
        }

        const getPositionsBySymbol = (symbol) => {
          const  positions = [];
          grid.forEach((value, index) => {
            if (value === symbol) {
              getPositionsBySymbol.push(index);
            }
          })
          return positions;
        }

        const getWinCombo = (symbol) => {
          const positions = getPositionsBySymbol(symbol);
          for (let combo of winCombos) {
            if (combo.every(c => positions.includes(c))) {
              return combo;
            }
          }
        }

        const isWon = (symbol) => {
          if (getWinCombo(symbol)) {
            return true;
          } else {
            return false;
          }
        };

        const isFull = () => !grid.some(pos => pos == null);

        const isEmptyCell = (pos) => !grid[pos];

      return {markSymbol, getWinCombo, isFull, isWon, isEmptyCell}

    };

    const Game = (board, ...players) => {
        const switchPlayer = () => players.reverse();
        const activePlayer = () => players[0];

        const isGameOver = () => {
          return board.isWon(activePlayer().getSymbol()) || board.isFull();
        };

        const getWinner = () => {
          return board.isWon(activePlayer().getSymbol()) && players[0];
        }

        const getWinCombo = () => board.getWinCombo(getWinner().getSymbol());

        const turn = (pos) => {
           if (!board.isEmptyCell(pos)) return;
           const symbol = activePlayer().getSymbol();
          
           board.markSymbol(pos, symbol);
           return {pos, symbol};
        }
        return { switchPlayer, activePlayer, isGameOver, getWinner, getWinCombo, turn }
    };

    return { Player, Board, Game }
})();


const UIModule = (() => {
    const DOMSelectors = {
        startbutton: '#startbtn',
        restbutton: '#restbtn',
        board: '#gameboard',
        allcells: '.cell',
        message: '#message-line',
        player1Name: `[name=player1]`,
        player2Name: `[name=player2]`,
        cell(pos) { return `#"${pos}"` }
    }

    const getDOMSelectors = () => DOMSelectors;

    const markPosition = ({ position, symbol }) => {
        const cell = document.querySelector(DOMSelectors.cell(position));
        drawSymbol(cell, symbol)
    }

    const drawSymbol = (cell, symbol) =>{
      cell.innerText = symbol;
    }

    const showResult = (player = null) => {
      const messageNode = document.querySelector(DOMSelectors.message);

      

    }

    const showWinCombo = (combo) => {
      combo.forEach( (index) => {
        const cell = document.querySelector(DOMSelectors.cell(index));
        cell.style.background = '#e67e25';
      })
    }

    const clearBoard = () => {
      const cells = document.getElementsByClassName(DOMSelectors.allcells);

      for (let cell of cells) {
        cell.innerText = "";
      }
    }


    return { getDOMSelectors, markPosition, showResult, showWinCombo, clearBoard }

})();


const Controller = ((Data, UI) => {
    let DOM = UI.DOMSelectors;

    let board = Data.Board;
    let game = Data.Game;


    const restGame = () => {
        board.rest();
        game.rest();
        UI.clearBoard();
    };

    const runGame = (board, player1, player2) => {

        if (board.isWon(player1)) {

        }

    }

    const startGame = () => {
        const player1Name = document.querySelector(DOM.player1Name).value;
        const player2Name = document.querySelector(DOM.player2Name).value;

        const player1 = Data.Player(player1Name, 'X');
        const player2 = Data.Player(player2Name, 'O');

        const messageNode = document.createTextNode(`Player1 is ${player1Name}, Player2 is ${player2Name}`);
        document.querySelector(DOM.message).replaceWith(messageNode);

        restGame();
        runGame(board, player1, player2);

    };


    const init = () => {
        document.querySelector(DOM.startbutton)
            .addEventListener('click', startGame);
    };

    return { init }
})(DataModule, UIModule);

Controller.init();