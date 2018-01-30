function getActiveRange(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[1];
  // Returns the active range
  var range = sheet.getActiveRange();
  
  // using 'A1' as the content starts there
  var start_data = "A1";
  
  var end_row = range.getLastRow();
  
  // getLastColumn returns index, need to convert to Letter
  var end_column = range.getLastColumn();
    if (end_column < 27) { 
      return start_data.concat(String.fromCharCode(64 + end_column)).concat(end_row);
    } 
  else {
    var first = Math.round(end_column / 26);
    var second = end_column % 26;
    return start_data.concat(String.fromCharCode(64 + first) + String.fromCharCode(64 + second)).concat(end_row);
  }
}