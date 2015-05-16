document.addEventListener("DOMContentLoaded", function(event) {
  var csvElm = document.getElementById('csv');
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === 'csv') {
      csvElm.textContent = msg.data;
    }
  });
});
