const DataModule = (() => {

  const Player = (name, symbol) => {
    this._name = name;
    this._symbol = symbol;

    const getName = () => {return this._name};
    const getSymbol = () => {return this._symbol};

    return {getName, getSymbol}
  };

  const Board = () => {
    const grid = new Array(9).fill(null);
    const winCombs = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6]
    ];

    const markSymbol = (player, pos) => {
      const symbol = player.getSymbol();

      if (grid[pos] != null) {
        grid[pos] = symbol;
        return true;
      } else {
        return false;
      }
    }

    const isWon = (player) => {
      const symbol = player.getSymbol();
      const playerPosistions = grid.reduce( (arr, value, index) => {
        if (value == symbol) {
          arr.push(index); 
        }
        return arr;
      }, [] );

      const check = (arr) => { playerPosistions.some(r => arr.includes(r))};

      return winCombs.forEach(arr => check(arr)); 

    };

    const reset = () => {
      grid.forEach(cell => cell = null );
    }

    return {reset, isWon, markSymbol}

  };

  const Game = () => {

  };

  return {Player, Board, Game}
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
    cell(pos) { return `#"${pos}"`}
  }

  return { DOMSelectors, }

})();


const Controller = ((Data, UI)=> {
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
