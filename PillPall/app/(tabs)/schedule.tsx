import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Text, View, Pressable } from 'react-native'
import { StyleSheet } from 'react-native'
import { MedicationReminder } from '@/components/medication-reminder'
import { useState, useEffect } from 'react'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, router } from 'expo-router'

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

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.newMedication) {
      const newMed = JSON.parse(params.newMedication as string) as Medication;
      setMedications(prev => [...prev, newMed]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [params.newMedication]);

  const handleAddMedication = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-medication');
  };

  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} 
      headerImage={<Text style={styles.headerText}>Your Medications</Text>}
    >
      <ThemedView style={styles.container}>
        <View style={styles.medicationList}>
          {medications.map((medication) => (
            <MedicationReminder
              key={medication.id}
              name={medication.name}
              dosage={medication.dosage}
              time={medication.time}
              days={medication.days}
            />
          ))}
        </View>
        
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
  medicationList: {
    paddingBottom: 16,
  },
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
});
