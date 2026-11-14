import { styles } from "@/styles/styles";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ThemedText } from "./themed-text";

type Line = {
    line: string;
    destination: {
        fr: string;
        nl: string;
    } | null;
    arrival: string;
    minutes: number;
}

export default function BrusselsTransportDisplay(props: { lat: number, lon: number, distance?: number }) {
    const [stops, setStops] = useState<Record<string, Line[]>>()
    const [error, setError] = useState("")
    useEffect(() => {
        const { lat, lon, distance } = props
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/lines?lat=${lat}&lon=${lon}&distance=${distance}`).then(r => r.json())
            .then((r: { stops: { fr: string, nl: string }[], lines: Record<string, Line[]> }) => {
                console.log(r)
                if (r.stops.length && r.lines) {
                    for (const k of Object.keys(r.lines)) {
                        r.lines[k] = r.lines[k].sort((a, b) => a.minutes - b.minutes)
                    }
                    setStops(r.lines)
                }
                else
                    setError("No stops around.")
            })
            .catch(e => {
                console.error(e)
                setError(e)
            })
    }, [])
    return (
        <View style={styles.stopsContainer}>
            {error && (
                <ThemedText>{error}</ThemedText>
            )}
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                {stops && Object.keys(stops).map(stopName => (
                    <View key={stopName} style={styles.stop}>
                        <View style={styles.stopNameContainer}>
                            <ThemedText style={styles.stopName}>{stopName}</ThemedText>
                        </View>
                        {stops[stopName].map((line, i) => (
                            <View key={`${line.destination?.fr}-${i}`} style={styles.line}>
                                <View style={styles.lineName}>
                                    <ThemedText>{line.line} {line.destination?.fr}</ThemedText>
                                </View>
                                <View style={styles.lineTime}>
                                    <ThemedText>{line.minutes > 0 ? `${line.minutes} min` : "↓↓"}</ThemedText>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}