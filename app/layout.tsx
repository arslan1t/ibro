import type { ReactNode } from "react";
import "./globals.css";
import { FilterProvider } from "./context/FilterContext";
import { AppProvider } from "./context/AppContext";
import ConditionalBottomNav from "@/components/ConditionalBottomNav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0F2C] text-white">
        <AppProvider>
          <FilterProvider>
            {children}
            <ConditionalBottomNav />
          </FilterProvider>
        </AppProvider>
      </body>
    </html>
  );
}

