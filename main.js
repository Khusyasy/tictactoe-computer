class TicTacToeGame {
  constructor(boardEl, infoEl) {
    this.boardEl = boardEl;
    this.infoEl = infoEl;
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

    this.isWon = this.checkWin();
    if (!this.isWon) {
      this.xTurn = !this.xTurn;
    }

    this.render();
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
      this.infoEl.innerHTML = `It's ${this.xTurn ? 'X' : 'O'} turn`;
    } else {
      if (this.isWon === this.EMPTY) {
        this.infoEl.innerHTML = `It's a draw`;
      } else {
        this.infoEl.innerHTML = `Game over! ${
          this.isWon === this.X_VALUE ? 'X' : 'O'
        } won`;
      }
    }
  }

  render() {
    this.renderCells();
    this.renderInfo();
  }

  checkWin() {
    const position = [];
    const filled = [];
    const currVal = this.xTurn ? this.X_VALUE : this.O_VALUE;
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] !== this.EMPTY) {
        filled.push(i);
        if (this.cells[i] === currVal) {
          position.push(i);
        }
      }
    }

    for (const pos of this.WIN_POSITION) {
      if (pos.every((val) => position.includes(val))) {
        return currVal;
      }
    }

    if (filled.length === this.cells.length) {
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
}

const boardElement = document.getElementById('board');
const infoText = document.getElementById('info');
const restartButton = document.getElementById('restart');

const game = new TicTacToeGame(boardElement, infoText);

restartButton.addEventListener('click', () => {
  game.reset();
});
