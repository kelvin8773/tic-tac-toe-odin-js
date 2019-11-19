// let Gameboard = {
//     0: '',
//     1: '',
//     2: '',
//     3: 'O',
//     4: '',
//     5: '',
//     6: '',
//     7: '',
//     8: 'x',
// }
let Gameboard = []

const player1 = 'X';
const player2 = 'O';

const gameBoard = (() => {

    const cells = document.querySelectorAll('.cell');

    // function game() {
    //     document.querySelector(".restart").style.display = "none";

    // }

    function render_board(Gameboard) {
        //let cells = document.getElementsByClassName('cell');

        Gameboard = Array.from(Array(8).keys());
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
            // cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', clicks, false);
        }
    }

    function clicks(cell) {
        turn(cell.target.id, player1);
        console.log(cell.target.id);
    }

    function turn(cellId, player) {

        Gameboard[cellId] = player;
        document.getElementById(cellId).innerText = player;

    }
    return render_board;

})();

gameBoard(Gameboard);

const Player = (player, number) => {

    return { player, number }

};