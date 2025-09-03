import { Button, Input, Modal, Select, UploadFile } from "antd";
import { IoIosPricetags } from "react-icons/io";
import { CgCalendarDates } from "react-icons/cg";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { IoCreateSharp } from "react-icons/io5";
import { EnterpriseType } from "../../../Services/Demandes/Entreprise/Type";
import FileUploadComponent from "../UploadFile";
import AjoutCreditEntrepriseStep2 from "./AjoutCreditEntrepriseStep2";
import { useGetTypeCredit } from "../../../Services/Credit/useGetTypeCredit";

type DocumentInput = {
  file: File;
  type_document: string;
   previewUrl: string;
  
}
  export type PopconfirmType = {
    client?: EnterpriseType | null ;
    open: boolean;
  };
const { TextArea } = Input;
type props = {
    client: EnterpriseType,
    onCloseModal?: () => void;
    widt:number,
    typeFile:string;
  }
  const AjoutCreditEntreprise= ({client, onCloseModal, typeFile}:props) => {
    console.log("client : ", client)
        const [openPopupConfirm, setOpenPopupConfirm] = useState<PopconfirmType>({
          open: false,
          client: null,
        });
          const [uploadedFiles, setUploadedFiles] = useState<Record<string, DocumentInput[]>>({});
          const [montant, setMontant] = useState("")
          const [montantNet, setMontantNet] = useState("")

        const {data:ListCredit} = useGetTypeCredit()
       
           const creditOptions = ListCredit?.map((credit) => ({
         label: credit.libelle,  // Ce qui sera affiché
         value: credit.ncg       // La valeur associée
       })) || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value;
  setMontant(rawValue);
  setMontantNet(rawValue)
};

          const [duree, setDuree] = useState("")
          const [memoType, setmemoType] = useState("")
          const [nature, setNature] = useState("")
          const [avis, setAvis] = useState("")
          const showModal = (client:EnterpriseType)=>{
                  
                  if(Number(montant)<=0){
                    return   enqueueSnackbar("Veuillez entrer un montant valide !", { variant: "error" });
                  }   
                  if (Number(duree) <= 0) {
                    return enqueueSnackbar("Veuillez entrer une durée valide !", { variant: "error" });
                }
                  setOpenPopupConfirm({open:true, client})
                 }
                const handleCancel = ()=>{
                  setOpenPopupConfirm({open:false,client:null})
                }


const handleFileChange = (
  info: { fileList: UploadFile[] },
  clientId: string,
  documentType: string
) => {
  const newFiles = info.fileList
    .filter(file => file.originFileObj)
    .map(file => ({
      file: file.originFileObj as File,
      type_document: documentType,
      previewUrl: URL.createObjectURL(file.originFileObj as File) 
    }));

  setUploadedFiles(prev => ({
    ...prev,
    [clientId]: [
      ...(prev[clientId] || []).filter(f => f.type_document !== documentType),
      ...newFiles
    ]
  }));
};

      const [TypeCredit, setTypeCredit] = useState("")
      const onchangeSelect = (value:string) => {
        setTypeCredit(value)
      }
      const onchangeSelectNature = (value:string) => {
        setNature(value)
      }
      const credit = {
        montant: Number(montantNet),
        duree: Number(duree),
        type_credit : TypeCredit,
        memo: memoType,
        avis: avis,
        nature:nature,
        fichiers: uploadedFiles[client.CLIENT!] || []
      };
      console.log("uploadedFiles : ", uploadedFiles)
    return (
        <div className="flex flex-col gap-2 ">
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-center font-bold text-2xl underline">Ajout Crédit {typeFile === "entreprise" ? "Entreprise" : "Client"}</h1>
            <IoCreateSharp size={30} />
            </div>
            <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
              <label>
          <span className="font-bold text-base">Type Crédit</span> {" "}<span style={{ color: 'red' }}>*</span>
            <Select 
          // options={[
          //   {label : "Immobilier", value : "Immobilier"},
          // ]}
            options={creditOptions}
          className="w-full h-[42px]"
          onChange={onchangeSelect}
          placeholder="Type Crédit"
          />
        </label>
           <label>
          <span className="text-base font-bold">Nature de Crédit</span> {" "}<span style={{ color: 'red' }}>*</span>
          <Select   options={[
    {label: "Crédit Immobilier", value: "Crédit Immobilier"},
    {label: "Crédit Automobile", value: "Crédit Automobile"},
    {label: "Crédit à la Consommation", value: "Crédit à la Consommation"},
    {label: "Crédit d'Exploitation", value: "Crédit d'Exploitation"},
    {label: "Crédit d'Investissement", value: "Crédit d'Investissement"},
    // {label: "Microcrédit", value: "Microcrédit"},
    {label: "Découvert", value: "Découvert"},
    {label: "Crédit Agricole", value: "Crédit Agricole"},
    {label: "Autre", value: "Autre"},
  ]}
          className="w-full h-[42px]"
          onChange={onchangeSelectNature}
          placeholder="Nature de Crédit"
          />
        </label>
            </div>
             
          <div className="grid grid-cols-2 gap-3">
                   
        <label>
          <span className="font-bold text-base">Montant</span>{" "}<span style={{ color: 'red' }}>*</span>
        <Input 
         type="text"
        value={montant}
        suffix={"MRU"}
        prefix={<IoIosPricetags /> as unknown as string}
          onChange={handleChange}
        className="w-full !h-[43px] rounded-lg" placeholder="montant" />
        </label>
        <label>
          <span className="font-bold text-base">Durée</span>  {" "}<span style={{ color: 'red' }}>*</span>
        <Input 
        value={duree}
        prefix={<CgCalendarDates /> as unknown as string}
        suffix={"Mois"}
        min={"1"}
        onChange={(e)=>setDuree(e.target.value)}
        
        className="w-full !h-[43px] rounded-lg" placeholder="Duree" type="number"/>
        </label>
          </div>

        <label>
  <span className="text-base font-bold">Avis</span> {" "}<span style={{ color: 'red' }}>*</span>
  <TextArea rows={3}
        onChange={(e)=>setAvis(e.target.value)}
        value={avis} className="rounded-lg" placeholder="Saisissez votre avis" />
</label>
        <label>
         <span className="text-base font-bold">Memo</span>  {" "}<span style={{ color: 'red' }}>*</span>
        <TextArea 
        className="rounded-lg"
        value={memoType}
        onChange={(e)=>setmemoType(e.target.value)}
        rows={3} placeholder="Saisissez un mémo" />

        </label>
        
        <div className="flex ">
            <span className="text-[17px] font-bold">Document à Télécharger</span> 
            </div>
         <label className=" w-full">
   <FileUploadComponent client={client} type={typeFile} handleFileChange={handleFileChange}/>
   
  </label>

        { memoType && montant &&duree &&avis && TypeCredit&& nature ? (
<div className="grid grid-cols-2 gap-2 mt-2">

<Button className="secondary-button !h-[42px]"
 onClick={onCloseModal}
 >
    Annuler
    </Button>
    <Button className="auth-button !h-[42px]" onClick={()=>showModal(client)}>
    Suivant
    </Button>

</div>
) : <Button className="secondary-button !h-[42px] mt-2" onClick={onCloseModal}>
Annuler
</Button>}
<Modal
            destroyOnClose={true}
            onCancel={handleCancel}
            open={openPopupConfirm.open}
            footer={null}
            width={1500}
            closable={false}
              maskClosable={false}
          >
            <AjoutCreditEntrepriseStep2 closeFirstModal={onCloseModal} closeSecondModal={handleCancel} client={openPopupConfirm.client!} credit={credit}/>

          </Modal>
      </div>
    )
}

export default AjoutCreditEntreprise