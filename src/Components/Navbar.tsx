import { Menu } from "lucide-react";
import logo from "../assets/images/image.png"
type props = {
    setIsSidebarOpen : (value:boolean)=>void 
}
import { getUserInfo } from "../Services/Auth/useGetUserInfo";
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import { useState } from "react";
import { UpdateProfileAdmin } from "../Pages/Profile/UpdateProfileUser";
import { EditPassword } from "../Pages/Profile/UpdatePassword";
import { BaseUrl } from "../api/BaseUrl";
import { useGetNotifications } from "../Services/Notifications/useGetNotifications";
import AuthService from "../Auth-Services/AuthService";
import SpinnerLoader from "../Ui/Spinner";
import NotificationPage from "../Pages/Notifications/Notifications";
export function Navbar({setIsSidebarOpen}:props){
 
const {data:userInfo} = getUserInfo()
const idUserConnect = AuthService.getIDUserConnect()
const {data:Notification, isPending} = useGetNotifications(idUserConnect!)
const [isModalOpenProfile, setIsModalOpenProfile] = useState(false);
  const [isModalOpenPassword, setIsModalOpenPassword] = useState(false);
  const handlecancelProfile = () => {
    setIsModalOpenProfile(false)
  }
  const handlecancelPassword = () => {
    setIsModalOpenPassword(false)
  }

    const showModalProfile = () => {
      setIsModalOpenProfile(true);
    };
    const showModalPassword = () => {
      setIsModalOpenPassword(true);
    };
const items: MenuProps["items"] = [
  {
    label: ("Modifier le profil"),
    key: "1",
    onClick: () => showModalProfile(),
  },
  {
    label: ("Modifier le mot de passe"),
    key: "2",
    onClick: () => showModalPassword(),
  },
];


if(isPending){
  return <SpinnerLoader/>
}
return (
    <div className="z-50">
        <header className="fixed w-full rounded-md  bg-white shadow-md py-2  px-6 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="lg:hidden">
          </div>
          <img src={logo} className=" h-12 max-lg:hidden "  />

          <div className="flex items-center space-x-4">
          <NotificationPage notifications={Notification!} />
          <Dropdown menu={{ items }} placement="bottom" arrow>

          <div className="flex items-center justify-center space-x-3">
          <Avatar size={40} src={<img src={String(BaseUrl+userInfo?.image!)} className="text-black text-[11px]" alt="logo-profile" />} />
         

            <div className="flex flex-col items-center cursor-pointer">
            <div>
            <span className="text-[15px]"> {userInfo?.prenom} </span>
            <span className="text-[15px]"> {userInfo?.nom} </span>
            </div>
           <div className="flex items-center gap-2">
             <span className="text-[12px]"> {userInfo?.post} </span>
           {(userInfo?.post === "Chargé de clientèle" || userInfo?.post === "Chef agence central") && <span>{" "} - {" "}</span>}
      {(userInfo?.post === "Chargé de clientèle" || userInfo?.post === "Chef agence central") && <span className="text-[12px]"> {userInfo?.agnece === "00001"? "NKTT" : userInfo?.agnece === "00002" ? "NDB" : ""} </span>}      
           </div>
            </div>
          </div>
          </Dropdown>
          </div>
          
         <Modal
                destroyOnClose={true}
                onCancel={handlecancelProfile}
                open={isModalOpenProfile}
                footer={null}
                width={412}
                closable={false}
                className=''
                  maskClosable={false}
              >
              <UpdateProfileAdmin handleCancel={handlecancelProfile}/>
              </Modal>
              <Modal
                destroyOnClose={true}
                onCancel={handlecancelPassword}
                open={isModalOpenPassword}
                footer={null}
                width={390}
                closable={false}
                className=''     
                  maskClosable={false}         >
              <EditPassword handleCancel={handlecancelPassword}/>
              </Modal>
        </header>
     
    </div>
)
}

