import {  X } from "lucide-react"
// import { CreditCard, X } from "lucide-react"
import { Link } from "react-router-dom"
import { FaArchive, FaFolder } from "react-icons/fa";
import { LiaWarehouseSolid } from "react-icons/lia";
import { FaCodePullRequest } from "react-icons/fa6";
type props = {
    setIsSidebarOpen:(value:boolean)=>void
    isSidebarOpen:boolean
}
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react";
import SpinnerLoader from "../Ui/Spinner";
import { useLogout } from "../Services/Auth/useLogout";
import AuthService from "../Auth-Services/AuthService";
import { RiGuideFill } from "react-icons/ri";
import { SiAlwaysdata } from "react-icons/si";

function Sidebar({setIsSidebarOpen, isSidebarOpen} : props){
  const  {mutate:logout} = useLogout()
    const [loading, setLoading] = useState(false)
  const LogoutFun = () => {
    setLoading(true)
    setTimeout(()=>{
        setLoading(false)
        logout()
        window.location.href="/login"
    }, 1000)
   }
    const navsAdmin = [
        { name: ("Accueil"), link: "/", icon: <LiaWarehouseSolid size={20} /> },
        { name: ("Dossiers"), link: "/dossier", icon: <FaFolder  size={20}/> },
        // { name: ("Crédit"), link: "/credit", icon: <CreditCard  size={20}/> },
        { name: ("Historiques"), link: "/historique", icon: <RiGuideFill  size={20} /> },
        // { name: ("Quide"), link: "/quide", icon: <FaArchive  size={20} /> },
        { name: ("Processus"), link: "/processus", icon: <SiAlwaysdata  size={20} /> },
      ];
      const navsChargeClientele = [
        { name: ("Accueil"), link: "/", icon: <LiaWarehouseSolid size={20} /> },
        { name: ("Demandes"), link: "/demande", icon: <FaCodePullRequest   size={20} /> },
        { name: ("Dossiers"), link: "/dossier", icon: <FaFolder  size={20}/> },
        // { name: ("Crédit"), link: "/credit", icon: <CreditCard  size={20}/> },
        { name: ("Historiques"), link: "/historique", icon: <FaArchive  size={20} /> },
        // { name: ("Quide"), link: "/quide", icon: <RiGuideFill  size={20} /> },
        { name: ("Processus"), link: "/processus", icon: <SiAlwaysdata  size={20} /> },
      ];
     
      const post = AuthService.getPostUserConnect()
      const navs = post === "Chargé de clientèle" ? navsChargeClientele : navsAdmin
      const isActive = (link: string) => {
        return location.pathname === link; 
      };

    return (
        <>
         <aside
                className={`fixed inset-y-0 left-0 z-50 w-[85px]  overflow-y-auto  p-5 transition-transform bg-main-color rounded-r-3xl mt-[82px] text-white ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-64"
                } lg:translate-x-0`}
              >
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                  <X className="w-6 h-6" />
                </button>
                <div className=" justify-center flex items-center">
                </div>
                <nav className=" flex flex-col items-center justify-center">
                  {navs.map((item,index)=>{
                    
                    return (
                        <div key={index} className="flex flex-col space-y-2 items-center justify-center">

                        <Link to={item.link}>
                        
                            <div className={`flex flex-col
                            items-center justify-center
                                ${isActive(item.link)? "" : "text-main-"} hover:ml-2  p-2   rounded`}>
                            <div className={`rounded-full  p-2  ${isActive(item.link) ? "bg-white text-black" : "bg-gray-800"}`}>
                            {item.icon}
                            </div>
                            <span className=" text-[11px]"> {item.name} </span>
                            </div>
                        </Link>
                        </div>
                    )
                  })}
                  <div className="mt-3 bottom-9 flex flex-col items-center justify-center cursor-pointer" onClick={LogoutFun}>
                            
                            <div className="rounded-full  p-2 bg-gray-800">
                            <TbLogout2  />

                            </div>
                            <span className="text-[11px]">Déconnecter</span>
                        </div>
                        
                       
                </nav>
              </aside>
              {loading && (
                <SpinnerLoader/>
               )}
            </>
              
    )
}

export default Sidebar