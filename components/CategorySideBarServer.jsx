import { ChevronDown } from "lucide-react"

function generatePriceRanges(availableFilters) {
  if (!availableFilters.priceRange) {
    return []
  }
  const { min, max } = availableFilters.priceRange
  if (min === max) {
    return [{ min, max }]
  }
  const step = (max - min) / 4 // Create 4 ranges
  return [
    { min, max: min + step },
    { min: min + step, max: min + 2 * step },
    { min: min + 2 * step, max: min + 3 * step },
    { min: min + 3 * step, max },
  ]
}

export default function CategorySideBarServer({ availableFilters }) {
  const priceRanges = generatePriceRanges(availableFilters)

  return (
    <aside className="w-64 px-4">
      <h2 className="font-bold text-gray-700 mb-4">FILTERS</h2>
      <button className="text-blue-500 text-sm mb-4">Clear All</button>
      <div className="mb-4">
        <button className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2">
          <span className="flex items-center">Price Range</span>
          <ChevronDown className="transition-transform duration-300" />
        </button>
        <div className="pl-4">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center mb-2">
              <input type="checkbox" id={`price-range-${index}`} className="mr-2" />
              <label htmlFor={`price-range-${index}`} className="text-sm text-gray-600">
                ₹{range.min.toFixed(0)} - ₹{range.max.toFixed(0)}
              </label>
            </div>
          ))}
        </div>
      </div>
      {Object.entries(availableFilters).map(
        ([filter, options]) =>
          filter !== "priceRange" &&
          options.length > 0 && (
            <div key={filter} className="mb-4">
              <button className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2">
                <span className="flex items-center">{filter}</span>
                <ChevronDown className="transition-transform duration-300" />
              </button>
              <div className="pl-4">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input type="checkbox" id={`${filter}-${index}`} className="mr-2" />
                    <label htmlFor={`${filter}-${index}`} className="text-sm text-gray-600">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </aside>
  )
}

