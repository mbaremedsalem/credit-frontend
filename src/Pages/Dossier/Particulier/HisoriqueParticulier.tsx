import { MdCheckCircle, MdCancel } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { useGetHistoriqueLigneCredit } from "../../../Services/Demandes/useGetHistorique";
import { IoMdCreate } from "react-icons/io";
import { SiProgress } from "react-icons/si";
import { GrValidate } from "react-icons/gr";
import { Button, Tag } from "antd";
import { motion } from "framer-motion";

type props = {
  credit: number | string;
  onClose: () => void;
};

const HistoriqueParticulier = ({ credit, onClose }: props) => {
  const listVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const { data: HistoriqueData } = useGetHistoriqueLigneCredit(credit);

function isMourabahaType(type:string) {
    return ["CRDT CT- MOURABAHA", "CRDT MT- MOURABAHA", "CRDT LT- MOURABAHA"].includes(type);
}

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
      <div className="flex items-center space-x-3 mb-6 justify-center">
        <RiFolderHistoryFill size={30} />
        <h1 className="text-2xl font-bold text-gray-800">Historique Crédit</h1>
      </div>
      <div className="flex items-center space-x-3 mb-2 justify-center">
        <h1 className="text-lg font-bold text-gray-800">Statut actuel : </h1>
        <Tag
          color={
            HistoriqueData?.credit?.status === "EN_COURS"
              ? "geekblue"
              : HistoriqueData?.credit?.status === "VALIDÉ"
              ? "green"
              : "red"
          }
          key={status}
        >
          {HistoriqueData?.credit?.status === "EN_COURS"
            ? "En Cours"
            : HistoriqueData?.credit?.status}
        </Tag>
      </div>
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
            : status === "Validé"
            ? "border-green-500"
            : ""
        }
        ${
          status === "Créé"
            ? "text-blue-700"
            : status === "Rejeté"
            ? "text-red-700"
            : status === "Validé"
            ? "text-green-700"
            : ""
        }
         text-${
           status === "Créé"
             ? "blue"
             : status === "Rejeté"
             ? "red"
             : status === "Validé"
             ? "green"
             : ""
         }-700
        p-4 mb-4 flex items-center space-x-1 font-bold
      `}
          >
            {Icon}
            <span>
              {credit?.poste === "Chargé de clientèle"
                ? credit.status === "Validé"
                  ? "Rémonter"
                  : status
                : status}
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
            </span>
            <span>
              {credit?.status === "Créé"
                ? formatDate(credit?.date_creation)
                : credit.status === "Validé"
                ? formatDate(credit?.date_validation)
                : formatDate(credit?.date_rejet)}
            </span>
          </motion.div>
        );
      })}

      {HistoriqueData?.credit.status === "EN_COURS" && (
        <motion.div
          initial={{ opacity: 0, x: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mb-4 flex items-center space-x-1"
        >
          <SiProgress size={20} />
          <span>
            {/* {UserData?.post === "Chargé de clientèle"
              ? "de remontation"
              : "de la décision"}
            {UserData
              ? ` de ${
                  UserData?.post === "Directeur Risque"
                    ? "Commite (" + UserData?.post + ")"
                    : UserData?.post
                }, ${UserData.nom?.toUpperCase()} ${UserData.prenom?.toUpperCase()}`
              : null} */}
            {HistoriqueData.credit.points_valides >= 2 &&
            HistoriqueData.credit.points_valides < 48
              ? "En attente de remontation de"
              : ""}{" "}
            {HistoriqueData.credit.points_valides === 2
              ? // ? "Cheff Agence"
                "Chef agence central"
               : HistoriqueData.credit.points_valides === 6 && !isMourabahaType(HistoriqueData?.credit?.type_credit)
              //  : HistoriqueData.credit.points_valides === 6
              ? "Chef de département commercial"
              : HistoriqueData.credit.points_valides === 6 && isMourabahaType(HistoriqueData?.credit?.type_credit)
              ? "Directeur de département Islamique"
              : HistoriqueData.credit.points_valides === 12
              ? "L'Analyse de risque"
              : HistoriqueData.credit.points_valides === 24
              ? "Directeur Risque"
              : HistoriqueData.credit.points_valides === 48
              ? "En attente de l'importation du tableau d'amortissement par le chargé de clientèle"
              : HistoriqueData.credit.points_valides === 50
              ? "En attente de validation par Directeur Engagement"
              : "En attente de modification de Chargé de clientèle"}
          </span>
        </motion.div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🧾 Historique en Details
        </h3>
        <motion.ol
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="relative border-l border-gray-300 ml-4 space-y-6"
        >
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
              statutColor = "text-gray-500";
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
                className="ml-4"
                initial={{ opacity: 0, x: "-100vw" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
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
                      <span className={statutColor}>
                        Statut :{" "}
                        {validateur.post === "Chargé de clientèle"
                          ? status === "Validé"
                            ? "Rémonter"
                            : status
                          : status}
                      </span>
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
                    <p
                      className={`text-sm text-gray-500 ${
                        status === "Rejeté" ? "text-red-500" : ""
                      }`}
                    >
                      {status === "Rejeté" ? "Motif" : "Avis"} :{" "}
                      <span>{motiv}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {memo && <span>Memo : {memo}</span>}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
          {HistoriqueData?.credit.status === "REJETÉ" && (
            <li className="ml-4">
              <div className="flex items-start space-x-3">
                <span className="mt-1">
                  <MdCancel size={24} className="text-red-500" />
                </span>
                <div>
                  <p className="text-sm text-gray-800">
                    <strong></strong>
                  </p>
                  <p className="text-sm">
                    <span className="text-red-400">Statut : REJETÉ</span>
                  </p>
                  <p className="text-sm text-red-400">
                    Date :{" "}
                    <span>
                      {formatDate(HistoriqueData?.credit?.date_rejet)}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-red-400">
                      Motif : {HistoriqueData?.credit?.motif_rejet}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          )}
        </motion.ol>
        <div>
          <Button
            onClick={onClose}
            className="w-full auth-button mt-3 h-[41px]"
          >
            ok
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueParticulier;
