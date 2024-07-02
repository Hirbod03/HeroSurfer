let timer;
let startTime;
let elapsedTime = 0;
let running = false;

document.getElementById('startStop').addEventListener('click', function() {
  if (running) {
    clearInterval(timer);
    running = false;
    this.textContent = 'Start';
  } else {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTime, 1000);
    running = true;
    this.textContent = 'Stop';
  }
});

document.getElementById('reset').addEventListener('click', function() {
  clearInterval(timer);
  running = false;
  elapsedTime = 0;
  document.getElementById('timer').textContent = '00:00:00';
  document.getElementById('startStop').textContent = 'Start';
});

function updateTime() {
  elapsedTime = Date.now() - startTime;
  document.getElementById('timer').textContent = timeToString(elapsedTime);
}

function timeToString(time) {
  let hours = Math.floor(time / (1000 * 60 * 60));
  let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((time % (1000 * 60)) / 1000);

  let formattedHours = hours.toString().padStart(2, '0');
  let formattedMinutes = minutes.toString().padStart(2, '0');
  let formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
