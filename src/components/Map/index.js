import React, { Component, Fragment } from 'react';
import { View, Image,  Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from "react-native-geocoding";

import Search from '../Search/';
import Directions from '../Directions';
import Details from '../Details';
import { getPixelSize } from '../../utils';
import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall, Back } from './styles';

Geocoder.init('AIzaSyBgXmgWu1RpgtGa4T_avkIigaOefOWLTJE');

export default class Map extends Component {
    state = {
        region: null,
        destination: null,
        duration: null,
        location: null,
    };

    _getCurrentLocation() {
        Geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                const response = await Geocoder.from({ latitude, longitude });
                const address = response.results[0].formatted_address;
                const location = address.substring(0, address.indexOf(','))

                this.setState({
                    location: location,
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

    handleLocationSelected = (data, { geometry }) => {
        const { location: { lat: latitude, lng: longitude }} = geometry;
        this.setState({
            destination: {
                latitude, 
                longitude,
                title: data.structured_formatting.main_text,
            }
        })
    }

    handleBack = () => {
        this.setState({ destination: null });
    }

    render() {
        const { region, destination, duration, location } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={ region }
                    showsUserLocation
                    loadingEnabled
                    ref={ el => this.mapView = el}
                >
                    { destination && (
                        <Fragment>
                            <Directions 
                                origin={region}
                                destination={destination}
                                onReady={result => {
                                    this.setState({ duration: Math.floor(result.duration), },
                                    () => {
                                        this.mapView.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: getPixelSize(100),
                                                left: getPixelSize(20),
                                                top: getPixelSize(50),
                                                bottom: getPixelSize(350),
                                            }
                                        });
                                    });
                                }}
                            />

                            <Marker 
                                coordinate={destination} 
                                anchor={{ x: 0, y: 0 }}
                                image={markerImage}
                            >
                                <LocationBox>
                                    <LocationText>{destination.title}</LocationText>
                                </LocationBox>
                            </Marker>

                            <Marker 
                                coordinate={region} 
                                anchor={{ x: 0, y: 0 }}
                            >
                                <LocationBox>
                                    <LocationTimeBox>
                                        <LocationTimeText>{duration}</LocationTimeText>
                                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                    </LocationTimeBox>
                                    <LocationText>{location}</LocationText>
                                </LocationBox>
                            </Marker>
                        </Fragment>
                    )}
                </MapView>

                { destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack}>
                            <Image source={backImage} />
                        </Back>
                        <Details />
                    </Fragment>
                ) : (
                    <Search onLocationSelected={this.handleLocationSelected}/>
                )}
            </View>
        );
    }
}