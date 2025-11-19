int leds[] = {25, 26, 27};  // GPIO pins for each LED
int numLeds = 3;
int bootButton = 0;          // BOOT button is GPIO0
int ctr = 0;
int lastButtonState = HIGH;  // start with not pressed

void setup() {
  pinMode(bootButton, INPUT_PULLUP); // button on board
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }
}

void loop() {
  int buttonState = digitalRead(bootButton);

  // detect transition: HIGH -> LOW (button press)
  if (buttonState == LOW && lastButtonState == HIGH) {
    turnOffAllLEDs();
    digitalWrite(leds[ctr], HIGH);
    ctr = (ctr + 1) % numLeds;
    delay(50); // small debounce delay
  }

  lastButtonState = buttonState; // update for next loop
}

void turnOffAllLEDs() {
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], LOW);
  }
}
