function lookerFetchData(url) {
  url = url.replace(/(\/\w+\.)txt|html|csv(\?.*)?/, "$1csv$2");
  var csvString = UrlFetchApp.fetch(url).getContentText();
  var dataIn = Utilities.parseCsv(csvString);
  var dataOut = dataIn.map(function(row) {
    return row.map(function(val) {
      if (val == '') return '';
      
      var timeMatch = /(\d{4})\-(\d{2})-*(\d{0,}) (\d{2}):(\d{2}):(\d{2})/.exec(val);
      while (timeMatch != null) {
        return timeMatch[1].concat("-").concat(timeMatch[2]).concat("-").concat(timeMatch[3]).concat(" ").concat(timeMatch[4]).concat(":").concat(timeMatch[5]).concat(":").concat(timeMatch[6]);
      };
      
      var dateMatch = /(\d{4})\-(\d{2})-*(\d{0,})/.exec(val);
      while (dateMatch != null) {
        if (dateMatch[2] == null || dateMatch[2] == "" ) {
          // for YYYY
          return dateMatch[1];
        } else if (dateMatch[3] == null || dateMatch[3] == "" ) {
          // for YYYY-MM
          return dateMatch[1].concat("-").concat(dateMatch[2]);
        } else {
          // for YYYY-MM-DD
          return dateMatch[1].concat("-").concat(dateMatch[2]).concat("-").concat(dateMatch[3]);
        }
      };
      if (val.match(/[-a-zA-Z]/)) {
        return String(val)
      };
      
      val = val.replace(/[^\d.]/g, '');
      
      if (val.match(/[0-9.]+/))
        return Number(val);
      
      return Number(parseInt(val));
    });
  });
  return dataOut;
}
