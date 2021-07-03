/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps';
import Geolocation, {
  AuthorizationLevel,
} from 'react-native-geolocation-service';

const App: () => Node = () => {
  const [location, setLocation] = useState(null);
  const _map = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const hasLocationPermission =
        Platform.OS === 'ios'
          ? await Geolocation.requestAuthorization('whenInUse')
          : await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

      if (hasLocationPermission === 'granted') {
        await Geolocation.getCurrentPosition(
          position => {
            const {
              coords: {latitude, longitude},
            } = position;

            setLocation({
              latitude,
              longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (location && _map.current) {
      _map.current.animateCamera(
        {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          zoom: 15,
        },
        {duration: 5000},
      );
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} ref={_map}>
        {location && <Marker coordinate={location} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default React.memo(App);
