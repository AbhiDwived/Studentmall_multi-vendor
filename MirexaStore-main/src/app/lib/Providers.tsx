// src/app/Providers.tsx
"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/lib/redux/store";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="white">
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </Provider>
  );
}
