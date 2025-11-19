import { DayOfWeek } from '@/components/dayOfWeek';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const inputBackground = useThemeColor({ light: '#F0F0F0', dark: '#2C2C2C' }, 'background');
  const placeholderColor = useThemeColor({ light: '#999999', dark: '#666666' }, 'text');
  const buttonBackground = useThemeColor({ light: '#A1CEDC', dark: '#1D3D47' }, 'tint');

  const toggleDay = (day: string) => {
    const newSelected = new Set(selectedDays);
    if (selectedDays.has(day)) {
      newSelected.delete(day);
    } else {
      newSelected.add(day);
    }
    setSelectedDays(newSelected);
    Haptics.selectionAsync();
  };

  const handleSave = async () => {
    if (!name || !dosage || !time || selectedDays.size === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const medication = {
      id: Date.now().toString(),
      name,
      dosage,
      time,
      days: Array.from(selectedDays),
    };

    try {
      // Read existing medications
      const existing = await AsyncStorage.getItem('medications');
      const meds = existing ? JSON.parse(existing) as Array<any> : [];
      meds.push(medication);
      await AsyncStorage.setItem('medications', JSON.stringify(meds));

      // success feedback and navigate back to schedule
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/schedule'); // Navigate directly to the schedule page
    } catch (error) {
      console.error('Failed to save medication', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Medication Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter medication name"
            placeholderTextColor={placeholderColor}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Dosage</ThemedText>
          <View style={styles.dosageRow}>
            <TextInput
              style={[styles.input, styles.dosageInput, { backgroundColor: inputBackground }]}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage (mg)"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
            />
            <ThemedText style={styles.dosageUnit}>mg</ThemedText>
          </View>
        </View>

        <View style={[styles.inputContainer, { zIndex: 10 }]}>
          <ThemedText style={styles.label}>Time</ThemedText>
          <Pressable
            style={[styles.input, styles.dropdownTrigger, { backgroundColor: inputBackground }]}
            onPress={() => {
              setShowTimeDropdown(!showTimeDropdown);
              Haptics.selectionAsync();
            }}
          >
            <ThemedText style={{ color: time ? undefined : placeholderColor, fontSize: 16 }}>
              {time || "Select time"}
            </ThemedText>
            <Ionicons
              name={showTimeDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={placeholderColor}
            />
          </Pressable>

          {showTimeDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: inputBackground }]}>
              {['12:00 AM', '3:00 PM', '6:00 PM'].map((option, index) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.dropdownOption,
                    pressed && { backgroundColor: 'rgba(0,0,0,0.05)' },
                    index !== 2 && styles.dropdownBorder
                  ]}
                  onPress={() => {
                    setTime(option);
                    setShowTimeDropdown(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <ThemedText style={styles.dropdownOptionText}>{option}</ThemedText>
                  {time === option && (
                    <Ionicons name="checkmark" size={20} color={buttonBackground} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Days</ThemedText>
          <View style={styles.daysContainer}>
            {allDays.map((day) => (
              <DayOfWeek
                key={day}
                day={day}
                selected={selectedDays.has(day)}
                onPress={() => toggleDay(day)}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: buttonBackground,
              opacity: pressed ? 0.8 : 1
            }
          ]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>Save Medication</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosageInput: {
    flex: 1,
    marginRight: 8,
  },
  dosageUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  saveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    marginTop: 4,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  dropdownBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
});