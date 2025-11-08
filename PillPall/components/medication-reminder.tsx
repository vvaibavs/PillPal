import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { DayOfWeek } from './dayOfWeek';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';

interface MedicationReminderProps {
    name: string;
    dosage: string;
    time: string;
    days: string[];
}

export function MedicationReminder({ name, dosage, time, days }: MedicationReminderProps) {
    const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(days));

    const toggleDay = (day: string) => {
        const newSelected = new Set(selectedDays);
        if (selectedDays.has(day)) {
            newSelected.delete(day);
        } else {
            newSelected.add(day);
        }
        setSelectedDays(newSelected);
    };

    const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <ThemedText style={styles.name}>{name}</ThemedText>
                    <ThemedText style={styles.dosage}>{dosage}</ThemedText>
                </View>
                <ThemedText style={styles.time}>{time}</ThemedText>
            </View>
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    dosage: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 4,
    },
    time: {
        fontSize: 16,
        fontWeight: '500',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
});