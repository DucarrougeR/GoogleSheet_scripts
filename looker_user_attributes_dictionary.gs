// Replace this with your base domain 
var BASE_URL = 'https://client.looker.com:19999/api/3.0';
// Replace this with your API credentials
var CLIENT_ID = ''; 
var CLIENT_SECRET = ''; 

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

function GET_USER_ATTRIBUTES_DICTIONARY() {
  var options = {
        'method': 'get',
        'headers': {
            'Authorization': 'token ' + login()
        }
    };

    // api call to the /user_attributes endpoint
    var response = UrlFetchApp.fetch(BASE_URL + "/user_attributes", options);
    var output = JSON.parse(response.getContentText());
    var result = [];
    
    // defining the fields to retrieve for the Google Sheets
    result.push(["ID", "Name", "Label", "Type", "Default Value"]);
    result.push(output.length);
  
    for (var i = 0; len = output.length, i < len; i++) {
        Logger.log(output);

        var id = output[i].id;
        var name = output[i].name;
        var label = output[i].label;
        var type = output[i].type;
        var default_value = output[i].default_value;
        result.push([id,
                   name,
                   label,
                   type,
                   default_value]);
    }
    return result
  } 



