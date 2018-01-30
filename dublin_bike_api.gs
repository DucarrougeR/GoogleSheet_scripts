function get_dublin_bikes() {
  
  try {
    var response = UrlFetchApp.fetch("http://api.citybik.es/v2/networks/dublinbikes");  
    var data = JSON.parse(response.getContentText());
    var result = [];
  
    result.push(["Station Name", "Parking Spots Available", "Bikes Available", "Last Check"]);
    for (elem in data.network.stations){
      
      var date = new Date(data.network.stations[elem].extra.last_update);
      var last_update = date.toTimeString();
           
      result.push([data.network.stations[elem].name, data.network.stations[elem].empty_slots, data.network.stations[elem].free_bikes, date]);
    }
    return result;
  } catch (err) {
    return "Something went wrong!";
  }
}
