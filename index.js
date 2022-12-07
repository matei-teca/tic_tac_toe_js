let gameTurn = 0;
let currentPlayer;
let board;
let gameOver = false;

// this function will be called whenever the user changes
// the `select` input labeled `please select game mode`
function setGameMode(selectedValue) {
  switch (selectedValue) {
    case "human-human":
      isPlayerXHuman = true;
      isPlayerYHuman = true;
      setHTMLvisibilityForInputGameMode(false);
      setHTMLvisibilityForInputHumanCoordinates(true);
      setHTMLvisibilityForInputAiCoordinatesInput(false);
      setHTMLvisibilityForButtonLabeledReset(true);
      break;
    case "human-ai":
      isPlayerXHuman = true;
      isPlayerYHuman = false;
      setHTMLvisibilityForInputGameMode(false);
      setHTMLvisibilityForInputHumanCoordinates(true);
      setHTMLvisibilityForInputAiCoordinatesInput(false);
      setHTMLvisibilityForButtonLabeledReset(true);
      break;
  }
  resetBoard();

  displayMessage("Player X's turn");
}

// this function is called whenever the user presses the `enter`
// key in the input box labeled `enter coordinates`
// paramerter: input - the content of the input box
function processHumanCoordinate(input) {
    console.log(`'processHumanCoordinate('${input}')`);
    if (gameTurn % 2 === 0) {
        currentPlayer = "diamond";
    } else {
        currentPlayer = "pets";
    }

    let coordinates = extractCoordinates(input);

    if(coordinates.x < 0 || coordinates.x > 2 || coordinates.y < 0 || coordinates.y > 2){
      displayMessage("Invalid coordinate entered");
    }
    else if(board[coordinates.x][coordinates.y] !== ""){
      displayMessage("Position is already taken on board");
    } 
    else {
      handleMove(coordinates, currentPlayer)
      console.log(`Best result attainable for ${other(currentPlayer)}:`, treeSearchAI(board, other(currentPlayer), 0))
    }
    if(!isPlayerYHuman){
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
    }
    if(gameOver){
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(false);
    }
}

// this function is called whenever the user presses
// the button labeled `Generate AI coordinates`
function processAICoordinate() {
  if (gameTurn % 2 === 0) {
    currentPlayer = "diamond";
  } else {
    currentPlayer = "pets";
  }

  if(currentPlayer == "pets"){
    let coordinates = basicAI(currentPlayer)[0]

    if(coordinates.x < 0 || coordinates.x > 2 || coordinates.y < 0 || coordinates.y > 2){
      displayMessage("Invalid coordinate entered");
    }
    else if(board[coordinates.x][coordinates.y] !== ""){
      displayMessage("Position is already taken on board");
    } 
    else {
      handleMove(coordinates, currentPlayer)
    }
  }

  setHTMLvisibilityForInputHumanCoordinates(true);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
  if(gameOver){
    setHTMLvisibilityForInputHumanCoordinates(false);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }
}

let verbose = true
// Trivial strategy. AI fills the first free cell.
function basicAI(currentPlayer){
  return treeSearchAI(board, currentPlayer, 0)
}

//input: state - a board configuration
//       currentPlayer - the player to move
//   
//output: returns [the best move, if relevant, outcome for current player] as a 2-array
function treeSearchAI(state, currentPlayer, depth){
  let winningPlayer = getWinningPlayer(state);
  // a winner was found
  if (winningPlayer != undefined) { 
    winningPlayer = (winningPlayer == 'X' ? 'diamond' : 'pets')
    return [undefined, winningPlayer == currentPlayer ? 'w' : 'l'] 
  }

  // if there is no winner and no moves, it is a draw
  let moves = legalMoves(state)
  if(moves.length == 0){ 
    return [undefined, 'd']
  }

  // recursively call the function for all of our possible moves
  let results = []
  for(let move of moves){
    let nextState = cloneBoard(state)
    nextState[move.x][move.y] = currentPlayer
    let [_, outcomeForOpponent] = treeSearchAI(nextState, other(currentPlayer), depth + 1)
    results.push([move, outcomeForOpponent])
  }

  //Case 1: one of our moves makes the opponent lose, so we select it and are winning.
  for(let x of results){
    let [move, outcome] = x
    if(outcome == 'l')
      return [move, 'w']
  }

  //Case 2: one of our moves forces a draw and we are not in Case 1.
  for(let x of results){
    let [move, outcome] = x
    if(outcome == 'd')
      return [move, 'd']
  }

  //Case 3: we are not in case 1 or 2 so we just pick a random losing move.
  let [move, _] = results[0]
  return [move, 'l']
}

function legalMoves(state){
  let moves = []
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (state[i][j] == "")
        moves.push({x: i, y: j})
  return moves
}

function cloneBoard(state){
  let clone = []
  for (let i = 0; i < 3; i++){
    clone[i] = []
    for (let j = 0; j < 3; j++)
      clone[i][j] = state[i][j]
  }
  return clone
}

function other(player){
  return player == 'diamond' ? 'pets' : 'diamond'
}

function handleMove(coordinates, currentPlayer){
  board[coordinates.x][coordinates.y] = currentPlayer;
  displayBoard(board);
  gameTurn += 1;

  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
      displayMessage(`Player ${currentPlayer} has won !`);
      gameOver = true;
  } else if (gameTurn === 9) {
      displayMessage(`It's a tie`);
      gameOver = true;
  } else {
      if(currentPlayer === "diamond"){
          displayMessage(`Player pets' turn`);
      } else if(currentPlayer === "pets"){
          displayMessage(`Player diamond's turn`);
      }
  } 
}

// this function is called when the user clicks on
// the button labeled `Restart Game`
function resetGame() {
  location.reload()
  console.log(`resetGame()`);
}

// this function should change from A1..C3 to coordinates
// that are present in the `board` global variable
function extractCoordinates(input) {

    // this is a sample of what should be returned if the
    // the user had typed `A1`
    // you need to add the to also treat other cases (A2..C3)
    let legend = {A: 0, B: 1, C: 2}
    let x = legend[input[0].toUpperCase()]
    let y = Number(input[1]) - 1
    return {x, y};
}

// this function should return `X` or `O` or undefined (carefull it's not a string )
// based on interpreting the values in the board variable
function getWinningPlayer(state) {
    let checkThese = []

    for(let i = 0; i <= 2; ++i){
        let row = []
        let col = []
        for(let j = 0; j <= 2; ++j){
            row.push([i, j])
            col.push([j, i])
        }
        checkThese.push(row)
        checkThese.push(col)
    }
    checkThese.push([[0,0], [1,1], [2,2]])
    checkThese.push([[0,2], [1,1], [2,0]])

    for(let line of checkThese){
        if(rowWinner(line, state) != undefined){
            return rowWinner(line, state)
        }
    }

    return undefined
}

//returns the winner of a length 3 array of coordinates, and returns undefined if no winner exists
function rowWinner(line, state){
    line = line.map(cell => state[cell[0]][cell[1]])
    if(line[0] == line[1] && line[0] == line[2]){
        if(line[0] == 'diamond')
            return 'X'
        else if(line[0] == 'pets')
            return 'O'
    }
    return undefined
}
