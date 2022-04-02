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
// key down logic
Document.addEventListener("keydown", (event)=>{
  // if we aren't playin right now, get me out of here!
  if(!inGame) return;

  // TODO
  // key down logic
});

/*******************************************************************************
 * Varibales we don't expect to change (we haven't coverd const yet)
 ******************************************************************************/

// the key for getting the stats from local storage
var statsKey = "stats";
var timerStart = 10;

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
var timeRemaining = timerStart; // time left on the timer
var displayValue = "HE _ _ O"; // what is displayed on the word guess

var timerIntervalID; // used to hold the timer's setInterval() ID;
var currentWord; // the current solution to the wordguess
var playerGuess; // what the player has guessed so far including blanks
var inGame = false; // if we are in a game currently

/*******************************************************************************
 * FUNCTIONS!
 ******************************************************************************/

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
 * the word.
 */
function start(){
  console.log("starting the game!");

  // choose a random word to be the correct one
  currentWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  // make the player's guess a bunch of spaces
  playerGuess = playerGuess = ' '.repeat(currentWord.length);

  // starts the countdown, triggers every second, checks for wins or losses
  timerIntervalID = setInterval(()=>{
    timeRemaining--;
    updateTimer();
    if (checkWin()){win();} // if we are in a winning state we win!
    if (timeRemaining < 0){lose();} // if we are out of time we lose!
  },1000);
  // makes the start button invisible
  startButton.style.display = "none";
}


/**
 * Called when the player loses the game. Increments the losses by one and 
 * writes to local storage, then resets the game to starting state.
 */
function lose(){
  losses++; 
  updateScore(); 
  updateStorage(); 
  resetTimer();
   // show them what the solution was
  playerGuess = currentWord;
  updateWordField();

  // start button reappears
  startButton.style.display = "";
}

/**
 * Called when the player wins the game increments the wins by one and writes
 * to local storage
 */
function win(){
  wins++;
  updateScore();
  updateStorage();
  resetTimer();
}

/**
 * Stops the timer and resets it to the beginning
 */
function resetTimer(){
  clearInterval(timerIntervalID); // stops the countdown
  timeRemaining = timerStart; // reset the countdown
  updateTimer(); // propogate value to DOM
  startButton.style.display = ""; // make the start button visible again
}

/**
 * Goes into the storage and gets an object with the statistics
 * @returns {object} the stats object. 
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

/**
 * Checks to see if the player has won. 
 * @returns {boolean} True if player has won false if not. Does not indicate 
 * loss state.
 */
function checkWin(){
  if (currentWord == playerGuess){
    return true;
  }
  return false;
}

/**
 * Converts a single word into how it should be displayed to the player on the
 * DOM. Substitutes spaces for blank spots.
 * @param {string} word the word to convert
 * @returns {string} a string that can be written directly to the DOM
 */
function convertWordDOM(word){
  displayValue = "";
  for(var i = 0; i < word.length; i++){
    var char  = word.charAt(i);
    if (char == " "){
      displayValue = displayValue + "_ ";
    } else {
      displayValue = displayValue + char.toUpperCase() + " ";
    }
  }
  
  return displayValue;
}

/**
 * Updates the word field to be appropriate based on the current state of 
 * variables
 */
function updateWordField(){
  displayValue = convertWordDOM(playerGuess);
  wordFieldEle.textContent = displayValue;
}

/**
 * Returns true if the letter is in the word false if not
 * @param {string} letter a single character of a string
 * @returns {boolean} 
 */
function checkLetter(letter){
  return false;
}

init();