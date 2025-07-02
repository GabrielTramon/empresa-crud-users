import "../styles/globals.css";
import SideBar from "../components/sideBar";
import { ReactNode } from "react";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex flex-col flex-1 ml-24 p-6 min-h-screen bg-gray-50">
              {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
