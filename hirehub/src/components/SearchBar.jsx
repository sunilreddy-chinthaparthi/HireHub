import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(jobTitle, location);
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center shadow-lg  p-3 rounded-lg w-full max-w-3xl border border-black" >
        <div className="relative flex-grow">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#000]" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="pl-12 pr-4 py-3 w-full rounded-l-full border-none focus:outline-none bg-[#F4F4F4] text-sm text-[#000] placeholder-[#B3B4BD]"
          />
        </div>
        <div className="relative flex-grow">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#000]" />
          <input
            type="text"
            placeholder="City, state, zip code, or 'remote'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border-none focus:outline-none bg-[#F4F4F4] text-sm text-[#000] placeholder-[#B3B4BD]"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#000] text-white px-6 py-3 rounded-full ml-2 hover:bg-[#white] text-sm transition-all"
        >
          Find jobs
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
