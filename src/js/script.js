const colors = ['red', 'orange', 'blue', 'green'];
const playPieceAmount = 104;
const jokerAmount = 2;
let playPieces = [];
let shuffled_playpieces = [];


const matchfield = document.getElementById('matchfield');
const stack = document.getElementById('stack');

//*ANCHOR -  Init
window.onload = init();
function init() {
    setTimeout(() => {
        createPlayPieces();
    }, 1000);
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

    shuffled_playpieces = shuffleArray(playPieces);
    console.log(playPieces);
    render_Playpiece();
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
function render_Playpiece() {
    shuffled_playpieces.forEach((playpiece) => {

        let stone = document.createElement('div');
        stone.innerHTML = playpiece.val;
        const color = playpiece.color;
        stone.classList.add(color);
        stone.classList.add('stone');
        stone.setAttribute('data-joker', `${playpiece.isJoker}`);
        stone.setAttribute('data-color', `${color}`);

        matchfield.appendChild(stone);
    })
}