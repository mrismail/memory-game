/*
* a list that holds cards repository
*/
const cardsRepo = ["fa-heart", "fa-star", "fa-home", "fa-clock-o", "fa-music", "fa-glass", "fa-book", "fa-gift",
    "fa-leaf", "fa-plane", "fa-phone", "fa-bell", "fa-briefcase", "fa-scissors", "fa-cloud", "fa-envelope",
    "fa-fighter-jet", "fa-coffee", "fa-anchor", "fa-female", "fa-male", "fa-sun-o", "fa-moon-o", "fa-bug",
    "fa-cube", "fa-car", "fa-taxi", "fa-life-ring", "fa-binoculars", "fa-futbol-o", "fa-birthday-cake", "fa-bicycle",
    "fa-bus", "fa-diamond", "fa-motorcycle", "fa-shopping-bag", "fa-shopping-basket", "fa-star-o", "fa-trash-o", "fa-lock"];

// TODO: show difficulty on UI and make it changable
// game difficulty
let difficulty = 8;

//array that hold current open cards
let openList = [];

// holds the number of matched cards
let noOfMatchedCards = 0;

// holds number of moves
let noOfMoves = 0;

const stars = document.querySelectorAll(".score-panel .stars i");

const moves = document.querySelectorAll(".moves");

const timerElements = document.querySelectorAll(".timer");

const congrats = document.querySelector(".congrats-panel");
const starsCongrats = document.querySelectorAll(".congrats-panel .stars i");

let startedPlaying = false;

//timer variables
let seconds = 0,
    minutes = 0,
    hours = 0,
    t;

const restart = document.querySelectorAll(".restart");
restart[0].addEventListener("click", initiate);
restart[1].addEventListener("click", initiate);

document.addEventListener('DOMContentLoaded', initiate());

/*
* Display the cards on the page
*/
function initiate() {
    let playCards = preparePlayCards(cardsRepo, difficulty);

    playCards = shuffle(playCards);

    drawPlayCardsOnDeck(playCards);

    resetGameStats();
}

/**
 * @description prepare play cards from cards repository after
 * @param {*} allCards
 * @param {integer} difficulty
 */
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
/**
 * @description Shuffle any array
 * @param {array} array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * @description Draw cards on deck
 * @param {array} playCards
 */
function drawPlayCardsOnDeck(playCards) {
    const deck = document.querySelector(".deck");
    deck.innerHTML = "";

    for (let index = 0; index < difficulty * 2; index++) {
        const figure = document.createElement("i");
        figure.classList.add("fa");
        figure.classList.add(playCards[index]);

        const card = document.createElement("li");
        card.classList.add("card");
        card.appendChild(figure);
        card.addEventListener("click", openCard);

        deck.appendChild(card);
    }
}

/**
 * @description Reset game states
 */
function resetGameStats() {
    openList = [];
    noOfMatchedCards = 0;

    noOfMoves = 0;
    moves[0].innerText = noOfMoves;
    moves[1].innerText = noOfMoves;

    stars[1].classList.replace("fa-star-o", "fa-star");
    starsCongrats[1].classList.replace("fa-star-o", "fa-star");
    stars[2].classList.replace("fa-star-o", "fa-star");
    starsCongrats[2].classList.replace("fa-star-o", "fa-star");

    clearTimer();

    startedPlaying = false;

    congrats.classList.add("hide");
}

/**
 * @description Open card and check match
 */
function openCard() {
    if(!startedPlaying) {
        startedPlaying = true;
        startTimer();
    }
    if (openList.length < 2) {
        this.classList.add("open", "show");

        openList.push(this);
        this.removeEventListener("click", openCard);

        if (openList.length == 2) {
            incrementMoves();
            checkMatch();
        }
    }
}

/**
 * @description check matching of opened cards
 */
function checkMatch() {
    if (openList[0].isEqualNode(openList[1])) {
        cardsMatched();
    } else {
        openList[0].classList.add("no-match");
        openList[1].classList.add("no-match");
        window.setTimeout(cardsNotMatched, 1300);
    }
}

/**
 * @description Handle matched open cards
 */
function cardsMatched() {
    openList[0].classList.remove("open", "show");
    openList[0].classList.add("match");

    openList[1].classList.remove("open", "show");
    openList[1].classList.add("match");

    noOfMatchedCards += 2;
    openList = [];
    checkAllMatched();
}

/**
 * @description Handle not matched open cards
 */
function cardsNotMatched() {
    openList[0].classList.remove("open", "show", "no-match");
    openList[0].addEventListener("click", openCard);

    openList[1].classList.remove("open", "show", "no-match");
    openList[1].addEventListener("click", openCard);

    openList = [];
}

/**
 * @description Increment no of moves per 2 cards
 */
function incrementMoves() {
    noOfMoves++;
    moves[0].innerText = noOfMoves;
    moves[1].innerText = noOfMoves;

    calculateScore();
}

/**
 * @description Calculate score of stars
 */
function calculateScore() {
    if (noOfMoves > (difficulty + (difficulty / 2))) {
        if (noOfMoves < ((difficulty * 2) + (difficulty / 2))) {
            stars[2].classList.replace("fa-star", "fa-star-o");
            starsCongrats[2].classList.replace("fa-star", "fa-star-o");
        } else {
            stars[1].classList.replace("fa-star", "fa-star-o");
            starsCongrats[1].classList.replace("fa-star", "fa-star-o");
        }
    }
}

// timer function https://jsfiddle.net/Daniel_Hug/pvk6p/
/**
 * @description Increment Timer
 */
function increamentTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    time = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":"
        + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":"
        + (seconds > 9 ? seconds : "0" + seconds);

    timerElements[0].textContent = time;
    timerElements[1].textContent = time;
}

/**
 * @description Start Timer
 */
function startTimer() {
    t = setInterval(increamentTimer, 750);
}

/**
 * @description Stop timer
 */
function stopTimer() {
    clearInterval(t);
}

/**
 * @description Clear Timer
 */
function clearTimer() {
    stopTimer();
    timerElements[0].textContent = "00:00:00";
    timerElements[1].textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}


/**
 *  @description Cheack that all cards matched to show congrats messsage
 */
function checkAllMatched() {
    if (noOfMatchedCards == difficulty * 2) {
        stopTimer();

        congrats.classList.remove("hide");
    }
}
