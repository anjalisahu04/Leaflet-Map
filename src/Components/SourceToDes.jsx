import React, { useState } from 'react';
import './SourceToDes.css';

async function getCoordinates(location, setSelectPosition) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  try {
    const response = await fetch(nominatimUrl);
    if (!response.ok) {
      throw new Error(`Error fetching coordinates for location: ${location}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      setSelectPosition(data[0]);
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      throw new Error(`No coordinates found for location: ${location}`);
    }
  } catch (error) {
    throw error;
  }
}

function SourceToDes(props) {
  const setSelectPosition = props.setSelectPosition;
  const source = props.source;
  const setSource = props.setSource;
  const destination = props.destination;
  const setDestination = props.setDestination;
  const setRoute = props.setRoute;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function getRoute(startCoordinates, endCoordinates) {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoordinates[1]},${startCoordinates[0]};${endCoordinates[1]},${endCoordinates[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(osrmUrl);
      if (!response.ok) {
        throw new Error(`Error fetching route: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lon]
        setRoute(routeCoordinates);
      } else {
        setError('No route found');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  }
  const handleGo = async () => {
    setLoading(true);
    setError(null);
    setRoute(null);
    try {
      const startCoordinates = await getCoordinates(source, setSelectPosition);
      const endCoordinates = await getCoordinates(destination, setSelectPosition);
      if (startCoordinates && endCoordinates) {
        await getRoute(startCoordinates, endCoordinates);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <button className="backward" onClick={props.toggle}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <div className="travel-mode" >
        <button className="by-car">
          <i className="fa-solid fa-car"></i>
        </button>
        <button className="by-bike">
          <i className="fa-solid fa-motorcycle"></i>
        </button>
        <button className="by-walk">
          <i className="fa-solid fa-person-walking"></i>
        </button>
      </div>
      <div className='sourceBox'>
        <i className="fa-solid fa-location-dot source-location"></i>
        <input type="text" placeholder='Source...' value={source} className="source-input" onChange={(e) => setSource(e.target.value)} />
      </div>
      <div className='destinationBox'>
        <i className="fa-solid fa-location-dot destination-location"></i>
        <input type="text" placeholder='Destination...' value={destination} className="destination-input" onChange={(e) => setDestination(e.target.value)} />
      </div>
      <button className='go' onClick={handleGo}>{loading ? 'Loading...' : 'Go..'}</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
export default SourceToDes;
