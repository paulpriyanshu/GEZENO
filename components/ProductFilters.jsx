import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProductFilters({ filters }) {
  const [selectedFilters, setSelectedFilters] = useState({})

  const handleFilterChange = (filterName, tag) => {
    setSelectedFilters(prev => {
      const updatedFilters = { ...prev }
      if (!updatedFilters[filterName]) {
        updatedFilters[filterName] = []
      }
      const index = updatedFilters[filterName].indexOf(tag)
      if (index > -1) {
        updatedFilters[filterName].splice(index, 1)
      } else {
        updatedFilters[filterName].push(tag)
      }
      return updatedFilters
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Filters</h2>
      {filters.map((filterGroup) => (
        <div key={filterGroup.filter._id} className="space-y-2">
          <h3 className="font-medium">{filterGroup.filter.name}</h3>
          {filterGroup.tags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`${filterGroup.filter._id}-${tag}`}
                checked={selectedFilters[filterGroup.filter.name]?.includes(tag)}
                onCheckedChange={() => handleFilterChange(filterGroup.filter.name, tag)}
              />
              <label
                htmlFor={`${filterGroup.filter._id}-${tag}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag}
              </label>
            </div>
          ))}
        </div>
      ))}
      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}

    