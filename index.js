const root = document.querySelector(".root");
let blackBoxMovingStatus = false;
const winDiv = document.getElementById("winner");
const restartButton = document.getElementById("restart-button");
const restartButtonLoser = document.getElementById("restart-button-loser");
const looserDiv = document.getElementById("loser");
const resetGame = () => {
  const newBoard = new Board();
  for (let i = 0; i < board.length; i++) {
    board[i] = newBoard[i];
  }

  winDiv.style.display = "none";
  render();
};
const resetGameLoser = () => {
  const newBoard = new Board();
  for (let i = 0; i < board.length; i++) {
    board[i] = newBoard[i];
  }

  looserDiv.style.display = "none";
  render();
};
restartButtonLoser.addEventListener("click", resetGameLoser);

restartButton.addEventListener("click", resetGame);

class Board {
  constructor() {
    this.board = this.#init();
    return this.board;
  }

  #getRedPosition() {
    const randomIndexesTwoStartRed = [
      [0, 0],
      [0, 5],
      [5, 0],
      [5, 5],
    ];
    const redPositionIndex = Math.floor(Math.random() * 4);
    
    return randomIndexesTwoStartRed[redPositionIndex];
  }
  

  #getBlackPositions([redRow, redCol]) {
    const boardSize = 6;
    const mid = Math.floor(boardSize / 2);

    const rowOffset = redRow === 0 ? boardSize - 1 : 0;
    const colOffset = redCol === 0 ? boardSize - 1 : 0;

    return [
      [rowOffset, mid - 1],
      [rowOffset, mid],
      [mid - 1, colOffset],
      [mid, colOffset],
    ];
  }

  #init() {
    const board = [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ];

    const redPosition = this.#getRedPosition();
    board[redPosition[0]][redPosition[1]] = "red";

    const blackPositions = this.#getBlackPositions(redPosition);
    blackPositions.forEach(([rowIndexForBlack, columnIndexForBlack]) => {
      board[rowIndexForBlack][columnIndexForBlack] = "black";
    });
    if (redPosition[0] === 0 && redPosition[1] === 0) {
      board[5][5] = "green";
    }
    if (redPosition[0] === 0 && redPosition[1] === 5) {
      board[5][0] = "green";
    }
    if (redPosition[0] === 5 && redPosition[1] === 0) {
      board[0][5] = "green";
    }
    if (redPosition[0] === 5 && redPosition[1] === 5) {
      board[0][0] = "green";
    }

    return board;
  }
}
const board = new Board();

const getBlackBoxPositions = () => {
  const blackBoxes = [];

  board.forEach((row, rowIndex) => {
    row.forEach((box, columnIndex) => {
      if (box === "black") {
        blackBoxes.push([rowIndex, columnIndex]);
      }
    });
  });

  return blackBoxes;
};

const getNearestPositionIntoRed = (blackPosition) => {
  const [blackRow, blackCol] = blackPosition;
  const [redRow, redCol] = getRedBoxPosition();

  const possibleMoves = [
    [blackRow - 1, blackCol],
    [blackRow + 1, blackCol],
    [blackRow, blackCol - 1],
    [blackRow, blackCol + 1],
  ];

  const validMoves = possibleMoves.filter(([row, col]) => {
    return row >= 0 && col >= 0 && row < 6 && col < 6 && board[row][col] === "";
  });

  if (validMoves.length === 0) {
    return [blackRow, blackCol];
  }

  return validMoves.reduce((bestMove, currentMove) => {
    const [currentRow, currentCol] = currentMove;
    const [bestRow, bestCol] = bestMove;

    const currentDistance =
      Math.abs(currentRow - redRow) + Math.abs(currentCol - redCol);
    const bestDistance =
      Math.abs(bestRow - redRow) + Math.abs(bestCol - redCol);

    return currentDistance < bestDistance ? currentMove : bestMove;
  }, validMoves[0]);
};
const hasValidMovesForRed = () => {
  const [redRow, redCol] = getRedBoxPosition();

  const possibleMoves = [
    [redRow - 1, redCol],
    [redRow + 1, redCol],
    [redRow, redCol - 1],
    [redRow, redCol + 1],
  ];

  return possibleMoves.some(([row, col]) => {
    return row >= 0 && col >= 0 && row < 6 && col < 6 && board[row][col] === "";
  });
};

const moveBlacksPositions = () => {
  blackBoxMovingStatus = true;

  const blackBoxes = getBlackBoxPositions();

  blackBoxes.forEach((blackBox, index) => {
    setTimeout(() => {
      const [currentRow, currentCol] = blackBox;
      const newPosition = getNearestPositionIntoRed(blackBox); 

      if (newPosition[0] !== currentRow || newPosition[1] !== currentCol) {
        board[currentRow][currentCol] = "";
        board[newPosition[0]][newPosition[1]] = "black";
      }

      render();

      if (index === blackBoxes.length - 1) {
        blackBoxMovingStatus = false;
      }
    }, 200 * (index + 1));
  });
};

const getRedBoxPosition = () => {
  return board.reduce((acc, row, rowIndex) => {
    const columnIndex = row.findIndex((boxValue) => boxValue === "red");

    if (columnIndex !== -1) {
      acc = [rowIndex, columnIndex];
    }

    return acc;
  }, []);
};

const moveRedBox = (event) => {
  if (blackBoxMovingStatus) return;

  const redPosition = getRedBoxPosition();

  const goToDown = () => {
    const currentMovedPosition = [redPosition[0] + 1, redPosition[1]];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "green") {
      winDiv.style.display = "block";
      winDiv.classList.add("win-div");
    }
  };

  const goToUp = () => {
    const currentMovedPosition = [redPosition[0] - 1, redPosition[1]];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "green") {
      winDiv.style.display = "block";
      winDiv.classList.add("win-div");
    }
  };

  const goToRight = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] + 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "green") {
      winDiv.style.display = "block";
      winDiv.classList.add("win-div");
    }
  };

  const goToLeft = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] - 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "green") {
      winDiv.style.display = "block";
      winDiv.classList.add("win-div");
    }
  };

  const eventActions = {
    ArrowDown: goToDown,
    ArrowUp: goToUp,
    ArrowRight: goToRight,
    ArrowLeft: goToLeft,
  };

  if (eventActions?.[event.code]) {
    event?.preventDefault?.();
    eventActions[event.code]();
    if (!hasValidMovesForRed()) {
      looserDiv.style.display = "block";
      looserDiv.classList.add("looser-div");
    }
  }
};

const moveControl = () => {
  document.removeEventListener("keydown", moveRedBox);
  document.addEventListener("keydown", moveRedBox);

  const buttonToTop = document.querySelector(".button-to-top");
  const buttonToDown = document.querySelector(".button-to-down");
  const buttonToLeft = document.querySelector(".button-to-left");
  const buttonToRight = document.querySelector(".button-to-right");

  buttonToTop.onclick = () => moveRedBox({ code: "ArrowUp" });
  buttonToDown.onclick = () => moveRedBox({ code: "ArrowDown" });
  buttonToLeft.onclick = () => moveRedBox({ code: "ArrowLeft" });
  buttonToRight.onclick = () => moveRedBox({ code: "ArrowRight" });
};

const render = () => {
  root.innerHTML = "";
  board.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");

    row.forEach((column) => {
      const boxEl = document.createElement("div");
      boxEl.classList.add("box");
      if (column !== "") {
        boxEl.classList.add(column);
      }
      rowEl.appendChild(boxEl);
    });

    root.appendChild(rowEl);
  });

  moveControl();
};

render();
 
