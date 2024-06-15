let stackPieces = [];
let playerHand = [];
let computerHand = [];
let boardTiles = [];
let selectedStone = null;
let is_firstmove = true;
let move_Tile_Array = [];

const boardElement = document.getElementById('matchfield');
const stackElement = document.getElementById('stack');
const playerHandElement = document.getElementById('board');
const infoLabel = document.getElementById('lbl_info');

//*ANCHOR -  Init
window.onload = init;

function init() {
    setTimeout(() => {
        createPlayPieces();
        stackPieces = shuffleArray(stackPieces);
        createFields();
    }, 400);

    setTimeout(() => {
        dealInitialTiles();
    }, 500);

    setTimeout(() => {
        updateUI();
    }, 600);


    setTimeout(() => {
        const stones = document.querySelectorAll('.stone');
        stones.forEach((stone) => {
            stone.addEventListener('click', () => {
                clearSelection();
                stone.classList.add('selected-stone');

                const sel_id = stone.dataset.id;
                const sel_place = stone.dataset.place;
                console.log('sel_place', sel_place);
                if (sel_place === 'playerHand') {
                    selectedStone = get_Object_by_ID(sel_id, playerHand);
                    boardTiles.push(selectedStone)
                } else if (sel_place === 'board') {
                    console.log('BOARD');
                }
            })
        })
    }, 1000);
}

function get_Object_by_ID(uid, place_array) {
    for (let i = 0; i < place_array.length; i++) {
        if (uid === place_array[i].uid) {
            return place_array[i];
        }
    }
}

//*ANCHOR -  Klasse PlayPiece
class PlayPiece {
    constructor(value, name, color, isJoker, uid) {
        this.uid = uid;
        this.value = value;
        this.color = color;
        this.isJoker = isJoker;
        this.name = name;
        this.place = '';
    }

    change_place(newPlace) {
        this.place = newPlace;
    }
}

//*ANCHOR -  create Play Pieces 
function createPlayPieces() {
    const colors = ['red', 'orange', 'blue', 'green'];
    let uidCounter = 1;

    for (let d = 1; d <= 2; d++) {
        for (const color of colors) {
            for (let value = 1; value <= 13; value++) {
                stackPieces.push(new PlayPiece(value, value, color, false, `${uidCounter++}`));
            }
        }
        //* Joker 
        stackPieces.push(new PlayPiece(0, `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.2 4.2 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A3 3 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515zM4.969 9.75A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>
</svg>`, 'black', true, `${uidCounter++}`));
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
function renderPlayPieces(array, renderSurface) {
    renderSurface.innerHTML = '';
    console.log('renderSurface', renderSurface);
    array.forEach(piece => {
        const tileElement = document.createElement('div');
        tileElement.innerHTML = piece.name;
        tileElement.className = `${piece.color} stone`;
        tileElement.dataset.joker = piece.isJoker;
        tileElement.dataset.color = piece.color;
        tileElement.dataset.place = piece.place;
        tileElement.dataset.id = piece.uid;

        // tileElement.addEventListener('click', () => {
        //     clearSelection();
        //     tileElement.classList.add('selected-stone');
        //     selectedStone = piece;
        //     console.log('Miep');
        // });

        renderSurface.appendChild(tileElement);
    });
}

function clearSelection() {
    document.querySelectorAll('.selected-stone').forEach(element => {
        element.classList.remove('selected-stone');
    });
}

//* Spieler und Computer ziehen 14 Steine
function dealInitialTiles() {
    for (let i = 0; i < 14; i++) {
        drawTile(playerHand);
        drawTile(computerHand);
    }
}

//* Draw Tiles
function drawTile(hand) {
    if (stackPieces.length > 0) {
        hand.push(stackPieces.pop());
    }
}

function updateUI() {
    assignPlaces(stackPieces, 'stack');
    assignPlaces(computerHand, 'computerHand');
    assignPlaces(boardTiles, 'board');
    assignPlaces(playerHand, 'playerHand');

    renderPlayPieces(playerHand, playerHandElement);
}

function assignPlaces(tileArray, placeName) {
    tileArray.forEach(tile => {
        tile.place = placeName;
    });
}

function createFields() {
    for (let i = 1; i <= 14; i++) {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'field-wrapper';
        fieldWrapper.id = `field_wrapper${i}`;

        for (let j = 1; j <= 13; j++) {
            const field = document.createElement('div');
            field.className = 'field';
            field.id = `field_wrapper${i}_${j}`;
            field.dataset.holdId = '';
            field.dataset.holdColor = '';
            field.dataset.holdValue = '';

            field.addEventListener('click', () => {
                if (selectedStone) {
                    placeTileOnField(field);
                }
                if (event.target.hasAttribute('data-hold-id') && event.target.getAttribute('data-hold-id') !== '') {
                    // Suche nach dem Kindelement, das das Attribut data-id besitzt
                    let childElement = event.target.querySelector('[data-id]');
                    if (childElement) {
                        // Lese das Attribut data-id des Kindelements aus
                        let dataId = childElement.getAttribute('data-id');
                        console.log('data-id:', dataId);
                        selectedStone = get_Object_by_ID(dataId, 'boardTiles')
                        // Hier kannst du weiteren Code hinzufügen, um mit dataId zu arbeiten
                        if (selectedStone) {
                            placeTileOnField(field);
                        }
                    }
                }
            });

            fieldWrapper.appendChild(field);
        }

        boardElement.appendChild(fieldWrapper);
    }
}

function placeTileOnField(field) {
    const selectedIndex = playerHand.indexOf(selectedStone);
    console.log('1 selectedIndex', selectedIndex);
    if (selectedIndex !== undefined) {
        move_Tile_Array.push(selectedStone);
        console.log('move_Tile_Array', move_Tile_Array);
    }
    field.dataset.holdId = selectedStone.uid;
    field.dataset.holdColor = selectedStone.color;
    field.dataset.holdValue = selectedStone.value;

    const tileElement = document.createElement('div');
    tileElement.innerHTML = selectedStone.name;
    tileElement.className = `${selectedStone.color} stone`;
    tileElement.dataset.joker = selectedStone.isJoker;
    tileElement.dataset.color = selectedStone.color;
    tileElement.dataset.place = 'board';
    tileElement.dataset.id = selectedStone.uid;

    // tileElement.addEventListener('click', () => {
    //     clearSelection();
    //     tileElement.classList.add('selected-stone');
    // });

    field.appendChild(tileElement);

    playerHand.splice(selectedIndex, 1);
    renderPlayPieces(playerHand, playerHandElement);

    selectedStone = null;
}


