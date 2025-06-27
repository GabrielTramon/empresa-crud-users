import logo from "../assets/logo.png";
import Image from "next/image";
import { Home, LogOut ,PlusCircle, Trash, Eye } from "lucide-react";
import Link from "next/link";


export default function SideBar() {
    return (
        <nav className="fixed flex h-screen w-24 bg-white shadow-md p-4 flex-col">
            <Link href="/"> <Image src={logo} alt="Logo" width={100} height={100} /></Link>
            <div className="flex flex-col items-center w-full space-y-4 mt-12">
                    <Link href="/"><Home className="text-gray-800 w-6 h-6 cursor-pointer hover:text-blue-500"/></Link>
                <div className="w-8 h-px bg-gray-300" />
                    <Link href="/create"><PlusCircle className="text-gray-800 w-6 h-6 cursor-pointer hover:text-blue-500"/></Link>
                <div className="w-8 h-px bg-gray-300" />
                    <Link href="/view"><Eye className="text-gray-800 w-6 h-6 cursor-pointer hover:text-blue-500"/></Link> 
            </div>
        </nav>
    );
  }
  