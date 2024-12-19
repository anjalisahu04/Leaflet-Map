import React, { useState } from 'react';
import './SearchBox.css';


const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const SearchBox = (props) => {
  const setSelectPosition = props.setSelectPosition;
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const params = {
      q: searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
           setSelectPosition( result[0]); // Automatically select the first result
        }
      })
      .catch((err) => console.log("err: ", err));
  };

  return (
    <div className="main-container">
      <div>
        <input placeholder="Search location..." value={searchText} onChange={(event) => {
          setSearchText(event.target.value);
        }} className="search-input" />
      </div>
      <div>
        <button className="searchBtn" onClick={handleSearch}>Search</button>
      </div>
      <div>
        <button className="direction" onClick={props.toggle}>
          <i className="fa-solid fa-diamond-turn-right" />
        </button>
      </div>
    </div>
  )
}
export default SearchBox;