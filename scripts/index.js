let Gameboard = {
    position0: '',
    position1: '',
    position2: '',
    position3: 'X',
    position4: '',
    position5: 'O',
    position6: '',
    position7: '',
    position8: '',
}

function render_board(Gameboard) {
    let board = document.getElementById('gameboard');
    
    for (let key in Gameboard) {
     console.log(Gameboard[key]);
    }
    console.log(board);

}

render_board(Gameboard)