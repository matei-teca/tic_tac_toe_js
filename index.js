let gameTurn = 0;
let currentPlayer;
let board;
let gameOver = false;
let Aimode=0
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
    case "ai-ai":
      isPlayerXHuman = false;
      isPlayerYHuman = false;
      setHTMLvisibilityForInputGameMode(false);
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
      setHTMLvisibilityForButtonLabeledReset(true);
      Aimode=1
      break;
  }
  resetBoard();

  displayMessage("Player X's turn");
}

// this function is called whenever the user presses the `enter`
// key in the input box labeled `enter coordinates`
// paramerter: input - the content of the input box
function processHumanCoordinate(input) {
  let valid=true;
    console.log(`'processHumanCoordinate('${input}')`);
    if (gameTurn % 2 === 0) {
        currentPlayer = "diamond";
    } else {
        currentPlayer = "pets";
    }

    let coordinates = extractCoordinates(input);
    
    if(coordinates.x < 0 || coordinates.x > 2 || coordinates.y < 0 || coordinates.y > 2){
      displayMessage("Invalid coordinate entered");
      valid=false;
    }
    else if(board[coordinates.x][coordinates.y] !== ""){
      displayMessage("Position is already taken on board");
      valid=false;
    } 
    else {
      handleMove(coordinates, currentPlayer)
    }
    if(!valid){
      if (e.key === 'Enter') {
    return processHumanCoordinate(e.target.value);
    }
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
    console.log(board)

  if(currentPlayer == "pets"|| currentPlayer=="diamond"){
    let coordinates
    if(gameTurn==0 && Aimode==1){
      coordinates={x:Math.floor(Math.random()*3), y:Math.floor(Math.random()*3)}
    }
    else{
      coordinates= secondAi()
      console.log(a,b)
    }
      handleMove(coordinates, currentPlayer)
  }
  
if(Aimode==0){
  setHTMLvisibilityForInputHumanCoordinates(true);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
}
  if(gameOver){
    setHTMLvisibilityForInputHumanCoordinates(false);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }
}

// Trivial strategy. AI fills the first free cell.
let checkThese1=[]
for(let i = 0; i <= 2; ++i){
  let row = []
  let col = []
  for(let j = 0; j <= 2; ++j){
      row.push([i, j])
      col.push([j, i])
  }
  checkThese1.push(row)
  checkThese1.push(col)
}
checkThese1.push([[0,0], [1,1], [2,2]])
checkThese1.push([[0,2], [1,1], [2,0]])



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
function getWinningPlayer(board2) {
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
        if(rowWinner(line,board2) != undefined){
            return rowWinner(line,board2)
        }
    }

    return undefined
}
//returns the winner of a length 3 array of coordinates, and returns undefined if no winner exists
function rowWinner(line,board2){
    line = line.map(cell => board2[cell[0]][cell[1]])
    if(line[0] == line[1] && line[0] == line[2]){
        if(line[0] == 'diamond')
            return 'diamond'
        else if(line[0] == 'pets')
            return 'pets'
    }
    return undefined
}
