"use strict";

//display the field on the page depending on the selected level
// להציג את השדה  בהתאם לרמה שנבחרה
// and additional actions with the form
// ופעולות נוספות

// callback function
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
  //level selection and field output
  // בחירת רמה
  let currentSudoku = null;

  // lock of buttons for level selection
  function disabledLevelBtn() {
    const levelBtns = document.querySelectorAll(".level").forEach((e) => {
      e.setAttribute("disabled", "disabled");
    });
  }

  //easy level
  function levelEasy() {
    const generateLv_1 = Sudoku.generate(61);
    currentSudoku = generateLv_1;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_1.getGameField(300));
  }
  // middle level
  function levelMedium() {
    const generateLv_2 = Sudoku.generate(41);
    currentSudoku = generateLv_2;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_2.getGameField(300));
  }
  // hard level
  function levelHard() {
    const generateLv_3 = Sudoku.generate(25);
    currentSudoku = generateLv_3;
    const virtualDom = document
      .getElementById("app")
      .append(generateLv_3.getGameField(300));
  }

  // show solution in adjacent block
  // להראות פתרון בבלוק הסמוך
  function finishGame() {
    let solveGame = currentSudoku;
    solveGame = solveGame.solveGame();

    const virtualDom = document
      .getElementById("app_2")
      .append(solveGame.getGameField(300));
  }

  function disabledSolveBtn() {
    const solveGame = document.querySelector(".solve");
    solveGame.setAttribute("disabled", "disabled");
  }

  // reload the page thereby reload the game
  // טען מחדש את הדף ובכך טען מחדש את המשחק
  function restartGame() {
    location.reload();
  }

  //if the correct username and password are entered then you can start the game
  // אם שם המשתמש והסיסמה הנכונים, תוכלו להתחיל במשחק
  // otherwise, the buttons do not execute commands
  // אחרת כפתורים אינם פעילים
  function login(name, password) {
    name = document.getElementById("name");
    password = document.getElementById("password");
    const enter = document.querySelector(".enter");
    const outUserName = document.querySelector(".out_user-name");

    enter.addEventListener("click", () => {
      if (name.value === "abcd" && password.value === "1234") {
        enter.style.backgroundColor = "green";
        outUserName.innerHTML = `Be Strong!!! Player: ${name.value} &#128540;`;
        // if the username and password are correct, then we launch the buttons
        // אם שם המשתמש והסיסמה נכונים, אנו מפעילים את הכפתורים
        // display the field depending on the selected field
        // הצגת השדה בהתאם לשדה שנבחר
        //  easy level
        const easyLevel = document
          .querySelector(".level_1")
          .addEventListener("click", function progresbar() {
            let start = 0;
            const loadGameProgress = document.querySelector(
              ".load-game-progress"
            );
            loadGameProgress.style.display = "block";
            let interval = setInterval(() => {
              if (start > 100) {
                clearInterval(interval);
                levelEasy();
                startTimer();
                activeTimer();
                disabledLevelBtn();
                loadGameProgress.style.display = "none";
              } else {
                loadGameProgress.value = start;
              }
              start++;
            }, 15);
          });

        // middle level
        const mediumLevel = document
          .querySelector(".level_2")
          .addEventListener("click", function progresbar() {
            let start = 0;
            const loadGameProgress = document.querySelector(
              ".load-game-progress"
            );
            loadGameProgress.style.display = "block";
            let interval = setInterval(() => {
              if (start > 100) {
                clearInterval(interval);
                levelMedium();
                startTimer();
                activeTimer();
                disabledLevelBtn();
                loadGameProgress.style.display = "none";
              } else {
                loadGameProgress.value = start;
              }
              start++;
            }, 15);
          });
        // hard level
        const hardLevel = document
          .querySelector(".level_3")
          .addEventListener("click", function progresbar() {
            let start = 0;
            const loadGameProgress = document.querySelector(
              ".load-game-progress"
            );
            loadGameProgress.style.display = "block";
            let interval = setInterval(() => {
              if (start > 100) {
                clearInterval(interval);
                levelHard();
                startTimer();
                activeTimer();
                disabledLevelBtn();
                loadGameProgress.style.display = "none";
              } else {
                loadGameProgress.value = start;
              }
              start++;
            }, 15);
          });

        // out solution
        const solveGame = document
          .querySelector(".solve")
          .addEventListener("click", function solveGame() {
            finishGame();
            stopTimer();
            disabledSolveBtn();
          });

        // reload
        const restart = document
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
      enter.setAttribute("disabled", "disabled");
    });
  }
  login();
})();
