import { View, Text } from "react-native";
import { Button } from "react-native";

export function DayOfWeek({ day }: { day: string }) {
    return (
        <View>
            <Button title={day}/>
            <Text>{day}</Text>
        </View>
    )
}
