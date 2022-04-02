/*jshint esversion:6*/
/*******************************************************************************
 * References for the elements on the DOM we need to interact with
 ******************************************************************************/
var winsEle = document.querySelector("#wins-score");
var lossesEle = document.querySelector("#losses-score");
var startButton = document.querySelector("#start-button");
var timerEle = document.querySelector("#timer-text");
var wordFieldEle = document.querySelector(".startlet");
var resetButtonEle = document.querySelector(".reset");

/*******************************************************************************
 * Event listeners that we need
 ******************************************************************************/

// the start button starts the game
startButton.addEventListener("click", start);

// the reset score button resets local storage
resetButtonEle.addEventListener("click", ()=>{
  wins = 0;
  losses = 0;
  updateStorage();
  updateScore();
});

// key down logic
document.addEventListener("keydown", (event)=>{
  // if we aren't playin right now, get me out of here!
  if(!inGame) return;
  // make it so we aren't worrying about case sensitivity
  var input = event.key.toLowerCase();
  
  // check to see if the key we got is in the guess
  if(checkLetter(input)){
    // replace the letter in the player's guess
    replaceLetter(input);
  }
  
});

/*******************************************************************************
 * Varibales we don't expect to change (we haven't coverd const yet)
 ******************************************************************************/

// the key for getting the stats from local storage
var statsKey = "stats";
var timerStart = 10;

/**
 * All possible words that can be solutions. Should be lower case and no 
 * whitespace or special characters.
 */
var wordBank = [
  "variable",
  "logic",
  "turing",
  "switch",
  "loop",
  "asimov",
  "javascript",
  "function",
  "method",
  "declaration"
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
 *  Cleans up variables and resets them after a game is over 
 */
function cleanUp(){
  // stops the timer and sets it to 10 seconds
  resetTimer();
  // if we lost show them the answer
  playerGuess = currentWord;
  updateWordField();
  inGame = false;
  updateStorage();
  startButton.style.display = ""; // make the start button visible again

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
  console.log("The answer is: " + currentWord);
  
  // make the player's guess a bunch of spaces
  playerGuess = playerGuess = ' '.repeat(currentWord.length);

  // propogate the lack of guessing to the DOM
  updateWordField();

  // we are now in game
  inGame = true;
  

  // starts the countdown, triggers every second, checks for wins or losses
  timerIntervalID = setInterval(()=>{
    timeRemaining--;
    // update DOM
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
  cleanUp();
}

/**
 * Called when the player wins the game increments the wins by one and writes
 * to local storage
 */
function win(){
  wins++;
  updateScore();
  cleanUp();
}

/**
 * Stops the timer and resets it to the beginning.
 */
function resetTimer(){
  clearInterval(timerIntervalID); // stops the countdown
  timeRemaining = timerStart; // reset the countdown
  updateTimer(); // propogate value to DOM
  
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
 * Returns true if the letter is in the current word we are testing, false if 
 * not
 * @param {string} letter a single character of a string
 * @returns {boolean} 
 */
function checkLetter(letter){
  for (var i = 0; i < currentWord.length; i++){
    if (letter == currentWord.charAt(i)) return true;
  }
  return false;
}

/**
 * Takes a single character and replaces the appropriate characters in 
 * player guess from being spaces to that character, then updates the UI
 * @param {string} char 
 */
function replaceLetter(char){
  for(var i =0; i < currentWord.length; i++){
    // if the letter we got as an argument is equal to the current letter 
    if (currentWord.charAt(i) == char){
      // replace the character in the same spot with it
      playerGuess = playerGuess.substring(0, i ) + char + playerGuess.substring(i+1);
    }
    // update the DOM
    updateWordField();
  }
}

init();