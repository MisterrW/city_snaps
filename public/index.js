var app = function(){
  var mapDiv = document.querySelector("#map");
  var map = new MapWrapper(mapDiv, {lat: 50.05, lng: -5.08}, 11, [
  {
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#f5f5f5"
    }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
    {
      "visibility": "off"
    }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#616161"
    }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
    {
      "color": "#f5f5f5"
    }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#bdbdbd"
    }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#eeeeee"
    }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#757575"
    }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#e5e5e5"
    }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#9e9e9e"
    }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#ffffff"
    }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#757575"
    }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#dadada"
    }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#616161"
    }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#9e9e9e"
    }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#e5e5e5"
    }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#eeeeee"
    }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
    {
      "color": "#c9c9c9"
    }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#9e9e9e"
    }
    ]
  }
  ]);
  var cityNow = {};
  var builtCities = {};
  var ukCities = new UkCities();
  var coordinator = new Coordinator();
  // coordinator.geocode();

  console.log(ukCities.ukCities);
  var ukCitiesCoords = {};

  var postCurrentTime = function(timeObject){
    var localTime = document.querySelector("#time");
    localTime.innerText = timeObject.formatted;
  }

  var getCurrentTime = function(lat, lng){
    var url = "http://api.timezonedb.com/v2/get-time-zone?key=AFQAZRVOAIDL&format=json&by=position&lat=" + lat + "&lng=" + lng;
    makeRequest(url, function(){
      console.log(JSON.parse(this.responseText));
      postCurrentTime(JSON.parse(this.responseText));
    })
  }

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
      coordsP.innerText = output.lat + ", " + output.lng;
      map.moveCenter({lat: output.lat, lng: output.lng});
      getCurrentTime(output.lat, output.lng);
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

  var makeRequest = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callback;
    request.send();
  }

  var round = function(number){
    return (Math.round(number*100))/100;
  }

  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  }

  var getWeather = function(name, country){
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + name + "," + country + "&APPID=07830595d15fabfc0b091e97443be419";
    console.log(url);
    makeRequest(url, function(){
      if (this.status !== 200){
        return;
      } else {
        var response = JSON.parse(this.responseText);
        console.log(response);
        var weatherP = document.querySelector("#weather");
        var temp = round(response["main"]["temp"]-273.15);
        var description = response["weather"][0]["description"].capitalize();
        weatherP.innerText = description + ", " + temp + "°C.";
      }
    });
  }

  var getWiki = function(name, country){
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + name + "&origin=*";
    makeRequest(url, function(){
      if (this.status !== 200){
        return;
      } else {
        var response = JSON.parse(this.responseText);
        console.log("wikiResponse:")
        var pages = response.query.pages;
        pagesArray = [];
        for(page in pages) {pagesArray.push(pages[page])};
          console.log(pagesArray);
        console.log(pagesArray[0].extract)
        // var thisDiv = document.querySelector("#this-div");
        var wikiP = document.querySelector("#wiki");
        // thisDiv.appendChild(weatherP);
        wikiP.innerText = pagesArray[0].extract;
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

  

  newCity("Edinburgh", "uk");
  // newCity("Aberdeen", "uk");
  // newCity("Milan", "it");


  var go = function(){
      var cityChoice = document.querySelector("#city-chooser");
      // var countryChoice = document.querySelector("#country-chooser");
      newCity(cityChoice.value, "");
    }

    // var goButt = document.querySelector("#go");
  // goButt.onclick = go;

  var cityChoice = document.querySelector("#city-chooser");
  cityChoice.onkeyup = function(event){
    if (event.keyCode === 13) {
      console.log("yep");
      go();
    }
  }

  var hideNotes = document.querySelector("#hide-notes");
  hideNotes.style.display = "none";

  var notesDiv = document.querySelector("#notes");
  notesDiv.style.display = "none";

  var showNotes = document.querySelector("#show-notes");
  showNotes.onclick = function(){
    notesDiv.style.display = "block";
    hideNotes.style.display = "inline";
    hideNotes.onclick = function(){
      notesDiv.style.display = "none";
      hideNotes.style.display = "none";
    }
  }

  var hideNotes = document.querySelector("#hide-notes");
  hideNotes.style.display = "none";

  var notesDiv = document.querySelector("#notes");
  notesDiv.style.display = "none";

  var description = document.querySelector("#wiki");
  wiki.style.display = "none";

  var hideDescription = document.querySelector("#hide-description");
  hideDescription.style.display = "none"
  
  var showDescription = document.querySelector("#show-description");
  showDescription.onclick = function(){
    showDescription.style.display = "none";
    hideDescription.style.display = "block";
    description.style.display = "block";
    hideDescription.onclick = function(){
      showDescription.style.display = "block";
      hideDescription.style.display = "none";
      description.style.display = "none";
    }
  }
}
window.onload = app;