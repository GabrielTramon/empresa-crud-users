import "../styles/globals.css";
import SideBar from "../components/sideBar";
import { ReactNode } from "react";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "react-hot-toast";  // Importa o Toaster

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'BE1 foda',
  description: 'Descrição do site',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen overflow-x-hidden">
        <ReactQueryProvider>
          <SideBar />
          <div className="flex flex-col flex-1 ml-24 p-6 min-h-screen bg-gray-50">
              {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
