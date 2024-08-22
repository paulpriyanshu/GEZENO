// import React, { useState } from 'react';
// import './SearchOverlay.css'; // Create this file for your CSS

// const SearchOverlay = () => {
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearchClick = () => {
//     setIsSearchActive(true);
//   };

//   const handleSearchClose = () => {
//     setIsSearchActive(false);
//     setSearchTerm('');
//   };

//   return (
//     <div className="search-container">
//       {!isSearchActive ? (
//         <div className="search-bar">
//           <i className="icon-back" onClick={() => window.history.back()}></i>
//           <input
//             type="text"
//             placeholder="Type here to search"
//             onClick={handleSearchClick}
//           />
//           <i className="icon-close" onClick={handleSearchClose}></i>
//         </div>
//       ) : (
//         <div className="search-overlay">
//           <div className="search-bar active">
//             <i className="icon-back" onClick={() => window.history.back()}></i>
//             <input
//               type="text"
//               placeholder="Type here to search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <i className="icon-close" onClick={handleSearchClose}></i>
//           </div>
//           <div className="search-results">
//             <div className="suggestions">
//               <div className="suggestion-item">
//                 <a href="/summer-vests-men">Vests Men <span>2</span></a>
//               </div>
//               <div className="suggestion-item">
//                 <a href="/vests-under-rs-299">Vests Under Rs 299 <span>2</span></a>
//               </div>
//               <div className="suggestion-item">
//                 <a href="/solid-vests-and-tees">Solid Vests and Tees <span>25</span></a>
//               </div>
//               <div className="suggestion-item">
//                 <a href="/men-vests">Men&apos;s Vests <span>113</span></a>
//               </div>
//               <div className="suggestion-item">
//                 <a href="/printed-vests-men">Printed Vests Men <span>12</span></a>
//               </div>
//               <div className="view-all-results">
//                 <a href="/search-results">View All Results</a>
//               </div>
//             </div>
//             <div className="recent-searches">
//               <h4>Recent Searches</h4>
//               <div className="recent-items">
//                 <div className="recent-item">
//                   <img src="/images/recent-1.jpg" alt="recent search" />
//                   <p>Men</p>
//                 </div>
//                 <div className="recent-item">
//                   <img src="/images/recent-2.jpg" alt="recent search" />
//                   <p>Pajama for Men</p>
//                 </div>
//                 <div className="recent-item">
//                   <img src="/images/recent-3.jpg" alt="recent search" />
//                   <p>Men Clothing</p>
//                 </div>
//               </div>
//             </div>
//             <div className="popular-searches">
//               <h4>Popular Searches</h4>
//               <div className="popular-items">
//                 <button>T-Shirts</button>
//                 <button>Vests</button>
//                 <button>Printed T-shirts</button>
//                 <button>Oversized T-shirts</button>
//                 <button>Joggers</button>
//                 <button>Anime</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchOverlay;
