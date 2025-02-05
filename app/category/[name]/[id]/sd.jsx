// "use client"

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// import NavBar from '@/components/NavBar';
// import MobileHeader from '@/components/MobileHeader';
// import MobileFooter from '@/components/MobileFooter';
// import CategorySideBar from "@/components/CategorySideBar";
// import Loading from '../app/category/[name]/[id]/loading';
// import ProductCard from './ProductCard'
// import TopHeader from './TopHeader';

// const Category = ({ id }) => {
//   const [navBarData, setNavBarData] = useState([]);
//   const [categoryData, setCategoryData] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [selectedSort, setSelectedSort] = useState('Popular');
//   const [mobileFilters, setMobileFilters] = useState({});

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [homeConfigResponse, categoryResponse] = await Promise.all([
//           axios.get('https://backend.gezeno.in/api/home/headers'),
//           axios.get(`https://backend.gezeno.in/api/productOfCategory/${id}`)
//         ]);
        
//         setNavBarData(homeConfigResponse.data);
//         setCategoryData(categoryResponse.data.category);
//         setProducts(categoryResponse.data.products);
//         setFilteredProducts(categoryResponse.data.products);
//         console.log("THESE ARE FILTERED PRODUCTS",categoryResponse.data.products)
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
   
//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     let newFilteredProducts = products.filter(product => {
//       return Object.entries(filters).every(([key, value]) => {
//         if (value.length === 0) return true;
//         if (key === 'sizes') {
//           return product.sizes.some(size => 
//             size.tags.some(tag => value.includes(tag))
//           );
//         }
//         if (key === 'brands') {
//           return value.includes(product.brand?.name);
//         }
//         if (key === 'priceRange') {
//           return product.price >= value[0] && product.price <= value[1];
//         }
//         // For other filters
//         return product.filters.some(filter => 
//           filter.filter.name === key && 
//           (value.includes(filter.filter.name) || filter.tags.some(tag => value.includes(tag)))
//         );
//       });
//     });

//     // Apply sorting
//     newFilteredProducts.sort((a, b) => {
//       switch (selectedSort) {
//         case 'Popular':
//           return b.popularity - a.popularity;
//         case 'New':
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'PriceLowToHigh':
//           return a.price - b.price;
//         case 'PriceHighToLow':
//           return b.price - a.price;
//         default:
//           return 0;
//       }
//     });

//     setFilteredProducts(newFilteredProducts);
//   }, [filters, products, selectedSort]);

//   const handleFilterChange = (filterType, selectedOptions) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [filterType]: selectedOptions
//     }));
//   };

//   const handleMobileFilterChange = (newFilters) => {
//     setMobileFilters(newFilters);
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       ...newFilters
//     }));
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 mt-8">{error}</div>;
//   }

//   const availableFilters = products.reduce((acc, product) => {
//     product.filters.forEach(filter => {
//       if (!acc[filter.filter.name]) {
//         acc[filter.filter.name] = new Set();
//       }
//       acc[filter.filter.name].add(filter.filter.name);
//       filter.tags.forEach(tag => acc[filter.filter.name].add(tag));
//     });

//     if (!acc['sizes']) {
//       acc['sizes'] = new Set();
//     }
//     product.sizes.forEach(size => {
//       size.tags.forEach(tag => acc['sizes'].add(tag));
//     });

//     if (!acc['brands']) {
//       acc['brands'] = new Set();
//     }
//     if (product.brand) {
//       acc['brands'].add(product.brand.name);
//     }

//     if (!acc['priceRange']) {
//       acc['priceRange'] = { min: Infinity, max: -Infinity };
//     }
//     acc['priceRange'].min = Math.min(acc['priceRange'].min, product.price);
//     acc['priceRange'].max = Math.max(acc['priceRange'].max, product.price);

//     return acc;
//   }, {});

//   // Convert Sets to Arrays
//   Object.keys(availableFilters).forEach(key => {
//     if (key !== 'priceRange') {
//       availableFilters[key] = Array.from(availableFilters[key]);
//     }
//   });

//   return (
//     <div className='w-full'>
//       <div className='hidden md:block'>
//         <TopHeader/>
//         <NavBar data={navBarData}/>
//       </div>
      
//       <div className='md:hidden'>
//         <MobileHeader filters={availableFilters}/>
//       </div>
      
//       <main className="container mx-auto px-4 py-8">
//         <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 mb-4">
//           <a href="/">Home</a>
//           <span>/</span>
//           <span>{categoryData?.name}</span>
//         </div>

//         <h1 className="hidden md:block text-3xl font-bold mb-6">{categoryData?.name} ({filteredProducts.length})</h1>
//         {products.length === 0 ? (
//           <div>
//             <h1>No products added</h1>
//           </div>
//         ) : (
//           <div className="flex flex-col md:flex-row flex-grow">
//             <div className="hidden md:block md:w-1/4 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
//               <CategorySideBar 
//                 availableFilters={availableFilters} 
//                 onFilterChange={handleFilterChange}
//                 products={products}
//               />
//             </div>
//             <div className="flex-1 md:ml-8">
//               {/* <div className="sticky top-0 bg-white z-10 mb-6 py-2">
//                 <div className="hidden md:flex justify-between items-center">
//                   <span>SORT BY:</span>
//                   <select className="border rounded px-2 py-1" value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
//                     <option value="Popular">Popular</option>
//                     <option value="PriceLowToHigh">Price: Low to High</option>
//                     <option value="PriceHighToLow">Price: High to Low</option>
//                     <option value="New">Newest First</option>
//                   </select>
//                 </div>
//               </div> */}

//               {categoryData?.image && (
//                 <div className="mb-8">
//                  <img src="https://images.bewakoof.com/uploads/category/desktop/INSIDE_DESKTOP_BANNER_pajamas_-1719554491.jpg" alt="category-image"/>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
//                 {filteredProducts.map((product) => (
//                   <ProductCard 
//                     key={product._id}
//                     image={product.images[0]?.url}
//                     price={product.price}
//                     product={product}
//                     onClick={() => router.push(`/products/${product._id}`)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//       <div className="container mx-auto px-4 py-8">
//         <h2 className="text-xl font-semibold mb-2">{categoryData?.name}</h2>
//         <h3 className="text-lg font-medium mb-3 text-gray-400">
//           SHOP LATEST {categoryData?.name?.toUpperCase()} ONLINE IN INDIA
//         </h3>

//         <div className="prose prose-gray max-w-none">
//           <p className="mb-3 text-gray-500 leading-relaxed">
//             Looking for versatility? Our {categoryData?.name?.toLowerCase()} are designed to complement both casual and semi-formal looks, making them a must-have in every wardrobe. Whether you&apos;re heading out for a weekend adventure or a casual day at the office, Gezeno&apos;s {categoryData?.name?.toLowerCase()} provide the perfect finishing touch. Choose from a variety of colors, patterns, and styles to find the pair that speaks to your personal taste.
//           </p>

//           <p className="mb-4 text-gray-400 leading-relaxed">
//             Crafted with high-quality materials, these {categoryData?.name?.toLowerCase()} offer durability and support, making them ideal for daily wear. Additionally, with our regular discounts and offers, upgrading your collection has never been more affordable. Don&apos;t wait—step into the world of Gezeno and redefine your fashion statement with our exceptional {categoryData?.name?.toLowerCase()}. Start shopping today and experience the difference in every step!
//           </p>

//           <h3 className="text-lg font-semibold mb-4">WHY CHOOSE Gezeno&apos;s {categoryData?.name?.toUpperCase()}:</h3>

//           <h4 className="text-lg font-semibold mb-4">STYLISH DESIGNS:</h4>
//           <p className="text-gray-400 leading-relaxed">
//             At Gezeno, we know how important it is to stay on trend. Our {categoryData?.name?.toLowerCase()} come in a variety of modern designs that easily match any outfit. Whether you&apos;re into classic looks or something more eye-catching, we&apos;ve got options that suit your style.
//           </p>
//         </div>
//       </div>
//       <div className='md:hidden'>
//         <MobileFooter 
//           selectedSort={selectedSort}
//           setSelectedSort={setSelectedSort}
//           filters={filters}
//           setFilters={setFilters}
//           availableFilters={availableFilters}
//         />
//       </div>
//     </div>
//   );
// };

// export default Category;
