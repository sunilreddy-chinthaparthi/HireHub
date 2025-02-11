import React, { useState } from "react";

const CandidateSearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
  
    const handleSearch = () => {
      onSearch(query, location);
    };
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex bg-white shadow-md rounded-full border border-gray-200 w-2/3 p-2">
        <div className="flex items-center px-4 flex-grow">
          <span className="text-gray-400">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Job title, skills, or candidate name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow ml-2 bg-transparent focus:outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center px-4 flex-grow">
          <span className="text-gray-400">
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <input
            type="text"
            placeholder="City, state, zip code, or 'remote'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-grow ml-2 bg-transparent focus:outline-none text-gray-700"
          />
        </div>

        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800" onClick={handleSearch}>
          Find Candidates
        </button>
      </div>
    </div>
  );
};

export default CandidateSearchBar;
