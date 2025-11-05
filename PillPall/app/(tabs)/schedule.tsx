import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native'

export default function ScheduleScreen() {
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} headerImage={<Text>Schedule</Text>}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Schedule</ThemedText>
      </ThemedView>
      <ThemedText>This is the schedule screen</ThemedText>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 32,
  },
});
