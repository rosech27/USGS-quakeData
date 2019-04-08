var myMap = L.map("map", {
  center: [44.58, -103.46],  
  zoom: 3
});

console.log("my map declared");

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


console.log("tile layer added");

var newtry = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(newtry, function(response) {

  console.log(response);
  // console.log("response logged");

  var len = response.features.length
  // console.log(len)
  // console.log("tot lenth")

  for (var i = 0; i < len; i++) {
    var location = response.features[i].geometry;
    //[0].geometry;

    // console.log("location added");
    // console.log(location);



    if (location) {
      L.circle([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        weight: 1,
//        fillColor: color,
        fillColor:getColor(response.features[i].properties.mag),
        radius: markerSize(response.features[i].properties.mag)
      })
      .bindPopup("<h3>" + response.features[i].properties.place + "</h3> <hr> <h4>Magnitude: " + response.features[i].properties.mag + "</h4>")
      .addTo(myMap);
    
  };
};

//var legend = L.control({position: 'bottomright'});
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend');
var labels = ['<strong>Magnitude</strong>'];

var grades = [0, 1, 2, 3, 4, 5];

// loop through magnitude grades and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
        labels.push(
            '<i class="circle" style="background:' + getColor(grades[i]+ 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+'))
    }
    div.innerHTML = labels.join('<br>');
return div;
};

 // Adding legend to the map
legend.addTo(myMap);

// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 1, 2, 3, 4, 5],
//         labels = ['<strong>Magnitude</strong>'];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//       div.innerHTML +=
//           '<i class="circle" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//   }
//   div.innerHTML = labels.join('<br>');
//   return div;
// };

// legend.addTo(map);

function markerSize(mag){
  return mag*20000
}

function getColor(d) {
  return d > 5 ? '#FF0000' :
         d > 4  ? '#FF4500' :
         d > 3  ? '#FFA500' :
         d > 2  ? '#FAA460' :
         d > 1   ? '#FFFF00' :
                    '#008000';
}


