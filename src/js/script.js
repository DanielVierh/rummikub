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
    playPieces.push(new PlayPiece('🃟','black',true))

 render_Playpiece()
}


//*ANCHOR - Render Playpiece
function render_Playpiece() {
    playPieces.forEach((playpiece) => {
        console.log(playpiece);

        let stone = document.createElement('div');
        stone.innerHTML = playpiece.val;
        const color = playpiece.color;
        stone.classList.add(color);
        stone.classList.add('stone');
        stone.setAttribute('data-joker', `${playpiece.isJoker}`);

        matchfield.appendChild(stone);
    })
}