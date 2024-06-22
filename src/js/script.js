let nachziehstapel = [];
let playerHand = [];
let computerHand = [];
let playground = [];
let clipboard = [];
let selectedStone = null;
let is_firstmove = true;
let is_Move_from_Playerhand = false;
let is_Move_from_Clipboard = false;

const playgroundElement = document.getElementById('playground');
const nachziehElement = document.getElementById('nachziehElement');
const playerHandElement = document.getElementById('playerhand');
const infoLabel = document.getElementById('lbl_info');
const clipboardElement = document.getElementById('clipboardElement');
const dropzone_playerhand = document.getElementById('dropzone_playerhand');
const finishRound = document.getElementById('finishRound');

window.onload = init;

function init() {
    setTimeout(() => {
        createPlayStones();
        nachziehstapel = shuffleArray(nachziehstapel);
        createFields();
    }, 100);

    setTimeout(() => {
        set_fieldNumbers()
        dealInitialStones();
    }, 200);

    setTimeout(() => {
        initUI();
    }, 300);
}

function get_Object_by_ID(uid, place_array) {
    return place_array.find(item => item.uid === uid);
}

class PlayStones {
    constructor(value, name, color, isJoker, uid) {
        this.uid = uid;
        this.value = value;
        this.color = color;
        this.isJoker = isJoker;
        this.name = name;
        this.place = '';
        this.playgroundCoord = '';
    }

    change_place(newPlace) {
        this.place = newPlace;
    }
}

function check_anytime() {
    if (clipboard.length === 0) {
        clipboardElement.classList.remove('active');
    }
}

function createPlayStones() {
    const colors = ['red', 'orange', 'blue', 'green'];
    let uidCounter = 1;

    for (let d = 1; d <= 2; d++){
        for (const color of colors) {
            for (let value = 1; value <= 13; value++) {
                nachziehstapel.push(new PlayStones(value, value, color, false, `${uidCounter++}`));
            }
        }
        nachziehstapel.push(new PlayStones(0, `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.2 4.2 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A3 3 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515zM4.969 9.75A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>
        </svg>`, 'black', true, `${uidCounter++}`));
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderPlayerhand(array, renderSurface) {
    renderSurface.innerHTML = '';

    array.forEach(piece => {
        const tileElement = document.createElement('div');
        tileElement.innerHTML = piece.name;
        tileElement.className = `${piece.color} stone`;
        tileElement.dataset.joker = piece.isJoker;
        tileElement.dataset.color = piece.color;
        tileElement.dataset.place = piece.place;
        tileElement.dataset.id = piece.uid;

        tileElement.addEventListener('click', () => {
            is_Move_from_Playerhand = true;
            clearSelection();
            tileElement.classList.add('selected-stone');
            selectedStone = piece;
            dropzone_playerhand.classList.remove('active');
        });
        renderSurface.appendChild(tileElement);
    });
}

function renderClipBoard(array, renderSurface) {
    renderSurface.innerHTML = '';
    renderSurface.classList.remove('active');

    array.forEach(piece => {
        renderSurface.classList.add('active');
        const tileElement = document.createElement('div');
        tileElement.innerHTML = piece.name;
        tileElement.className = `${piece.color} stone`;
        tileElement.dataset.joker = piece.isJoker;
        tileElement.dataset.color = piece.color;
        tileElement.dataset.place = piece.place;
        tileElement.dataset.id = piece.uid;

        tileElement.addEventListener('click', () => {
            is_Move_from_Clipboard = true;
            clearSelection();
            tileElement.classList.add('selected-stone');
            selectedStone = piece;
            dropzone_playerhand.classList.add('active');
        });
        renderSurface.appendChild(tileElement);
    });
}

function clearSelection() {
    document.querySelectorAll('.selected-stone').forEach(element => {
        element.classList.remove('selected-stone');
    });
}

function dealInitialStones() {
    for (let i = 0; i < 14; i++) {
        drawTile(playerHand); 
        //drawTile(computerHand); //TODO - Später wieder rein
    }
}

//*ANCHOR -  Draw Tile
function drawTile(hand) {
    if (nachziehstapel.length > 0) {
        hand.push(nachziehstapel.pop());
        const nachziehstapelSize = nachziehstapel.length;
        nachziehElement.innerHTML = nachziehstapelSize;
        console.log(nachziehstapelSize);
    }
}

//*ANCHOR -  Init UI
function initUI() {
    assignPlaces(nachziehstapel, 'nachzieh');
    assignPlaces(computerHand, 'computerHand');
    assignPlaces(playground, 'playground');
    assignPlaces(playerHand, 'playerHand');

    renderPlayerhand(playerHand, playerHandElement);
    renderClipBoard(clipboard, clipboardElement);
}

//*ANCHOR - Assign Places
function assignPlaces(tileArray, placeName) {
    tileArray.forEach(tile => {
        tile.change_place(placeName);
    });
}

//*ANCHOR - Create Fields
function createFields() {
    for (let i = 1; i <= 22; i++) {
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
            field.dataset.fieldNumber = j;

            fieldWrapper.appendChild(field);
        }

        playgroundElement.appendChild(fieldWrapper);
    }
}

//*ANCHOR - Set Field Numbers
function set_fieldNumbers() {
    const allFields = document.querySelectorAll('.field');

    allFields.forEach((field) => {
        const currentFieldNumber = field.getAttribute('data-field-number');
        
        // Check if a span element already exists in the field
        if (!field.querySelector('span')) {
            let numberSpan = document.createElement('span');
            numberSpan.innerHTML = currentFieldNumber;
            field.appendChild(numberSpan);
        }
    });
}


setTimeout(() => {
    document.querySelectorAll('.field').forEach(field => {
        field.addEventListener('click', (event) => {
            const targetField = event.currentTarget;
            const fieldHoldId = targetField.getAttribute('data-hold-id');

            if (selectedStone) {
                if (is_Move_from_Playerhand || is_Move_from_Clipboard) {
                    moveStoneToField(selectedStone, targetField);
                    selectedStone = null;
                    is_Move_from_Playerhand = false;
                    is_Move_from_Clipboard = false;
                }
            } else if (fieldHoldId) {
                const stone = get_Object_by_ID(fieldHoldId, playground);
                if (stone) {
                    moveStoneToClipboard(stone, targetField);
                }
            }
            check_anytime();
        });
    });
}, 1000);

function moveStoneToField(stone, field) {
    playground.push(stone);
    if (is_Move_from_Playerhand) {
        removeFromArray(playerHand, stone);
    } else if (is_Move_from_Clipboard) {
        removeFromArray(clipboard, stone);
        dropzone_playerhand.classList.remove('active');
    }
    renderPlayerhand(playerHand, playerHandElement);
    renderClipBoard(clipboard, clipboardElement);
    addStoneToField(stone, field);
}

function moveStoneToClipboard(stone, field) {
    clipboard.push(stone);
    removeFromArray(playground, stone);
    renderClipBoard(clipboard, clipboardElement);
    removeStoneFromField(field);
}

function removeFromArray(array, stone) {
    const index = array.findIndex(item => item.uid === stone.uid);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function addStoneToField(stone, field) {
    field.setAttribute('data-hold-id', stone.uid);
    field.setAttribute('data-hold-color', stone.color);
    field.setAttribute('data-hold-value', stone.value);

    const tileElement = document.createElement('div');
    tileElement.innerHTML = stone.name;
    tileElement.className = `${stone.color} stone`;
    tileElement.dataset.joker = stone.isJoker;
    tileElement.dataset.color = stone.color;
    tileElement.dataset.id = stone.uid;

    field.appendChild(tileElement);
}


function removeStoneFromField(field) {
    field.removeAttribute('data-hold-id');
    field.removeAttribute('data-hold-color');
    field.removeAttribute('data-hold-value');
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
    set_fieldNumbers()
}

dropzone_playerhand.addEventListener('click', () => {
    try {
        if (selectedStone) {
            moveStoneToPlayerHand(selectedStone, clipboardElement, clipboard);
            renderClipBoard(clipboard, clipboardElement);
            selectedStone = null;
            dropzone_playerhand.classList.remove('active');
        }
    } catch (error) {
        console.log(error);
    }
});

function moveStoneToPlayerHand(stone, renderSurface, delFromArr) {
    playerHand.push(stone);
    removeFromArray(delFromArr, stone);
    renderPlayerhand(playerHand, playerHandElement);
    renderSurface.innerHTML = '';
}

//*ANCHOR - Nachziehen
nachziehElement.addEventListener('click', () => {
    drawTile(playerHand);
    renderPlayerhand(playerHand, playerHandElement);
    finish_Round();
});

//*ANCHOR - Finish Round
finishRound.addEventListener('click', ()=> {
    finish_Round();
})

function finish_Round() {
    clearInvalidMarks();
    checkPlayground();
}
//*ANCHOR Check Valid
function checkPlayground() {
    let valid = true;
    clearInvalidMarks();
    let totalFirstMoveValue = 0;
    const field_wrappers = document.querySelectorAll('.field-wrapper');

    //* Iterate through each field wrapper (rows)
    for (let i = 1; i <= field_wrappers.length; i++) {
        let stones = [];

        //* Iterate through each field in the wrapper (row)
        for (let j = 1; j <= 13; j++) {
            const field = document.getElementById(`field_wrapper${i}_${j}`);
            const fieldStone = field ? getStoneFromField(field) : null;

            if (fieldStone) stones.push(fieldStone);
        }

        //* Check if the stones follow the rules within the wrapper (row)
        if (!checkStoneGroup(stones, i)) {
            valid = false;
        }
    }

    if (is_firstmove && is_Move_from_Playerhand) {
        console.log('is_Move_from_Playerhand', is_Move_from_Playerhand);
        if (totalFirstMoveValue >= 30) {
            infoLabel.textContent = 'First move is valid.';
            is_firstmove = false;
        } else {
            infoLabel.textContent = 'Für deinen ersten Zug benötigst du mindestend 30 Punkte.';
            valid = false;
        }
    } else {
        if (valid) {
            infoLabel.textContent = 'Alles Paletti :)';
            infoLabel.style.background = 'green';
        } else {
            infoLabel.textContent = 'Fehlerhafter Zug';
            infoLabel.style.background = 'red';
        }
    }
}

function getStoneFromField(field) {
    const holdId = field.getAttribute('data-hold-id');
    if (holdId) {
        return get_Object_by_ID(holdId, playground);
    }
    return null;
}

function checkStoneGroup(stones, rowIndex) {
    if (stones.length < 2) return true;

    let isValid = true;

    if (isSameColorGroup(stones) && checkAscendingValues(stones)) {
        return true;
    } else if (isSameValueGroup(stones) && checkUniqueColors(stones)) {
        return true;
    } else if (containsJoker(stones)) {
        if (checkWithJoker(stones)) {
            return true;
        }
    }

    markInvalid(stones, rowIndex);
    return false;
}

function isSameColorGroup(stones) {
    return stones.every(stone => stone.color === stones[0].color);
}

function checkAscendingValues(stones) {
    stones.sort((a, b) => a.value - b.value);
    for (let i = 1; i < stones.length; i++) {
        console.log(stones[i]);
        if (stones[i].value !== stones[i - 1].value + 1 && !stones[i - 1].isJoker) {
            return false;
        }
    }
    return true;
}

function isSameValueGroup(stones) {
    return stones.every(stone => stone.value === stones[0].value || stone.isJoker);
}

function checkUniqueColors(stones) {
    const colors = new Set(stones.map(stone => stone.color));
    return colors.size === stones.length;
}

function containsJoker(stones) {
    return stones.some(stone => stone.isJoker);
}

function checkWithJoker(stones) {
    let nonJokerStones = stones.filter(stone => !stone.isJoker);

    if (isSameColorGroup(nonJokerStones)) {
        return checkAscendingValues(nonJokerStones);
    } else if (isSameValueGroup(nonJokerStones) && checkUniqueColors(nonJokerStones)) {
        return true;
    }

    return false;
}

function markInvalid(stones, rowIndex) {
    stones.forEach(stone => {
        const field = document.querySelector(`.field[data-hold-id="${stone.uid}"]`);
        if (field) {
            field.classList.add('invalid-stone');
        }
    });
}

function clearInvalidMarks() {
    document.querySelectorAll('.invalid-stone').forEach(field => {
        field.classList.remove('invalid-stone');
    });
}

function calculateTotalValue(stones) {
    return stones.reduce((total, stone) => total + (stone.isJoker ? 0 : stone.value), 0);
}
