import { JSX, useState } from "react";
import { FaUserTie } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { BsThreeDotsVertical as DotIcon } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaCreditCard } from "react-icons/fa6";
import { Button, Dropdown, MenuProps, message, Modal } from "antd";
import { FaCloudDownloadAlt, FaFileImport } from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
} from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { LigneCredit, NewClient } from "../../../Services/type";
import { BaseUrl } from "../../../api/BaseUrl";
import {
  typUpdateCredit,
  useUpdateCredit,
} from "../../../Services/Demandes/useUpdateCredit";
import { GiConfirmed } from "react-icons/gi";
import AuthService from "../../../Auth-Services/AuthService";

type CreditInfo = {
  montant: number;
  duree: number;
  memo: string;
  avis: string;
  type_credit: string;
  nature: string;
  fichiers: {
    file: File;
    type_document: string;
    previewUrl?: string;
  }[];
};
type props = {
  client?: NewClient;
  credit?: CreditInfo;
  ligne: LigneCredit;
  closeSecondModal?: () => void;
  closeFirstModal?: () => void;
  oncloseFirstModal?: () => void;
};
export type PopconfirmTypeDetails = {
  ligne?: LigneCredit | null;
  open: boolean;
};
const RemonterStep2 = ({
  ligne,
  closeSecondModal,
  credit,
  oncloseFirstModal,
}: props) => {
  const fullName = AuthService.getFullNameUserConnect();
  const [isExpandedAvis, setIsExpandedAvis] = useState(false);
  const [isExpandedMemo, setIsExpandedMemo] = useState(false);

  const post = AuthService.getPostUserConnect();

  const handleToggleAvis = () => setIsExpandedAvis(!isExpandedAvis);
  const handleToggleMemo = () => setIsExpandedMemo(!isExpandedMemo);

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };
  const [openModal, setOpenModal] = useState(false);
  const afficherModal = () => {
    setOpenModal(true);
  };
  const hideModal = () => {
    setOpenModal(false);
  };
  const { mutate: UpdateCredit, isPending } = useUpdateCredit();

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
  const formatMontant = (montant: number) => {
    if (typeof montant !== "number") return montant;
    return montant.toLocaleString("fr-FR").replace(/\s/g, ".");
  };

  const showDocument = (file: string | File) => {
    const url =
      typeof file === "string"
        ? `${BaseUrl}${file}`
        : URL.createObjectURL(file);
    window.open(url, "_blank");
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

  const generateItems = (file: string | File): MenuProps["items"] => [
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
  ];

  const handleUpdateCredit = () => {
    const params: typUpdateCredit = {
      avis: credit?.avis!,
      duree: credit?.duree!,
      id: ligne.id,
      memo: credit?.memo!,
      montant: credit?.montant!,
      type_credit: credit?.type_credit!,
      fichiers: credit?.fichiers!,
      nature_credit: credit?.nature!,
    };
    UpdateCredit(params, {
      onSuccess: () => {
        hideModal(),
          closeSecondModal!(),
          oncloseFirstModal!(),
          // setTimeout(() => {
            message.success("credit remonte avec success !");
          // }, 1000);
      },
    });
  };



  const docsRisque = ligne?.documents
    ? ligne?.documents?.filter(
        (doc) =>
          doc.createur?.post === "Analyse de Risque" ||
          doc.createur?.post === "Directeur Risque"
      )
    : [];

  // const docsNormaux = ligne?.documents?.filter(
  //   (doc) =>
  //     doc.createur?.post !== "Analyse de Risque" &&
  //     doc.createur?.post !== "Directeur Risque"
  // );
  const docsNormaux = ligne?.documents
    ? ligne?.documents?.filter(
        (doc) =>
          doc.createur?.post !== "Analyse de Risque" &&
          doc.createur?.post !== "Directeur Risque" &&
          doc.type_document !== "analyse" &&
          doc.type_document !== "amortissement" &&
          doc.type_document !== "mourabaha"
      )
    : [];
  return (
    <div className="w-full  mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-800">
          Détails des modifications
        </h1>
        <TbListDetails size={28} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaUserTie size={23} />
          <span className="text-lg font-semibold">Informations Client</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
          <div>
            <span className="font-medium">Client :</span>{" "}
            {ligne?.client?.client_code}
          </div>
          <div>
            <span className="font-medium">Nom :</span> {ligne?.client?.nom}
          </div>
          <div>
            <span className="font-medium">Prenom :</span>{" "}
            {ligne?.client?.prenom}
          </div>
          <div>
            <span className="font-medium">Telephone :</span>{" "}
            {ligne?.client?.tel}
          </div>
          <div>
            <span className="font-medium">Date Naissance :</span>{" "}
            {ligne?.client?.date_naissance
              ? ligne?.client?.date_naissance.slice(0, 10)
              : ""}
          </div>
          <div>
            <span className="font-medium">nni :</span> {ligne?.client?.nni}
          </div>
        </div>
      </div>

      <hr />

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaCreditCard size={23} />
          <span className="text-lg font-semibold">Informations Crédit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
          <div>
            <span className="font-medium">Montant :</span>{" "}
            {formatMontant(Number(credit?.montant))} MRU
          </div>
          <div>
            <span className="font-medium">Durée :</span> {credit?.duree} mois
          </div>
          <div>
            <span className="font-medium">Status :</span>{" "}
            {ligne?.status === "EN_COURS" ? "En Cours" : ligne?.status}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {credit?.avis && (
            <div>
              <span className="font-medium">Avis :</span>
              <p className="text-gray-700">
                {isExpandedAvis
                  ? credit?.avis
                  : truncateText(credit?.avis!, 150)}
                <button
                  className="text-blue-500 ml-2 inline-flex items-center"
                  onClick={handleToggleAvis}
                >
                  {isExpandedAvis && credit?.avis.length! >= 250 ? (
                    <>
                      Voir moins
                      <ChevronUpIcon className="h-4 w-4 ml-1" />
                    </>
                  ) : credit?.avis.length! >= 350 ? (
                    <>
                      Voir plus
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </>
                  ) : null}
                </button>
              </p>
            </div>
          )}

          {credit?.memo && (
            <div>
              <span className="font-medium">Mémo :</span>
              <p className="text-gray-700">
                {isExpandedMemo
                  ? credit?.memo
                  : truncateText(credit?.memo, 150)}
                <button
                  className="text-blue-500 ml-2 inline-flex items-center"
                  onClick={handleToggleMemo}
                >
                  {isExpandedMemo && credit?.memo.length >= 250 ? (
                    <>
                      Voir moins
                      <ChevronUpIcon className="h-4 w-4 ml-1" />
                    </>
                  ) : credit?.memo.length! >= 350 ? (
                    <>
                      Voir plus
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </>
                  ) : null}
                </button>
              </p>
            </div>
          )}

          <div>
            <span className="font-medium">Reference :</span>{" "}
            <span>{ligne?.reference}22</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
          <div>
            <span className="font-medium">Type Crédit :</span>{" "}
            {credit?.type_credit}
          </div>
          <div>
            <span className="font-medium">Nature Crédit :</span>{" "}
            {credit?.nature}
          </div>
        </div>
        <hr />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaFileImport size={23} />
          <span className="text-lg font-semibold">
            Informations sur les Importations
          </span>
        </div>

        {/* - -------------------------------------  importations exist deja ------------------------------------------- */}

        <div>
          <h1 className="text-center font-bold text-lg">
            {" "}
            Anciennes importations{" "}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-sm text-gray-900">
          {docsNormaux.map((fileObj, idx) => (
            <motion.div
              initial={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              transition={{ duration: 0.4, delay: 0.3 * idx }}
              key={fileObj.id}
              className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl text-blue-600">
                  {getFileIcon(fileObj.fichier)}
                </div>
                <div className="flex-1 truncate font-medium text-gray-800 text-[13px]">
                  {fileObj.fichier.split("/").pop()}
                </div>
                <Dropdown menu={{ items: generateItems(fileObj.fichier) }}>
                  <div className="cursor-pointer">
                    <DotIcon />
                  </div>
                </Dropdown>
              </div>

              <div className="text-xs text-gray-500 pl-1 space-y-1">
                <div>
                  <span className="font-medium text-gray-600">Type : </span>
                  {fileObj.type_document}
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Ajouté le :{" "}
                  </span>
                  {new Date(fileObj.date_creation).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Créé par : </span>
                  {fileObj.createur.post} {fileObj.createur.prenom}{" "}
                  {fileObj.createur.nom}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <hr />

        <div>
          <h1 className="text-center font-bold text-lg">
            Nouvelles importations{" "}
          </h1>
        </div>

        {/* --------------------------------------------------    nouveau importations   ----------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-900">
          {credit?.fichiers?.map((fileObj, idx) => (
            <motion.div
              initial={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: idx % 2 !== 0 ? "100vw" : "-100vw" }}
              transition={{ duration: 0.5, delay: 0.4 * idx }}
            >
              <span className="">{fileObj?.type_document}</span>
              <div
                key={idx}
                title={fileObj.file.name}
                className="flex items-center gap-2 shadow p-3 mt-3 rounded-lg bg-white"
              >
                <div className="w-1/6 flex justify-center text-xl ">
                  {getFileIcon(fileObj.file.name)}
                </div>

                <div className="w-4/6 truncate">{fileObj.file.name}</div>

                <div className="w-1/6 text-right">
                  <a
                    href={fileObj.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <IoEyeOutline size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {(post === "Analyse de Risque" ||
        post === "Directeur Risque" ||
        post === "Directeur commercial" ||
        post === "Chef de département commercial" ||
        post === "Directeur de département Islamique" ||

        post === "Directeur d'Audit" ||
        post === "Directeur juridique" ||
           post === "Directeur Général" ||
        post === "Directeur Engagement") && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <FaFileImport size={23} />
            <span className="text-lg font-semibold">
              Informations sur les Importations de Risque
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-sm text-gray-900">
            {docsRisque.map((fileObj, idx) => (
              <motion.div
                initial={{ opacity: 0, y: "100vh" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 * idx }}
                key={fileObj.id}
                className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-blue-600">
                    {getFileIcon(fileObj.fichier)}
                  </div>
                  <div className="flex-1 truncate font-medium text-gray-800">
                    {fileObj.fichier.split("/").pop()}
                  </div>
                  <Dropdown menu={{ items: generateItems(fileObj.fichier) }}>
                    <div className="cursor-pointer">
                      <DotIcon />
                    </div>
                  </Dropdown>
                </div>

                <div className="text-xs text-gray-500 pl-1 space-y-1">
                  <div>
                    <span className="font-medium text-gray-600">Type : </span>
                    {fileObj.type_document}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Ajouté le :{" "}
                    </span>
                    {new Date(fileObj.date_creation).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Créé par :{" "}
                    </span>
                    {fileObj.createur.post} {fileObj.createur.prenom}{" "}
                    {fileObj.createur.nom}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <div className="grid  grid-cols-2 gap-3">
        <Button
          className="secondary-button !h-[44px]"
          onClick={closeSecondModal}
        >
          Annuler
        </Button>
        <Button className="auth-button !h-[44px]" onClick={afficherModal}>
          Remonter
        </Button>
      </div>
      <Modal
        className="rounded-lg"
        destroyOnClose={true}
        onCancel={hideModal}
        open={openModal}
        footer={null}
        width={375}
        closeIcon={false}
        maskClosable={false}
      >
        <div className="flex flex-col items-center space-y-3 ">
          <div className="flex items-center justify-center space-x-3">
            <h1 className="text-xl font-bold text-gray-800">Confirmation</h1>
            <GiConfirmed size={32} className="text-green-500" />
          </div>
          <p className=" my-2 text-[15px] text-center">
            {fullName}, êtes-vous sûr de remonter cela à Nouvau ? Si oui, sachez
            qu'on ne pourra plus le modifier après la remontée.
          </p>
          <div className="w-full"></div>
          <div className="flex items-center justify-end gap-x-2">
            <Button
              className="w-[143px] h-[50.6px]   mt-2 secondary-button"
              onClick={hideModal}
            >
              No, Annuler
            </Button>
            <Button
              className="w-[153.8px] h-[50.6px] mt-2 primary-button"
              loading={isPending}
              onClick={handleUpdateCredit}
            >
              Oui, Remonter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RemonterStep2;
