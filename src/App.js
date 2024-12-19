import React, { useState } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import Map from './Components/Map'
import SearchBox from './Components/SearchBox';
import SourceToDes from './Components/SourceToDes';


function App() {
  const [selectPosition, setSelectPosition] = useState(null);
  const [currentComponent, setCurrentComponent] = useState('searchBox');
  const [route, setRoute] = useState(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const toggleComponent = () => {
    setCurrentComponent(currentComponent === 'searchBox' ? 'sourceToDes' : 'searchBox');
  };
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <Map selectPosition={selectPosition} route={route} source={source} destination={destination} />
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1000, backgroundColor: "white", padding: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        {currentComponent === 'searchBox' ? (
          <SearchBox toggle={toggleComponent} selectPosition={selectPosition} setSelectPosition={setSelectPosition} />
        ) : (
          <SourceToDes toggle={toggleComponent} setRoute={setRoute} source={source} destination={destination} setSource={setSource} setDestination={setDestination} setSelectPosition={setSelectPosition} />
        )}
      </div>
    </div>
  );
}

export default App;
