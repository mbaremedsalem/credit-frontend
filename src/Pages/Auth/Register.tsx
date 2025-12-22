import { Button, Select } from "antd"
import img from "../../assets/images/image.png"

import SpinnerLoader from "../../Ui/Spinner"
import {FaRegEyeSlash, FaRegEye} from "react-icons/fa6"
import {  useState } from "react"
import { enqueueSnackbar } from "notistack";
import { RegisterParams, useRegister } from "../../Services/Auth/useRegsiter"

function Register(){
   
   const [email, setEmail] = useState("")
   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")
   const [nom, setNom] = useState("")
   const [prenom, setPrenom] = useState("")
   const [adress, setAdress] = useState("")
   const [post, setPost] = useState("")
   const [poit, setPoit] = useState("")
   const [agence, setAgence] = useState("")
   const [phone, setPhone] = useState("")

   const onchangePost = (value:string) =>{
setPost(value)
   }
   
       const onchangePoit = (value:string) =>{
        setPoit(value)
           }
           const onchangeAgence = (value:string) =>{
            setAgence(value)
               }
   const [errorPassword, setErrorPassword] = useState(false)
   const [errorUsername, seterrorUsername] = useState(false)
    const [loading, setLoading] = useState(false);
    const [passType, setPassType] = useState("password")
    const {mutate:register, isPending} = useRegister()
    function showHidePass() {
      setPassType((prev) => (prev === "password" ? "text" : "password"));
    }
    
    const onClik = () => {
      
      
      let hasError = false;

  
  if (!email) {
    seterrorUsername(true);
    enqueueSnackbar("Entrez le username", { variant: "error" });
    hasError = true;
  }
  if (!password) {
    setErrorPassword(true);
    enqueueSnackbar("Entrez le mot de passe", { variant: "error" });

    hasError = true;
  } if (!nom) {
    enqueueSnackbar("Entrez le nom", { variant: "error" });
    hasError = true;

  } if (!prenom) {
    enqueueSnackbar("Entrez le prenom", { variant: "error" });
    hasError = true;

  } if (!email) {
    enqueueSnackbar("Entrez email", { variant: "error" });
    hasError = true;

  } if (!post) {
    enqueueSnackbar("Entrez le post", { variant: "error" });

    hasError = true;
  } if (Number(poit) < 0) {
    enqueueSnackbar("Entrez le poit", { variant: "error" });
    hasError = true;

  } if (!username) {
    enqueueSnackbar("Entrez le username", { variant: "error" });
    hasError = true;

  } if (!agence) {
    enqueueSnackbar("selectionner l'agence", { variant: "error" });
    hasError = true;

  } 

  if (hasError) {
    return;
  }
  setErrorPassword(false)
  seterrorUsername(false)
      setLoading(true); 
      
      // setTimeout(() => {
        setLoading(false);
        const params : RegisterParams = {
          password : password,
          username : email,
          address : adress, 
          nom : nom,
          prenom : prenom,
          phone : phone,
        email : username,
        post : post,
        role : post === "Chargé de clientèle" ? "Createur" : "Validateur",
        poit : Number(poit),
        agence : agence

      

        }
        register(params,{
          onSuccess:()=>{
          }
        })
      // }, 1500); 
    };

    

    return (
        <div className=" bg-gray-100 lg:px-[200px] max-lg:p-2">
            <div className="flex items-center justify-around">
            
            {/* </div> */}
            </div>
            <div className="flex items-center justify-center min-h-screen ">

            <div className="shadow-2xl p-16 max-lg:p-4 rounded-lg bg-white lg:w-[550px] max-lg:w-full">
            <img src={img} className="mb-4"/>

            <label className="text-sm font-light text-blue-2a mt-6">
            {("Username")}
          </label>
            <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Username")}
          />
          <span className="text-red-600 text-[12px]">{errorUsername ? "Entrez le username" : ""}</span>
          

          <label className="text-sm font-light text-blue-2a mt-6">
            {("Nom")}
          </label>
            <input
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (errorUsername) seterrorUsername(false)
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Nom")}
          />
          
          <label className="text-sm font-light text-blue-2a mt-6">
            {("Prenom")}
          </label>
            <input
            value={prenom}
            onChange={(e) => {
              setPrenom(e.target.value);
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Prenom")}
          />

          {/* email */}
          <label className="text-sm font-light text-blue-2a mt-6">
            {("Phone")}
          </label>
            <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Phone")}
          />

            {/* phone */}
            <label className="text-sm font-light text-blue-2a mt-6">
            {("Email")}
          </label>
            <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Email")}
          />


            {/* adress */}

            <label className="text-sm font-light text-blue-2a mt-6">
            {("Adress")}
          </label>
            <input
            value={adress}
            onChange={(e) => {
              setAdress(e.target.value);
            }}
            type="text"
            className={`${errorUsername? "border-red-600" : ""} 
            border-b w-full
            
            outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
            placeholder={("Adresse")}
          />

          
            <label className="mt-1">post
                <Select placeholder="Post" options={[
                    {label : "Chargé de clientèle", value:"Chargé de clientèle"},
                    {label : "Chef agence central", value:"Chef agence central"},
                    {label : "Chef de département commercial", value :"Chef de département commercial"},
                    {label : "Analyse de Risque", value :"Analyse de Risque"},
                    {label : "Directeur Risque", value :"Directeur Risque"},
                    {label : "Directeur Engagement", value :"Directeur Engagement"},
                    {label : "commite", value :"commite"},
                    {label : "IT DSI", value :"IT DSI"},
                    {label : "Directeur d'Audit", value :"Directeur d'Audit"},
                    { label: "Directeur Général", value: "Directeur Général" },
                    { label: "Directeur Général Adjoint", value: "Directeur Général Adjoint" }
                    
                
                ]}
                onChange={onchangePost}
                className="w-full my-2 border-none border-b-2"/>
            </label>    
           
            <label className="mt-1">Poit
                <Select placeholder="Poit" options={[
                    {label : 0, value : 0},
                    {label : 2, value : 2},
                    {label : 4, value : 4},
                    {label : 6, value : 6},
                    {label : 12, value : 12},
                    {label : 24, value : 24},
                
                ]}
                onChange={onchangePoit}

                className="w-full my-2 border-none border-b-2"/>
            </label>   
            <label className="mt-1">Agence
                <Select placeholder="Agence" options={[
                    {label : "00001", value : "00001"},
                    {label : "00002", value : "00002"},
                    {label : "00003", value : "00003"},
                   
                
                ]}
                onChange={onchangeAgence}

                className="w-full my-2 border-none border-b-2"/>
            </label>   
                  <div className="flex flex-col gap-y-[5px] mt-4">
          <label className="text-sm font-light text-blue-2a">
            {("Mot de Passe")}
          </label>
          <div className="flex items-center  justify-between">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorPassword) setErrorPassword(false); 
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
       
                 <Button className="w-full bg-main-color text-white mt-4 h-[43px] primary-button"
                loading={isPending}
                 onClick={onClik}>
                    Valider
                 </Button>
                 {loading && (
 <SpinnerLoader/>
)}
                
            </div>
            </div>
        </div>
    )
}

export default Register