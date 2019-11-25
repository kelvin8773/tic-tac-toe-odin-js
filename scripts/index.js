const DataModule = (() => {

    const Player = (name, symbol) => {
        const getName = () => name;
        const getSymbol = () => symbol;
        return { getName, getSymbol }
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
            [2, 4, 6]
        ];

        const mark = (pos, symbol) => {
          grid[pos] = symbol;
        }

        const positionsBySymbol = (symbol) => {
          const positions = [];
          grid.forEach((value, pos) => {
            if (value === symbol) {
              positions.push(pos)
            }
          })
        }

        const isWon = (symbol) => {
            if (getWinCombo(symbol)) {
              return true
            }
            return false
        };

        const getWinCombo = (symbol) => {
          const positions = positionsBySymbol(symbol);
            for (let combo of winCombs) {
              if (combo.every(c => positions.includes(c))) {
                return combo;
              }
            }
        }

        const isFull = () => !grid.some(pos => pos == null);

        const isEmptyCell = (pos) => !grid[pos]; 

      return { mark, getWinCombo, isFull, isWon, isEmptyCell }
    };

    const Game = (board, ...players) => {
        const switchPlayer = () => players.reverse();
        const getActivePlayer = () => players[0];

        const isGameOver = () => {
            return board.isWon(getActivePlayer().getSymbol()) || board.isFull();
        };

        const getWinner = () => {
            return board.isWon(getActivePlayer().getSymbol()) && players[0];
        }

        const getWinCombo = () => board.getWinCombo(getActivePlayer().getSymbol());

        const turn = (pos) => {
          if (!board.isEmptyCell(pos)) return;
          const symbol = getActivePlayer().getSymbol();

          board.mark(pos, symbol);

          return {pos, symbol};
        }
 
        return { switchPlayer, getActivePlayer, isGameOver, getWinner, turn, getWinCombo }
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

    }
    return { DOMSelectors, }

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