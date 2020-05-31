"use strict";

class Sudoku {
  constructor(
    // start line 81 element
    initString = "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ) {
    // start line is added to the variable
    const startValues = initString
      //create array from a string
      .split("")
      // set the filter to valid values
      .filter((x) => "0123456789".includes(x))
      // set back to number
      .map((x) => Number(x));
    /////////////////////////////////////////////////////////
    //create an array and an object and add data using two cycles along the X axis and along the Y axis from
    // create array with 81 cells
    this.gameBody = [];

    let idNumber = 1; // add id for each cell

    // go through each row and each column
    // עברים על כל שורה ועל כל טור
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        this.gameBody.push({
          id: idNumber,
          x: x,
          y: y,
          segment: parseInt(y / 3) * 3 + parseInt(x / 3),
          //number: 0,
          // put the initial line
          // הראשוני string
          number: startValues[idNumber - 1],
          selected: false,
          supported: false,
          important: false,
          error: false,
          started: startValues[idNumber - 1] === 0 ? false : true, // check start or not cell
        });

        idNumber++;
      }
    }
  }

  // we get an random empty cell
  static getFreeCell(sudoku) {
    const cells = sudoku.gameBody.filter((x) => !x.number);
    const index = Math.floor(Math.random() * cells.length);

    return cells[index];
  }

  // we get a busy cell
  static getBusyCell(sudoku) {
    const cells = sudoku.gameBody.filter((x) => x.number);
    const index = Math.floor(Math.random() * cells.length);

    return cells[index];
  }

  static generate(n) {
    // generate n between 0 and 81
    n = Math.min(81, Math.max(n, 0));
    const generateSudoku = new Sudoku();

    // get free cell and put number 1 --- 9
    for (let i = 0; i <= 9; i++) {
      const freeCell = Sudoku.getFreeCell(generateSudoku);
      freeCell.number = i;
    }

    // we have solved game
    const completelySolve = generateSudoku.solveGame();

    // get empty cells from filled options and delete the values
    for (let i = 0; i < 81 - n; i++) {
      const busyCell = Sudoku.getBusyCell(completelySolve);
      busyCell.number = 0;
    }
    // return solved sudoku with empty-cells 
    return new Sudoku(completelySolve.gameBody.map((x) => x.number).join(""));
  }

  // solve empty sudoku
  // check solved game or not
  // in row,column,segment only one number === 1 -- 9
  get isSolved() {
    // no empty cell
    for (const cell of this.gameBody) {
      if (cell.number === 0) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      // check for duplicate numbers and have 1=== 9
      // if not all numbers includes from 1 to 9 the game is not solved === false
      const row = this.getRow(i).map((x) => x.number);
      for (let n = 1; n <= 9; n++) {
        if (!row.includes(n)) {
          return false;
        }
      }

      const column = this.getColumn(i).map((x) => x.number);
      // check for duplicate numbers and have 1=== 9
      for (let n = 1; n <= 9; n++) {
        if (!column.includes(n)) {
          return false;
        }
      }

      const segment = this.getSegment(i).map((x) => x.number);
      // check for duplicate numbers and have 1=== 9
      for (let n = 1; n <= 9; n++) {
        if (!segment.includes(n)) {
          return false;
        }
      }
    }
    return true;
  }

  //create a copy of the current sudoku
  //for not to change the current body for use when solving
  getCopy() {
    // because that the initial values ​​as a string then return the string
    return new Sudoku(this.gameBody.map((x) => x.number).join(""));
  }

  // get a row
  getRow(numOfRow) {
    const row = [];

    for (let y = 0; y < 9; y++) {
      row.push(this.gameBody[9 * numOfRow + y]);
    }

    return row;
  }

  // get a column
  getColumn(numOfColumn) {
    const column = [];

    for (let x = 0; x < 9; x++) {
      column.push(this.gameBody[x * 9 + numOfColumn]);
    }

    return column;
  }

  // get a square(segment)
  getSegment(numOfSegment) {
    const segment = [];

    // upper left cel
    const x = numOfSegment % 3,
      y = parseInt(numOfSegment / 3);

    //go three times x / y in the segment relative to the leftmost cell
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        segment.push(this.gameBody[y * 27 + dy * 9 + x * 3 + dx]);
      }
    }

    return segment;
  }

  //functions input handlers
  // keydown
  keydownHandler(event, cell) {
    //if the cell is not a start then change the styles
    // and if the start then can’t change
    if (!cell.started) {
      if ("123456789".includes(event.key)) {
        // if event.key one of "123456789"
        cell.number = parseInt(event.key);

        //remove the highlight of the last error if we changed to the correct value
        if (cell.error) {
          for (const item of this.gameBody) {
            item.error = false;
          }
        }

        // note if there is no compliance with the rules (not the right move)
        // check the row
        for (const item of this.getRow(cell.y)) {
          if (item === cell) {
            continue;
          }
          if (item.number === cell.number) {
            item.error = true;
            cell.error = true;
          }
        }

        // check the column
        for (const item of this.getColumn(cell.x)) {
          if (item === cell) {
            continue;
          }
          if (item.number === cell.number) {
            item.error = true;
            cell.error = true;
          }
        }

        // check the segment
        for (const item of this.getSegment(cell.segment)) {
          if (item === cell) {
            continue;
          }
          if (item.number === cell.number) {
            item.error = true;
            cell.error = true;
          }
        }
      }
      // add the ability to delete
      // הוסף את היכולת למחוק
      else if (["Backspace", "Delete"].includes(event.key)) {
        cell.number = "";
      }

      //disable styles for all cells
      for (const cell of this.gameBody) {
        cell.important = false;
      }
      // add styles to the selected cells with the same elements
      if (cell.number) {
        for (const item of this.gameBody) {
          if (item.number === cell.number) {
            item.important = true;
          }
        }
      }
    }

    //cancel the action of the buttons except those that match the condition
    // בטל את פעולת הכפתורים למעט אלה התואמים את התנאי(אם זה לא מספר
    event.preventDefault();
    this.viewUpdate();
  }

  // focus on the keyboard
  focusHandler(event, cell) {
    // add color to the cell by clicking
    cell.selected = true;

    // select the whole row
    for (const item of this.getRow(cell.y)) {
      item.supported = true;
    }

    // select the entire column
    for (const item of this.getColumn(cell.x)) {
      item.supported = true;
    }

    // select the selected cell element
    for (const item of this.gameBody) {
      if (cell.number === item.number) {
        item.important = true;
      }
    }

    this.viewUpdate();
  }

  // key focus loss
  blurHandler(event, cell) {
    // remove error
    if (cell.error) {
      cell.number = 0;
    }

    // go through all the cells
    for (const cell of this.gameBody) {
      //remove row selection
      cell.supported = false;
      // remove the selected cell style
      cell.selected = false;
      // remove the style for the same
      cell.important = false;
      // remove error
      cell.error = false;
    }

    this.viewUpdate();
  }

  // create a playing field (virtual DOM)
  getGameField(size) {
    // playing field
    const sudokuGame = document.createElement("div");
    sudokuGame.classList.add("sudoku-game");
    sudokuGame.style.width = `${size}px`;
    sudokuGame.style.height = `${size}px`;
    sudokuGame.style["font-size"] = `${size / 20}px`;

    // create 9 cells
    //go through gameBody and create for each item 9 input cells
    for (const cell of this.gameBody) {
      const inputItem = document.createElement("input");
      inputItem.setAttribute("type", "text");
      inputItem.classList.add("sudoku-cell");

      //handlers for entering only numbers and only one
      inputItem.addEventListener("keydown", (event) =>
        this.keydownHandler(event, cell)
      );
      inputItem.addEventListener("focus", (event) =>
        this.focusHandler(event, cell)
      );
      inputItem.addEventListener("blur", (event) =>
        this.blurHandler(event, cell)
      );

      // check if the starting cell then add the style
      if (cell.started) {
        inputItem.classList.add("start-cell");
      }

      cell.element = inputItem;
    }

    // create 9 blocks \ segments
    for (let i = 0; i < 9; i++) {
      // create
      const segmentsBlock = document.createElement("div");
      segmentsBlock.classList.add("sudoku-segment");

      // add cells
      for (const cell of this.getSegment(i)) {
        segmentsBlock.append(cell.element);
      }

      // add blocks
      sudokuGame.append(segmentsBlock);
    }

    //call the method to add the start line
    this.viewUpdate();

    return sudokuGame;
  }

  // update \ add visual effects
  viewUpdate() {
    for (const cell of this.gameBody) {
      //first we will remove all additional classes in all cells
      cell.element.classList.remove(
        "error",
        "important-cell",
        "supported-cell",
        "selected-cell"
      );
      cell.element.value = cell.number ? cell.number : "";
      //hang only on supported cells
      if (cell.supported) {
        cell.element.classList.add("supported-cell");
      }
      // hang only on selected cells
      if (cell.selected) {
        cell.element.classList.add("selected-cell");
      }
      // hang only on cells with identical elements
      if (cell.important) {
        cell.element.classList.add("important-cell");
      }
      // hang on errors (coincidence of elements in the table, in a row, in a segment)
      // css class אם לא המהלך הנכון הוסף
      if (cell.error) {
        cell.element.classList.add("error");
      }
    }
  }

  // possible values
  // ערכים אפשריים
  getPotentials() {
    const potentials = [];

    // if
    for (const cell of this.gameBody) {
      // if cell already have a number => push
      if (cell.number) {
        potentials.push(cell.number);
      } else {
        //got all row numbers
        const rowNumbers = this.getRow(cell.y).map((x) => x.number);
        //got all column numbers
        const columnNumbers = this.getColumn(cell.x).map((x) => x.number);
        //got all segment numbers
        const segmentNumbers = this.getSegment(cell.segment).map(
          (x) => x.number
        );
        // filter only valid numbers
        const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // filter leave only those numbers that are not present
        potentials.push(
          possibleValues
            .filter((x) => !rowNumbers.includes(x))
            .filter((x) => !columnNumbers.includes(x))
            .filter((x) => !segmentNumbers.includes(x))
        );
      }
    }
    return potentials;
  }

  // game solution
  solveGame() {
    // change only a copy
    const copy = this.getCopy();

    let haveSolution = true;

    while (haveSolution) {
      haveSolution = false;
      const potentials = copy.getPotentials();

      for (let i = 0; i < 81; i++) {
        const potential = potentials[i];
        //check potential membership of arr and him length > 0
        if (potential instanceof Array && potential.length === 1) {
          // add a single value to the copy
          copy.gameBody[i].number = potential[0];
          haveSolution = true;
        }
      }
    }

    const potentials = copy.getPotentials();

    //must to find the smallest option of cell
    for (let option = 2; option <= 9; option++) {
      for (let i = 0; i < 81; i++) {
        if (potentials[i].length === option) {
          // check already received options
          for (const value of potentials[i]) {
            const nextCopy = copy.getCopy();
            nextCopy.gameBody[i].number = value;

            const resultCopy = nextCopy.solveGame();
            if (resultCopy.isSolved) {
              return resultCopy;
            }
          }
          break;
        }
      }
    }

    return copy;
  }
}
