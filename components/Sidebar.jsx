import React, { useState } from 'react'


function SideBar() {
  const [openFilters, setOpenFilters] = useState({});

  const toggleFilter = (filter) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
  };

  // Define options for each filter
  const filterOptions = {
    Category: ['Toys', 'Games', 'Fashion', 'Electronics'],
    Sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    Brand: ['Brand A', 'Brand B', 'Brand C'],
    Colors: ['Red', 'Blue', 'Green', 'Black'],
    Ratings: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    Design: ['Solid', 'Printed', 'Graphic', 'Striped'],
    Fit: ['Regular', 'Slim', 'Loose'],
    Sleeve: ['Short', 'Long', 'Sleeveless'],
    Neck: ['Round', 'V-Neck', 'Collared'],
    Type: ['Casual', 'Formal', 'Sports'],
    Offers: ['Buy 1 Get 1', '20% Off', '50% Off'],
    Discount: ['10%', '20%', '30%', '50%'],
    'Sort By': ['Popular', 'Price: Low to High', 'Price: High to Low'],
  };

  return (
    <aside className="w-64 px-4">
      <h2 className="font-bold text-gray-700 mb-4">FILTERS</h2>
      <button className="text-blue-500 text-sm mb-4">Clear All</button>
      {Object.keys(filterOptions).map((filter) => (
        <div key={filter} className="mb-4">
          <button
            className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2"
            onClick={() => toggleFilter(filter)}
          >
            <span className="flex items-center">
              {filter}
            </span>
            <span
              className={`transition-transform duration-300 ${
                openFilters[filter] ? 'transform rotate-180' : ''
              }`}
            >
              <img src="dropdown.png" width={20} height={20} />
            </span>
          </button>
          {openFilters[filter] && (
            <div className="pl-4">
              {/* Dynamically render options based on the selected filter */}
              {filterOptions[filter].map((option, index) => (
                <p key={index} className="text-sm text-gray-600 mb-2">
                  {option}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}

export default SideBar