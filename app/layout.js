import { Inter, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MobileFooterDropdown from "@/components/MobileFooterDropDown";
import TopHeader from "@/components/TopHeader";
import { ThemeProvider } from "next-themes";

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Gezeno",
  // description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${montserrat.className} ${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
          <div>
            {/* Large screens */}
            <div className="hidden lg:block">
              <Footer />
            </div>

            {/* Small screens */}
            <div className="block lg:hidden">
              <MobileFooterDropdown />
            </div>
          </div>
        </body>
      </StoreProvider>
    </html>
  );
}