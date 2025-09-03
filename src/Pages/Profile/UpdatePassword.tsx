

import {  Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import {  useState } from "react";
import { ModifierPassword, useUpdatePassword } from "../../Services/Auth/useUpdatePassword";

type Props = {
  handleCancel: () => void;
};
export  function EditPassword({handleCancel} : Props) {


  const {t} = useTranslation()

  const [password, setPassword] = useState("")
  const [newPassword, setnewPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const {mutate:editpassword, isPending:isPendigUpdate} = useUpdatePassword()
  const handleChanges = () => {
    if(!password){
       return message.error("Entrez le mot de passe !")
    } else if(!newPassword){
       return  message.error("Entrez le nouveau mot de passe !")
    } else if(!confirm){
      return  message.error("confirmez le mot de passe !")
    } else if(newPassword !== confirm){
      return   message.error("Le nouveau mot de passe et sa confirmation doivent être identiques !")
    } else if(confirm.length < 8 || newPassword.length < 8){
      return message.error("Le mot de passe doit contenir au minimum 8 caractères.")

    } else {
        const params : ModifierPassword = {
          old_password:password,
          new_password:newPassword, 
          confirm_password:confirm
        }
        editpassword(params,{
            onSuccess:()=>{
                handleCancel()
            }
        })
    }
  }
  return (
    <form>
     
      <div className=" gap-y-1 gap-x-3 flex flex-col gap-6">
      <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Mot de Passe")}
            
          <Input.Password
          className="my-1"
            onChange={(e) => setPassword(e.target.value)}
           value={password}
            placeholder="Password"
            type="password"
          />
          </label>

          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Nouveau Mot de Passe")}
            
          <Input.Password
          className="my-1"
            onChange={(e) => setnewPassword(e.target.value)}
           value={newPassword}
            placeholder="Nouveau Password"
            type="password"
            required
          />
          </label>
        
          <label className="text-blue-2a text-[13px]" htmlFor="">
          {t("Confirm Mot de Passe")}
            
          <Input.Password
          className="my-1"
            onChange={(e) => setConfirm(e.target.value)}
           value={confirm}
            placeholder="Confirm Password"
            type="password"
          />
          </label>
        
      </div>
      <div className="grid grid-cols-2 items-center gap-x-4  mt-2">
          <Button className=" h-[50.6px]   mt-2 secondary-button" onClick={handleCancel}>Cancel</Button>
            <Button className=" h-[50.6px] mt-2 primary-button" onClick={handleChanges}
             loading={isPendigUpdate}
            >Confirm
            </Button>

            {/* <Button className="w-[153.8px] h-[50.6px] mt-2 primary-button" loading={isPending} onClick={handleChanges}>Confirm</Button> */}
            
      </div>
    </form>
  );
}
