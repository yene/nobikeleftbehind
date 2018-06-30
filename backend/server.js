var ttn = require('ttn');
var fs = require('fs');
var https = require('https');
var exampledata = require('./data/exampledata.js');
var config = JSON.parse(fs.readFileSync('./config.json', 'UTF-8'));

var bikes = [];
bikes = bikes.concat(exampledata); // adding example data for demo, it has predefined age key.

var b = JSON.parse(fs.readFileSync('data/bikes.json', 'utf8'));
bikes = bikes.concat(b);

var stations = JSON.parse(fs.readFileSync('data/stations.json', 'utf8'));

var processRequest = function( req, res ) {
  res.writeHead(200);
  res.end("All glory to WebSockets!\n");
};

var path = '/root/.caddy/acme/acme-v02.api.letsencrypt.org/sites/nobikeleftbehind.ch/';

const server = https.createServer({
  cert: fs.readFileSync(path + 'nobikeleftbehind.ch.crt'),
  key: fs.readFileSync(path + 'nobikeleftbehind.ch.key'),
}, processRequest).listen(8082);


const WebSocket = require('ws');
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws) {
  console.log('new client connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('error', (e) => console.log('client disconnected'));

  // fake the timestamps
  var now = new Date();
  bikes.forEach(function(b) {
    if (b.age !== undefined) {
      b.timestamp = new Date(now.getTime() - 1000*b.age);
    }
    if (b.health_score === undefined) {
      b.health_score = Math.floor((Math.random() * 4));
    }
  })
  ws.send(JSON.stringify({stations: stations, bikes: bikes}));
});

// discover handler and open mqtt connection
ttn.data(config.appID, config.accessKey)
  .then(function (client) {
    client.on('uplink', function (devID, payload) {
      //console.log(JSON.stringify(payload, null, 2));
      var buf = payload.payload_raw;
      if (payload.dev_id !== 'first_hero') {
        return;
      }

      if (buf.length !== 10) {
        console.error('Invalid data received.');
        return;
      }
      var t = new Date().toISOString();
      if (payload.metadata.time !== undefined) {
        t = payload.metadata.time;
      }

      var bikeData = lookUpBikeInDB(payload.hardware_serial);
      var d = {
        id: bikeData.id,
        station: bikeData.station,
        name: bikeData.name,
        type: bikeData.type,
        battery: buf.readUInt8(0),
        health_score: buf.readUInt8(1),
        lat: buf.readFloatLE(2),
        lng: buf.readFloatLE(6),
        timestamp: t,
        device: payload.dev_id,
        serial: payload.hardware_serial,
      }
      // If bike is in the records update it else add it.
      var exists = bikes.find(function(b) {
        return b.serial === d.serial;
      })
      if (exists === undefined) {
        bikes.push(d);
      } else {
        exists = Object.assign(exists, d);
      }

      // inform all clients of the new bike
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(d));
        }
      });

      console.log(d);
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

// discover handler and open application manager client
ttn.application(config.appID, config.accessKey)
  .then(function (client) {
    return client.get()
  })
  .then(function (app) {
    console.log('Got app', app)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

  function lookUpBikeInDB(serial) {
    // STUB

    return {
      id: 1337,
      name: '101435',
      type: 'Bike',
      station: 0,
    }

  }
