document.addEventListener("DOMContentLoaded", function(event) {
  var csvElm = document.getElementById('csv');

  var sizeElm = function(){
    csvElm.style.height = (window.innerHeight - 45) + 'px';
  }

  window.addEventListener('resize', sizeElm);

  csvElm.onclick = function(elm){
    csvElm.focus();
    csvElm.select();
  }

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === 'csv') {
      csvElm.textContent = msg.data;
      sizeElm();
    }
  });
});
