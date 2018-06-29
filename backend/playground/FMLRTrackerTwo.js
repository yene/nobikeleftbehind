/*
interpreting the FMLRTrackerTwo data
*/

// miromico payload format
// http://www.miromico.ch/tl_files/downloads/flyer/GPS_Tracker_Payload_Format_v0.2.pdf
// https://shiro.ch/shot%202018-06-29%20at%2017.05.48.png
var payload;
payload = [0x01,0x05,0x07,0x3A,0x80,0x01,0x4D,0x5A,0x00,0xA5,0x8C,0x64];

var buf = Buffer.from(payload);
var data = {
  fix: buf.readUInt8(0), // 0 or 1
  satellites: buf.readUInt8(1), // 1 to 12
  latitude: buf.readIntBE(2, 3) / 10000, // 1/10000 deg
  longitude: buf.readIntBE(5, 3) / 10000, // 1/10000 deg
  altitude: buf.readIntBE(8, 3) / 100, // 1/100 m
  battery: battery255to100(buf.readUInt8(11)),
}
console.log(JSON.stringify(data, null, 2));


function battery255to100(b) {
  return Math.round((b/255)*100);
}

/* Alternative way of decoding the integers
 var decoded = {};
 decoded.fix = bytes[0];
 decoded.satellites = bytes[1];
 decoded.battery= bytes[11]
 decoded.latitude = ((bytes[2]<<16 ) | (bytes[3]<<8) | (bytes[4]))/10000;
 decoded.longitude = ((bytes[5]<<16 ) | (bytes[6]<<8) | (bytes[7]))/10000;
 decoded.altitude = ((bytes[8]<<16 ) | (bytes[9]<<8) | (bytes[10]))/100;
*/


/*
Other playload format:


Taken from FMLR_TrackerTwo_GPS.pdf
| 1 byte sensor channel | 1 byte sensor type | N bytes value |

Types:
0x67 = Temperature
0x71 ⇒ Accelerometer
0x88 ⇒ GPS

var data = {
  // channel 1 byte 0x01
  // type 1 byte 0x67 == Temperature
  temperature: buf.readInt16BE(2) / 10,
  // channel 1 byte 0x06
  // type 1 byte 0x71 == Accelerometer
  accelerometer: {
    x: buf.readInt16BE(6) / 1000,
    y: buf.readInt16BE(8) / 1000,
    z: buf.readInt16BE(10) / 1000,
  },
}
*/
