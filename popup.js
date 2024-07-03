const startStopButton = document.getElementById('startStop');
const startStopImage = document.getElementById('startStopImage');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset');
const headerGif = document.getElementById('header-gif');
const headerSelect = document.getElementById('header-select');

// Function to save the header choice
function saveHeaderChoice() {
  chrome.storage.local.set({ headerChoice: headerSelect.value });
}

// Load state from chrome.storage
chrome.storage.local.get(['elapsedTime', 'running', 'headerChoice'], function(result) {
  if (result.elapsedTime !== undefined) {
    updateTimerDisplay(result.elapsedTime);
  }
  if (result.running) {
    startStopImage.src = 'icons/buttons/pause.png';
    console.log('Timer was running. State restored.');
  }
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
  }
});

// Add event listeners for start/stop, reset, and header selection
startStopButton.addEventListener('click', function() {
  if (startStopImage.src.includes('start.png')) {
    chrome.runtime.sendMessage({ action: 'start' });
    startStopImage.src = 'icons/buttons/pause.png';
  } else {
    chrome.runtime.sendMessage({ action: 'stop' });
    startStopImage.src = 'icons/buttons/start.png';
  }
});

resetButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'reset' });
  startStopImage.src = 'icons/buttons/start.png';
  updateTimerDisplay(0);
});

headerSelect.addEventListener('change', function() {
  headerGif.src = `icons/${headerSelect.value}`;
  saveHeaderChoice();
});

chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
  if (response) {
    updateTimerDisplay(response.elapsedTime);
    if (response.running) {
      startStopImage.src = 'icons/buttons/pause.png';
    }
  }
});

// Listen for updates from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'update') {
    updateTimerDisplay(request.elapsedTime);
    console.log('Timer display updated:', request.elapsedTime);
  }
});

function updateTimerDisplay(time) {
    console.log('Updating timer display');
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