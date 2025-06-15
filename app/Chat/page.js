"use client";
import Navbar from "@/app/components/Navbar";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";

const Chat = () => {
  return (
    <>
      {/* Empty Page Content */}
      <div className="flex flex-col min-h-screen w-screen pb-28 pt-8 items-center bg-[#f3f3f3] dark:bg-[#292B2D] text-black dark:text-white relative px-4">
        <div className="dark:hidden">
          <CherryBlossomSnowfall isDarkMode={false} />
        </div>
        <div className="dark:block">
          <CherryBlossomSnowfall isDarkMode={true} />
        </div>
        Chat Page
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Navbar />
      </div>
    </>
  );
};

export default Chat;
