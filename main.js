class TicTacToeGame {
  constructor(boardEl, infoEl, singleplayer = false) {
    this.boardEl = boardEl;
    this.infoEl = infoEl;
    this.singleplayer = singleplayer;

    this.EMPTY = 1;
    this.X_VALUE = 2;
    this.O_VALUE = 3;
    this.X_CLASS = 'x';
    this.O_CLASS = 'o';
    this.xTurn = true;
    this.isWon = null;
    this.cells = [];
    this.cellsEl = [];
    this.WIN_POSITION = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    this.initCells();
    this.initRenderCells();
    this.render();
  }

  initCells() {
    for (let i = 0; i < 9; i++) {
      this.cells.push(this.EMPTY);
    }
  }

  clickCell(index) {
    if (index < 0 || index >= this.cells.length) {
      return;
    }

    if (this.isWon) {
      return;
    }

    if (this.cells[index] !== this.EMPTY) {
      return;
    }

    if (this.xTurn) {
      this.cells[index] = this.X_VALUE;
    } else {
      this.cells[index] = this.O_VALUE;
    }

    this.isWon = this.checkWin(this.cells, this.xTurn);
    if (!this.isWon) {
      this.xTurn = !this.xTurn;
    }

    this.render();

    if (this.singleplayer && !this.isWon && !this.xTurn) {
      this.bestMove();
    }
  }

  initRenderCells() {
    for (let i = 0; i < this.cells.length; i++) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');
      cellEl.addEventListener('click', () => this.clickCell(i));
      this.cellsEl.push(cellEl);
      this.boardEl.appendChild(cellEl);
    }
  }

  renderCells() {
    for (let i = 0; i < this.cells.length; i++) {
      const cellEl = this.cellsEl[i];

      if (this.cells[i] == this.X_VALUE) {
        cellEl.classList.add(this.X_CLASS);
      } else if (this.cells[i] == this.O_VALUE) {
        cellEl.classList.add(this.O_CLASS);
      } else {
        cellEl.classList.remove(this.X_CLASS);
        cellEl.classList.remove(this.O_CLASS);
      }
    }
  }

  renderInfo() {
    if (!this.isWon) {
      if (this.singleplayer) {
        this.infoEl.innerHTML = `It's ${this.xTurn ? 'Your' : 'Computer'} turn`;
      } else {
        this.infoEl.innerHTML = `It's ${this.xTurn ? 'X' : 'O'} turn`;
      }
    } else {
      if (this.isWon === this.EMPTY) {
        this.infoEl.innerHTML = `It's a draw`;
      } else {
        if (this.singleplayer) {
          this.infoEl.innerHTML = `Game over! ${
            this.isWon === this.X_VALUE ? 'You' : 'Computer'
          } won`;
        } else {
          this.infoEl.innerHTML = `Game over! ${
            this.isWon === this.X_VALUE ? 'X' : 'O'
          } won`;
        }
      }
    }
  }

  render() {
    this.renderCells();
    this.renderInfo();
  }

  checkWin(cells, xTurn) {
    const position = [];
    const filled = [];
    const currVal = xTurn ? this.X_VALUE : this.O_VALUE;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== this.EMPTY) {
        filled.push(i);
        if (cells[i] === currVal) {
          position.push(i);
        }
      }
    }

    for (const pos of this.WIN_POSITION) {
      if (pos.every((val) => position.includes(val))) {
        return currVal;
      }
    }

    if (filled.length === cells.length) {
      return this.EMPTY;
    }

    return null;
  }

  reset() {
    this.xTurn = true;
    this.isWon = null;
    this.cells = [];
    this.initCells();
    this.render();
  }

  evaluate(xTurn) {
    const win = this.checkWin(this.cells, xTurn);
    // console.log(this.debugCells(), this.debugCell(win));
    if (win === this.X_VALUE) {
      return 1024;
    } else if (win === this.O_VALUE) {
      return -1024;
    } else if (win === this.EMPTY) {
      return 0;
    }

    if (xTurn) {
      let max = -Infinity;
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === this.EMPTY) {
          this.cells[i] = this.X_VALUE;
          const score = this.evaluate(!xTurn);
          this.cells[i] = this.EMPTY;
          max = Math.max(max, score);
        }
      }
      return max / 2;
    } else {
      let min = Infinity;
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === this.EMPTY) {
          this.cells[i] = this.O_VALUE;
          const score = this.evaluate(!xTurn);
          this.cells[i] = this.EMPTY;
          min = Math.min(min, score);
        }
      }
      return min / 2;
    }
  }

  bestMove() {
    if (this.isWon) {
      return;
    }

    if (this.xTurn) {
      let max = -Infinity;
      let bestMove = -1;
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === this.EMPTY) {
          this.cells[i] = this.X_VALUE;
          const score = this.evaluate(!this.xTurn);
          // console.log(this.debugCells(), score);
          this.cells[i] = this.EMPTY;
          if (score > max) {
            max = score;
            bestMove = i;
          }
        }
      }
      // console.log({
      //   max,
      //   bestMove,
      // });
      this.clickCell(bestMove);
    } else {
      let min = Infinity;
      let bestMove = -1;
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === this.EMPTY) {
          this.cells[i] = this.O_VALUE;
          const score = this.evaluate(!this.xTurn);
          // console.log(this.debugCells(), score);
          this.cells[i] = this.EMPTY;
          if (score < min) {
            min = score;
            bestMove = i;
          }
        }
      }
      // console.log({
      //   min,
      //   bestMove,
      // });
      this.clickCell(bestMove);
    }
  }

  debugCells() {
    return this.cells.map((v) => this.debugCell(v)).join('');
  }

  debugCell(cell) {
    if (cell === this.EMPTY) {
      return ' ';
    } else if (cell === this.X_VALUE) {
      return 'X';
    } else if (cell === this.O_VALUE) {
      return 'O';
    }
    return '?';
  }
}

const boardElement = document.getElementById('board');
const infoText = document.getElementById('info');

const restartButton = document.getElementById('restart');
const modeButton = document.getElementById('mode');

const game = new TicTacToeGame(boardElement, infoText, true);

restartButton.addEventListener('click', () => {
  game.reset();
});

modeButton.addEventListener('click', () => {
  game.singleplayer = !game.singleplayer;
  game.reset();
});
