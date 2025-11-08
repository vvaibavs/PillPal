import { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DayOfWeek } from '@/components/dayOfWeek';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  
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

  const handleSave = () => {
    if (!name || !dosage || !time || selectedDays.size === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Add the new medication to the global state
    const medication = {
      id: Date.now().toString(),
      name,
      dosage,
      time,
      days: Array.from(selectedDays)
    };

    // Pass the medication back to the schedule screen
    router.push({
      pathname: '/(tabs)',
      params: { newMedication: JSON.stringify(medication) }
    });
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
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Enter dosage (e.g., 50mg)"
            placeholderTextColor={placeholderColor}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Time</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            value={time}
            onChangeText={setTime}
            placeholder="Enter time (e.g., 9:00 AM)"
            placeholderTextColor={placeholderColor}
          />
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
});