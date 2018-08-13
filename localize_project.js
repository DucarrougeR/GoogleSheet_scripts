// Replace this with your base domain /////////////////////////////
var BASE_URL = 'https://YOUR_COMPANY.com:19999/api/3.0';         // 
// Replace this with your API credentials /////////////////////////                       //
var CLIENT_ID = 'YOUR_API_KEY';                                  //
var CLIENT_SECRET = 'YOUR_API_SECRET';                           //
///////////////////////////////////////////////////////////////////

// function below will be called to remove possible duplicates
function rmDuplicatesFrom(arr) {
  var check  = {};
  var result = [];
  var j = 0;
  for(var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if(check[item] !== 1) {
      check[item] = 1;
      result[j++] = item;
    }
  }
  return result;
}


function GetLocale(model_name, language) {
  try {
  var options = {
        'method': 'get',
        'headers': {
            'Authorization': 'token ' + login()
        }
    };

    // api call to the /lookml_models/{lookml_model_name} endpoint to get list of all explores in model
    var response = UrlFetchApp.fetch(BASE_URL + "/lookml_models/" + model_name, options);
    var explores = JSON.parse(response.getContentText()).explores;
    var result = [];

    // looping through explore to get all the info
    for (var i = 0; len = explores.length, i < len; i++) {
        Logger.log(explores);

        var explore = explores[i].name;
        var explore_results = UrlFetchApp.fetch(BASE_URL + "/lookml_models/" + model_name + "/explores/" + explore, options);
        var dimensions = JSON.parse(explore_results.getContentText()).fields.dimensions;
        var measures = JSON.parse(explore_results.getContentText()).fields.measures;
      
        // adding data for explore label
        result.push([explore.label]);
      
        // adding the data for dimensions' label
          for (var j = 0; j < dimensions.length; j++) {
              var label = (dimensions[j].label).replace(dimensions[j].view_label, "").trim();
              var locale_dimension = LanguageApp.translate(label, 'en', language);
              if (label != null) {
                result.push([
                         '"'.concat(label).concat('" = "').concat(locale_dimension).concat('";')
                         ]);
            } 
         //handle the view_label values
              var view_label = (dimensions[j].view_label);
              var view_locale_dimension = LanguageApp.translate(view_label, 'en', language);
              if (view_label != null) {
                result.push([
                         '"'.concat(view_label).concat('" = "').concat(view_locale_dimension).concat('";')
                         ]);
            }
          }
          
          // adding the data for measures' label
          for (var k = 0; k < measures.length; k++) {
              var label = (measures[k].label).replace(measures[k].view_label, "").trim();
              var locale_measure = LanguageApp.translate(label, 'en', language);
              if (label != null) {
              result.push([
                         '"'.concat(label).concat('" = "').concat(locale_measure).concat('";')
                         ]);
              }
           //handle the view_label values
              var view_label = (measures[k].view_label);
              var view_locale_measure = LanguageApp.translate(view_label, 'en', language);
              if (view_label != null) {
              result.push([
                         '"'.concat(view_label).concat('" = "').concat(view_locale_measure).concat('";')
                         ]);
              }
          }}
    
    // keeping things ordered
    result.sort();
    
    // removing duplicate values
    var unique = rmDuplicatesFrom(result);
    
    // Add comments for time script is ran
    var curDate = Utilities.formatDate(new Date(), "GMT+1", "MM/dd/yyyy"); 
    unique.unshift(["# Created on ".concat(curDate)]);
    unique.unshift(["# Content for .strings file:"]);
    
    return unique 
  } catch(err) {
    return "Something went wrong. " + err
}}

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
