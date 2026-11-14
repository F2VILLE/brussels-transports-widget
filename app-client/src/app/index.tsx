import Slider from '@expo/ui/community/slider';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';

import BrusselsTransportDisplay from '@/components/BrusselsTransportDisplay';
import { ThemedText } from '@/components/themed-text';
import * as Location from 'expo-location';
import { useState } from 'react';
import { styles } from '../styles/styles';



export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distance, setDistance] = useState(100)
  function getWaitingTime() {
    setLocation(null);

    async function getCurrentLocation() {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Brussels Transports Widget
          </ThemedText>
        </ThemedView> */}

        <ThemedView style={styles.container}>
          {location && (<BrusselsTransportDisplay lat={location.coords.latitude} lon={location.coords.longitude} distance={distance} />)}
        </ThemedView>
        <View>
          <View>
            <Slider minimumValue={20} maximumValue={1000} value={distance} onValueChange={v => setDistance(v)} />
            <ThemedText>
              Distance: {distance.toFixed(0)}m
            </ThemedText>
          </View>
          <View style={styles.button}>
            <Button
              onPress={getWaitingTime}
              title="Get Waiting Time"
              color="#c9c5ff"
            ></Button>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

