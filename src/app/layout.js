import { Inter } from "next/font/google";
import "./globals.css";
import News from "@/components/News";
import Sidebar from "@/components/Sidebar";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "X Clone",
  description: "A clone of X",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex justify-between max-w-6xl mx-auto">
            <div className="hidden sm:inline border-r h-screen sticky top-0">
              <Sidebar />
            </div>
            <div className="w-2xl flex-1">{children}</div>
            <div className="lg:flex lg:flex-col p-3 h-screen border-l hidden w-[24rem]">
              <div className="sticky top-0 bg-white py-2 focus:border-blue-500">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 border border-gray-200 rounded-3xl text-sm w-full px-4 py-2"
                ></input>
              </div>
              <News />
            </div>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
