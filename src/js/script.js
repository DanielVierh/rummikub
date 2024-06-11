let stackPieces = [];
let playerHand = [];
let brett = [];
let computerHand = [];
let board = [];
let board_sets = [];

const board_obj = document.getElementById('matchfield');
const stack_obj = document.getElementById('stack');
const brett_obj = document.getElementById('board');
const lbl_info = document.getElementById('lbl_info');

//*ANCHOR -  Init
window.onload = init();
function init() {
    setTimeout(() => {
        createPlayPieces();
        stackPieces = shuffleArray(stackPieces);
    }, 400);

    setTimeout(() => {
        get_first_Stones();
    }, 500);

    setTimeout(() => {
        update();
    }, 600);
}

//*ANCHOR -  Klasse PlayPiece
class PlayPiece {
    constructor(val, name, color, isJoker, uid, place) {
        this.uid = uid;
        this.val = val;
        this.color = color;
        this.isJoker = isJoker;
        this.place = place;
        this.name = name;
    }
}

// //* Klasse Sets
// class Sets {
//     constructor() {

//     }
// }

//*ANCHOR -  create Play Pieces 
function createPlayPieces() {
    const colors = ['red', 'orange', 'blue', 'green'];
    let counter = 1;
    for (let d = 1; d <= 2; d++) {
        for (let c = 0; c < colors.length; c++) {
            for (let z = 1; z <= 13; z++) {
                stackPieces.push(new PlayPiece(z, z, colors[c], false, `${counter}`));
                counter++;
            }
        }
        stackPieces.push(new PlayPiece(0, '🃟', 'black', true, `${counter}`))
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
        stone.innerHTML = arr.name;
        const color = arr.color;
        stone.classList.add(color);
        stone.classList.add('stone');
        stone.setAttribute('data-joker', `${arr.isJoker}`);
        stone.setAttribute('data-color', `${color}`);
        stone.setAttribute('data-place', `${arr.place}`);

        stone.addEventListener('click', () => {
            remove_all_selections();
            stone.classList.add('selected-stone');
        })

        render_surface.appendChild(stone);
    });
}

function remove_all_selections() {
    let used_class = document.querySelectorAll('.selected-stone')
    used_class.forEach((used)=> {
        used.classList.remove('selected-stone')
    });
}


//* Spieler und Computer ziehen 14 Steine
function get_first_Stones() {
    for (let i = 0; i < 14; i++) {
        drawTile(playerHand);
        drawTile(computerHand);
    }
    brett = playerHand;
}


function drawTile(hand) {
    if (stackPieces.length > 0) {
        hand.push(stackPieces.pop());
    }
}

function update() {
    set_places(stackPieces, 'stackPieces');
    set_places(computerHand, 'computerHand');
    set_places(board, 'board');
    set_places(brett, 'brett');
    render_Playpiece(brett, brett_obj);
}


function set_places(tilesetArray, array_name) {
    tilesetArray.forEach((tile) => {
        if (array_name === 'stackPieces') {
            tile.place = 'stack';
        }

        if (array_name === 'computerHand') {
            tile.place = 'computerHand';
        }

        if (array_name === 'board') {
            tile.place = 'board'
        }

        if (array_name === 'brett') {
            tile.place = 'brett';
        }
    });
}