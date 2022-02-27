
#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>

#define FIREBASE_HOST "sigurnosnisistemiot-default-rtdb.europe-west1.firebasedatabase.app"
#define FIREBASE_AUTH "xQiJ0B4FgosQbYb7x7xRtaqYUcb1O8VTj7sEO9X1"

#define WIFI_SSID "xxxx"
#define WIFI_PASSWORD "xxxxxxxx"

FirebaseData firebase;
bool allSensorController;

#define MQ2 A0
#define flame D7
#define PIR D0

void setup()
{
  Serial.begin(9600);
  delay(20000);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  pinMode(flame, INPUT);
  pinMode(PIR, INPUT);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void gassensor()
{

  if (allSensorController == 1)
  {
    float value = analogRead(MQ2);
    value = map(value, 0, 1024, 0, 100);
    if (value > 60)
    {
      Serial.println("Alarm activated! -> MQ2 sensor");
    }
    Firebase.setInt(firebase, "Soba/MQ2Sensor", value);
  }
}

void flamesensor()
{

  if (allSensorController == 1)
  {
    bool value = digitalRead(flame);
    if (value == 0)
    {
      Serial.println("Alarm activated! -> Flame sensor");
    }
    Firebase.setInt(firebase, "Soba/FlameSensor", value);
  }
}

void pirsensor()
{

  if (allSensorController == 1)
  {
    bool value = digitalRead(PIR);

    if (value == 1)
    {
      Serial.println("Alarm activated! -> PIR sensor");
    }
    Firebase.setInt(firebase, "Soba/PIRSensor", value);
  }
}

void loop()
{

  bool temp = Firebase.getInt(firebase, "Kontroleri/StatusAll");
  allSensorController = firebase.to<int>();

  pirsensor();
  gassensor();
  flamesensor();
}
