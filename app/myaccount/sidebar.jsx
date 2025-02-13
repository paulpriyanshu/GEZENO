import Link from "next/link";
import { Package, CreditCard, Wallet, MapPin, User, LogOut, Hand } from "lucide-react";

import HandleLogoutButton from "./HandleLogoutButton";


export default function Sidebar({ pathname }) {

  const links = [
    { label: "Overview", route: "/myaccount", icon: Package },
    { label: "My Orders", route: "/myaccount/myorders", icon: Package },
    { label: "My Payments", route: "/myaccount/mypayments", icon: CreditCard },
    { label: "My Addresses", route: "/myaccount/myaddress", icon: MapPin },
    { label: "My Profile", route: "/myaccount/myprofile", icon: User },
  ];

  return (
    <aside className="w-64 h-screen bg-white p-6 space-y-6 shadow-lg">
      <nav className="space-y-2">
        {links.map(({ label, route, icon: Icon }) => {
          const isActive = pathname === route || pathname.startsWith(route + "/"); // Check if active
          return (
            <Link
              key={label}
              href={route}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition
                ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}


       <HandleLogoutButton/>

      </nav>
    </aside>
  );
}