import { Button, message } from "antd"
import { HashLoader } from "react-spinners";
import img from "../../assets/images/image.png"

import { useState } from "react"
import { enqueueSnackbar } from "notistack";
import { forgetPassword, useForgetPassword } from "../../Services/Auth/useForgetPassword";
export type loginParams = {
    email : string,
    password :string
}

export const validateEmail = (email: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};




function ForgetPassword(){
  const {mutate : forget} = useForgetPassword()

 
    const [loading, setLoading] = useState(false);
    const onClik = () => {
      let hasError = false;
  
      if (!email) {
          seterrorUsername(true);
          enqueueSnackbar("Entrez votre email !!", { variant: "error" });
          hasError = true;
      } else if (!validateEmail(email)) {
          enqueueSnackbar("Veuillez entrer une adresse e-mail valide !", { variant: "error" });
          hasError = true;
      }
  
      if (hasError) {
          return;
      }
  
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const params : forgetPassword = {
          email : email
        }
        forget(params, {
          onSuccess : ()=>{
            message.success("success email !")
          }
        })
      }, 2000);
  };
  
   const [errorUsername, seterrorUsername] = useState(false)
   const [email, setEmail] = useState("")
    

    return (
        <div className=" bg-gray-100 lg:px-[200px]  max-md:p-3 lg:py-12">
            <div className="flex items-center justify-around">
            
           
            </div>
            <div className="flex items-center justify-center min-h-screen ">
            <div className="shadow-2xl p-16 max-lg:p-4 rounded-lg bg-white lg:w-[550px] max-lg:w-full">
            <img src={img} className="mb-4"/>

            <div className="flex items-center justify-center flex-col space-y-2">
            <p className="text-main-color text-[18px]">Mot de passe oublié? 🔒 </p>
            <p className="text-main-color text-[13px]">Entrez votre Email </p>
            </div>
            <label className="text-sm font-light text-blue-2a">
            {("Email")}
          </label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorUsername) seterrorUsername(false); 
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Email")}
          />
          <span className="text-red-600 text-[12px]">{errorUsername ? "Entrez votre email !!" : ""}</span>
          
          
                  <div className="flex flex-col gap-y-[5px] mt-4">
          
        </div>
       
                 <Button className="w-full bg-main-color text-white mt-4 h-[43px] primary-button"
                 onClick={onClik}>
                    Confirmer
                 </Button>


                 {loading && (
  <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-50 z-50">
    <div className="flex flex-col justify-center items-center">
      {/* <img src={img} alt="Logo Banque" className="w-20 h-20 mb-4" /> Assure-toi d'importer ton image */}
      
      {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">AUB</h2> */}
      
      <HashLoader color="#141317" size={100} />
    </div>
  </div>
)}

<div className="mt-8 pt-4 border-t border-gray-200 text-center">
  <div className="flex items-center justify-center gap-2 mb-2">
    {/* Use either the SVG import or component */}
    {/* <img src={workflowLogo} alt="Workflow Credit" className="h-6" /> */}
    {/* OR */}
    {/* <WorkflowCreditLogo /> */}
    
    <span className="text-sm font-medium text-gray-600">Crédit</span>
  </div>
  <p className="text-xs text-gray-500">
    Fait par Direction Informatique (DSI)
  </p>
</div>
                


                
            </div>
            </div>
        </div>
    )
}

export default ForgetPassword