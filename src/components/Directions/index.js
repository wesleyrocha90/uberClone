import React from 'react';
import MapViewDirections from 'react-native-maps-directions'

const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections 
        destination={ destination }
        origin={ origin }
        onReady={ onReady }
        apikey="AIzaSyBgXmgWu1RpgtGa4T_avkIigaOefOWLTJE"
        strokeWidth={3}
        strokeColor="#222"
    />
);

export default Directions;