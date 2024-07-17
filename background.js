var timer;
var startTime;
var elapsedTime = 0; // Initialize elapsedTime
var running = true; // Initialize running

// Initialize state from chrome.storage.local when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['elapsedTime', 'running'], (result) => {
    console.log('Initial state:', result); // Debug line
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
  console.log('Received message:', request); // Debug line
  if (request.action === 'start') {
    if (!running) {
      startTime = Date.now() - elapsedTime;
      timer = setInterval(updateTime, 10);
      running = true;
      chrome.storage.local.set({ running: true });
      console.log('Timer started');
    }
    sendResponse({ success: true });
  } else if (request.action === 'stop') {
    if (running) {
      clearInterval(timer);
      running = false;
      chrome.storage.local.set({ running: false });
      console.log('Timer stopped');
    }
    sendResponse({ success: true });
  } else if (request.action === 'reset') {
    clearInterval(timer);
    running = false;
    elapsedTime = 0;
    chrome.storage.local.set({ elapsedTime: 0, running: false });
    console.log('Timer reset');
    sendResponse({ success: true });
  } else if (request.action === 'getState') {
    sendResponse({ elapsedTime: elapsedTime, running: running });
    console.log('Sent state:', { elapsedTime: elapsedTime, running: running });
  }
  return true; // Indicate that the response will be sent asynchronously
});

function updateTime() {
  elapsedTime = Date.now() - startTime;
  chrome.storage.local.set({ elapsedTime: elapsedTime });
  chrome.runtime.sendMessage({ action: 'update', elapsedTime: elapsedTime });
  console.log('Time updated:', elapsedTime); // Debug line
}