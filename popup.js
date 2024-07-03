let timer;
let startTime;
let elapsedTime = 0;
let running = false;

const startStopButton = document.getElementById('startStop');
const startStopImage = document.getElementById('startStopImage');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset');

startStopButton.addEventListener('click', function() {
  if (running) {
    clearInterval(timer);
    running = false;
    startStopImage.src = 'icons/buttons/start.png';
  } else {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTime, 10);  // Update every 10 milliseconds
    running = true;
    startStopImage.src = 'icons/buttons/pause.png';
  }
});

resetButton.addEventListener('click', function() {
  clearInterval(timer);
  running = false;
  elapsedTime = 0;
  timerDisplay.textContent = '00:00:00.000';
  startStopImage.src = 'icons/buttons/start.png';
});

function updateTime() {
  elapsedTime = Date.now() - startTime;
  timerDisplay.textContent = timeToString(elapsedTime);
}

function timeToString(time) {
  let hours = Math.floor(time / (1000 * 60 * 60));
  let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((time % (1000 * 60)) / 1000);
  let milliseconds = Math.floor((time % 1000));

  let formattedHours = hours.toString().padStart(2, '0');
  let formattedMinutes = minutes.toString().padStart(2, '0');
  let formattedSeconds = seconds.toString().padStart(2, '0');
  let formattedMilliseconds = milliseconds.toString().padStart(3, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}
