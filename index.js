let gameTurn = 0;
let currentPlayer;
let board;

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

    if(coordinates.x < 0 || coordinates.x > 2 && coordinates.y < 0 && coordinates.y > 2){
      displayMessage("Invalid coordinate entered");
    }
    else if(board[coordinates.x][coordinates.y] !== ""){
      displayMessage("Position is already taken on board");
    } 
    else {
      handleMove(coordinates, currentPlayer)
    }
    if(!isPlayerYHuman){
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
    }
}

// this function is called whenever the user presses
// the button labeled `Generate AI coordinates`
function processAICoordinate() {
  if (gameTurn % 2 === 0) {
    currentPlayer = "diamond";
  } else {
    currentPlayer = "pets";
    let ok = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = "pets";
          ok = 1;
          break;
        }
      }
      if (ok == 1) {
        break;
      }
    }
  }
  gameTurn++;
  displayBoard(board);
  setHTMLvisibilityForInputHumanCoordinates(true);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
}

function handleMove(coordinates, currentPlayer){
  board[coordinates.x][coordinates.y] = currentPlayer;
  displayBoard(board);
  gameTurn += 1;

  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
      displayMessage(`Player ${currentPlayer} has won !`);
  } else if (gameTurn === 9) {
      displayMessage(`It's a tie`);
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
  resetBoard();
  setHTMLvisibilityForInputGameMode(true);
  setHTMLvisibilityForInputHumanCoordinates(false);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
  setHTMLvisibilityForButtonLabeledReset(false);
  gameTurn = 0;
  displayBoard(board);
  console.log(`resetGame()`);
}

// this function should change from A1..C3 to coordinates
// that are present in the `board` global variable
function extractCoordinates(input) {

    // this is a sample of what should be returned if the
    // the user had typed `A1`
    // you need to add the to also treat other cases (A2..C3)
    let legend = {A: 0, B: 1, C: 2}
    let x = legend[input[0]]
    let y = Number(input[1]) - 1
    return {x, y};
}

// this function should return `X` or `O` or undefined (carefull it's not a string )
// based on interpreting the values in the board variable
function getWinningPlayer(board) {
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
        if(rowWinner(line) != undefined){
            return rowWinner(line)
        }
    }

    return undefined
}

//returns the winner of a length 3 array of coordinates, and returns undefined if no winner exists
function rowWinner(line){
    line = line.map(cell => board[cell[0]][cell[1]])
    if(line[0] == line[1] && line[0] == line[2]){
        if(line[0] == 'diamond')
            return 'X'
        else if(line[0] == 'pets')
            return 'O'
    }
    return undefined
}
