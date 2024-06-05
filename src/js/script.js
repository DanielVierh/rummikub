const colors = ['red', 'orange', 'blue', 'green'];
const playPieceAmount = 104;
const jokerAmount = 2;
let playPieces = [];


const matchfield = document.getElementById('matchfield');

//*ANCHOR -  Init
window.onload = init();
function init() {
   setTimeout(() => {
    createPlayPieces();
    createPlayPieces();
   }, 1000);
}

//*ANCHOR -  PlayPiece
class PlayPiece {
    constructor(val, color, isJoker) {
        this.val = val;
        this.color = color;
        this.isJoker = isJoker;
    }
}

//*ANCHOR -  create Play Pieces 
function createPlayPieces() {
    for(let c = 0; c < colors.length; c++) {
        for(let z = 1; z <= 13; z++) {
            playPieces.push(new PlayPiece(z,colors[c],false))
        }
    }

    playPieces.push(new PlayPiece('🃟','black',true))

 render_Playpiece();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//*ANCHOR - Render Playpiece
function render_Playpiece() {
    const shuffled_playpieces = shuffleArray(playPieces)
    shuffled_playpieces.forEach((playpiece) => {

        let stone = document.createElement('div');
        stone.innerHTML = playpiece.val;
        const color = playpiece.color;
        stone.classList.add(color);
        stone.classList.add('stone');
        stone.setAttribute('data-joker', `${playpiece.isJoker}`);

        matchfield.appendChild(stone);
    })
}