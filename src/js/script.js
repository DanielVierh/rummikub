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

    //shuffled_playpieces = shuffleArray(playPieces);
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
    playPieces.forEach((playpiece) => {

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


//* Drag and drop
const king = document.getElementById('king');
const squares = document.querySelectorAll('.square');
const infoDisplay = document.getElementById('info');

// Desktop drag events
king.addEventListener('drag', dragging);
king.addEventListener('dragstart', dragStart);

squares.forEach((square) => {
    square.addEventListener('dragover', dragOver);
    square.addEventListener('dragenter', dragEnter);
    square.addEventListener('dragleave', dragLeave);
    square.addEventListener('drop', dragDrop);
    square.addEventListener('dragend', dragEnd);
});

// Mobile touch events for the king
king.addEventListener('touchstart', touchStart);
king.addEventListener('touchmove', touchMove);
king.addEventListener('touchend', touchEnd);

let beingDragged;

function dragStart(e) {
    beingDragged = e.target;
    console.log("dragging has started on " + beingDragged.id);
}

function dragging() {
    console.log(beingDragged.id + " is being dragged");
    infoDisplay.innerHTML = beingDragged.id + " is being dragged";
}

function dragOver(e) {
    e.preventDefault();
    console.log('you are dragging something over ' + e.target.classList);
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('highlighted');
    console.log('you are entering the space of ' + e.target.classList);
}

function dragLeave(e) {
    e.target.classList.remove('highlighted');
    console.log('you are leaving the space of ' + e.target.classList);
}

function dragDrop(e) {
    e.target.classList.remove('highlighted');
    console.log('you have dropped something into ' + e.target.classList);
    e.target.append(beingDragged);
}

function dragEnd(e) {
    e.target.classList.add('target');
    setTimeout(() => {
        e.target.classList.remove('target');
    }, 100);
    console.log('The drag has ended in ' + e.target.classList);
}

// Touch event handlers for king only
function touchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    beingDragged = e.target;
    beingDragged.style.position = 'absolute';
    beingDragged.style.left = touch.pageX - (beingDragged.offsetWidth / 2) + 'px';
    beingDragged.style.top = touch.pageY - (beingDragged.offsetHeight / 2) + 'px';
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    beingDragged.style.left = touch.pageX - (beingDragged.offsetWidth / 2) + 'px';
    beingDragged.style.top = touch.pageY - (beingDragged.offsetHeight / 2) + 'px';
}

function touchEnd(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (dropTarget && dropTarget.classList.contains('square')) {
        dropTarget.append(beingDragged);
        console.log('you have dropped something into ' + dropTarget.classList);
    }
    beingDragged.style.position = 'static';
}