// Simple ESP32 firmware that supports two control modes:
// 1) Local boot button cycling (existing behavior)
// 2) BLE write control: a single writable characteristic accepts one byte where
//    bit0 -> LED on GPIO25, bit1 -> GPIO26, bit2 -> GPIO27. Any bit set = HIGH.

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

int leds[] = {25, 26, 27};  // GPIO pins for each LED
int numLeds = 3;
int bootButton = 0;          // BOOT button is GPIO0
int ctr = 0;
int lastButtonState = HIGH;  // start with not pressed

// BLE UUIDs (custom)
static BLEUUID serviceUUID("12345678-1234-1234-1234-1234567890ab");
static BLEUUID charUUID("abcd1234-5678-90ab-cdef-1234567890ab");

BLECharacteristic *pCharacteristic;

class LedWriteCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pChar) {
    std::string val = pChar->getValue();
    if (val.length() >= 1) {
      uint8_t mask = (uint8_t)val[0];
      // apply mask: bit0 -> leds[0]=25, bit1 -> leds[1]=26, bit2 -> leds[2]=27
      for (int i = 0; i < numLeds; i++) {
        if (mask & (1 << i)) {
          digitalWrite(leds[i], HIGH);
        } else {
          digitalWrite(leds[i], LOW);
        }
      }
    }
  }
};

void setup() {
  Serial.begin(115200);
  pinMode(bootButton, INPUT_PULLUP); // button on board
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
    digitalWrite(leds[i], LOW);
  }

  // Initialize BLE
  BLEDevice::init("PillPal-ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(serviceUUID);

  pCharacteristic = pService->createCharacteristic(
      charUUID,
      BLECharacteristic::PROPERTY_WRITE
  );
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new LedWriteCallback());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(serviceUUID);
  pAdvertising->start();

  Serial.println("BLE PillPal-ESP32 started, waiting for writes...");
}

void loop() {
  // Keep original boot button behavior as a fallback: press cycles LEDs
  int buttonState = digitalRead(bootButton);

  // detect transition: HIGH -> LOW (button press)
  if (buttonState == LOW && lastButtonState == HIGH) {
    // cycle mode: turn off all and enable next
    for (int i = 0; i < numLeds; i++) digitalWrite(leds[i], LOW);
    digitalWrite(leds[ctr], HIGH);
    ctr = (ctr + 1) % numLeds;
    delay(50); // small debounce delay
  }

  lastButtonState = buttonState; // update for next loop
  delay(10);
}
