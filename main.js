"use strict";

//выводим поле на страницу в зависимости от выбрвнного уровня
// и дополнительные действия с формой

(function StartAndGenerate(
  easyLevel,
  mediumLevel,
  hardLevel,
  solveGame,
  restart
) {
  function activeTimer() {
    const timer = document.querySelector(".timer");

    timer.classList.add("active");
  }
  //выбор уровня и вывод поля
  let currentSudoku = null;

  //легкий уровень
  function levelEasy() {
    const generateLv_1 = Sudoku.generate(61);
    currentSudoku = generateLv_1;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_1.getGameField(300));
  }
  // средний уровень
  function levelMedium() {
    const generateLv_2 = Sudoku.generate(41);
    currentSudoku = generateLv_2;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_2.getGameField(300));
  }
  // тяжелый уровень
  function levelHard() {
    const generateLv_3 = Sudoku.generate(25);
    currentSudoku = generateLv_3;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_3.getGameField(300));
  }

  // показать решение в соседнем блоке
  function finishGame() {
    let solveGame = currentSudoku;
    solveGame = solveGame.solveGame();
    const virtualDom = document
      .getElementById("app_2")
      .append(solveGame.getGameField(300));
  }
  // обновить страницу тем самым обновить игру
  function restartGame() {
    location.reload();
  }

  //если введен верный логин и пароль то можно начинать игру
  // в другом случае кнопки не выполняют команд
  function login(name, password) {
    name = document.getElementById("name");
    password = document.getElementById("password");
    const enter = document.querySelector(".enter");
    const outUserName = document.querySelector(".out_user-name");

    enter.addEventListener("click", () => {
      if (name.value === "abcd" && password.value === "1234") {
        enter.style.backgroundColor = "green";
        // name.style.borderColor = "green"
        // password.style.borderColor = "green"
        outUserName.innerHTML = `Be Strong!!! Player: ${name.value} &#128540;`;
        // если верный логин и пароль то запускаем кнопки
        // выводим поле в зависимости от выбранного поля
        //  легкий уровень
        const easyLevel = document.querySelector(".level_1");
        easyLevel.addEventListener("click", () => {
          levelEasy();
          startTimer();
          activeTimer();
        });
        // средний уровень
        const mediumLevel = document.querySelector(".level_2");
        mediumLevel.addEventListener("click", () => {
          levelMedium();
          startTimer();
          activeTimer();
        });
        // сложный уровень
        const hardLevel = document.querySelector(".level_3");
        hardLevel.addEventListener("click", () => {
          levelHard();
          startTimer();
          activeTimer();
        });
        // выводим решение
        solveGame = document
          .querySelector(".solve")
          .addEventListener("click", finishGame);
        solveGame = document
          .querySelector(".solve")
          .addEventListener("click", stopTimer);
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

