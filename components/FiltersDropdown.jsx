import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from 'lucide-react'

export function FilterDropdowns({ filters, selectedFilters, onFilterChange }) {
  const [openPopover, setOpenPopover] = useState(null)

  const handleFilterChange = (filterName, tagName, isChecked) => {
    onFilterChange(filterName, tagName, isChecked)
    setOpenPopover(null)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters?.map((filter) => (
        <Popover key={filter.name} open={openPopover === filter.name} onOpenChange={(open) => setOpenPopover(open ? filter.name : null)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {filter.name} <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-2">
              {filter.tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.name}-${tag}`}
                    checked={selectedFilters[filter.name]?.includes(tag)}
                    onCheckedChange={(checked) => handleFilterChange(filter.name, tag, checked)}
                  />
                  <Label htmlFor={`${filter.name}-${tag}`}>{tag}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
