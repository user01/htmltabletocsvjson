

chrome.runtime.onInstalled.addListener(function() {

  chrome.contextMenus.create({
    "title": "to CSV",
    "contexts":["page","selection","link","editable","image","video","audio"],
    'id':'toCsv'
  });

  chrome.contextMenus.create({
    "title": "to JSON Formatted",
    "contexts":["page","selection","link","editable","image","video","audio"],
    'id':'toJsonPretty'
  });

  chrome.contextMenus.create({
    "title": "to JSON Minified",
    "contexts":["page","selection","link","editable","image","video","audio"],
    'id':'toJsonMini'
  });

});

chrome.contextMenus.onClicked.addListener(function(data){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,
      {
        action: "contextRequestTable",
        actionId: data.menuItemId
      },
      function(response) {});
  });

});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action !== 'newpage') return;
  var data = message.data ? message.data : '';
  if (data.length < 2097000){
    chrome.tabs.create({url: 'data:text;base64,'+btoa(message.data)});
  } else {
    chrome.tabs.create({url : 'blankpage.html'}, function(tab) {
      chrome.tabs.sendMessage(tab.id,
        {
          action: "csv",
          data: message.data
        },
        function(response) {});
    });
  }

});
