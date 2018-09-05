function getDistancePlace(origin, destination) {
  try {
  // https://maps.googleapis.com/maps/api/directions/json?origin={ origin }&destination={ destination }&sensor=false
  var response = UrlFetchApp.fetch("maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&sensor=false");
  var result = [];
  var values = JSON.parse(response.getContentText());
  console.log(values);
        var explore = values.routes[0].legs[0].distance.text;
        //var start_lat = values.routes[0].legs[0].start_location.lat;
        //var start_long = values.routes[0].legs[0].start_location.lng;            
        //var end_lat = values.routes[0].legs[0].end_location.lat;
        //var end_long = values.routes[0].legs[0].end_location.lng;
  result.push([
              explore,
              //start_lat,
              //start_lng,
              //end_lat,
              //end_lng
              ]);
     
  return result
  } catch (err) {
     Logger.log('getDistancePlace() yielded an error: ' + err);
     return "Uh oh! Something went wrong."
    }
}
