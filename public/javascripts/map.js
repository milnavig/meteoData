/* eslint-disable */
/*
var map = new OpenLayers.Map("mapdiv");

map.addLayer(new OpenLayers.Layer.OSM());

var lonLat = new OpenLayers.LonLat( 30.5141, 50.4455 )
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );     
    
var zoom=14;

var markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);
var size = new OpenLayers.Size(21,25);
var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
//var icon = new OpenLayers.Icon("./img/icon-50x50.png", size, offset);
    
//markers.addMarker(new OpenLayers.Marker(lonLat, icon));
    
    
map.setCenter (lonLat, zoom);

      
var user_pos_lat;  
var user_pos_lng;  
      
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    user_pos_lat = position.coords.latitude;
    user_pos_lng = position.coords.longitude;
              
    var user_lonLat = new OpenLayers.LonLat(user_pos_lng, user_pos_lat  )
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
            );
            
    markers.addMarker(new OpenLayers.Marker(user_lonLat));
    //console.log(user_pos_lat + " " + user_pos_lng);        
    }, function() {
        console.log(user_pos_lat + " " + user_pos_lng);
    });
} else {
        // Browser doesn't support Geolocation
        console.log("Map Error");
}*/

var user_pos_lat = 50.436516;  
var user_pos_lng = 30.484727;  

var mymap = L.map('mapid').setView([50.436516, 30.484727], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWlsbmF2aWciLCJhIjoiY2tnOXFzYzE5MDAwczJ0bzFzajFmcGUzMyJ9.Zi-2N6HfsX-ZRy2tCYjDlQ'
}).addTo(mymap);

var marker = L.marker([user_pos_lat, user_pos_lng]).addTo(mymap);

marker.bindPopup("<b>Місто Київ!</b><br>Інформація.").openPopup();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        user_pos_lat = position.coords.latitude;
        user_pos_lng = position.coords.longitude;
        var my_marker = L.marker([user_pos_lat, user_pos_lng]).addTo(mymap);

        my_marker.bindPopup("<b>Місцезнаходження</b><br>Ви знаходитеся тут.").openPopup();
    });
} else {
    // Browser doesn't support Geolocation
    console.log("Map Error");
    user_pos_lat = 50.436516;
    user_pos_lng = 30.484727;
}

var popup = L.popup();

function onMapClick(e) {
    
    fetch('https://afternoon-badlands-72919.herokuapp.com/data?lon=' + e.latlng.lng + '&lat=' + e.latlng.lat, {
    mode: 'no-cors'}).then((response) => {
                return response.json();
            }).then((res) => {
                popup
                    .setLatLng(e.latlng)
                    .setContent("The temperature <b>at</b> " + e.latlng.toString() + "<br/>Temperature: "+ res.main.temp +"°<br/>Feels like: " + res.main.feels_like + "°<br/><a href='https://afternoon-badlands-72919.herokuapp.com/add.html?lon=" + e.latlng.lng + "&lat=" + e.latlng.lat + "'>Додати</a>")
                    .openOn(mymap);
                console.log(e);
                console.log(res);
            });
    
}

mymap.on('click', onMapClick);