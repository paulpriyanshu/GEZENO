"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "./ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);

  const router = useRouter();

  // Fetch recent searches from localStorage
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(savedSearches);
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = (newSearch) => {
    const isExisting = recentSearches.some(item => item.text === newSearch.text);
  
    if (!isExisting) {
      const updatedSearches = [newSearch, ...recentSearches];
      if (updatedSearches.length > 5) updatedSearches.pop(); // Limit to 5 searches
  
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    }
  };

  // Fetch search results based on query
  const handleSearchChange = async (value) => {
    setSearchQuery(value);

    if (value.length > 1) {
      setLoading(true);
      try {
        const response = await axios.post(`https://backend.gezeno.in/api/search/${value}`);
        const data = response.data.data;

        if (data) {
          const categories = data.parentCategories.map((category) => ({
            _id: category._id,
            name: category.name,
            image: category.image || "/placeholder.svg?height=60&width=60",
            type: 'category'
          }));
          const subCategories = data.parentCategories.map((subCategory) => ({
            _id: subCategory._id,
            name: subCategory.name,
            image: subCategory.image || "/placeholder.svg?height=60&width=60",
            type: 'category'
          }));
          const products = data.products.map((product) => ({
            _id: product._id,
            name: product.name,
            image: product?.images[0] || "/placeholder.svg?height=60&width=60",
            type: 'product'
          }));
          setSearchResults([...products, ...subCategories, ...categories]);

          // Save the query as a recent search
          const newSearch = { text: value, image: "/placeholder.svg?height=60&width=60" };
          saveRecentSearches(newSearch);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleClick = (result) => {
    const route = result.type === "product"
      ? `/products/${result._id}`
      : `/category/${result._id}`;
    router.push(route);
  };

  const handleRecentSearchClick = (searchText) => {
    setSearchQuery(searchText);
    handleSearchChange(searchText);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden p-0 hover:bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <img src="/search.png" alt="Search" className="w-5 h-5" />
      </Button>

      <SheetContent
        side="top"
        className="w-full h-[100dvh] p-0 border-none bg-white"
      >
        <div className="flex items-center gap-2 p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-5/6 pl-4 pr-8 h-10 bg-gray-50 border-none focus-visible:ring-0"
              placeholder="Type here to search"
            />
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
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-73px)]">
          {searchQuery ? (
            <div className="divide-y">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full p-4 text-sm hover:bg-gray-50"
                    onClick={() => handleClick(result)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-[60px] h-[60px] rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={result.type === 'product' ? result.image.url : result.image}
                          alt={result.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-900">{result.name}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-gray-500">No results found</div>
              )}
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Recent Searches</h3>
                    <button
                      className="text-sm text-[#00A5EC]"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("recentSearches");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {recentSearches.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                        onClick={() => handleRecentSearchClick(item.text)}
                      >
                        <div className="w-[60px] h-[60px] rounded-md overflow-hidden bg-gray-100">
                          {/* You can add an image here if needed */}
                        </div>
                        <span className="text-xs text-center whitespace-nowrap">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-sm font-medium mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches?.map((text, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                      onClick={() => handleRecentSearchClick(text)}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

