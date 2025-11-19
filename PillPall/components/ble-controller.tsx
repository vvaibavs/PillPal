import useBle from '@/hooks/use-ble';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function BleController() {
  const { scanAndConnect, disconnect, writeLedMask, isConnected, isScanning, isConnecting } = useBle();
  const [leds, setLeds] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const toggleLed = async (index: number) => {
    const next: [boolean, boolean, boolean] = [...leds] as any;
    next[index] = !next[index];
    setLeds(next);

    // compute mask and send
    const mask = (next[0] ? 1 : 0) | (next[1] ? 2 : 0) | (next[2] ? 4 : 0);
    try {
      await writeLedMask(mask);
    } catch (e) {
      console.warn('Failed to write LED mask', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE LED Controller</Text>

      <View style={styles.row}>
        <Pressable
          style={[styles.ledButton, leds[0] ? styles.on : styles.off]}
          onPress={() => toggleLed(0)}>
          <Text style={styles.btnText}>LED 25</Text>
        </Pressable>
        <Pressable
          style={[styles.ledButton, leds[1] ? styles.on : styles.off]}
          onPress={() => toggleLed(1)}>
          <Text style={styles.btnText}>LED 26</Text>
        </Pressable>
        <Pressable
          style={[styles.ledButton, leds[2] ? styles.on : styles.off]}
          onPress={() => toggleLed(2)}>
          <Text style={styles.btnText}>LED 27</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        {!isConnected ? (
          <Pressable style={styles.actionButton} onPress={scanAndConnect}>
            <Text style={styles.btnText}>{isScanning || isConnecting ? 'Connecting...' : 'Connect'}</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.actionButton, styles.disconnect]} onPress={disconnect}>
            <Text style={styles.btnText}>Disconnect</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 8,
  },
  ledButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  on: { backgroundColor: '#4CAF50' },
  off: { backgroundColor: '#333' },
  actionButton: {
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  disconnect: { backgroundColor: '#F44336' },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});
