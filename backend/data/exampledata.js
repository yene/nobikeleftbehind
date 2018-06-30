// age is in seconds
// 0 station means in the field
var data = [
  {station: 0, type: 'E-Bike', battery: 80, lat: 47.46277040609552, lng: 8.29968528577183, age: 50*60*60, serial: '0003DC04777B1C94'}, // baden forgotten
  {station: 0, type: 'Bike', battery: 80, lat: 47.35577511676121, lng: 8.536921308721048, age: 3*60*60, serial: '0004DC04777B1C94'}, // im wasser strandbad
  {station: 0, type: 'E-Bike', battery: 10, lat: 47.350192855468656, lng: 8.57880668469761, age: 3*60*60, serial: '0005DC04777B1C94'}, // low battery by Weinegg
  {station: 0, type: 'Bike', battery: 55, lat: 47.36356603581437, lng: 8.534003065312845, age: 3*60*60, serial: '0006DC04777B1C94'},
  {station: 0, type: 'Bike', battery: 33, lat: 47.36519384373842, lng: 8.528939054692728, age: 36*60*60, serial: '0007DC04777B1C94'},
  {station: 0, type: 'E-Bike', battery: 45, lat: 47.36868183443268, lng: 8.52988319226597, age: 3*60*60, serial: '0008DC04777B1C94'},
  {station: 0, type: 'Bike', battery: 65, lat: 47.37769140951948, lng: 8.521986768926126, age: 72*60*60, serial: '0009DC04777B1C94'},
  {station: 0, type: 'E-Bike', battery: 45, lat: 47.37495963645219, lng: 8.504391477788431, age: 25*60*60, serial: '000ADC04777B1C94'},
  {station: 0, type: 'Bike', battery: 76, lat: 47.38315453108259, lng: 8.502503202641947, age: 6*60*60, serial: '000BDC04777B1C94'},
  {station: 0, type: 'E-Bike', battery: 15, lat: 47.38890763216312, lng: 8.520184324468119, age: 20*60, serial: '000CDC04777B1C94'},
  {station: 0, type: 'Bike', battery: 45, lat: 47.41051973292251, lng: 8.542671964848978, age: 13*60*60, serial: '000DDC04777B1C94'},
  {station: 0, type: 'Bike', battery: 94, lat: 47.38332887670451, lng: 8.486367033208353, age: 4*60*60, serial: '000EDC04777B1C94'},

  {station: 0, type: 'Bike', battery: 95, lat: 0, lng: 0, age: 15*60, serial: '0ABADC04777B1C94'},
  {station: 0, type: 'E-Bike', battery: 86, lat: 0, lng: 0, age: 25*60, serial: '0ABADC04779B1C94'},
  {station: 0, type: 'Bike', battery: 77, lat: 0, lng: 0, age: 35*60, serial: '0ABADC04778B1C94'},
  {station: 0, type: 'E-Bike', battery: 80, lat: 0, lng: 0, age: 45*60, serial: '0ABADC04987B1C94'},
  {station: 0, type: 'Bike', battery: 43, lat: 0, lng: 0, age: 55*60, serial: '0ABADC04877B1C94'},
  {station: 0, type: 'E-Bike', battery: 65, lat: 0, lng: 0, age: 9*60, serial: '0ABADC04377B1C94'},
  {station: 0, type: 'Bike', battery: 45, lat: 0, lng: 0, age: 20*60, serial: '0ABADC04477B1C94'},
  {station: 0, type: 'E-Bike', battery: 45, lat: 47.40595985288653, lng:8.518768118286062, age: 13*60*60, serial: 'AABADC04477B1C94'}, // käferberg
];
module.exports = data;

// code to record example data:
// copy('{station: 0, battery: 80, lat: ' + $('.property__form input[name="lat"]').val() + ', lng:' + $('.property__form input[name="lng"]').val() + ', age: 3*60*60},')
