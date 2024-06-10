let playPieces = [];
let playerHand = [];
let computerHand = [];
let table = [];

const matchfield = document.getElementById('matchfield');
const stack = document.getElementById('stack');
const board = document.getElementById('board');

//*ANCHOR -  Init
window.onload = init();
function init() {
    setTimeout(() => {
        createPlayPieces();
        playPieces = shuffleArray(playPieces);
    }, 700);

    setTimeout(() => {
        get_first_Stones();
    },800);

    setTimeout(() => {
        render_Playpiece(playPieces, matchfield);
        render_Playpiece(table, board);
    }, 900);
}

//*ANCHOR -  PlayPiece
class PlayPiece {
    constructor(val, color, isJoker, uid) {
        this.uid = uid;
        this.val = val;
        this.color = color;
        this.isJoker = isJoker;
    }
}

//*ANCHOR -  create Play Pieces 
function createPlayPieces() {
    const colors = ['red', 'orange', 'blue', 'green'];
    let counter = 1;
    for (let d = 1; d <= 2; d++) {
        for (let c = 0; c < colors.length; c++) {
            for (let z = 1; z <= 13; z++) {
                playPieces.push(new PlayPiece(z, colors[c], false, `${counter}`));
                counter++;
            }
        }
        playPieces.push(new PlayPiece('🃟', 'black', true, `${counter}`))
    }
}

//*ANCHOR -  shuffle Play Pieces 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//*ANCHOR - Render Playpiece
function render_Playpiece(array, render_surface) {
    array.forEach((arr) => {

        let stone = document.createElement('div');
        stone.innerHTML = arr.val;
        const color = arr.color;
        stone.classList.add(color);
        stone.classList.add('stone');
        stone.setAttribute('data-joker', `${arr.isJoker}`);
        stone.setAttribute('data-color', `${color}`);

        render_surface.appendChild(stone);
    });
}



//* Spieler und Computer ziehen 14 Steine
function get_first_Stones() {
    for (let i = 0; i < 14; i++) {
        drawTile(playerHand);
        drawTile(computerHand);
    }
    table = playerHand;
    console.log('table', table);
}


function drawTile(hand) {
    if (playPieces.length > 0) {
        hand.push(playPieces.pop());
    }
}