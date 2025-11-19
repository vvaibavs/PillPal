import { Buffer } from 'buffer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';

// UUIDs must match the ESP32 sketch
const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHAR_UUID = 'abcd1234-5678-90ab-cdef-1234567890ab';
const DEVICE_NAME = 'PillPal-ESP32';

export function useBle() {
  const managerRef = useRef<BleManager | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    managerRef.current = new BleManager();
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, []);

  const scanAndConnect = async () => {
    if (!managerRef.current) return;
    setIsScanning(true);
    try {
      const subscription = managerRef.current.startDeviceScan(
        null,
        { allowDuplicates: false },
        async (error, scannedDevice) => {
          if (error) {
            console.warn('Scan error', error);
            setIsScanning(false);
            return;
          }
          if (!scannedDevice) return;

          const name = scannedDevice.name ?? scannedDevice.localName ?? '';
          if (name.includes(DEVICE_NAME) || (scannedDevice.serviceUUIDs || []).includes(SERVICE_UUID)) {
            // Found device
            managerRef.current?.stopDeviceScan();
            setIsScanning(false);
            setIsConnecting(true);
            try {
              const connected = await scannedDevice.connect();
              await connected.discoverAllServicesAndCharacteristics();
              setDevice(connected);
              setIsConnected(true);
            } catch (connectErr) {
              console.warn('Connect error', connectErr);
            }
            setIsConnecting(false);
            subscription.remove();
          }
        }
      );
    } catch (e) {
      console.warn('scanAndConnect error', e);
      setIsScanning(false);
    }
  };

  const disconnect = async () => {
    if (!device) return;
    try {
      await device.cancelConnection();
    } catch (e) {
      console.warn('disconnect error', e);
    }
    setDevice(null);
    setIsConnected(false);
  };

  // write a single byte mask: bit0 -> pin25, bit1 -> pin26, bit2 -> pin27
  const writeLedMask = async (mask: number) => {
    if (!device) throw new Error('Not connected');
    const base64 = Buffer.from([mask & 0xff]).toString('base64');
    try {
      await device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, base64);
    } catch (e) {
      console.warn('writeLedMask error', e);
      throw e;
    }
  };

  return useMemo(() => ({
    scanAndConnect,
    disconnect,
    writeLedMask,
    isScanning,
    isConnecting,
    isConnected,
    device,
  }), [isScanning, isConnecting, isConnected, device]);
}

export default useBle;
