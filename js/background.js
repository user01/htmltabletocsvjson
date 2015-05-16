
var id = chrome.contextMenus.create({
  "title": "to CSV",
  "contexts":["page","selection","link","editable","image","video","audio"],
  'id':'toCsv'
});

var id2 = chrome.contextMenus.create({
  "title": "to JSON Formatted",
  "contexts":["page","selection","link","editable","image","video","audio"],
  'id':'toJsonPretty'
});

var id3 = chrome.contextMenus.create({
  "title": "to JSON Minified",
  "contexts":["page","selection","link","editable","image","video","audio"],
  'id':'toJsonMini'
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
  chrome.tabs.create({url : 'blankpage.html'}, function(tab) {
    chrome.tabs.sendMessage(tab.id,
      {
        action: "csv",
        data: message.data
      },
      function(response) {});
  });
});
