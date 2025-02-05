import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-8 mt-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 mb-6 ">
            <img src="/logo.webp" alt="Gezeno Logo" className="h-12 bg-white rounded-lg" />
          </div>
          <div>
  <h3 className="text-teal-300 font-semibold mb-4">CUSTOMER SERVICE</h3>
  <ul className="space-y-2">
    {[
      { name: 'Contact Us', href: '/contact-us' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Returns Order', href: '/returns' },
      { name: 'Cancel Order', href: '/cancellations' },
    ].map((item) => (
      <li key={item.name}>
        <a href={item.href} className="hover:text-teal-300">{item.name}</a>
      </li>
    ))}
  </ul>
  <div className="mt-4 text-sm text-gray-400">
    <p>15 Days return policy*</p>
    <p>Cash on delivery*</p>
  </div>
</div>

{/* Company */}
<div>
  <h3 className="text-teal-300 font-semibold mb-4">COMPANY</h3>
  <ul className="space-y-2">
    {[
      { name: 'About Us', href: '/about-us' },
      { name: "We're Hiring", href: '/we-re-hiring' },
      { name: 'Terms & Conditions', href: '/terms&conditions' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Blog', href: '/blog' },
    ].map((item) => (
      <li key={item.name}>
        <a href={item.href} className="hover:text-teal-300">{item.name}</a>
      </li>
    ))}
  </ul>
</div>
          
          {/* Connect with Us */}
          <div>
            <h3 className="text-teal-300 font-semibold mb-4">CONNECT WITH US</h3>
            <p className="mb-2">4.7M People Like this</p>
            <p className="mb-4">1M Followers</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
          
          {/* Keep Up to Date */}
          <div>
            <h3 className="text-teal-300 font-semibold mb-4">KEEP UP TO DATE</h3>
            <form className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Enter Email Id" className="bg-transparent flex-grow p-2 px-4 select-none border-b border-teal-300" />
              <button type="submit" className="bg-teal-300 text-black hover:bg-teal-400 px-4 py-2">SUBSCRIBE</button>
            </form>
          </div>
        </div>
        
        {/* Download App */}
        <div className="mb-8">
          <h3 className="text-teal-300 font-semibold mb-4">DOWNLOAD THE APP</h3>
          <a href="#" aria-label="Get it on Google Play">
            <img src="https://gezeno.in/img/google-play-badge.png" alt="Get it on Google Play" className="h-12" />
          </a>
        </div>
        
        {/* 100% Secure Payment */}
        <div className="mb-8">
          <h3 className="text-teal-300 font-semibold mb-4">100% SECURE PAYMENT</h3>
          <div className="flex flex-wrap gap-4">
            <img src="https://images.bewakoof.com/web/secure-payments-image.png" alt="payments" />
          </div>
        </div>
        
        <hr className="border-gray-700 mb-8" />
        
        {/* Product Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">MEN&apos;S CLOTHING</h3>
            <ul className="space-y-2 text-sm">
              {["Top Wear", "Men's New Arrivals", "Men's T-Shirts", "Men's Hoodies & Sweatshirts", "Oversized T-Shirts for Men", "Men's Long Sleeve T-shirts"].map((item) => (
                <li key={item}><a href="#" className="hover:text-teal-300">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">WOMEN&apos;S CLOTHING</h3>
            <ul className="space-y-2 text-sm">
              {["Women's Top Wear", "Women's New Arrivals", "Women's T-Shirts", "Women's Hoodies & Sweatshirts"].map((item) => (
                <li key={item}><a href="#" className="hover:text-teal-300">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">MOBILE COVERS</h3>
            <ul className="space-y-2 text-sm">
              {["Apple", "Realme", "Samsung", "Xiaomi", "Oneplus", "Vivo", "Oppo"].map((item) => (
                <li key={item}><a href="#" className="hover:text-teal-300">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">FANBOOK</h3>
              <a href="#" className="text-sm hover:text-teal-300">OFFERS</a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SITEMAP</h3>
            </div>
          </div>
        </div>
        
        {/* Company Description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">GEZENO THE NEW AGE ONLINE SHOPPING EXPERIENCE.</h3>
          <p className="text-sm text-gray-400 mb-4">
            Welcome to Gezeno, the ultimate online destination for every toy enthusiast out there! Founded in 2023 by a group of passionate toy collectors and childhood friends, our mission is to reignite the joy and excitement of childhood through an incredible selection of toys. From classic favorites to the latest innovations in toy technology, we aim to bring happiness and create lasting memories for kids and adults alike.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Our Story</h3>
          <div className="text-sm text-gray-400 space-y-4">
            <p>
              It all started with a shared nostalgia for the toys we grew up with and a dream to create a place where those memories could be passed on to new generations. What began as a small online store has now blossomed into Gezeno, a beloved marketplace for high-quality, fun, and educational toys. Our journey has been fueled by a love for play, imagination, and the belief that toys are a gateway to endless possibilities.
            </p>
            <h4 className="text-lg font-semibold text-white">What We Offer</h4>
            <p>
              At Gezeno, we specialize in a wide range of toys that cater to all ages and interests. From action figures and dolls to puzzles and STEM kits, our selection is curated to spark creativity, foster learning, and encourage play. We partner with trusted brands and innovative toy makers to ensure that every item in our store meets our high standards for safety, quality, and fun.
            </p>
            <h4 className="text-lg font-semibold text-white">Our Values</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Joyful Play:</span> We believe in the power of play to bring joy, inspire creativity, and foster development. Every product we offer is chosen to enhance the play experience.</li>
              <li><span className="font-semibold">Quality and Safety:</span> Your child&apos;s safety is our top priority. We carefully select toys that are not only fun but also safe and made to last.</li>
              <li><span className="font-semibold">Education Through Play:</span> We champion toys that not only entertain but also educate. Our range includes many options that promote STEM skills, problem-solving, and cognitive development.</li>
              <li><span className="font-semibold">Community and Connection:</span> Gezeno is more than just a store; it&apos;s a community of toy lovers, parents, and educators. We love to connect, share stories, and offer support.</li>
            </ul>
            <h4 className="text-lg font-semibold text-white">Our Team</h4>
            <p>
              Behind Gezeno is a dedicated team of toy enthusiasts, parents, and educators. We&apos;re united by our passion for play and our commitment to bringing you the best toys and service. We&apos;re always on the lookout for the next great toy that will capture your imagination and bring smiles to faces.
            </p>
            <h4 className="text-lg font-semibold text-white">Join Our Gezeno</h4>
            <p>
              Follow us on our journey through social media and our blog, where we share toy news, play ideas, and exclusive offers. We&apos;re excited to welcome you into our community and look forward to being a part of your playtime adventures.
            </p>
            <p className="font-semibold text-white">
              Thank you for visiting Gezeno. Let&apos;s make playtime magical!
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}