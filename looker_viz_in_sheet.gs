// Replace this with your base domain 
var BASE_URL = 'https://MY_INSTANCE.looker.com:19999/api/3.0';
// Replace this with your API credentials
var CLIENT_ID = 'MY CLIENT ID'; 
var CLIENT_SECRET = 'MY CLIENT SECRET'; 


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

function GET_LOOK(LOOK_ID) {
  var options = {
        'method': 'get',
        'headers': {
            'Authorization': 'token ' + login()
        }
    };
  
    var LOOK_ID;
    // api call to /looks/{look_id} endpoint
    var response = UrlFetchApp.fetch(BASE_URL + "/looks/"+ LOOK_ID , options);
    var output = JSON.parse(response.getContentText());
    var query_id = output.query_id;
    result = [];
    result.push(query_id);
    return query_id
  } 


function GET_VIZ(query_id) {
    var options = {
        'method': 'get',
        'headers': {
            'Authorization': 'token ' + login()
        }
    };
  
    var query_id;
    // api call to the /queries/{query_id}/run/{format} endpoint
    var response = UrlFetchApp.fetch(BASE_URL + "/queries/"+ query_id + "/run/png", options);
    //var output = JSON.parse(response.getContentText());

    result = [];
    result.push(response);
    return result
}