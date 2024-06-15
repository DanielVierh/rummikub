let nachziehstapel = [];
let playerHand = [];
let computerHand = [];
let playground = [];
let selectedStone = null;
let is_firstmove = true;
let is_Move_from_Playerhand = false;
let move_StonesFromHand_Array = [];
let is_Move_from_Playground = false;
let move_StonesFromPlayground_Array = [];

const playgroundElement = document.getElementById('playground');
const nachziehElement = document.getElementById('nachziehElement');
const playerHandElement = document.getElementById('playerhand');
const infoLabel = document.getElementById('lbl_info');

//* -Es gibt eine Klasse für Playstone Attri: value, name, color, isJoker, uid -- Place 
//* -Spielsteine werden erzeugt und random in Array gespeichert Nachzieh 
//* -Felder werden kreiert. Diese erhalten ein Klick Event: Ermittelt, ob Feld bereits belegt oder welche ID darin enthalten ist
//* -Spielsteine werden zu je 14 Stück an Playerhand Computerhand verteilt
//* -Update UI sorgt für Darstellung auf alles Ebenen 
//* -
//*
//*### Spielablauf ###
//* Vor jeder Runde: RenderPlaystones
//* RenderPlaystones: je nach array, unterschiedliche Event Listener
//* Wenn Playerhand:
//* Add EventListener um Stein auf Board abzulegen
//* 1. Round:
//* Ich bin am Zug und sehe meine 14 Steine. Ich muss Steine mit einem Mindestwert in Summe von 30 ablegen
//* Erlaubte Kombos: 1-13 || 3 x gleiche Farbe 
//* Klicke auf Stein im Board:
//* 
//*
//*
//*
//*Klick auf Feld: 
//*Ermitteln ob Stein vorhanden. Wenn ja, Reihe auswerten und sortieren || Wenn nein:  Stein ablegen und Reihe sortieren/auswerten
//*
//*
//*Wie werden Veränderungen erfasst
//* Beispiel man wählt ein Stein vom Playerhand aus und legt diesen auf den Playground:
//* Klick auf Stein-- 
//*Stein 
//* Klick auf Feld
//* 
//* 

//*ANCHOR -  Init
window.onload = init;

function init() {
    setTimeout(() => {
        createPlayStones();
        nachziehstapel = shuffleArray(nachziehstapel);
        createFields();
    }, 100);

    setTimeout(() => {
        dealInitialStones();
    }, 200);

    setTimeout(() => {
        initUI();
    }, 300);
}

//*ANCHOR Get Object 
function get_Object_by_ID(uid, place_array) {
    for (let i = 0; i < place_array.length; i++) {
        if (uid === place_array[i].uid) {
            return place_array[i];
        }
    }
}

//*ANCHOR -  Klasse PlayStones
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

//*ANCHOR -  create Play Stones 
function createPlayStones() {
    const colors = ['red', 'orange', 'blue', 'green'];
    let uidCounter = 1;

    for (let d = 1; d <= 2; d++) {
        for (const color of colors) {
            for (let value = 1; value <= 13; value++) {
                nachziehstapel.push(new PlayStones(value, value, color, false, `${uidCounter++}`));
            }
        }
        //* Joker 
        nachziehstapel.push(new PlayStones(0, `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.2 4.2 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A3 3 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515zM4.969 9.75A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>
</svg>`, 'black', true, `${uidCounter++}`));
    }
}

//*ANCHOR -  shuffle Play Stones 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//*ANCHOR - Render PlayStones 
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

        //* Event Listener um selectedStone zu übergeben
        tileElement.addEventListener('click', () => {
            is_Move_from_Playerhand = true;
            clearSelection();
            tileElement.classList.add('selected-stone');
            selectedStone = piece;
        })
        renderSurface.appendChild(tileElement);
    });
}

//*ANCHOR Remove Selection Class
function clearSelection() {
    document.querySelectorAll('.selected-stone').forEach(element => {
        element.classList.remove('selected-stone');
    });
}

//* Spieler und Computer ziehen 14 Steine
function dealInitialStones() {
    for (let i = 0; i < 14; i++) {
        drawTile(playerHand);
        drawTile(computerHand);
    }
}

//* Aus dem Nachzieh Stape entfernen und in Hand
function drawTile(hand) {
    if (nachziehstapel.length > 0) {
        hand.push(nachziehstapel.pop());
    }
}

//*ANCHOR Update
function initUI() {
    assignPlaces(nachziehstapel, 'nachzieh');
    assignPlaces(computerHand, 'computerHand');
    assignPlaces(playground, 'playground');
    assignPlaces(playerHand, 'playerHand');

    renderPlayerhand(playerHand, playerHandElement);
}


//*ANCHOR Assign Place
function assignPlaces(tileArray, placeName) {
    tileArray.forEach(tile => {
        tile.change_place(placeName);
    });
}


//*ANCHOR Create Fields
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

            // field.addEventListener('click', (event) => {
            //     //* Check if field hast child
            //     if (event.target.hasAttribute('data-hold-id') && event.target.getAttribute('data-hold-id') !== '') {
            //         if (is_Move_from_Playerhand === true) {
            //             console.warn('Illegal Move');
            //         } else {
            //             is_Move_from_Playground = true;
            //             console.log('is_Move_from_Playground', is_Move_from_Playground);
            //         }
            //         // Suche nach dem Kindelement, das das Attribut data-id besitzt
            //         let childElement = event.target.querySelector('[data-id]');
            //         if (childElement) {
            //             // Lese das Attribut data-id des Kindelements aus
            //             let dataId = childElement.getAttribute('data-id');
            //             console.log('data-id:', dataId);
            //             // Hier kannst du weiteren Code hinzufügen, um mit dataId zu arbeiten
            //         }
            //     } else {
            //         //! Check if from Hand or from Playground 
            //         if (is_Move_from_Playerhand) {
            //             //* -Selected Stone ist eine Kopie von ausgewählten Stein
            //             //* -Daher von Playerhand gezogen, muss Stein in Zwischen Array. 
            //             const board_field_coord = field.id;
            //             selectedStone.playgroundCoord = board_field_coord;
            //             console.log('selectedStone', selectedStone);
            //             move_StonesFromHand_Array.push(selectedStone);
            //             playground.push(selectedStone);

            //             const tileElement = document.createElement('div');
            //             tileElement.innerHTML = selectedStone.name;
            //             tileElement.className = `${selectedStone.color} stone`;
            //             tileElement.dataset.joker = selectedStone.isJoker;
            //             tileElement.dataset.color = selectedStone.color;
            //             tileElement.dataset.place = selectedStone.place;
            //             tileElement.dataset.id = selectedStone.uid;

            //             field.appendChild(tileElement);

            //             selectedStone = null;

            //         }
            //     }

            // });

            fieldWrapper.appendChild(field);
        }

        playgroundElement.appendChild(fieldWrapper);
    }
}


//* Event Listener für Spielfeldklicks hinzufügen
setTimeout(() => {
document.querySelectorAll('.field').forEach(field => {
    field.addEventListener('click', (event) => {
        const targetField = event.currentTarget;
        const fieldHoldId = targetField.getAttribute('data-hold-id');

        if (selectedStone) {
            if (is_Move_from_Playerhand) {
                //* Stein vom playerHand zum Spielfeld verschieben
                moveStoneToField(selectedStone, targetField);
                is_Move_from_Playerhand = false;
                selectedStone = null;
            } else if (fieldHoldId) {
                console.warn('Illegal Move');
            }
        } else if (fieldHoldId) {
            //* Stein vom Spielfeld zurück zur playerHand verschieben
            const stone = get_Object_by_ID(fieldHoldId, playground);
            if (stone) {
                moveStoneToPlayerHand(stone, targetField);
            }
        }
    });
});
}, 1000);


function moveStoneToField(stone, field) {
    //* Stein zum Spielfeld-Array hinzufügen
    playground.push(stone);
    //* Stein von der playerHand entfernen
    removeFromArray(playerHand, stone);
    //* UI-Update
    renderPlayerhand(playerHand, playerHandElement);
    addStoneToField(stone, field);
}


function moveStoneToPlayerHand(stone, field) {
    //* Stein zur playerHand hinzufügen
    playerHand.push(stone);
    //* Stein vom Spielfeld-Array entfernen
    removeFromArray(playground, stone);
    //* UI-Update
    renderPlayerhand(playerHand, playerHandElement);
    removeStoneFromField(field);
}

function removeFromArray(array, stone) {
    const index = array.findIndex(item => item.uid === stone.uid);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function addStoneToField(stone, field) {
    //* Feld-Attribute aktualisieren
    field.setAttribute('data-hold-id', stone.uid);
    field.setAttribute('data-hold-color', stone.color);
    field.setAttribute('data-hold-value', stone.value);

    //* Stein-Element zum Feld hinzufügen
    const tileElement = document.createElement('div');
    tileElement.innerHTML = stone.name;
    tileElement.className = `${stone.color} stone`;
    tileElement.dataset.joker = stone.isJoker;
    tileElement.dataset.color = stone.color;
    tileElement.dataset.id = stone.uid;

    field.appendChild(tileElement);
}

function removeStoneFromField(field) {
    //* Feld-Attribute zurücksetzen
    field.removeAttribute('data-hold-id');
    field.removeAttribute('data-hold-color');
    field.removeAttribute('data-hold-value');
    
    //* Stein-Element vom Feld entfernen
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}


