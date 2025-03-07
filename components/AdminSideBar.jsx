import React, { useState, useEffect } from "react";
import { Home, Package, Users, PieChart, Tag, ChevronRight, BookOpen, UserCircle, ChevronDown, Settings, Layout, Menu, Handshake } from "lucide-react";
import { useAppSelector } from "@/app/lib/hooks";
import ProductsDropdown from "@/components/ProductsDropdown";
import PagesDropdown from "./PagesDropdown";
import UserListDropdown from "./UserListDropdown";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomersDropdown from "@/components/CustomersDropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/app/lib/store/features/adminsidebar/SideBarSlice";

export default function AdminSideBar() {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const router = useRouter();
  const [activeBrands, setActiveBrands] = useState([]);
  const [inactiveBrands, setInactiveBrands] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const activeResponse = await fetch('https://backend.gezeno.in/api/products/getactivebrands');
        const inactiveResponse = await fetch('https://backend.gezeno.in/api/products/getinactivebrands');

        const activeData = await activeResponse.json();
        const inactiveData = await inactiveResponse.json();

        if (activeData.success) {
          setActiveBrands(activeData.data);
        }
        if (inactiveData.success) {
          setInactiveBrands(inactiveData.data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const menuItems = [
    { icon: Home, label: "Home", route: "home" },
    { icon: Package, label: "Products", route: "products", isDropdown: true },
    { icon: Users, label: "Customers", route: "customers", isDropdown: true },
    { icon: Handshake, label: "T & C", route: "T&C" },
    { icon: PieChart, label: "Analytics", route: "analytics" },
    { icon: Package, label: "Orders", route: "orders" },
    { icon: Tag, label: "Discounts", route: "discounts" },
    { icon: UserCircle, label: "User List", route: "user-list", isDropdown: true },
    { icon: Layout, label: "Home Page Setup", route: "home-page-setup", isDropdown: true },
    { icon: Settings, label: "Settings", route: "settings" },
  ];

  const handleNavigation = (route) => {
    router.push(`/admin/${route}`);
  };

  return (
    <div className="bg-white h-screen w-64 overflow-y-auto transition-all duration-300">
      <nav className="space-y-2 p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            {item.isDropdown ? (
              item.label === "Products" ? (
                <div>
                  <ProductsDropdown />
                </div>
              ) : item.label === "User List" ? (
                <UserListDropdown />
              ) : item.label === "Customers" ? (
                <CustomersDropdown/>
             
              ) : item.label === "Active Brands" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <Tag className="w-5 h-5 mr-3" />
                        Active Brands
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-[200px]">
                      {activeBrands.map((brand) => (
                        <DropdownMenuItem key={brand._id} onSelect={() => handleNavigation(`active-brands/${brand.name.toLowerCase()}`)}>
                          {brand.name}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.label === "Inactive Brands" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <Tag className="w-5 h-5 mr-3" />
                        Inactive Brands
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-[200px]">
                      {inactiveBrands.map((brand) => (
                        <DropdownMenuItem key={brand._id} onSelect={() => handleNavigation(`inactive-brands/${brand.name.toLowerCase()}`)}>
                          {brand.name}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.label === "Home Page Setup" ? (
                <div>
                  <Button variant="ghost" className="w-full justify-between" onClick={() => router.push('/admin/homepagesetup')}>
                    <span className="flex items-center">
                      <Layout className="w-5 h-5 mr-3" />
                      Home Page Setup
                    </span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" onClick={() => router.push('/admin/mobilesidebar')}>
                    <span className="flex items-center">
                      <Menu className="w-5 h-5 mr-3" />
                      Mobile Side Bar
                    </span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" onClick={() => router.push('/admin/submenu')}>
                    <span className="flex items-center">
                      <Menu className="w-5 h-5 mr-3" />
                      Sub Menu
                    </span>
                  </Button>
                </div>
              ) : null
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => handleNavigation(item.route)}
              >
                <span className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
