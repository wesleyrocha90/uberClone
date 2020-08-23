import React, { Component } from 'react';
import MapView from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';

import Search from "../Search/";
import { View, Platform, PermissionsAndroid } from 'react-native';

export default class Map extends Component {
    state = {
        region: null
    };

    _getCurrentLocation() {
        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                this.setState({
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134,
                    }
                });
            },
            error => console.log(error),
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        );
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ).then(granted => {
                if (granted) this._getCurrentLocation();
            })
        } else {
            this._getCurrentLocation();
        }
    }

    render() {
        const { region } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={ region }
                    showsUserLocation
                    loadingEnabled
                />

                <Search />
            </View>
        );
    }
}