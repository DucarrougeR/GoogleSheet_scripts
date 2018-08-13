// Replace this with your base domain //////////////////////
var BASE_URL = 'https://your_company.com:19999/api/3.0';  //
// Replace this with your API credentials //////////////////
var CLIENT_ID = 'your_api_ID';                            //
var CLIENT_SECRET = 'your_api_key';                       //
////////////////////////////////////////////////////////////

function LookerGetDataDictionary(model_name) {
   //checks for previous cached entry 
   var cache = CacheService.getScriptCache();
   var cached = cache.get("api_results");
   if (cached != null) {
     for (elem in cached) { 
       results.push(elem)
     return results;
     }
  }
  // if nothing in cache, run the call
  try {

  var options = {
        'method': 'get',
        'headers': {
            'Authorization': 'token ' + login()
        }
    };

    // api call to the /lookml_models/{lookml_model_name} endpoint
    var response = UrlFetchApp.fetch(BASE_URL + "/lookml_models/" + model_name, options);
    var explores = JSON.parse(response.getContentText()).explores;
    var result = [];
    
    // defining the fields to retrieve for the Google Sheets
    result.push(["View Name", "Field Type", "Name", "Label", "Type", "Description", "Hidden"]);
                 // additional details if needed:
                 //, "SQL", "Source"]);

    
    for (var i = 0; len = explores.length, i < len; i++) {
        Logger.log(explores);

        var explore = explores[i].name;
        var explore_results = UrlFetchApp.fetch(BASE_URL + "/lookml_models/" + model_name + "/explores/" + explore, options);

        var connection = JSON.parse(explore_results.getContentText()).connection_name;
        var dimensions = JSON.parse(explore_results.getContentText()).fields.dimensions;
        var measures = JSON.parse(explore_results.getContentText()).fields.measures;
        var current_sheet = SpreadsheetApp.getActiveSheet().getName();

        // using this test to retrieve only data relevant to a specific explore
        // change explore_name with your explore
        if (explore == "explore_name") {
        
        // adding the data for the dimensions
          for (var j = 0; j < dimensions.length; j++) {
            // checks that only the fields from the underlying Looker view matching the name of the Google sheet are displayed
            if (dimensions[j].view.replace("_", " ") == current_sheet.toLowerCase()|| dimensions[j].view_label.replace("_", " ").toLowerCase() == current_sheet.toLowerCase()) {     
              result.push([dimensions[j].view, 
                         "Dimension", 
                         (dimensions[j].name.substring((dimensions[j].name.indexOf(".")+1), dimensions[j].name.length)).replace(/_/g, " "), 
                         (dimensions[j].label != null ? dimensions[j].label : (dimensions[j].name.substring((dimensions[j].name.indexOf(".")+1), dimensions[j].name.length).replace(/_/g, " "))), 
                         (dimensions[j].type != null ? (dimensions[j].type).replace("_", " ") : "String"),
                         dimensions[j].description,  
                         dimensions[j].hidden, dimensions[j].view_label
                         //, (dimensions[j].sql != null ? dimensions[j].sql : ""), 
                         //dimensions[j].source_file
                         ]);
          }
          }
          
          // adding the data for the measures
          for (var k = 0; k < measures.length; k++) {
            // checks that only the fields from the view matching the name of the sheet are displayed
            if (measures[k].view.replace("_", " ") == current_sheet.toLowerCase() || measures[k].view_label.replace("_", " ").toLowerCase() == current_sheet.toLowerCase()) {
              result.push([measures[k].view, 
                         "Measure", 
                         (measures[k].name.substring((measures[k].name.indexOf(".")+1), measures[k].name.length).replace(/_/g, " ")), 
                         (measures[k].label != null ? measures[k].label : (measures[k].name.substring((measures[k].name.indexOf(".")+1), measures[k].name.length)).replace(/_/g, " ")), 
                         (measures[k].type != null ? (measures[k].type).replace("_", " ") : "String"), 
                         measures[k].description, 
                         measures[k].hidden
                         //, (measures[k].sql != null ? measures[k].sql : ""), 
                         //measures[k].source_file
                         ]);
        }
        }
        }
    }
    cache.put("api_results", result, 21600); // cache for 6 hours
    //the maximum cache time is 6 hours (21600 seconds) 
    //the default time is 10 minutes (600 seconds).
    return result
  } catch(err) {
    return "Something went wrong. " + err
}
}

function login() {
  try{
    var post = {
        'method': 'post'
    };
    var response = UrlFetchApp.fetch(BASE_URL + "/login?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET, post);
    return JSON.parse(response.getContentText()).access_token;
  } catch(err) {
    Logger.log(err);
    return "Could not login to Looker. Check your credentials.";
  }
}

// call the function in you Google sheet with =LookerGetDataDictionary("model_name")
