const startStopButton = document.getElementById('startStop');
const startStopImage = document.getElementById('startStopImage');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset');
const headerGif = document.getElementById('header-gif');
const headerSelect = document.getElementById('header-select');

// Load state from chrome.storage
chrome.storage.local.get(['elapsedTime', 'running', 'headerChoice'], function(result) {
  if (result.elapsedTime !== undefined) {
    updateTimerDisplay(result.elapsedTime);
    console.log('Loaded elapsed time:', result.elapsedTime);
  }
  if (result.running) {
    startStopImage.src = 'icons/buttons/pause.png';
    console.log('Timer was running. State restored.');
  }
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
    console.log('Header choice loaded:', result.headerChoice);
  }
});

startStopButton.addEventListener('click', function() {
  if (startStopImage.src.includes('start.png')) {
    chrome.runtime.sendMessage({ action: 'start' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        startStopImage.src = 'icons/buttons/pause.png';
        console.log('Sent start message');
      }
    });
  } else {
    chrome.runtime.sendMessage({ action: 'stop' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        startStopImage.src = 'icons/buttons/start.png';
        console.log('Sent stop message');
      }
    });
  }
});

resetButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'reset' }, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      startStopImage.src = 'icons/buttons/start.png';
      updateTimerDisplay(0);
      console.log('Sent reset message');
    }
  });
});

headerSelect.addEventListener('change', function() {
  headerGif.src = `icons/${headerSelect.value}`;
  saveHeaderChoice();
});

chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  } else if (response) {
    updateTimerDisplay(response.elapsedTime);
    if (response.running) {
      startStopImage.src = 'icons/buttons/pause.png';
    }
    console.log('Got state response:', response);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'update') {
    updateTimerDisplay(request.elapsedTime);
    console.log('Timer display updated:', request.elapsedTime);
  }
});

function updateTimerDisplay(time) {
  timerDisplay.textContent = timeToString(time);
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

function saveHeaderChoice() {
  chrome.storage.local.set({ headerChoice: headerSelect.value });
}