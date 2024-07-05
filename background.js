let timer;
let startTime;
let elapsedTime = 0;
let running = false;

// Initialize state from chrome.storage.local when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['elapsedTime', 'running'], (result) => {
    if (result.elapsedTime !== undefined) {
      elapsedTime = result.elapsedTime;
    }
    if (result.running) {
      running = result.running;
      startTime = Date.now() - elapsedTime;
      timer = setInterval(updateTime, 10);
    }
    console.log('Extension installed or reloaded. State initialized.');
  });
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === 'start') {
    if (!running) {
      startTime = Date.now() - elapsedTime;
      timer = setInterval(updateTime, 10);
      running = true;
      chrome.storage.local.set({ running: true });
      console.log('Timer started');
    }
  } else if (request.action === 'stop') {
    if (running) {
      clearInterval(timer);
      running = false;
      chrome.storage.local.set({ running: false });
      console.log('Timer stopped');
    }
  } else if (request.action === 'reset') {
    clearInterval(timer);
    running = false;
    elapsedTime = 0;
    chrome.storage.local.set({ elapsedTime: 0, running: false });
    console.log('Timer reset');
  } else if (request.action === 'getState') {
    sendResponse({ elapsedTime: elapsedTime, running: running });
    console.log('Sent state:', { elapsedTime: elapsedTime, running: running });
  }
});

function updateTime() {
  elapsedTime = Date.now() - startTime;
  chrome.storage.local.set({ elapsedTime: elapsedTime });
  chrome.runtime.sendMessage({ action: 'update', elapsedTime: elapsedTime });
  console.log('Time updated:', elapsedTime);
}