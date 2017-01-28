var app = function(){
  var ukCities = new UkCities();
  var coordinator = new Coordinator();
  // coordinator.geocode();

  console.log(ukCities.ukCities);
  var ukCitiesCoords = {};

  var setUkCoords = function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
      console.log(results);
      console.log({
        name: results[0].formatted_address,
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
        object: results[0]
      })
    } else {
      alert("Bad times: " + status);
    }
  }


      var requestUkCoords = function(city, country){
    // for(city of ukCities.ukCities){
    //   coordinator.geocode(city, "United Kingdom", setUkCoords);
    // }
    coordinator.geocode(city, country, setUkCoords);
  }

  


  var testDiv = document.querySelector("#test");
  testDiv.innerText = "working";

  var makeRequest = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callback; //if button calling function this is button
    request.send();
  }

  // var makeList = function () {
  //   if (this.status !== 200) return;
  //   var jsonString = this.responseText;
  //   console.log(JSON.parse(jsonString));
  //   cities = JSON.parse(jsonString).geonames;
  //   console.log(cities);
  //   var testDiv = document.querySelector("#test");
  //   cityNames = [];
  //   for (var city of cities){
  //     var cityName = city.name + ": lat " + city.lat + ", long " + city.lng;
  //     cityNames.push(cityName);
  //   }
  //   for (var city of cityNames){
  //     var cityP = document.createElement('p');
  //     cityP.innerText = city;
  //     testDiv.appendChild(cityP);
  //   }
  // }

  // makeRequest("http://api.geonames.org/citiesJSON?north=59.7&south=55.5&east=-2.6&west=-12.1&lang=de&maxRows=100&username=MisterrW", makeList)
  requestUkCoords("London", "United Kingdom");
  requestUkCoords("Edinburgh", "United Kingdom");
  requestUkCoords("Tulsa", "US");
}

window.onload = app;