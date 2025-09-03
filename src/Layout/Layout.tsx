import { useState } from "react";
import { Navbar } from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Footer } from "../Components/Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
     
    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1">
        
        <Navbar setIsSidebarOpen={setIsSidebarOpen}/>

  
        {/* <main className="flex-1 p-4 mt-[82px] lg:ml-[91px]  rounded-lg ">{children}</main> */}
        <main className="flex-1 p-6 pt-[80px] lg:ml-[91px]  rounded-lg ">{children}
       {/* <Footer/> */}

        </main>

       <Footer/>
      </div>
    </div>
  );
};

export default Layout;