import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import GlobalStyleProvider from "./providers/GlobalStyleProvider";
import ContextProvider from "./providers/ContextProvider";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from './providers/Sessionprovider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Management System",
  description: "A simple task management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { userId } = auth();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <NextTopLoader
            height={2}
            color="#27AE60"
            easing="cubic-bezier(0.53,0.21,0,1)"
          />
          <ContextProvider>
            <GlobalStyleProvider>
              <Sidebar />
              <div className="w-full">{children}</div>
            </GlobalStyleProvider>
          </ContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}