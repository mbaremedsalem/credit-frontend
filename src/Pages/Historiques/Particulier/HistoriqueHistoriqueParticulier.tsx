import { MdCheckCircle, MdCancel } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { useGetHistoriqueLigneCredit } from "../../../Services/Demandes/useGetHistorique";
import { IoMdCreate } from "react-icons/io";
import { GrValidate } from "react-icons/gr";
import { Button, Tag } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";

type props = {
  credit: number | string;
  onClose: () => void;
};

const HistoriqueHistoriqueParticulier = ({ credit, onClose }: props) => {
  const [showHistoriqueTest, setShowHistoriqueTest] = useState(true);
  const [showHistoriqueLigne, setShowHistoriqueLigne] = useState(true);

  const toggleHistoriqueTest = () => setShowHistoriqueTest((prev) => !prev);
  const toggleHistoriqueLigne = () => setShowHistoriqueLigne((prev) => !prev);

  const { data: HistoriqueData } = useGetHistoriqueLigneCredit(credit);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div
        className="flex items-center space-x-3 mb-6 justify-center cursor-pointer"
        onClick={toggleHistoriqueTest}
      >
        <RiFolderHistoryFill size={30} />
        <h1 className="text-2xl font-bold text-gray-800">Historique Crédit</h1>
        <span className="text-blue-500 text-sm">
          {showHistoriqueTest ? "▲" : "▼"}
        </span>
      </div>

      {showHistoriqueTest && (
        <div className="transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-3 mb-2 justify-center">
            <h1 className="text-lg font-bold text-gray-800">Status actuel :</h1>
            <Tag
              color={
                HistoriqueData?.credit?.status === "EN_COURS"
                  ? "geekblue"
                  : HistoriqueData?.credit?.status === "VALIDÉ"
                  ? "green"
                  : "red"
              }
            >
              {HistoriqueData?.credit?.status === "EN_COURS"
                ? "En Cours"
                : HistoriqueData?.credit?.status}
            </Tag>
          </div>


               <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-gray-700">Dossier N° :</span>
          <span className="font-semibold text-gray-900">
            {HistoriqueData?.credit?.id}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium text-gray-700">Client N° :</span>
          <span className="font-semibold text-gray-900">
            {HistoriqueData?.credit?.client?.client_code}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="font-medium text-gray-700">Client Nom :</span>
          <span className="font-semibold text-gray-900">
            {HistoriqueData?.credit?.client?.nom}{" "}
            {HistoriqueData?.credit?.client?.prenom}
          </span>
        </motion.div>
      </motion.div>

          {HistoriqueData?.validations?.map((credit, index) => {
            const { status } = credit || {};
            let Icon = null;

            if (status === "Créé") {
              Icon = <IoMdCreate size={20} />;
            } else if (status === "Validé") {
              Icon = <GrValidate size={20} />;
            } else if (status === "Rejeté") {
              Icon = <MdCancel size={24} className="text-red-500" />;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: "100vw" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                exit={{ opacity: 0, x: "-100vw" }}
                className={`
                ${
                  status === "Créé"
                    ? "bg-blue-100"
                    : status === "Rejeté"
                    ? "bg-red-100"
                    : "bg-green-100"
                }
                border-l-4
                ${
                  status === "Créé"
                    ? "border-blue-500"
                    : status === "Rejeté"
                    ? "border-red-500"
                    : "border-green-500"
                }
                ${
                  status === "Créé"
                    ? "text-blue-700"
                    : status === "Rejeté"
                    ? "text-red-700"
                    : "text-green-700"
                }
                p-4 mb-4 flex items-center space-x-1 font-bold
              `}
              >
                {Icon}
                <span>
                  {status}
                  {" Par "}
                  {credit.poste === "Chef agence central"
                    ? credit.poste + ","
                    : credit?.poste === "Directeur Risque"
                    ? `Commité (${credit?.validateur?.post})`
                    : credit?.validateur?.post}{" "}
                  <strong>
                    {credit?.validateur?.nom !== "COMMITE"
                      ? credit?.validateur?.nom
                      : ""}{" "}
                    {credit?.validateur?.prenom !== "COMMITE"
                      ? credit?.validateur?.prenom
                      : ""}
                  </strong>{" "}
                  le{" "}
                  {status === "Créé"
                    ? formatDate(credit?.date_creation)
                    : status === "Validé"
                    ? formatDate(credit?.date_validation)
                    : formatDate(credit?.date_rejet)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleHistoriqueLigne}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🧾 Historique en Details
        </h3>
        <span className="text-blue-500 text-sm">
          {showHistoriqueLigne ? "Cacher" : "Afficher"}
        </span>
      </div>

      {showHistoriqueLigne && (
        <ol className="relative border-l border-gray-300 ml-4 space-y-6 transition-all duration-300 ease-in-out">
          {HistoriqueData?.validations.map((step, index) => {
            const {
              validateur,
              date_validation,
              date_rejet,
              date_creation,
              status,
              memo,
              motiv,
            } = step;

            let Icon = null;
            let statutColor = "text-gray-500";
            if (status === "Créé") {
              Icon = <IoMdCreate size={24} className="text-black" />;
            } else if (status === "Validé") {
              Icon = <MdCheckCircle size={24} className="text-green-500" />;
              statutColor = "text-green-600";
            } else if (status === "Rejeté") {
              Icon = <MdCancel size={24} className="text-red-500" />;
              statutColor = "text-red-500";
            }

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="ml-4"
              >
                <div
                  className={`flex items-start space-x-3 ${
                    status === "Rejeté" ? "text-red-500" : ""
                  }`}
                >
                  <span className="mt-1">{Icon}</span>
                  <div>
                    <p className="text-sm text-gray-800">
                      <strong>
                        {validateur?.post === "Directeur Risque"
                          ? "Commité (" + validateur?.post + ")"
                          : validateur?.post}
                      </strong>{" "}
                      – {validateur?.nom} {validateur?.prenom}
                    </p>
                    <p className="text-sm">
                      <span className={statutColor}>Statut : {status}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Date :{" "}
                      <span>
                        {status === "Créé"
                          ? formatDate(date_creation)
                          : status === "Validé"
                          ? formatDate(date_validation)
                          : formatDate(date_rejet)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {status === "Rejeté" ? "Motif" : "Avis"} :{" "}
                      <span>{motiv}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Memo : <span>{memo}</span>
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}

      <div>
        <Button onClick={onClose} className="w-full auth-button mt-3 h-[41px]">
          OK
        </Button>
      </div>
    </div>
  );
};

export default HistoriqueHistoriqueParticulier;
