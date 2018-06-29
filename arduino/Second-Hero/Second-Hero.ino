#include <TheThingsNetwork.h>

// Set your AppEUI and AppKey
const char *appEui = "70B3D57ED001010B";
const char *appKey = "F4CC5E26B482C6DD4E4F3E386620A688";

#define loraSerial Serial1
#define debugSerial Serial

// Replace REPLACE_ME with TTN_FP_EU868 or TTN_FP_US915
#define freqPlan TTN_FP_EU868

TheThingsNetwork ttn(loraSerial, debugSerial, freqPlan);

void setup() {
  loraSerial.begin(57600);
  debugSerial.begin(9600);

  // Wait a maximum of 10s for Serial Monitor
  while (!debugSerial && millis() < 10000) {};

  ttn.showStatus();
  ttn.join(appEui, appKey);
}

void loop() {

  typedef struct sensorData_t{
    uint8_t battery; // 0-100%
    uint8_t health_score; // 0: idle/not used, 1: bike used maybe once, 2: bike used multiple times, 3: bike heavily used
    float lat;
    float lng;
  };
  
  typedef union I2C_Packet_t{
    sensorData_t sensor;
    byte I2CPacket[sizeof(sensorData_t)];
  };
  
  I2C_Packet_t idlesensor;  
  idlesensor.sensor.battery = random(0, 101);
  idlesensor.sensor.health_score = random(0, 4);
  idlesensor.sensor.lat = 47.377765331038134;
  idlesensor.sensor.lng = 8.52585528466918;

  // debug print
  for(int i = 0; i < sizeof(idlesensor.I2CPacket); i++) {
    char tmp[16];
    sprintf(tmp, "%.2X",idlesensor.I2CPacket[i]); 
    Serial.print(tmp);
  }
  Serial.println();

  ttn.sendBytes(idlesensor.I2CPacket, sizeof(idlesensor.I2CPacket));
  delay(20000);
}


