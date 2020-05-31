"use strict";


const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
let timerTime = 0;
let interval;
let isRanning = false;


function startTimer() {
  if (isRanning === false) {
    interval = setInterval(incrementTimer, 1000);
    isRanning = true;
  }
}
function stopTimer() {
  if (isRanning === true) {
    clearInterval(interval);
    isRanning = false;
  }
}

//change timer and inner on the page
function incrementTimer() {
  timerTime++;
  const numberOfMinutes = Math.floor(timerTime / 60);
  const numberOfSeconds = Math.floor(timerTime % 60);
  minutes.innerText = zeroNumber(numberOfMinutes);
  seconds.innerText = zeroNumber(numberOfSeconds);
}

//add 0 before number if num < 10
function zeroNumber(number) {
  return number < 10 ? "0" + number : number;
}
