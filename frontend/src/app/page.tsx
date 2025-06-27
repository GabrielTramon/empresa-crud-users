import logo from "../assets/logo.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image src={logo} alt="Logo" width={400} height={400} className="max-h-[80vh] w-auto" />
    </div>
  );
}
