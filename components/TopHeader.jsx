import Link from 'next/link'

export default function TopHeader() {
  return (
    <header className="bg-gray-100 text-gray-600 text-sm py-1 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <nav className="flex space-x-4">
          <Link href="/offers" className="hover:text-gray-900 transition-colors">
            Offers
          </Link>
          <Link href="/fanbook" className="hover:text-gray-900 transition-colors">
            Fanbook
          </Link>
          <Link href="/download-app" className="hover:text-gray-900 transition-colors">
            Download App
          </Link>
          <Link href="/tribe-membership" className="hover:text-gray-900 transition-colors">
            Tribe Membership
          </Link>
        </nav>
        <nav className="flex space-x-4">
          <Link href="/contact-us" className="hover:text-gray-900 transition-colors">
            Contact Us
          </Link>
          <Link href="/track-order" className="hover:text-gray-900 transition-colors">
            Track Order
          </Link>
        </nav>
      </div>
    </header>
  )
}