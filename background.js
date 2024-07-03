chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
      if (!running) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTime, 10);
        running = true;
        console.log('Timer started');
      }
    } else if (request.action === 'stop') {
      if (running) {
        clearInterval(timer);
        running = false;
        console.log('Timer stopped');
      }
    } else if (request.action === 'reset') {
      clearInterval(timer);
      running = false;
      elapsedTime = 0;
      chrome.storage.local.set({ elapsedTime: elapsedTime, running: running });
      console.log('Timer reset');
    } else if (request.action === 'getState') {
      sendResponse({ elapsedTime: elapsedTime, running: running });
    }
  });
  
  function updateTime() {
    elapsedTime = Date.now() - startTime;
    chrome.storage.local.set({ elapsedTime: elapsedTime, running: running });
    chrome.runtime.sendMessage({ action: 'update', elapsedTime: elapsedTime });
    console.log('Time updated:', elapsedTime);
  }