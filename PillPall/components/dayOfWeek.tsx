import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

interface DayOfWeekProps {
    day: string;
    selected?: boolean;
    onPress?: () => void;
}

export function DayOfWeek({ day, selected = false, onPress }: DayOfWeekProps) {
    const backgroundColor = useThemeColor({ light: '#A1CEDC', dark: '#1D3D47' }, 'tint');
    const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
    const pressedColor = useThemeColor({ light: '#E1E1E1', dark: '#2C2C2C' }, 'background');
    
    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: selected 
                        ? backgroundColor
                        : pressed 
                            ? pressedColor 
                            : 'transparent'
                }
            ]}>
            <Text style={[
                styles.text,
                { color: selected ? '#FFFFFF' : textColor }
            ]}>
                {day.substring(0, 1)}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    }
});
