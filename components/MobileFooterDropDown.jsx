'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function MobileFooterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Return null if the current route is /categoryM
  if (pathname === '/categoryM') {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200 mb-16">
      <div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full"
            >
              <span className="text-lg font-semibold">More About Gezeno</span>
              {isOpen ? (
                <ChevronUp className="w-6 h-6 text-cyan-400" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {isOpen && <Footer />}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}