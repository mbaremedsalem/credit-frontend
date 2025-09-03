

import {  Button, Input, message, Space} from "antd";
import { useTranslation } from "react-i18next";


import { getUserInfo, UserInfo } from "../../Services/Auth/useGetUserInfo";
import { useEffect, useState } from "react";
import { validateEmail } from "../Auth/ForgetPassword";
import SpinnerLoader from "../../Ui/Spinner";
import { useUpdateUser } from "../../Services/Auth/useUpdateProfile";
import { enqueueSnackbar } from "notistack";
import ImageUploader from "../../Ui/ImageUploader";
import { ImageListType } from "react-images-uploading";
import { BaseUrl } from "../../api/BaseUrl";
type Props = {
  handleCancel: () => void;
};
export  function UpdateProfileAdmin({handleCancel} : Props) {
      const {data:clients, isPending:isPendingClient}= getUserInfo()
      const [images, setImages] = useState<ImageListType>([]);

  const {t} = useTranslation()
  
  const [nom, setnom] = useState("")
  const [prenom, setprenom] = useState("")
  const [email, setEmail] = useState("")
  const [adresse, setAdresse] = useState("")
  const [phone, setPhone] = useState("")
  const {mutate:UpdateProfile, isPending:isPendingProfile} = useUpdateUser()

  useEffect(()=>{
    if (clients) {
        setnom(clients?.nom || "");
        setprenom(clients.prenom || "");
        setAdresse(clients.address || "");
      setEmail(clients.email || "");
      setPhone(clients?.phone || "")
      
    if (clients.image) {
      setImages([{ data_url: BaseUrl + clients.image }]);
    } else {
      setImages([]);
    }
    }
  }, [clients])


  
  const onSubmit = () => {
    
    if(!nom || !prenom || !email || !adresse || !phone){
      enqueueSnackbar("Tous les champs sont obligatoires !", { variant: "error" });
    } else  if (!validateEmail(email)){
                return message.error(t("Entrez une adresse e-mail valide !"))
            }
       else  if(images?.length === 0) {
              message.error("please select the image !")
            }
      else { 
        const file = images[0]?.file;

        console.log("file : ", file)
        const params :UserInfo = {
          email:email,
          nom:nom,
          prenom : prenom,
          address : adresse,
          post : clients?.post,
          username : clients?.username,
          image : file
        
        }
        console.log("user : ", params)
        UpdateProfile(params,{
          onSuccess:()=>{
            handleCancel()
          }
        })
      }
  }
  if(isPendingClient || isPendingProfile){
    return <SpinnerLoader/>
  }
  return (
    <div>
       <div className="flex items-center justify-center flex-col space-y-2"> 
           <ImageUploader
            placeholder="Profile Image"
            image={images}
            setImage={setImages}
          />
          
          
        </div>
      <div className="grid grid-cols-2 gap-y-1 gap-x-3">
      
        <Space direction="vertical">
          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Nom")}
            
          </label>
          <Input
            onChange={(e) => setnom(e.target.value)}
           value={nom}
            placeholder="Nom"
          />
        </Space>

        <Space direction="vertical">
          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Prenom")}
          </label>
          <Input
            onChange={(e) => setprenom(e.target.value)}
           
            value={prenom}
            placeholder="Prenom"

          />
        </Space>
        
        {/* <Space direction="vertical" className="grid col-span-2"> */}
        <Space direction="vertical" className="">
          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Email")}
          </label>
          <Input
          type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
           
placeholder={t("Email")}
          />
        </Space>
        <Space direction="vertical" className="">
          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Téléphone")}
          </label>
          <Input
          type="text"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
           
placeholder={t("Téléphone")}
          />
        </Space>
        
      </div>
      <div className="grid grid-cols-2 items-center gap-x-4 mt-4 md:mt-5">
          <Button className=" h-[50.6px]   mt-2 secondary-button" onClick={handleCancel}>Annuler </Button>
            <Button className=" h-[50.6px] mt-2 primary-button" onClick={onSubmit} 
            >Confirmer</Button>
            
      </div>
    </div>
  );
}
