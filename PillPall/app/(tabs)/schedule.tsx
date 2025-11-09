import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Pressable, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { MedicationReminder } from '@/components/medication-reminder'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, router } from 'expo-router'
import { DayOfWeek } from '@/components/dayOfWeek'; // Import DayOfWeek component

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  days: string[];
}

export default function ScheduleScreen() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      time: '8:00 AM',
      days: ['Mon', 'Wed', 'Fri']
    },
    {
      id: '2',
      name: 'Aspirin',
      dosage: '81mg',
      time: '9:00 AM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.newMedication) {
      const newMed = JSON.parse(params.newMedication as string) as Medication;
      setMedications(prev => [...prev, newMed]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [params.newMedication]);

  const loadMedications = async () => {
    try {
      const raw = await AsyncStorage.getItem('medications');
      const meds = raw ? JSON.parse(raw) : [];
      setMedications(meds);
    } catch (e) {
      console.error('Failed to load medications', e);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadMedications();
    }, [])
  );

  const handleAddMedication = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-medication');
  };

  // Remove a medication by id, persist and update state
  const removeMedication = async (id: string) => {
    try {
      const raw = await AsyncStorage.getItem('medications');
      const meds = raw ? JSON.parse(raw) as Array<any> : [];
      const filtered = meds.filter((m: any) => m.id !== id);
      await AsyncStorage.setItem('medications', JSON.stringify(filtered));
      setMedications(filtered);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to remove medication', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <View style={styles.card}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.meta}>
          {item.dosage} mg • {item.time} {/* Added "mg" after dosage */}
        </ThemedText>
        <View style={styles.daysContainer}>
          {allDays.map((day) => (
            <DayOfWeek
              key={day}
              day={day}
              selected={item.days.includes(day)} // Highlight only the selected days
              onPress={() => {}} // No action needed on press
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => removeMedication(item.id)}
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.75 : 1 }
        ]}
        accessibilityLabel={`Remove ${item.name}`}
        accessibilityRole="button"
      >
        <ThemedText style={styles.deleteText}>−</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} 
      headerImage={<Text style={styles.headerText}>Your Medications</Text>}
    >
      <ThemedView style={styles.container}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : medications.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText>No medications saved yet.</ThemedText>
            <ThemedText style={{ marginTop: 8, color: '#666' }}>Add one from the Add Medication screen.</ThemedText>
          </View>
        ) : (
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
        
        <Pressable 
          style={({ pressed }) => [
            styles.addButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleAddMedication}
        >
          <ThemedText style={styles.addButtonText}>+ Add Medication</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    padding: 16,
  },
  list: { paddingBottom: 24 },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 14, color: '#444', marginTop: 4 },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  empty: { marginTop: 48, alignItems: 'center' },
  addButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#A1CEDC',
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D3D47', // Darker blue
    alignItems: 'center',
    justifyContent: 'center', // Ensure the content is vertically centered
    display: 'flex', // Ensure proper alignment
  },
  deleteText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 22, // Adjust line height to match font size for centering
    fontWeight: '700',
    textAlign: 'center', // Ensure horizontal centering
  },
});
