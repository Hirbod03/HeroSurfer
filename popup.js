const startStopButton = document.getElementById('startStop');
const startStopImage = document.getElementById('startStopImage');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset');
const headerGif = document.getElementById('header-gif');
const headerSelect = document.getElementById('header-select');

// Load state from chrome.storage
chrome.storage.local.get(['elapsedTime', 'running', 'headerChoice'], function(result) {
  console.log('Loaded state from storage:', result); // Debug line
  if (result.elapsedTime !== undefined) {
    updateTimerDisplay(result.elapsedTime);
  }
  if (result.running) {
    startStopImage.src = 'icons/buttons/pause.png';
  }
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
  }
});

startStopButton.addEventListener('click', function() {
  if (startStopImage.src.includes('start.png')) {
    chrome.runtime.sendMessage({ action: 'start' }, function(response) {
      console.log('Sent start message'); // Debug line
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        startStopImage.src = 'icons/buttons/pause.png';
      }
    });
  } else {
    chrome.runtime.sendMessage({ action: 'stop' }, function(response) {
      console.log('Sent stop message'); // Debug line
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        startStopImage.src = 'icons/buttons/start.png';
      }
    });
  }
});

resetButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'reset' }, function(response) {
    console.log('Sent reset message'); // Debug line
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      startStopImage.src = 'icons/buttons/start.png';
      updateTimerDisplay(0);
    }
  });
});

headerSelect.addEventListener('change', function() {
  headerGif.src = `icons/${headerSelect.value}`;
  saveHeaderChoice();
});

chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
  console.log('Got state response:', response); // Debug line
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  } else if (response) {
    updateTimerDisplay(response.elapsedTime);
    if (response.running) {
      startStopImage.src = 'icons/buttons/pause.png';
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'update') {
    updateTimerDisplay(request.elapsedTime);
    console.log('Timer display updated:', request.elapsedTime); // Debug line
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