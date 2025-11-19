import { StyleSheet } from 'react-native';

import { DayOfWeek } from '@/components/dayOfWeek';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Text } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={

            <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop:75 }}>PillPal</Text>
      }>

      <ThemedView style={styles.stepContainer}>
        {/* <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link> */}


        <ThemedText style={{ fontSize: 32, color: 'white', textAlign: 'center', marginTop: 20 }}>Set your Schedule</ThemedText>
        <DayOfWeek day="Monday" />
        <DayOfWeek day="Tuesday" />
        <DayOfWeek day="Wednesday" />
        <DayOfWeek day="Thursday" />
        <DayOfWeek day="Friday" />
        <DayOfWeek day="Saturday" />
        <DayOfWeek day="Sunday" />

      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
