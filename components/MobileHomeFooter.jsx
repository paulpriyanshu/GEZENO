import Link from 'next/link'

export default function MobileHomeFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <nav className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-cyan-500">
          <img src='/home.svg' className="w-6 h-6" alt="Home"/>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/categoryM" className="flex flex-col items-center text-gray-500">
          <img src='/category-selected-v2.svg' className="w-6 h-6" alt="Categories"/>
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center text-gray-500">
          <img src='/explore.svg' className="w-6 h-6" alt="Cart"/>
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="/myaccount" className="flex flex-col items-center text-gray-500">
          <img src='/profile.svg' className="w-6 h-6" alt="Account"/>
          <span className="text-xs mt-1">Account</span>
        </Link>
      </nav>
    </footer>
  )
}