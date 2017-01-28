var Coordinator = function(){
  this.geocoder = new google.maps.Geocoder();
};

Coordinator.prototype = {
  geocode: function(city, country, callback){
    console.log(city, country)
    this.geocoder.geocode( { 'address': city, country}, callback)}
}