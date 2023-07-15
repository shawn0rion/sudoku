import boards from "./boards.js";

const boardElement = document.querySelector(".board");
let board = "";
const numRows = 9;
const numCols = 9;
let lives = 3;

const selectBoard = () => {
  let randomId = Math.floor(Math.random() * boards.length) + 1;
  let currentId = board.id;
  while (randomId === currentId) {
    randomId = Math.floor(Math.random() * boards.length) + 1;
  }
  // make a copy of board array
  console.log(`random id: ${randomId}`);
  board = { ...boards.find((x) => x.id === randomId) };
  console.log(`current board: ${board.id}`);
};

const renderBoard = () => {
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      let cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      cellElement = handleBorders(cellElement);

      if (board.problem[y][x] !== "-") {
        cellElement.textContent = board.problem[y][x];
        cellElement.classList.add("fixed");
      } else {
        cellElement.contentEditable = true;
        cellElement.addEventListener("input", handleCellClick);
      }
      boardElement.appendChild(cellElement);
    }
  }
};

const handleCellClick = (event) => {
  // handles input into cell
  if (event.target.textContent.length > 0) {
    event.target.textContent = event.target.textContent.at(-1);
  }
  if (
    event.target.textContent.length === 0 &&
    !event.target.textContent.match(/[1-9]/)
  ) {
    event.target.textContent = "";

    return;
  }

  // valid inputs change the value of the problem array
  const { x, y } = event.target.dataset;
  const newValue = event.target.textContent;
  // strings are immutable so we have to split the string into an array
  board.problem[y] = [...board.problem[y]]
    .map((char, idx) => (idx === parseInt(x) ? newValue : char))
    .join("");

  if (checkSelectedTile(x, y)) {
    event.target.classList.remove("incorrect");
    event.target.classList.add("correct");
  } else {
    event.target.classList.remove("correct");
    event.target.classList.add("incorrect");
    lives--;
    updateLives();
  }
  if (board.problem.flat().join("") === board.solution.flat().join("")) {
    alert("You win!");
    init();
  }
  if (lives === 0) {
    alert("Game over!");
    init();
  }
};

const updateLives = () => {
  const livesElement = document.querySelector("#lives");
  livesElement.textContent = `Lives: ${lives}`;
};

const checkSelectedTile = (x, y) => {
  const solution = board.solution[y][x];
  const problem = board.problem[y][x];
  return solution === problem;
};

const handleBorders = (cellElement) => {
  const { x, y } = cellElement.dataset;
  // use shallow inequality bc checking numerical strings
  if (x == 2 || x == 5) {
    cellElement.classList.add("right-border");
  }
  if (y == 2 || y == 5) {
    cellElement.classList.add("bottom-border");
  }
  return cellElement;
};

const handleSelectedTile = (event) => {
  // removes seelected class from all cells
  // adds selected class to clicked cell
};

function init() {
  lives = 3;
  updateLives();
  boardElement.innerHTML = "";
  selectBoard();
  renderBoard();
}

init();
