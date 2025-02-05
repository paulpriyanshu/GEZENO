"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function CategorySideBar({ availableFilters, onFilterChange }) {
  const [openFilters, setOpenFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState(
    Object.keys(availableFilters).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {})
  );

  const toggleFilter = (filter) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
  };

  const handleCheckboxChange = (filterType, option) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        [filterType]: prevFilters[filterType].includes(option)
          ? prevFilters[filterType].filter(item => item !== option)
          : [...prevFilters[filterType], option]
      };
      onFilterChange(filterType, updatedFilters[filterType]);
      return updatedFilters;
    });
  };

  const handlePriceRangeChange = (min, max) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        priceRange: prevFilters.priceRange[0] === min && prevFilters.priceRange[1] === max
          ? []
          : [min, max]
      };
      onFilterChange('priceRange', updatedFilters.priceRange);
      return updatedFilters;
    });
  };

  // Generate price range options

const generatePriceRanges = () => {
      if (!availableFilters.priceRange) {
        return [];
      }
      const { min, max } = availableFilters.priceRange;
      if (min === max) {
        return [{ min, max }];
      }
    const step = (max - min) / 4; // Create 4 ranges
    return [
      { min, max: min + step },
      { min: min + step, max: min + 2 * step },
      { min: min + 2 * step, max: min + 3 * step },
      { min: min + 3 * step, max }
    ];
  };

  const priceRanges = generatePriceRanges();

  return (
    <aside className="w-64 px-4">
      <h2 className="font-bold text-gray-700 mb-4">FILTERS</h2>
      <button 
        className="text-blue-500 text-sm mb-4"
        onClick={() => {
          const resetFilters = Object.keys(selectedFilters).reduce((acc, key) => {
            acc[key] = [];
            return acc;
          }, {});
          setSelectedFilters(resetFilters);
          Object.keys(resetFilters).forEach(key => onFilterChange(key, resetFilters[key]));
        }}
      >
        Clear All
      </button>
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2"
          onClick={() => toggleFilter('priceRange')}
        >
          <span className="flex items-center">Price Range</span>
          <ChevronDown className={`transition-transform duration-300 ${
            openFilters['priceRange'] ? 'transform rotate-180' : ''
          }`} />
        </button>
        {openFilters['priceRange'] && (
          <div className="pl-4">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`price-range-${index}`}
                  className="mr-2"
                  checked={selectedFilters.priceRange.length > 0 && 
                           selectedFilters.priceRange[0] === range.min && 
                           selectedFilters.priceRange[1] === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                />
                <label htmlFor={`price-range-${index}`} className="text-sm text-gray-600">
                  ₹{range.min.toFixed(0)} - ₹{range.max.toFixed(0)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {Object.entries(availableFilters).map(([filter, options]) => (
        filter !== 'priceRange' && options.length > 0 && (
          <div key={filter} className="mb-4">
            <button
              className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2"
              onClick={() => toggleFilter(filter)}
            >
              <span className="flex items-center">
                {filter}
              </span>
              <ChevronDown className={`transition-transform duration-300 ${
                openFilters[filter] ? 'transform rotate-180' : ''
              }`} />
            </button>
            {openFilters[filter] && (
              <div className="pl-4">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`${filter}-${index}`}
                      className="mr-2"
                      checked={selectedFilters[filter].includes(option)}
                      onChange={() => handleCheckboxChange(filter, option)}
                    />
                    <label htmlFor={`${filter}-${index}`} className="text-sm text-gray-600">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </aside>
  );
}

export default CategorySideBar;

