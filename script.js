"use strict";

class Sudoku {
  constructor(
    // начальные цифры
    initString = "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ) {
    const startValues = initString
      //создаем массив из строки
      .split("")
      // задаем фильтр на допустимые значения
      .filter((x) => "0123456789".includes(x))
      // переводим обратно в число
      .map((x) => Number(x));
    // console.log("startValues: ", startValues);
    /////////////////////////////////////////////////////////

    // создаем массив с 81 ячейкой
    this.gameBody = [];
    // for (let i = 0; i < 81; i++) {
    // console.log(' this.gameBody.push(i): ',  this.gameBody.push(i));
    // }

    //создадим объект и добавим данные при помощи двух циклов по оси X и по оси Y
    let idNumber = 1; // добавим id для каждой клетки

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        this.gameBody.push({
          id: idNumber,
          x: x,
          y: y,
          segment: parseInt(y / 3) * 3 + parseInt(x / 3),
          // number: 0,
          // поместим строку начальную
          number: startValues[idNumber - 1],
          selected: false,
          supported: false,
          important: false,
          error: false,
          started: startValues[idNumber - 1] === 0 ? false : true, // проверка стартовая или нет ячейка
        });

        idNumber++;
      }
    }
    //  console.log( this.gameBody);
  }

  static getFreeCell(sudoku) {
    const cells = sudoku.gameBody.filter((x) => !x.number);
    const index = Math.floor(Math.random() * cells.length);

    return cells[index];
  }

  static getBusyCell(sudoku) {
    const cells = sudoku.gameBody.filter((x) => x.number);
    const index = Math.floor(Math.random() * cells.length);

    return cells[index];
  }

  static generate(n) {
    n = Math.min(81, Math.max(n, 0));
    const generateSudoku = new Sudoku();

    for (let i = 0; i <= 9; i++) {
      const freeCell = Sudoku.getFreeCell(generateSudoku);
      freeCell.number = i;
    }

    const completelySolve = generateSudoku.solveGame();

    for (let i = 0; i < 81 - n; i++) {
      const busyCell = Sudoku.getBusyCell(completelySolve);
      busyCell.number = 0;
    }
    return new Sudoku(completelySolve.gameBody.map((x) => x.number).join(""));
  }

  get isSolved() {
    for (const cell of this.gameBody) {
      if (cell.number === 0) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      const row = this.getRow(i).map((x) => x.number);

      for (let n = 1; n <= 9; n++) {
        if (!row.includes(n)) {
          return false;
        }
      }

      const column = this.getColumn(i).map((x) => x.number);

      for (let n = 1; n <= 9; n++) {
        if (!row.includes(n)) {
          return false;
        }
      }

      const segment = this.getSegment(i).map((x) => x.number);

      for (let n = 1; n <= 9; n++) {
        if (!row.includes(n)) {
          return false;
        }
      }
    }
    return true;
  }

  getCopy() {
    return new Sudoku(this.gameBody.map((x) => x.number).join(""));
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

  // нажатие клавиши
  keydownHandler(event, cell) {
    if (!cell.started) {
      if ("123456789".includes(event.key)) {
        // если event.key одно из "123456789"
        cell.number = parseInt(event.key);

        //убираем подсветку прошлой ошибки если моменяли на правильное значение
        if (cell.error) {
          for (const item of this.gameBody) {
            item.error = false;
          }
        }

        // отметим если есть не соответствие правилам (не правельный ход)
        // проверим ряд
        for (const item of this.getRow(cell.y)) {
          if (item === cell) {
            continue;
          }
          if (item.number === cell.number) {
            item.error = true;
            cell.error = true;
          }
        }

        // проверим колонку
        for (const item of this.getColumn(cell.x)) {
          if (item === cell) {
            continue;
          }
          if (item.number === cell.number) {
            item.error = true;
            cell.error = true;
          }
        }

        // проверим сегмент
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
      // добавим возможность удалять
      else if (["Backspace", "Delete"].includes(event.key)) {
        cell.number = "";
      }

      //отключаем у всех ячеек стили
      for (const cell of this.gameBody) {
        cell.important = false;
      }
      // добавляем выбранным ячейкам с одинаковыми элементами стили
      if (cell.number) {
        for (const item of this.gameBody) {
          if (item.number === cell.number) {
            item.important = true;
          }
        }
      }
    }

    //отменяем действие кнопок кроме тех которые соответствуют условию
    event.preventDefault();
    this.gameUpdate();
  }

  // фокус на клавище
  focusHandler(event, cell) {
    // добавим цвет на клетку по нажатию
    cell.selected = true;

    // выделим весь ряд
    for (const item of this.getRow(cell.y)) {
      item.supported = true;
    }

    // выделим весь столбик
    for (const item of this.getColumn(cell.x)) {
      item.supported = true;
    }

    // выделим выбранный элемент ячейки
    for (const item of this.gameBody) {
      if (cell.number === item.number) {
        item.important = true;
      }
    }

    this.gameUpdate();
  }

  // потеря фокуса с клавиши
  blurHandler(event, cell) {
    // убираем с ошибки
    if (cell.error) {
      cell.number = 0;
    }

    // проходим по всем ячейкам
    for (const cell of this.gameBody) {
      //убираем выделение ряда
      cell.supported = false;
      // убираем стиль выделенной клетки
      cell.selected = false;
      // убираем стиль для одинаковых
      cell.important = false;
      // убираем с ошибки
      cell.error = false;
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
    for (const cell of this.gameBody) {
      const inputItem = document.createElement("input");
      inputItem.setAttribute("type", "text");
      inputItem.classList.add("sudoku-cell");

      //обработчики для ввода только цифр и только одной
      inputItem.addEventListener("keydown", (event) =>
        this.keydownHandler(event, cell)
      );
      inputItem.addEventListener("focus", (event) =>
        this.focusHandler(event, cell)
      );
      inputItem.addEventListener("blur", (event) =>
        this.blurHandler(event, cell)
      );

      // проверяем если стартовая ячейка то добавляем стиль
      if (cell.started) {
        inputItem.classList.add("start-cell");
      }

      cell.element = inputItem;
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
      cell.element.classList.remove(
        "error",
        "important-cell",
        "supported-cell",
        "selected-cell"
      );
      cell.element.value = cell.number ? cell.number : "";
      // повесим только на выделенные вряду
      if (cell.supported) {
        cell.element.classList.add("supported-cell");
      }
      // повесим только на выделеную ячейку
      if (cell.selected) {
        cell.element.classList.add("selected-cell");
      }
      // повесим только на ячейки с одинаковыми элементами
      if (cell.important) {
        cell.element.classList.add("important-cell");
      }
      // повесим на ошибки (совпадение елементов в столбе, в ряду, в сегменте)
      if (cell.error) {
        cell.element.classList.add("error");
      }
    }
  }

  getPotentials() {
    const potentials = [];

    for (const cell of this.gameBody) {
      if (cell.number) {
        potentials.push(cell.number);
      } else {
        //получили все числа строки
        const rowNumbers = this.getRow(cell.y).map((x) => x.number);
        //получили все числа колонки
        const columnNumbers = this.getColumn(cell.x).map((x) => x.number);
        //получили все числа сегмента
        const segmentNumbers = this.getSegment(cell.segment).map(
          (x) => x.number
        );
        // допустимые числа
        const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // фильтруем и добавляем только те значения котрые отсутствуют
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

  solveGame() {
    const copy = this.getCopy();

    let haveSolution = true;

    while (haveSolution) {
      haveSolution = false;
      const potentials = copy.getPotentials();

      for (let i = 0; i < 81; i++) {
        const potential = potentials[i];

        if (potential instanceof Array && potential.length === 1) {
          copy.gameBody[i].number = potential[0];
          haveSolution = true;
        }
      }
    }

    const potentials = copy.getPotentials();

    mainLoop: for (let option = 2; option <= 9; option++) {
      for (let i = 0; i < 81; i++) {
        if (potentials[i].length === option) {
          for (const value of potentials[i]) {
            const nextCopy = copy.getCopy();
            nextCopy.gameBody[i].number = value;

            const resultCopy = nextCopy.solveGame();
            if (resultCopy.isSolved) {
              return resultCopy;
            }
          }
          break mainLoop;
        }
      }
    }

    return copy;
  }
}

//выводим поле на страницу в зависимости от выбрвнного уровня
// и дополнительные действия с формой

(function (easyLevel, mediumLevel, hardLevel, solveGame, restart) {
  //выбор уровня и вывод поля
  function levelEasy() {
    const generateLv_1 = Sudoku.generate(61);
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_1.getGameField(300));
  }

  function levelMedium() {
    const generateLv_2 = Sudoku.generate(41);
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_2.getGameField(300));
  }

  function levelHard() {
    const generateLv_3 = Sudoku.generate(25);
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_3.getGameField(300));
  }

  // показать решение
  function finishGame() {
    let solveGame = new Sudoku();
    solveGame = solveGame.solveGame();
    const virtualDom = document
      .getElementById("app_2")
      .append(solveGame.getGameField(300));
  }

  function restartGame() {
    location.reload();
  }

  function login(name, password) {
    name = document.getElementById("name");
    password = document.getElementById("login");
    const enter = document.querySelector(".enter");
    name.value === "abcd";
    password.value === "1234";
    enter.addEventListener("click", () => {
      if (name.value && password.value) {
        enter.style.backgroundColor = "green";
        // если верный логин и пароль то запускаем кнопки
        // выводим поле
        easyLevel = document
          .querySelector(".level_1")
          .addEventListener("click", levelEasy);
        mediumLevel = document
          .querySelector(".level_2")
          .addEventListener("click", levelMedium);
        hardLevel = document
          .querySelector(".level_3")
          .addEventListener("click", levelHard);
        // выводим решение
        solveGame = document
          .querySelector(".solve")
          .addEventListener("click", finishGame);
        // перезагрузить
        restart = document
          .querySelector(".restart")
          .addEventListener("click", restartGame);
      } else {
        alert(`Enter : 
    
          Name: abcd 
          Password: 1234
          
          
                                          Good Luck!!!!!`);
      }
      name.value = "";
      password.value = "";
    });
  }
  login();
})();
