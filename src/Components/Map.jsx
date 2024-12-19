import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';


const customIcon = new L.DivIcon({
  html: `<div style="font-size: 24px; color: red;">
           <i class="fas fa-map-marker-alt"></i>
         </div>`,
  className: '',
});
const MoveZoomControl = () => {
  const map = useMap();
  useEffect(() => {
    const zoomControl = L.control.zoom({ position: 'topright' });
    map.addControl(zoomControl);
    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};
function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();
  useEffect(() => {
    if (selectPosition) {
      map.setView(L.latLng(selectPosition?.lat, selectPosition?.lon), map.getZoom(), { animate: true })
    }
  }, [selectPosition, map]);
  return null;
}
const Map = (props) => {
  const { selectPosition } = props;
  const route = props.route;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const [position, setPosition] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchIpLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location');
        }
        const data = await response.json();
        setPosition([data.latitude, data.longitude]);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch IP location');
        setLoading(false);
      }
      return
    };
    fetchIpLocation();
  }, []);
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: " 10px" }}>Loading map based on your IP address...</div>
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MapContainer center={position} zoom={5} style={{ height: "900px", width: "100%" }} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MoveZoomControl />
      {selectPosition && (
        <Marker position={locationSelection} icon={customIcon}></Marker>
      )}
      {position && (
        <Marker position={position} icon={customIcon}>
          <Popup>
            Your Current location: Latitude {position[0].toFixed(4)}, Longitude {position[1].toFixed(4)}
          </Popup>
        </Marker>
      )}
      {route && (
        <>
          <Marker position={route[0]} icon={customIcon}>
            <Popup>Source: {props.source}</Popup>
          </Marker>
          <Marker position={route[route.length - 1]} icon={customIcon}>
            <Popup>Destination: {props.destination}</Popup>
          </Marker>
          <Polyline positions={route} color="blue" />
        </>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
};

export default Map;


