//Google Sheet script to geolocalize IP Address

function ip_geolocation(cell_reference) {
  // =get_ip_map(A1)
  var response = UrlFetchApp.fetch("freegeoip.net/json/" + cell_reference);
  var result = [];
  var values = JSON.parse(response.getContentText());
  result.push([values.latitude , values.longitude, values.city, values.country_name, values.country_code]);
    
  return result
}
