"use strict";


class Sudoku {
  constructor(
    // // начальные цифры
    // initString =
    //   "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ) {
    
    // const startValues = initString
    // //создаем массив из строки
    //   .split("")
    //   // задаем фильтр на допустимые значения
    //   .filter((x) => "0123456789".includes(x))
    //   // переводим обратно в число
    //   .map((x) => Number(x));
    // // console.log("startValues: ", startValues);
    /////////////////////////////////////////////////////////

    // создаем массив с 81 ячейкой
    this.gameBody = [];
    for (let i = 0; i < 81; i++) {
      // console.log(' this.gameBody.push(i): ',  this.gameBody.push(i));
    }

    //создадим объект и добавим данные при помощи двух циклов по оси X и по оси Y
    let idNumber = 1; // добавим id для каждой клетки

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        this.gameBody.push({
          id: idNumber,
          x: x,
          y: y,
          number: 0,
          // поместим строку начальную
          // number: startValues[idNumber - 1],
          selected: false,
          supported: false,
          segment: parseInt(y / 3) * 3 + parseInt(x / 3),
        });

        idNumber++;
      }
    }
    //  console.log( this.gameBody);
  }

  // получим ряд
  getRow(numOfRow) {
    const row = [];

    for (let y = 0; y < 9; y++) {
      row.push(this.gameBody[9 * numOfRow + y]);
    }
    // console.log(row);

    return row;
  }

  // получим колонку
  getColumn(numOfColumn) {
    const column = [];

    for (let x = 0; x < 9; x++) {
      column.push(this.gameBody[x * 9 + numOfColumn]);
    }
    // console.log(column);

    return column;
  }

  // получим квадрат
  getSegment(numOfSegment) {
    const segment = [];

    // верхняя левая ячейка
    const x = numOfSegment % 3,
      y = parseInt(numOfSegment / 3);

    // проходим по три раза по x/y в сегменте
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        segment.push(this.gameBody[y * 27 + dy * 9 + x * 3 + dx]);
      }
    }

    return segment;
  }

  //функции обработчики ввода
  keydownHandler(event, cell) {
    // console.log(event.key);
    if ("123456789".includes(event.key)) {
      // если event.key одно из "123456789"
      cell.number = parseInt(event.key);
    }
    // добавим возможность удалять
    else if (["Backspace", "Delete"].includes(event.key)) {
      cell.number = "";
    }
    //отменяем действие кнопок кроме тех которые соответствуют условию
    event.preventDefault();
    this.gameUpdate();
  }
  focusHandler(event, cell) {
    // добавим цвет на клетку по нажатию
    cell.selected = true;

    //выделим весь ряд
    for (const item of this.getRow(cell.y)) {
      item.supported = true;
    }

    //выделим весь столбик
    for (const item of this.getColumn(cell.x)) {
      item.supported = true;
    }

    this.gameUpdate();
  }
  blurHandler(event, cell) {
    // убираем цвет  выделенной клетки
    cell.selected = false;

    //убираем выделение ряда
    for (const item of this.getRow(cell.y)) {
      item.supported = false;
    }

    //убираем выделение колонки
    for (const item of this.getColumn(cell.x)) {
      item.supported = false;
    }

    this.gameUpdate();
  }

  // создадим игровое поле
  getGameField(size) {
    // игровое поле
    const sudokuGame = document.createElement("div");
    sudokuGame.classList.add("sudoku-game");
    sudokuGame.style.width = `${size}px`;
    sudokuGame.style.height = `${size}px`;
    sudokuGame.style["font-size"] = `${size / 20}px`;

    // создадим 9 ячеек (3)
    // проходим по gameBody и создаем для каждого item 9 ячеек input
    for (const item of this.gameBody) {
      const inputItem = document.createElement("input");
      inputItem.setAttribute("type", "text");
      inputItem.classList.add("sudoku-cell");

      //обработчики для ввода только цифр и только одной
      inputItem.addEventListener("keydown", (event) =>
        this.keydownHandler(event, item)
      );
      inputItem.addEventListener("focus", (event) =>
        this.focusHandler(event, item)
      );
      inputItem.addEventListener("blur", (event) =>
        this.blurHandler(event, item)
      );

      item.element = inputItem;
    }

    // создаем 9 полей (1,2)
    for (let i = 0; i < 9; i++) {
      // создаем
      const segmentsBlock = document.createElement("div");
      segmentsBlock.classList.add("sudoku-segment");

      // добавляем ячейки
      for (const cell of this.getSegment(i)) {
        segmentsBlock.append(cell.element);
      }

      // добавляем блоки
      sudokuGame.append(segmentsBlock);
    }

    //для добавления начальной строки
    this.gameUpdate();

    return sudokuGame;
  }

  gameUpdate() {
    for (const cell of this.gameBody) {
      //сначала удалим все дополнительные классы у всех ячеек
      cell.element.classList.remove("supported-cell", "selected-cell");
      cell.element.value = cell.number ? cell.number : "";
      // повесим только на выделенные
      if (cell.supported) {
        cell.element.classList.add("supported-cell");
      }
      if (cell.selected) {
        cell.element.classList.add("selected-cell");
      }
    }
  }
}

const sudoku = new Sudoku(`
    1 0 0  0 0 0  0 0 0
    0 0 0  0 0 0  0 3 0
    0 0 0  8 0 0  0 0 0

    0 6 0  2 0 0  0 0 0
    0 0 0  0 0 0  0 5 0
    0 0 0  0 0 0  0 0 0

    0 0 4  0 0 0  0 0 0
    0 0 0  0 0 0  0 0 0
    0 0 0  0 0 9  7 0 0
`);
//выводим поле на страницу
const virtualDom = document
  .querySelector("#app")
  .append(sudoku.getGameField(300));
