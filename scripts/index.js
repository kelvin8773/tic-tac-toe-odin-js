let Gameboard = {
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
}

function render_board(Gameboard) {
    let cells = document.getElementsByClassName('cell');

    for (let key in Gameboard) {
        let i = parseInt(key);
        cells[i].innerText = Gameboard[key];
    }
    
}


render_board(Gameboard)