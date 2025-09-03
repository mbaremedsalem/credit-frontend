import { Button } from "antd"
import img from "../../assets/images/image.png"
import {FaRegEyeSlash, FaRegEye} from "react-icons/fa6"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { ResetPasswordParams, useResetPassword } from "../../Services/Auth/useResetPassword";
import { enqueueSnackbar } from "notistack";
import SpinnerLoader from "../../Ui/Spinner";
export type loginParams = {
    email : string,
    password :string
}

function ResetPassword(){
const {mutate : resetPass, isPending} = useResetPassword()
const [passType, setPassType] = useState("password")
function showHidePass() {
  setPassType((prev) => (prev === "password" ? "text" : "password"));
}
const [errorPassword, setErrorPassword] = useState(false)
const [errorPasswordConfirm, setErrorPasswordConfirm] = useState(false)

const { token } = useParams(); 
const [currentToken, setCurrentToken] = useState('');

useEffect(() => {
  if (token) {
    setCurrentToken(token);  
  }
}, [token]);

console.log("code : ", currentToken)

const [loading, setLoading] = useState(false);


const navigate = useNavigate()
const [passwordNouvau, setNouveauPassword] = useState("")
const [password, setPassword] = useState("")
const onSubmit = () => {
  let hasError = false;

   if (!password) {
      setErrorPassword(true);
      enqueueSnackbar("Entrez le mot de passe", { variant: "error" });  
      hasError = true;
    }
    if (!passwordNouvau) {
      setErrorPasswordConfirm(true);
      enqueueSnackbar("Confirmer le mot de passe !", { variant: "error" });
      hasError = true;
    }

    if(password !== passwordNouvau){
     return  enqueueSnackbar("Le mot de passe et la confirmation du mot de passe doivent être identiques.", { variant: "error" })
    }
    
    if (hasError) {
      return;
    }
    setErrorPassword(false)
    setErrorPasswordConfirm(false)
     setLoading(true); 
      
      setTimeout(() => {
        setLoading(false);

      const params : ResetPasswordParams =  {
        password:password,
        confrimPassword:passwordNouvau,
        code:currentToken!
      }
    resetPass(params, {
      onSuccess:()=>{
        navigate("/login")
  
      }
  
    })
    
    }, (2000));
 
}
    
   
console.log(" loading " )
    return (
        <div className=" bg-gray-100 lg:px-[200px] max-lg:p-4">
            <div className="flex items-center justify-around">
            {/* <div className="grid grid-cols-2"> */}
            
           
            {/* </div> */}
            </div>
            <div className="flex items-center justify-center min-h-screen -mt-16 ">
            <div className="shadow-2xl p-16 max-lg:p-4 rounded-lg bg-white lg:w-[550px] max-lg:w-full">
           
            <img src={img} className="w-  mt-2"/>
          
                  <div className="flex flex-col gap-y-[5px] mt-4">
          
        
          
             <div className="flex flex-col gap-y-[2px] mt-4">
                    <label className="text-sm font-light text-blue-2a">
                      {("Mot de Passe")}
                    </label>
                    <div className="flex items-center  justify-between">
                      <input
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorPassword) setErrorPassword(false)
                        }}
                        type={passType}
                        className={`${errorPassword? "border-red-600 " : ""} border-b flex-1 w-full outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
                        placeholder={("Mot de Passe")}
                      />
                      
                      <div
                        className=" cursor-pointer text-blue-2a"
                        onClick={showHidePass}
                      >
                        {passType === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
                      </div>
                      
                    </div>
                    <span className="text-red-600 text-[12px]">{errorPassword ? "Entrez le mot de passe" : ""}</span>
                  </div>


                  
          

             <div className="flex flex-col gap-y-[5px] mt-4">
                    <label className="text-sm font-light text-blue-2a">
                      {("Confirmation Mot de Passe")}
                    </label>
                    <div className="flex items-center  justify-between">
                      <input
                        value={passwordNouvau}
                        onChange={(e) => {
                          setNouveauPassword(e.target.value);
                          if (errorPasswordConfirm) setErrorPasswordConfirm(false); 
                        }}
                        type={passType}
                        className={`${errorPasswordConfirm? "border-red-600 " : ""} border-b flex-1 w-full outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
                        placeholder={("Confirmation Mot de Passe")}
                      />
                      
                      <div
                        className=" cursor-pointer text-blue-2a"
                        onClick={showHidePass}
                      >
                        {passType === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
                      </div>
                      
                    </div>
                    <span className="text-red-600 text-[12px]">{errorPasswordConfirm ? "Entrez le mot de passe" : ""}</span>
                  </div>
        </div>
     
                 <Button className="w-full bg-main-color text-white mt-4 h-[43px] primary-button"
                 loading={isPending}
                 onClick={onSubmit}>
                    Confirmer
                 </Button>

                 {loading && <SpinnerLoader/>}

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

export default ResetPassword