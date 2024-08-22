import { useRouter } from 'next/router';
import useWindowSize from './UseWindowSize';

export const SearchComponent = () => {
  const router = useRouter();
  const size = useWindowSize();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    if (size.width <= 1024) {
      // Mobile behavior: Redirect to search page
      router.push(`/search?query=${searchTerm}`);
    } else {
      // Desktop behavior: Show search suggestions in current page
      // You can implement search suggestions dropdown here
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by product, category or collection"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={handleSearchClick}
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {size.width > 1024 && searchTerm && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-md">
          {/* Render search suggestions here */}
          <p>Search suggestions for &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
};
