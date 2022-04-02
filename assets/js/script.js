/*jshint esversion:6*/
/*******************************************************************************
 * References for the elements on the DOM we need to interact with
 ******************************************************************************/
var winsEle = document.querySelector("#wins-score");
var lossesEle = document.querySelector("#losses-score");
var startButton = document.querySelector("#start-button");
var timerEle = document.querySelector("#timer-text");
var wordFieldEle = document.querySelector(".startlet");

/*******************************************************************************
 * Event listeners that we need
 ******************************************************************************/

startButton.addEventListener("click", start);

/*******************************************************************************
 * Varibales we don't expect to change (we haven't coverd const yet)
 ******************************************************************************/

// the key for getting the stats from local storage
var statsKey = "stats";

// all possible words that can be solutions
var wordBank = [
  "variable",
  "logic",
  "Turing",
  "switch",
  "loop",
  "Asimov"
];


/*******************************************************************************
 * Varables to be modified during the game
 ******************************************************************************/

var wins = 0; // how many times we have won
var losses = 0; // how many times we have lost
var timeRemaining = 10; // time left on the timer
var currentSolution = []; // what letters the player currently has
var displayValue = "HE _ _ O"; // what is displayed on the word guess

/**
 * This function is called at load time for the page. Checks local storage for
 * already given values
 */
function init(){
  var stats = localStorage.getItem("stats");
  console.log(stats);
  // if we get something that's not null set up everything
  if (stats){
    stats = JSON.parse(stats);
    wins = stats.wins;
    losses = stats.losses;
    updateScore();
    return;
  }

  // if we don't lets make an entry to update
  updateStorage();
}

/**
 * Looks updates the score with the appropriate values
 */
function updateScore(){
  winsEle.textContent = wins;
  lossesEle.textContent = losses;
  
}

/**
 * Updates the timer with the right time
 */
function updateTimer(){
  timerEle.textContent = timeRemaining + " seconds remaining!";
}

/**
 * Updates the word field with the correct value given
 */
function updateWordField(){
  wordFieldEle.textContent = displayValue;
}

/**
 * This is called when the start button is clicked. Starts the timer and sets up
 * the word
 */
function start(){
  console.log("starting the game!");
}


/**
 * Called when the player loses the game. Increments the losses by one and 
 * writes to local storage
 */
function lose(){
  losses++;
  updateScore();
  updateStorage();
}

/**
 * Called when the player wins the game increments the wins by one and writes
 * to local storage
 */
function win(){
  wins++;
  updateScore();
  updateStorage();
}

/**
 * Goes into the storage and gets an object with the statistics
 * @returns {object} the stats object 
 */
function getStorage(){
  return JSON.parse(localStorage.getItem(statsKey));
}

/**
 * Updates local storage with current statistics we have
 */
function updateStorage (){
  stats = {
    "wins": wins,
    "losses": losses
  };
  localStorage.setItem(statsKey, JSON.stringify(stats));
}

init();