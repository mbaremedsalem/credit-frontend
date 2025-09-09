import { JSX, useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { FaCreditCard } from "react-icons/fa6";
import { Button, Modal } from "antd";
import { FaFileImport } from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
} from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CLientT } from "../../../Services/type";
import { getUserInfo } from "../../../Services/Auth/useGetUserInfo";
import { useAddligne } from "../../../Services/Demandes/useAddLigne";
import AuthService from "../../../Auth-Services/AuthService";
import { AddLigne } from "../../../Services/types/Demande";
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
  client?: CLientT;
  credit?: CreditInfo;
  closeSecondModal?: () => void;
  closeFirstModal?: () => void;
};
const AjoutCreditParticulierStep2 = ({
  client,
  closeFirstModal,
  closeSecondModal,
  credit,
}: props) => {
  const [isExpandedAvis, setIsExpandedAvis] = useState(false);
  const [isExpandedMemo, setIsExpandedMemo] = useState(false);
  const { data: userInfo } = getUserInfo();

  const handleToggleAvis = () => setIsExpandedAvis(!isExpandedAvis);
  const handleToggleMemo = () => setIsExpandedMemo(!isExpandedMemo);

  const { mutate: AddLigne, isPending } = useAddligne();
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };
  const [Show, setShow] = useState(false);
  const handlecancel = () => {
    setShow(false);
  };
  const showModal = () => {
    setShow(true);
  };
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

  const idUserConnect = AuthService.getIDUserConnect();

  const onSubmit = () => {
    const formatDate = (dateStr?: string) =>
      dateStr ? dateStr.slice(0, 10) : "";

    const params: AddLigne = {
      AGENCE: client?.AGENCE ?? "",
      avis: credit?.avis ?? "",
      CLIENT: client?.CLIENT ?? "",
      IDENTIFIENT: client?.IDENTIFIENT ?? "",
      DATNAIS: client?.DATNAIS ? formatDate(client?.DATNAIS) : null!,
      PAYSNAIS: client?.PAYSNAIS ?? "",
      NNI: client?.NNI ?? "",
      duree: credit?.duree ?? 0,
      memo: credit?.memo ?? "",
      montant: credit?.montant ?? 0,
      NOM: client?.NOM ?? "",
      PRENOM: client?.PRENOM ?? "",
      SEXE: client?.SEXE ?? "",
      TEL: client?.TEL ?? "",
      TYPE_CLIENT: client?.TYPE_CLIENT ?? "",
      TYPE_DOCUMENT: client?.TYPE_DOCUMENT ?? "",
      fichiers: credit?.fichiers ?? [],
      user_id: Number(idUserConnect),
      type_credit: credit?.type_credit ?? "",
      nature_credit: credit?.nature ?? "",
    };

    AddLigne(params, {
      onSuccess: () => {
        closeFirstModal?.();
      },
    });
  };

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}-${pad(
      date.getMonth() + 1
    )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
      date.getMinutes()
    )}:${pad(date.getSeconds())}`;
  };
  return (
    <div className="w-full  mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-800">Details</h1>
        <TbListDetails size={28} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaUserTie size={23} />
          <span className="text-lg font-semibold">Informations Client</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
          <div>
            <span className="font-medium">Client :</span> {client?.CLIENT}
          </div>
          <div>
            <span className="font-medium">Nom :</span> {client?.NOM}
          </div>
          <div>
            <span className="font-medium">Prenom :</span> {client?.PRENOM}
          </div>
          {/* <div>
            <span className="font-medium">Référence Dossier :</span> 34
          </div> */}
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
            {credit?.montant.toLocaleString()} MRU
          </div>
          <div>
            <span className="font-medium">Durée :</span> {credit?.duree} mois
          </div>
          <div>
            <span className="font-medium">Type de Crédit :</span>{" "}
            {credit?.type_credit}
          </div>
        </div>
        <div>
          <span className="font-medium">Natrue de Crédit :</span>{" "}
          {credit?.nature}
        </div>
        {/* Avis */}
        {credit?.avis && (
          <div>
            <span className="font-medium">Avis :</span>
            <p className="text-gray-700">
              {isExpandedAvis ? credit.avis : truncateText(credit.avis, 150)}
              <button
                className="text-blue-500 ml-2 inline-flex items-center"
                onClick={handleToggleAvis}
              >
                {isExpandedAvis && credit.avis.length >= 250 ? (
                  <>
                    Voir moins
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  </>
                ) : credit.avis.length >= 350 ? (
                  <>
                    Voir plus
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </>
                ) : null}
              </button>
            </p>
          </div>
        )}

        {/* Mémo */}
        {credit?.memo && (
          <div>
            <span className="font-medium">Mémo :</span>
            <p className="text-gray-700">
              {isExpandedMemo ? credit.memo : truncateText(credit.memo, 150)}
              <button
                className="text-blue-500 ml-2 inline-flex items-center"
                onClick={handleToggleMemo}
              >
                {isExpandedMemo && credit.memo.length >= 250 ? (
                  <>
                    Voir moins
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  </>
                ) : credit.memo.length >= 350 ? (
                  <>
                    Voir plus
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </>
                ) : null}
              </button>
            </p>
          </div>
        )}

        <hr />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaFileImport size={23} />
          <span className="text-lg font-semibold">
            Informations sur les Importations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-900">
          {credit?.fichiers?.map((fileObj, idx) => (
            <div>
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
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-white rounded-md shadow-md">
        <span>Crée Par </span>
        <span>
          {userInfo?.nom} {userInfo?.prenom}
        </span>
        <div>à la date du : {formatDate(now)}</div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
        <Button
          className="secondary-button !h-[44px]"
          onClick={closeSecondModal}
        >
          Annuler
        </Button>
        <Button className="auth-button !h-[44px]" onClick={showModal}>
          Valider
        </Button>
      </div>
      <Modal
        className="rounded-lg"
        destroyOnClose={true}
        onCancel={handlecancel}
        open={Show}
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
          {/* <p className="font-bold text-lg text-center">Confirm Credit </p> */}
          <p className=" my-2 text-[15px] text-center">
            Êtes-vous sûr de vouloir confirmer ce crédit ?
          </p>
          <div className="flex items-center justify-end gap-x-2">
            <Button
              className="w-[143px] h-[50.6px]   mt-2 secondary-button"
              onClick={handlecancel}
            >
              No, Annuler
            </Button>
            <Button
              className="w-[153.8px] h-[50.6px] mt-2 primary-button"
              loading={isPending}
              onClick={onSubmit}
            >
              Oui, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AjoutCreditParticulierStep2;
