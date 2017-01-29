var app = function(){
  var mapDiv = document.querySelector("#map");
  var map = new MapWrapper(mapDiv, {lat: 50.05, lng: -5.08}, 11);
  var cityNow = {};
  var builtCities = {};
  var ukCities = new UkCities();
  var coordinator = new Coordinator();
  // coordinator.geocode();

  console.log(ukCities.ukCities);
  var ukCitiesCoords = {};

  var setUkCoords = function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      // alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
      console.log(results);
      output = {
        name: results[0].formatted_address,
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
        object: results[0]
      }
      console.log(output);
      var nameP = document.querySelector("#name");
      var coordsP = document.querySelector("#coords");
      // thisDiv.appendChild(nameP);
      // thisDiv.appendChild(coordsP);
      // test.appendChild(thisDiv);
      nameP.innerText = output.name;
      coordsP.innerText = output.lat + " " + output.lng;
      map.moveCenter({lat: output.lat, lng: output.lng});
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

  // var testDiv = document.querySelector("#test");
  // testDiv.innerText = "working";

  var makeRequest = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callback;
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
  var getWeather = function(name, country){
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + name + "," + country + "&APPID=07830595d15fabfc0b091e97443be419";
    console.log(url);
    makeRequest(url, function(){
      if (this.status !== 200){
        return;
      } else {
        var response = JSON.parse(this.responseText);
        console.log(response);
        // var thisDiv = document.querySelector("#this-div");
        var weatherP = document.querySelector("#weather");
        // thisDiv.appendChild(weatherP);
        weatherP.innerText = response["weather"][0]["description"];
      }
    });
  }

  var getWiki = function(name, country){
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + name;
    makeRequest(url, function(){
      if (this.status !== 200){
        return;
      } else {
        var response = JSON.parse(this.responseText);
        console.log(response);
        // var thisDiv = document.querySelector("#this-div");
        var wikiP = document.querySelector("#wiki");
        // thisDiv.appendChild(weatherP);
        wikiP.innerText = "hello";
      }
    });
  }

  var cityGet = function(name, country){
    requestUkCoords(name, country);
    getWeather(name, country);
    getWiki(name, country);
  }

  var newCity = function(name, country){
    cityGet(name, country);
  }

  
  var goButt = document.querySelector("#go");
  newCity("London", "uk");
  // newCity("Aberdeen", "uk");
  // newCity("Milan", "it");

  goButt.onclick = function(){
    var cityChoice = document.querySelector("#city-chooser");
    var countryChoice = document.querySelector("#country-chooser");
    newCity(cityChoice.value, countryChoice.value);
  }
}

window.onload = app;