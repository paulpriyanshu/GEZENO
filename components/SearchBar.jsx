import axios from 'axios'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle search query change
  const handleChange = async (event) => {
    const value = event.target.value
    setQuery(value)

    if (value.length > 1) {
      setLoading(true)
      try {
        // Fetch suggestions from the API
        const response = await axios.post(`https://backend.gezeno.in/api/search/${value}`)
        const data = response.data.data
        console.log("searched items", data)

        // Check if the request is successful
        if (data) {
          const products = data.products.map((product) => ({_id:product._id,name:product.name , image:product?.images[0]}))
          const categories = data.parentCategories.map((category) => ({
            _id:category._id,
            name: category.name,
            image: category.image,
          }))
          const subCategories = data.parentCategories.flatMap((category) =>
            category.subCategories.map((subCategory) => ({ _id:subCategory._id,name:subCategory.name, image:subCategory.image}))
          )

          // Combine categories and subcategories for suggestions
          setSuggestions([
            { type: 'products', items: products },
            { type: 'categories', items: categories },
            { type: 'subcategories', items: subCategories },
          ])
        } else {
          setSuggestions([])
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
        console.log("suggestions", suggestions)
      }
    } else {
      setSuggestions([])
    }
  }
  const router=useRouter()
  useEffect(()=>{
    console.log("all suggestions",suggestions)
  },[handleChange])
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setSuggestions([]) // Hide suggestions after selecting one
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="h-10 w-full rounded-md bg-[#F2F2F2] px-9 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search by product, category or collection"
          type="search"
          value={query}
          onChange={handleChange}
        />
        {/* Loader Spinner */}
        {loading && (
          <div className="absolute right-3 top-3 animate-spin">
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="4" strokeLinecap="round" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12a8 8 0 018-8V4a12 12 0 00-12 12h4z"
              />
            </svg>
          </div>
        )}
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            {/* Products */}
            {suggestions.find((suggestion) => suggestion.type === 'products')?.items.map((product, index) => (
              <li
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(product)}
              >
                 <div className="flex items-center space-x-2">
                 <img src={product?.image?.url} alt={product} className="w-9 h-9 rounded-full" />
                 <span className='text-sm' onClick={()=>router.push(`/products/${product._id}`)}>{product.name.slice(0,50)}. . . . </span>
                 </div>
              </li>
            ))}
            {/* Categories */}
            {suggestions.find((suggestion) => suggestion.type === 'categories')?.items.map((category, index) => (
              <li
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(category.name)}
              >
                <div className="flex items-center space-x-2">
                  <img src={category.image} alt={category.name} className="w-6 h-6 rounded-full" />
                  <span className='text-sm' onClick={()=>router.push(`/category/${category._id}`)}>{category.name}</span>
                </div>
              </li>
            ))}
            {/* Subcategories */}
            {suggestions.find((suggestion) => suggestion.type === 'subcategories')?.items.map((subCategory, index) => (
              <li
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSuggestionClick(subCategory)}
              >
               <div className="flex items-center space-x-2">
                  <img src={subCategory.image} alt={subCategory.name} className="w-6 h-6 rounded-full" />
                  <span className='text-sm' onClick={()=>router.push(`/category/${subCategory._id}`)}>{subCategory.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}