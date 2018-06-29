/*
This script gets all the stations and bikes from the PubliBike API

https://api.publibike.ch/v1/public/stations
https://api.publibike.ch/v1/public/stations/110



*/

var fs = require('fs');
var axios = require('axios');

var stations = []; // format {id, latitude, longitude, state {id,name}, name, city}
var bikes = []; // {id,name,type}

var downloadCounter = 0;
var downloadData = [];

axios.get('https://api.publibike.ch/v1/public/stations')
.then(function (response) {
    downloadData = response.data;
    downloadStation();
})
.catch(function (error) {
  console.error(error);
});


function downloadStation() {
  if (downloadCounter === downloadData.length) {
    done();
    return;
  }

  axios.get('https://api.publibike.ch/v1/public/stations/' + downloadData[downloadCounter].id)
  .then(function (response) {
    var d = response.data;
    if (d.city === 'Zürich') { // No lausanne, bern etc
      stations.push({id: d.id, lat: d.latitude, lng: d.longitude, state: d.state.name, name: d.name});
      d.vehicles.forEach(v => {
        var b = Math.floor((Math.random() * 100) + 1);
        // random age between 3 days and now
        var a = Math.floor((Math.random() * 3*24*60*60) + 1);
        // random serial but not mine. 1305167548645700
        var s = Math.floor((Math.random() * 1305167548645700) + 1);
        var hex = Number(s).toString(16).toUpperCase().padStart(16, '0');

        bikes.push({id: v.id, station: d.id, name: v.name, type: v.type.name, lat: d.latitude, lng: d.longitude, battery: b, age: a, serial: hex});
        if (v.type.name !== 'Bike' && v.type.name !== 'E-Bike') {
          console.log('Found a new type of bike', v.type.name);
        }
      });
    }
    downloadCounter = downloadCounter + 1;
    downloadStation();
  })
  .catch(function (error) {
    console.error(error);
  });

}

function done() {
  fs.writeFileSync('data/stations.json', JSON.stringify(stations, null, 2));
  fs.writeFileSync('data/bikes.json', JSON.stringify(bikes, null, 2));
  console.log('finished downloading', downloadCounter, 'stations');
}
