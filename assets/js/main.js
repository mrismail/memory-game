/*
* a list that holds all cards repository
*/
const allCards = ["fa-heart", "fa-star", "fa-home", "fa-clock-o", "fa-music", "fa-glass", "fa-book", "fa-gift",
    "fa-leaf", "fa-plane", "fa-phone", "fa-bell", "fa-briefcase", "fa-scissors", "fa-cloud", "fa-envelope",
    "fa-fighter-jet", "fa-coffee", "fa-anchor", "fa-female", "fa-male", "fa-sun-o", "fa-moon-o", "fa-bug",
    "fa-cube", "fa-car", "fa-taxi", "fa-life-ring", "fa-binoculars", "fa-futbol-o", "fa-birthday-cake", "fa-bicycle",
    "fa-bus", "fa-diamond", "fa-motorcycle", "fa-shopping-bag", "fa-shopping-basket", "fa-star-o", "fa-trash-o", "fa-lock"];

let difficulty = 8;

let openList = [];

let noOfMatchedCards = 0;

let noOfMoves = 0;

const moves = document.querySelector(".moves");

const stars = document.querySelectorAll(".stars i");

const restart = document.querySelector(".restart");
restart.addEventListener("click", initiate);
// restart.onclick = initiate;

document.addEventListener('DOMContentLoaded', initiate());


/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
function initiate() {
    var playCards = preparePlayCards(allCards, difficulty);

    playCards = shuffle(playCards);

    const deck = document.querySelector(".deck");
    deck.innerHTML = "";

    for (var index = 0; index < difficulty * 2; index++) {
        const figure = document.createElement("i");
        figure.classList.add("fa");
        figure.classList.add(playCards[index]);

        const card = document.createElement("li");
        card.classList.add("card");
        card.appendChild(figure);
        card.addEventListener("click", openCard);

        deck.appendChild(card);
    }

    moves.innerText = 0;
}

function preparePlayCards(allCards, difficulty) {
    let playCards = [];
    playCards.length = difficulty * 2;

    allCards = shuffle(allCards);

    for (let index = 0; index < difficulty; index++) {
        const element = allCards[index];
        playCards[index] = element;
        playCards[index + difficulty] = element;
    }

    return playCards;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function openCard() {
    if (openList.length < 2) {
        this.classList.add("open", "show");

        openList.push(this);
        this.removeEventListener("click", openCard);

        if (openList.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    if (openList[0].isEqualNode(openList[1])) {
        cardsMatched();
    } else {
        openList[0].classList.add("no-match");
        openList[1].classList.add("no-match");
        window.setTimeout(
            cardsNotMatched, 1300);
    }

    incrementMoves();
}

function cardsMatched() {
    openList[0].classList.remove("open", "show");
    openList[0].classList.add("match");

    openList[1].classList.remove("open", "show");
    openList[1].classList.add("match");

    noOfMatchedCards += 2;
    openList = [];
    checkAllMatched();
}

function cardsNotMatched() {
    openList[0].classList.remove("open", "show", "no-match");
    openList[0].addEventListener("click", openCard);
    openList[1].classList.remove("open", "show", "no-match");
    openList[1].addEventListener("click", openCard);
    openList = [];
}

function incrementMoves() {
    var moves = document.querySelector(".moves");
    noOfMoves++;
    moves.innerText = noOfMoves;
    calculateScore();
}

function checkAllMatched() {
    if (noOfMatchedCards == difficulty * 2) {
        alert("done");
    }
}

function calculateScore() {
    if (noOfMoves > (difficulty + (difficulty / 2))) {
        if (noOfMoves < ((difficulty * 2) + (difficulty / 2))) {
            stars[2].classList.replace("fa-star", "fa-star-o");
        } else {
            stars[1].classList.replace("fa-star", "fa-star-o");
        }
    }
}