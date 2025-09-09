import { JSX, useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa6";
import { BsThreeDotsVertical as DotIcon } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaCreditCard } from "react-icons/fa6";
import { Button, Dropdown, MenuProps, Modal, Select, UploadFile } from "antd";
import { FaCloudDownloadAlt, FaFileImport } from "react-icons/fa";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
} from "react-icons/fa";
import { IoArrowUpSharp, IoEyeOutline } from "react-icons/io5";
import { LigneCredit, NewClient } from "../../../Services/type";
import { BaseUrl } from "../../../api/BaseUrl";
import FileUploadComponent from "../../Demandes/UploadFile";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiErrorCircle } from "react-icons/bi";
import { useGetSeulCredit } from "../../../Services/Demandes/useGetunSeulCredit";
import SpinnerLoader from "../../../Ui/Spinner";
import { useDeleteDocument } from "../../../Services/Demandes/useDeleteDocument";
import RemonterStep2 from "./RemonterStep2";
import { useGetTypeCredit } from "../../../Services/Credit/useGetTypeCredit";

type DocumentInput = {
  file: File;
  type_document: string;
  previewUrl: string;
};
type CreditInfo = {
  montant: number;
  duree: number;
  memo: string;
  avis: string;
  fichiers: any[] | File[];
};
type props = {
  client?: NewClient;
  credit?: CreditInfo;
  Credit_id: string;
  ligne: LigneCredit;
  closeSecondModal?: () => void;
  closeFirstModal?: () => void;
};
export type PopconfirmTypeDetails = {
  ligne?: LigneCredit | null;
  open: boolean;
};
const RemonterANouveau = ({ closeSecondModal, Credit_id }: props) => {
  const { data: Credit, isPending: isPendigCredit } =
  useGetSeulCredit(Credit_id);
  const [montant, setMontant] = useState(Credit?.montant || 0);
  const [duree, setDuree] = useState(Credit?.duree || 0);
  const [status, setStatus] = useState(Credit?.status || "");
  const [avis, setAvis] = useState(Credit?.avis || "");
  const [memo, setMemo] = useState(Credit?.memo || "");
  const [typeCredit, setTypeCredit] = useState(Credit?.type_credit || "");
  const [nature, setNature] = useState(Credit?.nature_credit || "");


  const getFileIcon = (fileName: string): JSX.Element => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FaFileExcel className="text-green-500" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-700" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FaFileImage className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const showDocument = (file: string | File) => {
    const url =
      typeof file === "string"
        ? `${BaseUrl}${file}`
        : URL.createObjectURL(file);
    window.open(url, "_blank");
  };
  const [afficherDocument, setafficherDocument] = useState<{
    id_client: string | number | null;
    open: boolean;
  }>();
  const [openPopupConfirmDetails, setopenPopupConfirmDetails] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });

  const ShowPopupConfirmDetails = () => {
    setopenPopupConfirmDetails({ open: true, ligne: Credit });
  };
  const CancelPopupConfirmDetails = () => {
    setopenPopupConfirmDetails({ open: false, ligne: null });
  };
  const showModalDelete = (id: string | number) => {
    setafficherDocument({ id_client: id, open: true });
  };
  const CancelModalDelete = () => {
    setafficherDocument({ id_client: null, open: false });
  };
  const handeSupprimerDocument = () => {
    deleteDocument(
      { credit_id: afficherDocument?.id_client! },
      {
        onSuccess: () => {
          CancelModalDelete();
        },
      }
    );
  };

  const downloadDocument = async (file: string | File) => {
    if (typeof file === "string") {
      try {
        const response = await fetch(`${BaseUrl}${file}`, {
          method: "GET",
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.split("/").pop() || "document";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Erreur lors du téléchargement :", err);
      }
    } else {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const { mutate: deleteDocument, isPending: isPendingDelete } =
    useDeleteDocument();

  

  const onchangeSelectType = (value: string) => {
    setTypeCredit(value);
  };

   const {data:ListCredit} = useGetTypeCredit()
  
      const creditOptions = ListCredit?.map((credit) => ({
    label: credit.libelle,  // Ce qui sera affiché
    value: credit.libelle       // La valeur associée
  })) || []
  const onchangeSelectNature = (value: string) => {
    setNature(value);
  };

  useEffect(() => {
    setMontant(Credit?.montant || 0);
    setDuree(Credit?.duree || 0);
    setStatus(Credit?.status || "");
    setAvis(Credit?.avis || "");
    setMemo(Credit?.memo || "");
    setTypeCredit(Credit?.type_credit || "");
    setNature(Credit?.nature_credit || "");
  }, [Credit]);

  const generateItems = (
    file: string | File,
    id_document: string | number
  ): MenuProps["items"] => [
    {
      label: (
        <div className="flex items-center justify-between space-x-3">
          <span>Voir</span>
          <IoEyeOutline size={17} />
        </div>
      ),
      key: "1",
      onClick: () => showDocument(file),
    },
    {
      label: (
        <div className="flex items-center justify-between space-x-3">
          <span>Télécharger</span>
          <FaCloudDownloadAlt size={17} />
        </div>
      ),
      key: "2",
      onClick: () => downloadDocument(file),
    },
    {
      label: (
        <div className="flex items-center justify-between space-x-3">
          <span>Supprimer</span>
          <RiDeleteBin2Fill size={17} />
        </div>
      ),
      key: "3",
      onClick: () => showModalDelete(id_document),
    },
  ];
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, DocumentInput[]>
  >({});

  const handleFileChange = (
    info: { fileList: UploadFile[] },
    clientId: string,
    documentType: string
  ) => {
    const newFiles = info.fileList
      .filter((file) => file.originFileObj)
      .map((file) => ({
        file: file.originFileObj as File,
        type_document: documentType,
        previewUrl: URL.createObjectURL(file.originFileObj as File),
      }));

    setUploadedFiles((prev) => ({
      ...prev,
      [clientId]: [
        ...(prev[clientId] || []).filter(
          (f) => f.type_document !== documentType
        ),
        ...newFiles,
      ],
    }));
  };

  if (isPendigCredit) {
    return <SpinnerLoader />;
  }

  const credit = {
    montant: Number(montant),
    duree: Number(duree),
    type_credit: typeCredit,
    memo: memo,
    avis: avis,
    nature: nature,
    fichiers: uploadedFiles[Credit?.client?.client_code!] || [],
  };

//   const docsNormaux = Credit?.documents?.filter(
//   (doc) => doc.createur?.post !== "Analyse de Risque"
// )


  const docsNormaux = Credit?.documents
    ? Credit?.documents?.filter(
        (doc) =>
          doc.createur?.post !== "Analyse de Risque" &&
          doc.createur?.post !== "Directeur Risque" &&
          doc.type_document !== "analyse" &&
          doc.type_document !== "amortissement" &&
          doc.type_document !== "mourabaha"
      )
    : [];
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-800">Remonter a Nouveau</h1>
        <IoArrowUpSharp size={28} />
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-gray-700">
            <FaUserTie size={23} />
            <span className="text-lg font-semibold">Informations Client</span>
          </div>
        </motion.div>

        <div className="flex items-center justify-between gap-4 text-sm text-gray-800">
          <div>
            <span className="font-medium">Client :</span>{" "}
            {Credit?.client?.client_code}
          </div>
          <div>
            <span className="font-medium">Nom :</span> {Credit?.client?.nom}
          </div>
          <div>
            <span className="font-medium">Prenom :</span>{" "}
            {Credit?.client?.prenom}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex items-center justify-between gap-4 text-sm text-gray-800"
        >
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <span className="font-medium">Telephone :</span>{" "}
            {Credit?.client?.tel}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="font-medium">Date Naissance :</span>{" "}
            {Credit?.client?.date_naissance ? Credit?.client?.date_naissance.slice(0, 10) : ""}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="font-medium">nni :</span> {Credit?.client?.nni}
          </motion.div>
        </motion.div>
      </div>

      <hr />

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: "-100vw" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <FaCreditCard size={23} />
            <span className="text-lg font-semibold">Informations Crédit</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: "-100vw" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <motion.span className="font-medium">Référence :</motion.span>{" "}
          <span>{Credit?.reference}</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
          <motion.div
            initial={{ opacity: 0, x: "-100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <label className="font-medium block">Montant (MRU) :</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={montant}
              onChange={(e) => setMontant(Number(e.target.value))}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: "-100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <label className="font-medium block">Durée (mois) :</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: "100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <label className="font-medium block">Status :</label>
            <input
              type="text"
              disabled
              className="w-full p-2 border rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm ">
          <motion.div
            initial={{ opacity: 0, x: "-100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
             <label>
          <span className="font-bold text-base">Type Crédit</span> {" "}<span style={{ color: 'red' }}>*</span>
          <Select 
       
          value={typeCredit}
            options={creditOptions}
          className="w-full h-[42px]"
          onChange={onchangeSelectType}
          placeholder="Type Crédit"
          />
        </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: "100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
          <label>
          <span className="text-base font-bold">Nature de Crédit</span> {" "}<span style={{ color: 'red' }}>*</span>
         <Select 
         value={nature}
  options={[
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
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Credit?.avis && (
            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <label className="font-medium block">Avis :</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={avis}
                onChange={(e) => setAvis(e.target.value)}
              />
            </motion.div>
          )}

          {Credit?.memo && (
            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <label className="font-medium block">Mémo :</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </motion.div>
          )}
        </div>
        <hr />
      </div>

      <div className="space-y-4">
        <motion.div
          className="flex items-center space-x-2 text-gray-700"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <FaFileImport size={23} />
          <span className="text-lg font-semibold">
            Informations sur les Importations
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-900">
          {docsNormaux?.map((fileObj, idx) => (
            <motion.div
              initial={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              transition={{ duration: 0.4, delay: 0.3 * idx }}
            >
              <span>{fileObj.type_document}</span>
              <div
                key={idx}
                title={fileObj.fichier}
                className="flex items-center gap-2 shadow p-3 rounded-lg bg-white mt-3"
              >
                <div className="w-1/6 flex justify-center text-xl ">
                  {getFileIcon(fileObj.fichier)}
                </div>

                <div className="w-4/6 truncate">
                  {fileObj.fichier.split("/").pop()}
                </div>

                <div className="w-1/6 text-right">
                  <Dropdown
                    menu={{
                      items: generateItems(fileObj.fichier, fileObj?.id),
                    }}
                  >
                    <div className="cursor-pointer">
                      <DotIcon />
                    </div>
                  </Dropdown>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <FileUploadComponent
          documentsExistants={Credit?.documents}
          client={{ CLIENT: Credit?.client?.client_code! }}
          type={"particulier"}
          handleFileChange={handleFileChange}
        />
      </div>

      <div className="grid  grid-cols-2 gap-3">
        <Button
          className="secondary-button !h-[44px]"
          onClick={closeSecondModal}
        >
          Annuler
        </Button>
        <Button
          className="auth-button !h-[44px]"
          onClick={ShowPopupConfirmDetails}
        >
          Suivant
        </Button>
      </div>
      <Modal
        className="rounded-lg"
        destroyOnClose={true}
        onCancel={CancelModalDelete}
        open={afficherDocument?.open}
        footer={null}
        width={375}
        closeIcon={false}
          maskClosable={false}
          
      >
        <div className="flex flex-col items-center space-y-3 ">
          <div className="flex items-center justify-center space-x-3">
            <h1 className="text-xl font-bold text-gray-800">
              Confirmation Suppression
            </h1>

            <BiErrorCircle size={32} className="text-red-500" />
          </div>
          <p className=" my-2 text-[15px] text-center">
            Êtes-vous sûr de vouloir supprimer ce document ?
          </p>
          <div className="flex items-center justify-end gap-x-2">
            <Button
              className="w-[143px] h-[50.6px]   mt-2 secondary-button"
              onClick={CancelModalDelete}
            >
              No, Annuler
            </Button>
            <Button
              className="w-[153.8px] h-[50.6px] mt-2 primary-button !bg-red-500"
              loading={isPendingDelete}
              onClick={handeSupprimerDocument}
            >
              Oui, Supprimer
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        className="rounded-lg"
        destroyOnClose={true}
        onCancel={CancelPopupConfirmDetails}
        open={openPopupConfirmDetails.open}
        footer={null}
        width={1200}
        closeIcon={false}
          maskClosable={false}
      >
        <RemonterStep2
          closeSecondModal={CancelPopupConfirmDetails}
          ligne={openPopupConfirmDetails.ligne!}
          credit={credit}
          oncloseFirstModal={closeSecondModal}
        />
      </Modal>
    </div>
  );
};

export default RemonterANouveau;
