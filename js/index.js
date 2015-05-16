var csvRows = [];
var colSkips = [];

//walks up the dom, trying to find the first table
var getTableElement = function(elm){
  if (!elm) return false;
  if (elm.nodeName === 'TABLE') return elm;
  if (!elm.parentElement) return false;
  return getTableElement(elm.parentElement);
}

//handle a row element into an array of elements
var processTableRow = function(tr){
  var currentRow = [];
  for (var i=0;i<tr.childNodes.length;i++){
    var td = tr.childNodes[i];
    if (!(td.nodeName === 'TH' || td.nodeName === 'TD')) continue;
    var colspan = parseInt(td.getAttribute('colspan') || '1');
    var rowspan = parseInt(td.getAttribute('rowspan') || '1');
    var currentIndex = currentRow.length;
    var content = td.textContent.trim();

    var blocker = _.find(colSkips,function(sk){return sk.index == currentIndex;});
    if (blocker) {
      for (var g=0;g<blocker.colspan;g++){
        currentRow.push('');
      }
    }

    currentRow.push(content);
    for (var g=0;g<colspan-1;g++){
      currentRow.push('');
    }

    if (rowspan > 1) {
      //mark future processes to leave space
      colSkips.push({
        index: currentIndex,
        rowsLeft:rowspan, //leave row in place since the post comp does the --
        colspan:colspan
      });
    }

  }

  //update and cleanse col skips
  colSkips = _.map(colSkips,function(sk){ return {
                                            index: sk.index,
                                            rowsLeft: sk.rowsLeft-1,
                                            colspan: sk.colspan
                                          };
                                        });
  _.remove(colSkips,function(sk){
    return sk.rowsLeft < 1;
  });

  return currentRow;
}


var processTableElement = function(elm){
  if (!elm) return false;
  if (elm.childElementCount < 1) return false;
  for (var i=0;i<elm.childNodes.length;i++){
    var child = elm.childNodes[i];
    if (child.nodeName === 'TR'){
      csvRows.push(processTableRow(child));
    } else {
      processTableElement(child);
    }
  }
}

var computeRowsFromEvt = function (evt) {
  var table = getTableElement(evt.target);
  if (!table) return false;

  csvRows = []; //global tracking hack reset
  colSkips = [];
  processTableElement(table);
  return csvRows;
}

var rowToCSV = function(row){
  var fixedRow = _.map(row,function(elm){
    if (typeof elm !== 'string') return '';
    if (elm.indexOf(',') < 0 && elm.indexOf('"') < 0) return elm;
    return '"' + elm.replace(/"/g,'""') + '"';
  });
  var fullText = fixedRow.join(',');
  return fullText;
}

var arrayToCSV = function(rowArr) {
  var rows = _.map(rowArr,rowToCSV);
  return rows.join('\n');
}


//tracking hack to know which element is right clicked
var lastEvt=null;
document.addEventListener('mousedown', function(evt){
  if( evt.button == 2 ) {
    lastEvt = evt;
  }
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action !== 'contextRequestTable' || !lastEvt) return;

  var rowArr = computeRowsFromEvt(lastEvt);
  if (!rowArr) return;

  var finishedText;
  if (msg.actionId === 'toJsonPretty'){
    finishedText = JSON.stringify(rowArr,null,'  ');
  } else if (msg.actionId === 'toJsonMini') {
    finishedText = JSON.stringify(rowArr);
  } else {
    finishedText = arrayToCSV(rowArr);
  }
  finishedText = finishedText.trim();
  if (finishedText === '') return;

  chrome.runtime.sendMessage({
    action:'newpage',
    data: finishedText
  });

});
