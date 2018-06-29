/*
interpreting the FMLRTrackerTwo data

Taken from FMLR_TrackerTwo_GPS.pdf
| 1 byte sensor channel | 1 byte sensor type | N bytes value |

Types:
0x67 = Temperature
0x71 ⇒ Accelerometer
0x88 ⇒ GPS
*/

// Temperature + Accelerometer
var payload = [1, 5, 7, 58, 119, 1, 77, 70, 0, 173, 82, 100];
payload = [0x01, 0x67, 0xFF, 0xD7, 0x06, 0x71, 0x04, 0xD2, 0xFB, 0x2E, 0x00, 0x00];

var buf = Buffer.from(payload);
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
console.log(JSON.stringify(data, null, 2));
