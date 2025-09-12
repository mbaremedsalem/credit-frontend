import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  message,
  Modal,
  Select,
  Table,
  Tag,
  Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { HiOutlineInbox } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { LuCircleUserRound } from "react-icons/lu";
import { ColumnsType } from "antd/es/table";
import { GrValidate } from "react-icons/gr";
import { MdCancel } from "react-icons/md";
const { RangePicker } = DatePicker;
import { BsThreeDotsVertical as DotIcon } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { RiFileHistoryFill } from "react-icons/ri";

import { CLientT, LigneCredit } from "../../../Services/type";
import { useGetLingeCredit } from "../../../Services/Demandes/useGetLigneCredit";
import DetailsLigne from "./DetailsPaticulier";
import HistoriqueLigne from "./HisoriqueParticulier";
import { GiConfirmed } from "react-icons/gi";
import AuthService from "../../../Auth-Services/AuthService";
import {
  useValiderLigne,
  ValiderLigne,
} from "../../../Services/Demandes/useValiderLigne";
import {
  RejeterLigne,
  useRejeterLigne,
} from "../../../Services/Demandes/useRejeterLigne";
import { enqueueSnackbar } from "notistack";
import SpinnerLoader from "../../../Ui/Spinner";
import RemonterNouveau from "./RemonterNouveau";
import {
  FaArrowDown,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaUpload,
} from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

export type PopconfirmType = {
  client?: CLientT | null;
  open: boolean;
};
type UploadedFile = {
  file: File;
  previewUrl: string;
};
export type PopconfirmTypeDetails = {
  ligne?: LigneCredit | null;
  open: boolean;
};
function ParticulierCreditView() {
  const role = AuthService.getPostUserConnect();

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadedFileMourabaha, setUploadedFileMourabaha] =
    useState<UploadedFile | null>(null);
  const [selectAutre, setSelectAutre] = useState("");
  const [memoType, setmemoType] = useState("");
  const [avis, setAvis] = useState("");
  const [cherche, setcherche] = useState("");
  const [valueChercher, setValuecher] = useState("");
  const [loading, setLoading] = useState(false);

  const [openPopupConfirmDetails, setopenPopupConfirmDetails] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });
  const [openPopupConfirmHistorique, setopenPopupConfirmHistorique] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });
  const [openPopupConfirmValider, setopenPopupConfirmValider] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });
  const [openPopupRemonterAnouveau, setopenPopupRemonterAnouveau] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });
  const [openPopupConfirmRejeter, setopenPopupConfirmRejeter] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });

  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [textContent, setTextContent] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewVisibleMourbaha, setPreviewVisibleMourabaha] =
    useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };
  const handlePreviewMourabaha = () => {
    setPreviewVisibleMourabaha(true);
  };

  const handleCancelPreviewMourabaha = () => {
    setPreviewVisibleMourabaha(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FaFilePdf className="file-icon pdf" />;
    if (fileType.includes("image"))
      return <FaFileImage className="file-icon image" />;
    if (fileType.includes("sheet") || fileType.includes("excel"))
      return <FaFileExcel className="file-icon excel" />;
    if (fileType.includes("word"))
      return <FaFileWord className="file-icon word" />;
    return <FaFileAlt className="file-icon generic" />;
  };

  useEffect(() => {
    return () => {
      if (uploadedFile?.previewUrl) {
        URL.revokeObjectURL(uploadedFile.previewUrl);
      }
    };
  }, [uploadedFile]);

  useEffect(() => {
    return () => {
      if (uploadedFileMourabaha?.previewUrl) {
        URL.revokeObjectURL(uploadedFileMourabaha.previewUrl);
      }
    };
  }, [uploadedFileMourabaha]);
  const [filtreStatus, setFiltreStatus] = useState<string>("all");

  useEffect(() => {
    if (cherche.trim() === "") {
      setValuecher("");
    }
  }, [cherche]);
  useEffect(() => {
    setFiltreStatus("a_decider");
  }, [dates]);

  // function isMourabahaType(type:string) {
  //     return ["CRDT CT- MOURABAHA", "CRDT MT- MOURABAHA", "CRDT LT- MOURABAHA"].includes(type);
  // }
  const doitPrendreDecision = (ligne: LigneCredit): boolean => {
    const dossierPoints = ligne.points_valides ?? 0;
    const dossierStatus = ligne.status;
    const typeCredit = ligne.type_credit;

    console.log("doit prend : ", typeCredit);

    if (dossierStatus !== "EN_COURS") return false;

    if (role === "Chargé de clientèle" && dossierPoints === 0) return true;
    if (role === "Chargé de clientèle" && dossierPoints === 48) return true;
    if (role === "Chef agence central" && dossierPoints === 2) return true;
    // if (
    //   role === "Chef de département commercial" &&
    //   dossierPoints === 6 && !isMourabahaType(typeCredit))
    //   return true;
    if (role === "Chef de département commercial" && dossierPoints === 6)
      return true;

    if (role === "Analyse de Risque" && dossierPoints === 12) return true;
    if (role === "Directeur Risque" && dossierPoints === 24) return true;
    if (role === "Directeur Engagement" && dossierPoints === 50) return true;

    // if (
    //   role === "Directeur de département Islamique" &&
    //   dossierPoints === 6 &&
    //   isMourabahaType(typeCredit))
    //   return true;

    return false;
  };

  const filtrerLignesCredit = (lignes: LigneCredit[] | undefined) => {
    if (!lignes) return [];

    switch (filtreStatus) {
      case "all":
        return lignes;
      case "a_decider":
        return lignes.filter(doitPrendreDecision);

      default:
        return lignes;
    }
  };
  const { data: LigneDaTa, isPending } = useGetLingeCredit(
    valueChercher,
    dates[0]!,
    dates[1]!
  );
  // const {data:DateDocument, isPending:isPendingType} = useGetTypeDocument("particulier")

  // const PartiCiluerDocument = DateDocument?.

  //  const PartiCiluerDocument =
  //   DateDocument?.map((credit) => ({
  //     label: credit.nom, // Ce qui sera affiché
  //     value: credit.nom, // La valeur associée
  //   })) || [];

  const agenceConnect = AuthService.getAGENCEUserConnect();

  const isCommercial =
    role === "Chargé de clientèle" || role === "Chef agence central"
      ? LigneDaTa?.filter((agence) => agence.agence === agenceConnect)
      : LigneDaTa;

  const onlyEnattente = isCommercial?.filter(
    (ligne) => ligne.status === "EN_COURS"
  );

  const onlyPaticulier = onlyEnattente?.filter(
    (credit) => credit.type_dossier === "Particulier"
  );

  const lignesFiltrees = filtrerLignesCredit(onlyPaticulier);

  <span className="text-[13px] ">
    {lignesFiltrees.length} Dossiers Particuliers
    {filtreStatus !== "all" && ` (filtrés)`}
  </span>;

  const { mutate: ValiderLigne, isPending: isPendigValider } =
    useValiderLigne();
  const { mutate: rejeterligne, isPending: isPendigRejeter } =
    useRejeterLigne();

  const handleDownload = (fileData: UploadedFile | null) => {
    if (!fileData) return;

    const url = URL.createObjectURL(fileData.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileData.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (!file) {
      setUploadedFile(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedFile({ file, previewUrl });

    // Si c'est un fichier texte, on lit son contenu
    if (file.type.startsWith("text/") || file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setTextContent("");
    }
  };

  const handleFileChangeMourabeha = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (!file) {
      setUploadedFileMourabaha(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedFileMourabaha({ file, previewUrl });

    if (file.type.startsWith("text/") || file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setTextContent("");
    }
  };
  const post = AuthService.getPostUserConnect();
  const poit = AuthService.getPoitUserConnect();
  const idUserConnect = AuthService.getIDUserConnect();

  const { TextArea } = Input;

  const funcCLick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cherche) {
      return message.error("Entrez le numéro de client !");
    }
    setValuecher(cherche.trim());
  };

  const handleDateChange = (values: any, dateStrings: [string, string]) => {
    console.log(values);
    setDates(dateStrings);
  };

  const handlecancelDetails = () => {
    setopenPopupConfirmDetails({
      open: false,
      ligne: null,
    });
  };
  const handlecancelRemonterANouveau = () => {
    setopenPopupRemonterAnouveau({
      open: false,
      ligne: null,
    });
  };
  const handlecancelHistorique = () => {
    setopenPopupConfirmHistorique({
      open: false,
      ligne: null,
    });
  };
  const handlecancelValide = () => {
    setopenPopupConfirmValider({
      open: false,
      ligne: null,
    });
  };
  const handlecancelRejeter = () => {
    setopenPopupConfirmRejeter({
      open: false,
      ligne: null,
    });
  };
  const showModalDetails = (ligne: LigneCredit) => {
    setopenPopupConfirmDetails({ ligne: ligne, open: true });
  };
  const showModalHistorique = (ligne: LigneCredit) => {
    setopenPopupConfirmHistorique({ ligne: ligne, open: true });
  };
  const showModalValider = (ligne: LigneCredit) => {
    setopenPopupConfirmValider({ ligne: ligne, open: true });
  };

  const showModalRemonterAnouveau = (ligne: LigneCredit) => {
    setopenPopupRemonterAnouveau({ ligne: ligne, open: true });
  };
  const showModalRejeter = (ligne: LigneCredit) => {
    setopenPopupConfirmRejeter({ ligne: ligne, open: true });
  };

  const handleValiderLigne = () => {
    const errors = [];

    if (!memoType?.trim()) {
      errors.push("Le mémo est obligatoire");
    }

    if (!avis?.trim()) {
      errors.push("L'avis est obligatoire");
    }

    if (errors.length > 0) {
      return message.error(errors.join("\n"));
    }
    if (!uploadedFile && role === "Analyse de Risque") {
      return message.error("importer document risque");
    } else if (!uploadedFile && role === "Directeur Risque") {
      return message.error("importer pv");
    } else if (
      !uploadedFile &&
      role === "Chargé de clientèle" &&
      openPopupConfirmValider?.ligne?.points_valides! === 48
    ) {
      return message.error("importer tableau d'amortissement");
    } else if (
      !uploadedFileMourabaha &&
      role === "Chargé de clientèle" &&
      openPopupConfirmValider?.ligne?.points_valides! === 48 &&
      (openPopupConfirmValider.ligne?.type_credit === "CRDT CT- MOURABAHA" ||
        openPopupConfirmValider.ligne?.type_credit === "CRDT MT- MOURABAHA" ||
        openPopupConfirmValider.ligne?.type_credit === "CRDT LT- MOURABAHA")
    ) {
      return message.error("importer le document mourabaha");
    }
    const params: ValiderLigne = {
      id_credit: Number(openPopupConfirmValider?.ligne?.id),
      user_id: Number(idUserConnect)!,
      memo: memoType,
      motiv: avis,
      documents:
        role === "Chargé de clientèle" &&
        openPopupConfirmValider?.ligne?.points_valides! === 48 &&
        (openPopupConfirmValider.ligne?.type_credit === "CRDT CT- MOURABAHA" ||
          openPopupConfirmValider.ligne?.type_credit === "CRDT MT- MOURABAHA" ||
          openPopupConfirmValider.ligne?.type_credit === "CRDT LT- MOURABAHA")
          ? [uploadedFile?.file!, uploadedFileMourabaha?.file!]
          : uploadedFile?.file!,
    };

    ValiderLigne(params, {
      onSuccess: () => {
        setAvis("");
        setmemoType("");
        handlecancelValide();
        setUploadedFileMourabaha(null);
        setUploadedFile(null);
        setTextContent("");
      },
    });
  };

  //   const SelectMotiv = (value: string) => {
  //     setMotiv(value);
  //   };
  //  const selectDocument = (value: string) => {
  //     setSelectTypeDocument(value);
  //   };
  const handleRejeterLigne = () => {
    // if (!motiv) {
    //   return enqueueSnackbar("Veuillez Selectionner le motiv ! ", {
    //     variant: "error",
    //   });
    // }
    if (!selectAutre) {
      return message.error("Veuillez saisir le motif de rejet !");
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const params: RejeterLigne = {
        id_credit: Number(openPopupConfirmRejeter?.ligne?.id),
        user_id: Number(idUserConnect)!,
        // motif: motiv,
        // motif: motiv === "Autre" ? selectAutre : motiv,
        motif: selectAutre,
      };
      rejeterligne(params, {
        onSuccess: () => {
          // setMotiv("");
          handlecancelRejeter();
          setAvis("");
          setmemoType("");
          enqueueSnackbar("Status de dossier Modifier avec success !", {
            variant: "success",
          });
        },
      });
    }, 2000);
  };

  const columnsLigne: ColumnsType<LigneCredit> = [
    {
      title: "Numéro Client",
      dataIndex: ["client", "client_code"],
      key: "client_code",
    },
    {
      title: "Nom",
      dataIndex: ["client", "nom"],
      key: "nom",
    },
    {
      title: "Prénom",
      dataIndex: ["client", "prenom"],
      key: "prenom",
    },
    {
      title: "TEL",
      dataIndex: ["client", "tel"],
      key: "tel",
    },
    {
      title: "Ligne de Crédit (MRU)",
      key: "credit",
      render: (_, record) => {
        return (
          <span>
            {new Intl.NumberFormat("fr-FR").format(
              Number(record?.client?.credits?.[0]?.montant.toLocaleString())
            )}
          </span>
        );
      },
    },
    {
      title: "Durée (mois)",
      key: "duree",
      render: (_, record) => record.client.credits[0]?.duree ?? "-",
    },
    {
      title: "Type Crédit",
      key: "duree",
      render: (_, record) => record?.type_credit,
    },
    {
      title: "Date Creation",
      key: "prenom",
      render: (_, record) => {
        return (
          <div>
            {" "}
            {record?.date_demande
              ? record?.date_demande?.slice(0, 10)
              : ""}{" "}
            {record?.date_demande ? record?.date_demande?.slice(11, 19) : ""}
          </div>
        );
      },
    },
    {
      title: "Agence",

      key: "agence",
      render: (_, record) => {
        return (
          <div> {record?.agence === "00001" ? "Nouakchott" : "Nouadhibou"}</div>
        );
      },
    },

    {
      title: "Status Dossier",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let color = "";
        if (record.status === "VALIDÉ") color = "green";
        else if (record.status === "REJETÉ") color = "red";
        else color = "geekblue";
        return (
          <Tag color={color} key={status}>
            {record?.status === "EN_COURS"
              ? "EN COURS".toUpperCase()
              : record?.status}
          </Tag>
        );
      },
    },
    {
      title: "État de remontée",
      key: "etat_remontee",
      render: (_, record) => {
        if (role === "Chargé de clientèle") {
          return record.points_valides! > 0 && record.points_valides! < 48 ? (
            <Tag color="green">Déjà remonté</Tag>
          ) : record.points_valides! === 48 ? (
            <Tag color="orange">En attente de Table d'amortissement</Tag>
          ) : record.points_valides! > 48 ? (
            <Tag color="green">Déjà remonté</Tag>
          ) : (
            <Tag color="orange">En attente de remontée</Tag>
          );
        } else if (role === "Chef agence central") {
          return record?.points_valides! > 4 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
            </Tag>
          ) : record?.points_valides === 2 && record.status === "EN_COURS" ? (
            <Tag color="orange">En attente de votre décision</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 4 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        } else if (role === "Chef de département commercial") {
          console.log("ici thiam");

          return record?.points_valides! > 6 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
            </Tag>
          ) : // ) : record.points_valides === 6 && record.status === "EN_COURS" && !isMourabahaType(record?.type_credit!)? (
          record.points_valides === 6 && record.status === "EN_COURS" ? (
            <Tag color="orange">En attente de votre décision</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 6 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        }
        // else if (role === "Directeur de département Islamique") {

        //   console.log("type credit : ", record.type_credit!)
        //   return record?.points_valides! > 6 ? (
        //     <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
        //       {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
        //     </Tag>
        //   ) : record.points_valides === 6 && record.status === "EN_COURS" &&  isMourabahaType(record?.type_credit!)  ? (
        //   // ) : record.points_valides === 6 && record.status === "EN_COURS"  ? (
        //     <Tag color="orange">En attente de votre décision</Tag>
        //   ) : record.status === "REJETÉ" ? (
        //     <Tag color="red">Déjà Rejeté</Tag>
        //   ) : record?.points_valides! < 6 ? (
        //     <Tag color="yellow">En cours d'instruction</Tag>
        //   ) : (
        //     ""
        //   );
        // }
        else if (role === "Analyse de Risque") {
          return record?.points_valides! > 12 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
            </Tag>
          ) : record.points_valides === 12 && record.status === "EN_COURS" ? (
            <Tag color="orange">En attente de votre décision</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 12 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        } else if (role === "Directeur Risque") {
          return record?.points_valides! > 24 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
            </Tag>
          ) : record.points_valides === 24 ? (
            <Tag color="orange">En attente de décision du commite</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 24 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        } else if (role === "Directeur Engagement") {
          return record?.points_valides! > 48 ? (
            <Tag
              color={
                record.status === "REJETÉ"
                  ? "red"
                  : record.status === "EN_COURS"
                  ? "orange"
                  : "green"
              }
            >
              {record.status === "REJETÉ"
                ? "Déjà Rejeté"
                : record.status === "EN_COURS"
                ? "En attente de votre décision"
                : "remonté"}
            </Tag>
          ) : record.points_valides === 48 && record.status === "EN_COURS" ? (
            <Tag color="orange">En attente de Table d'amortissement</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 48 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        }
        return null;
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => {
        const connectedUser = {
          post: post,
          points: poit,
        };

        const dossierPoints = record?.points_valides ?? 0;
        const dossierStatus = record?.status;

        const items = [
          {
            label: (
              <div className="flex items-center justify-between space-x-3">
                <span>Voir Détails</span>
                <CgDetailsMore size={17} />
              </div>
            ),
            key: "1",
            onClick: () => showModalDetails(record),
          },
          {
            label: (
              <div className="flex items-center justify-between space-x-3">
                <span>Voir Historique</span>
                <RiFileHistoryFill size={17} />
              </div>
            ),
            key: "2",
            onClick: () => showModalHistorique(record),
          },
        ];

        if (
          dossierStatus === "EN_COURS" &&
          connectedUser.post !== "Chargé de clientèle"
        ) {
          if (
            connectedUser.post === "Chef agence central" &&
            dossierPoints === 2
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    {/* <span>Valider</span> */}
                    <span>Remonter</span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "3",
                onClick: () => showModalValider(record),
              },
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Réjeter</span>
                    <MdCancel color="red" size={17} />
                  </div>
                ),
                key: "4",
                onClick: () => showModalRejeter(record),
              }
            );
          }

          if (
            connectedUser.post === "Chef de département commercial" &&
            // dossierPoints === 6 && !isMourabahaType(record?.type_credit!)
            dossierPoints === 6
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Remonter</span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "5",
                onClick: () => showModalValider(record),
              },
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Réjeter</span>
                    <MdCancel color="red" size={17} />
                  </div>
                ),
                key: "6",
                onClick: () => showModalRejeter(record),
              }
            );
          }

          //  if (
          //   connectedUser.post === "Directeur de département Islamique" &&
          //   dossierPoints === 6 && isMourabahaType(record?.type_credit!)
          //   // dossierPoints === 6
          // ) {
          //   items.push(
          //     {
          //       label: (
          //         <div className="flex items-center justify-between space-x-3">
          //           <span>Remonter</span>
          //           <GrValidate color="green" size={17} />
          //         </div>
          //       ),
          //       key: "5",
          //       onClick: () => showModalValider(record),
          //     },
          //     {
          //       label: (
          //         <div className="flex items-center justify-between space-x-3">
          //           <span>Réjeter</span>
          //           <MdCancel color="red" size={17} />
          //         </div>
          //       ),
          //       key: "6",
          //       onClick: () => showModalRejeter(record),
          //     }
          //   );
          // }

          if (
            connectedUser.post === "Analyse de Risque" &&
            dossierPoints === 12
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Remonter</span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "7",
                onClick: () => showModalValider(record),
              },
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Réjeter</span>
                    <MdCancel color="red" size={17} />
                  </div>
                ),
                key: "8",
                onClick: () => showModalRejeter(record),
              }
            );
          }
          if (
            connectedUser.post === "Directeur Risque" &&
            dossierPoints === 24
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Remonter</span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "3",
                onClick: () => showModalValider(record),
              },
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Réjeter</span>
                    <MdCancel color="red" size={17} />
                  </div>
                ),
                key: "4",
                onClick: () => showModalRejeter(record),
              }
            );
          }

          if (
            connectedUser.post === "Directeur Engagement" &&
            dossierPoints === 50
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span>Valider</span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "3",
                onClick: () => showModalValider(record),
              }
              // {
              //   label: (
              //     <div className="flex items-center justify-between space-x-3">
              //       <span>Réjeter</span>
              //       <MdCancel color="red" size={17} />
              //     </div>
              //   ),
              //   key: "4",
              //   onClick: () => showModalRejeter(record),
              // }
            );
          }
        } else if (
          dossierStatus === "EN_COURS" &&
          connectedUser.post === "Chargé de clientèle" &&
          dossierPoints === 0
        ) {
          items.push({
            label: (
              <div className="flex items-center justify-between space-x-3">
                <span>Remonter a nouveau </span>
                <GrValidate color="green" size={17} />
              </div>
            ),
            key: "13",
            onClick: () => showModalRemonterAnouveau(record),
          });
        } else if (
          dossierStatus === "EN_COURS" &&
          connectedUser.post === "Chargé de clientèle" &&
          dossierPoints === 48
        ) {
          items.push({
            label: (
              <div className="flex items-center justify-between space-x-3">
                {/* <span>Valider</span> */}
                <span> Joindre documents </span>
                <GrValidate color="green" size={17} />
              </div>
            ),
            key: "3",
            onClick: () => showModalValider(record),
          });
        }
        return (
          <div className="cursor-pointer">
            <Dropdown menu={{ items }}>
              <DotIcon />
            </Dropdown>
          </div>
        );
      },
      filteredValue: null,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="lg:flex  items-center justify-between ">
        <div className="flex flex-col ">
          <span className="text-[18px] font-bold">Dossiers</span>
          <span className="text-[13px] ">
            {lignesFiltrees?.length} Dossiers Particuliers
          </span>
        </div>
        <div className="flex items-center gap-x-[13px] justify-center mt-3">
          <Modal
            destroyOnClose={true}
            onCancel={handlecancelRemonterANouveau}
            open={openPopupRemonterAnouveau.open}
            footer={null}
            width={1000}
            closable={false}
            maskClosable={false}
          >
            <RemonterNouveau
              closeSecondModal={handlecancelRemonterANouveau}
              ligne={openPopupRemonterAnouveau.ligne!}
              Credit_id={openPopupRemonterAnouveau?.ligne?.id!}
            />
          </Modal>
          <Modal
            title={`Aperçu de ${uploadedFile?.file.name || "fichier"}`}
            open={previewVisible}
            onCancel={handleCancelPreview}
            footer={null}
            width="80%"
            style={{ top: 20 }}
            maskClosable={false}
          >
            {uploadedFile &&
              (uploadedFile.file.type.startsWith("image/") ? (
                <img
                  src={uploadedFile.previewUrl}
                  alt="Aperçu"
                  style={{ width: "100%" }}
                />
              ) : uploadedFile.file.type === "application/pdf" ? (
                <iframe
                  src={uploadedFile.previewUrl}
                  title="Aperçu PDF"
                  width="100%"
                  height="600px"
                />
              ) : (
                <div>
                  <p>
                    <strong>Nom:</strong> {uploadedFile.file.name}
                  </p>
                  <p>
                    <strong>Taille:</strong>{" "}
                    {(uploadedFile.file.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>Type:</strong> {uploadedFile.file.type}
                  </p>
                  <p>
                    Pour visualiser ce type de fichier, vous devrez peut-être le
                    télécharger.
                  </p>
                  <Button>
                    Télécharger
                    <FaArrowDown />
                    <a
                      href={uploadedFile.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <IoEyeOutline size={20} />
                    </a>
                  </Button>
                </div>
              ))}
          </Modal>

          <Modal
            title={`Aperçu de ${uploadedFileMourabaha?.file.name || "fichier"}`}
            open={previewVisibleMourbaha}
            onCancel={handleCancelPreviewMourabaha}
            footer={null}
            width="80%"
            style={{ top: 20 }}
            maskClosable={false}
          >
            {uploadedFileMourabaha &&
              (uploadedFileMourabaha.file.type.startsWith("image/") ? (
                <img
                  src={uploadedFileMourabaha.previewUrl}
                  alt="Aperçu"
                  style={{ width: "100%" }}
                />
              ) : uploadedFileMourabaha.file.type === "application/pdf" ? (
                <iframe
                  src={uploadedFileMourabaha.previewUrl}
                  title="Aperçu PDF"
                  width="100%"
                  height="600px"
                />
              ) : (
                <div>
                  <p>
                    <strong>Nom:</strong> {uploadedFileMourabaha.file.name}
                  </p>
                  <p>
                    <strong>Taille:</strong>{" "}
                    {(uploadedFileMourabaha.file.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>Type:</strong> {uploadedFileMourabaha.file.type}
                  </p>
                  <p>
                    Pour visualiser ce type de fichier, vous devrez peut-être le
                    télécharger.
                  </p>
                  <Button>
                    Télécharger
                    <FaArrowDown />
                    <a
                      href={uploadedFileMourabaha.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <IoEyeOutline size={20} />
                    </a>
                  </Button>
                </div>
              ))}
          </Modal>

          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelDetails}
            open={openPopupConfirmDetails.open}
            footer={null}
            width={1200}
            closeIcon={false}
            maskClosable={false}
          >
            <DetailsLigne
              closeSecondModal={handlecancelDetails}
              ligne={openPopupConfirmDetails.ligne!}
            />
          </Modal>
          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelHistorique}
            open={openPopupConfirmHistorique.open}
            footer={null}
            width={900}
            closeIcon={false}
            maskClosable={false}
          >
            <HistoriqueLigne
              onClose={handlecancelHistorique}
              credit={openPopupConfirmHistorique?.ligne?.id!}
            />
          </Modal>
          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelValide}
            open={openPopupConfirmValider.open}
            footer={null}
            width={uploadedFile || uploadedFileMourabaha ? 800 : 375}
            closeIcon={false}
            maskClosable={false}
          >
            <div className="flex flex-col items-center space-y-3 ">
              <div className="flex items-center justify-center space-x-3">
                <h1 className="text-xl font-bold text-gray-800">
                  Confirmation
                </h1>
                <GiConfirmed size={32} className="text-green-500" />
              </div>
              <p className=" my-2 text-[15px] text-center">
                Êtes-vous sûr de vouloir remonter ce Crédit ?
              </p>
              <div className="w-full">
                <label>
                  Memo <span style={{ color: "red" }}>*</span>
                  <TextArea
                    rows={3}
                    onChange={(e) => setmemoType(e.target.value)}
                    value={memoType}
                    className="rounded-lg"
                    placeholder="Saisissez un mémo"
                  />
                </label>

                <label>
                  Avis <span style={{ color: "red" }}>*</span>
                  <TextArea
                    rows={3}
                    onChange={(e) => setAvis(e.target.value)}
                    value={avis}
                    className="rounded-lg"
                    placeholder="Saisissez votre avis"
                  />
                </label>

                {role === "Analyse de Risque" && (
                  <div className="mt-3">
                    {/* PV Commité (Draft) <span style={{ color: "red" }}>*</span> */}
                    Contre Analyse Risque{" "}
                    <span style={{ color: "red" }}>*</span>
                    <Upload
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                      beforeUpload={() => false}
                      maxCount={1}
                      showUploadList={true}
                      onChange={(info) => handleFileChange(info)}
                      className="w-full mt-3"
                      style={{ width: "100%" }}
                    >
                      <div className="w-full">
                        <Button
                          type="dashed"
                          className="!h-[43px] rounded-lg flex justify-center items-center gap-2 w-full"
                          icon={<FaUpload />}
                        >
                          Contre Analyse Risque
                        </Button>
                      </div>
                    </Upload>
                    {uploadedFile && (
                      <div className="file-preview-section">
                        <h3>Aperçu du fichier:</h3>
                        <div className="file-info">
                          {getFileIcon(uploadedFile.file.type)}
                          <span className="file-name">
                            {uploadedFile.file.name}
                          </span>
                          <span className="file-size">
                            ({(uploadedFile.file.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>

                        <div className="preview-content">
                          {uploadedFile.file.type.startsWith("image/") ? (
                            <div className="image-preview">
                              <img src={uploadedFile.previewUrl} alt="Aperçu" />
                            </div>
                          ) : uploadedFile.file.type === "application/pdf" ? (
                            <div className="pdf-preview">
                              <iframe
                                ref={iframeRef}
                                src={uploadedFile.previewUrl}
                                title="Aperçu PDF"
                                width="100%"
                                height="500px"
                              />
                              <Button
                                onClick={handlePreview}
                                className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                              >
                                Ouvrir en plein écran
                              </Button>
                            </div>
                          ) : textContent ? (
                            <div className="text-preview">
                              <h4>Contenu du fichier texte:</h4>
                              <pre>{textContent}</pre>
                            </div>
                          ) : uploadedFile.file.type.includes("csv") ||
                            uploadedFile.file.type.includes("excel") ||
                            uploadedFile.file.type.includes("sheet") ||
                            uploadedFile.file.type.includes("word") ||
                            uploadedFile.file.type.includes("document") ? (
                            <div className="download-preview">
                              <p>
                                Ce type de fichier nécessite un téléchargement.
                              </p>
                              <Button
                                type="primary"
                                onClick={() => handleDownload(uploadedFile)}
                                className="download-button"
                              >
                                Télécharger le fichier
                              </Button>
                            </div>
                          ) : (
                            <div className="unsupported-preview">
                              <p>
                                L'aperçu direct n'est pas disponible pour ce
                                type de fichier.
                              </p>
                              <Button
                                type="primary"
                                onClick={() => handleDownload(uploadedFile)}
                                className="download-button"
                              >
                                Télécharger le fichier
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {role === "Directeur Risque" && (
                  <div className="mt-3">
                    {/* PV Signé <span style={{ color: "red" }}>*</span> */}
                    PV Commité<span style={{ color: "red" }}>*</span>
                    <Upload
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                      beforeUpload={() => false}
                      maxCount={1}
                      showUploadList={true}
                      onChange={(info) => handleFileChange(info)}
                      className="w-full mt-3"
                      style={{ width: "100%" }}
                    >
                      <div className="w-full">
                        <Button
                          type="dashed"
                          className="!h-[43px] rounded-lg flex justify-center items-center gap-2 w-full"
                          icon={<FaUpload />}
                        >
                          PV Commité
                        </Button>
                      </div>
                    </Upload>
                    {uploadedFile && (
                      <div className="file-preview-section">
                        <h3>Aperçu du fichier:</h3>
                        <div className="file-info">
                          {getFileIcon(uploadedFile.file.type)}
                          <span className="file-name">
                            {uploadedFile.file.name}
                          </span>
                          <span className="file-size">
                            ({(uploadedFile.file.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>

                        <div className="preview-content">
                          {uploadedFile.file.type.startsWith("image/") ? (
                            <div className="image-preview">
                              <img src={uploadedFile.previewUrl} alt="Aperçu" />
                            </div>
                          ) : uploadedFile.file.type === "application/pdf" ? (
                            <div className="pdf-preview">
                              <iframe
                                ref={iframeRef}
                                src={uploadedFile.previewUrl}
                                title="Aperçu PDF"
                                width="100%"
                                height="500px"
                              />
                              <Button
                                onClick={handlePreview}
                                className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                              >
                                Ouvrir en plein écran
                              </Button>
                            </div>
                          ) : textContent ? (
                            <div className="text-preview">
                              <h4>Contenu du fichier texte:</h4>
                              <pre>{textContent}</pre>
                            </div>
                          ) : uploadedFile.file.type.includes("csv") ||
                            uploadedFile.file.type.includes("excel") ||
                            uploadedFile.file.type.includes("sheet") ||
                            uploadedFile.file.type.includes("word") ||
                            uploadedFile.file.type.includes("document") ? (
                            <div className="download-preview">
                              <p>
                                Ce type de fichier nécessite un téléchargement.
                              </p>
                              <Button
                                type="primary"
                                onClick={() => handleDownload(uploadedFile)}
                                className="download-button"
                              >
                                Télécharger le fichier
                              </Button>
                            </div>
                          ) : (
                            <div className="unsupported-preview">
                              <p>
                                L'aperçu direct n'est pas disponible pour ce
                                type de fichier.
                              </p>
                              <Button
                                type="primary"
                                onClick={() => handleDownload(uploadedFile)}
                                className="download-button"
                              >
                                Télécharger le fichier
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {role === "Chargé de clientèle" &&
                  openPopupConfirmValider?.ligne?.points_valides! === 48 && (
                    <div className="mt-3">
                      <div>
                        Tableau d'amortissement et BO{" "}
                        <span style={{ color: "red" }}>*</span>
                        <Upload
                          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                          beforeUpload={() => false}
                          maxCount={1}
                          showUploadList={true}
                          onChange={(info) => handleFileChange(info)}
                          className="w-full mt-3"
                          style={{ width: "100%" }}
                        >
                          <div className="w-full">
                            <Button
                              type="dashed"
                              className="!h-[43px] rounded-lg flex justify-center items-center gap-2 w-full"
                              icon={<FaUpload />}
                            >
                              Importer Tableau d'amortissement et BO
                            </Button>
                          </div>
                        </Upload>
                      </div>

                      {(openPopupConfirmValider.ligne?.type_credit ===
                        "CRDT CT- MOURABAHA" ||
                        openPopupConfirmValider.ligne?.type_credit ===
                          "CRDT MT- MOURABAHA" ||
                        openPopupConfirmValider.ligne?.type_credit ===
                          "CRDT LT- MOURABAHA") && (
                        <div>
                          Mourabaha <span style={{ color: "red" }}>*</span>
                          <Upload
                            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                            beforeUpload={() => false}
                            maxCount={1}
                            showUploadList={true}
                            onChange={(info) => handleFileChangeMourabeha(info)}
                            className="w-full mt-3"
                            style={{ width: "100%" }}
                          >
                            <div className="w-full">
                              <Button
                                type="dashed"
                                className="!h-[43px] rounded-lg flex justify-center items-center gap-2 w-full"
                                icon={<FaUpload />}
                              >
                                Importer document mourabaha
                              </Button>
                            </div>
                          </Upload>
                        </div>
                      )}
                      {(uploadedFile! || uploadedFileMourabaha!) && (
                        <hr className="my-3 mt-2" />
                      )}

                      <div
                        className={`grid gap-4 ${
                          uploadedFileMourabaha && uploadedFile
                            ? "grid-cols-2"
                            : "grid-cols-1"
                        } `}
                      >
                        {uploadedFile && (
                          <div className="file-preview-section">
                            <h3>
                              Aperçu du fichier (Tableau d'amortissement) :{" "}
                            </h3>
                            <div className="file-info">
                              {getFileIcon(uploadedFile.file.type)}
                              <span className="file-name">
                                {uploadedFile.file.name}
                              </span>
                              <span className="file-size">
                                ({(uploadedFile.file.size / 1024).toFixed(2)}{" "}
                                KB)
                              </span>
                            </div>

                            <div className="preview-content">
                              {uploadedFile.file.type.startsWith("image/") ? (
                                <div className="image-preview">
                                  <img
                                    src={uploadedFile.previewUrl}
                                    alt="Aperçu"
                                  />
                                </div>
                              ) : uploadedFile.file.type ===
                                "application/pdf" ? (
                                <div className="pdf-preview">
                                  <iframe
                                    ref={iframeRef}
                                    src={uploadedFile.previewUrl}
                                    title="Aperçu PDF"
                                    width="100%"
                                    height="500px"
                                  />
                                  <Button
                                    onClick={handlePreview}
                                    className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                                  >
                                    Ouvrir en plein écran
                                  </Button>
                                </div>
                              ) : textContent ? (
                                <div className="text-preview">
                                  <h4>Contenu du fichier texte:</h4>
                                  <pre>{textContent}</pre>
                                </div>
                              ) : uploadedFile.file.type.includes("csv") ||
                                uploadedFile.file.type.includes("excel") ||
                                uploadedFile.file.type.includes("sheet") ||
                                uploadedFile.file.type.includes("word") ||
                                uploadedFile.file.type.includes("document") ? (
                                <div className="download-preview">
                                  <p>
                                    Ce type de fichier nécessite un
                                    téléchargement.
                                  </p>
                                  <Button
                                    type="primary"
                                    onClick={() => handleDownload(uploadedFile)}
                                    className="download-button"
                                  >
                                    Télécharger le fichier
                                  </Button>
                                </div>
                              ) : (
                                <div className="unsupported-preview">
                                  <p>
                                    L'aperçu direct n'est pas disponible pour ce
                                    type de fichier.
                                  </p>
                                  <Button
                                    type="primary"
                                    onClick={() => handleDownload(uploadedFile)}
                                    className="download-button"
                                  >
                                    Télécharger le fichier
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {uploadedFileMourabaha && (
                          <div className="file-preview-section">
                            <h3>Aperçu du fichier (Mourabaha) :</h3>
                            <div className="file-info">
                              {getFileIcon(uploadedFileMourabaha.file.type)}
                              <span className="file-name">
                                {uploadedFileMourabaha.file.name}
                              </span>
                              <span className="file-size">
                                (
                                {(
                                  uploadedFileMourabaha.file.size / 1024
                                ).toFixed(2)}{" "}
                                KB)
                              </span>
                            </div>

                            <div className="preview-content">
                              {uploadedFileMourabaha.file.type.startsWith(
                                "image/"
                              ) ? (
                                <div className="image-preview">
                                  <img
                                    src={uploadedFileMourabaha.previewUrl}
                                    alt="Aperçu"
                                  />
                                </div>
                              ) : uploadedFileMourabaha.file.type ===
                                "application/pdf" ? (
                                <div className="pdf-preview">
                                  <iframe
                                    ref={iframeRef}
                                    src={uploadedFileMourabaha.previewUrl}
                                    title="Aperçu PDF"
                                    width="100%"
                                    height="500px"
                                  />
                                  <Button
                                    onClick={handlePreviewMourabaha}
                                    className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                                  >
                                    Ouvrir en plein écran
                                  </Button>
                                </div>
                              ) : textContent ? (
                                <div className="text-preview">
                                  <h4>Contenu du fichier texte:</h4>
                                  <pre>{textContent}</pre>
                                </div>
                              ) : uploadedFileMourabaha.file.type.includes(
                                  "csv"
                                ) ||
                                uploadedFileMourabaha.file.type.includes(
                                  "excel"
                                ) ||
                                uploadedFileMourabaha.file.type.includes(
                                  "sheet"
                                ) ||
                                uploadedFileMourabaha.file.type.includes(
                                  "word"
                                ) ||
                                uploadedFileMourabaha.file.type.includes(
                                  "document"
                                ) ? (
                                <div className="download-preview">
                                  <p>
                                    Ce type de fichier nécessite un
                                    téléchargement.
                                  </p>
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      handleDownload(uploadedFileMourabaha)
                                    }
                                    className="download-button"
                                  >
                                    Télécharger le fichier
                                  </Button>
                                </div>
                              ) : (
                                <div className="unsupported-preview">
                                  <p>
                                    L'aperçu direct n'est pas disponible pour ce
                                    type de fichier.
                                  </p>
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      handleDownload(uploadedFileMourabaha)
                                    }
                                    className="download-button"
                                  >
                                    Télécharger le fichier
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="!w-full  h-[50.6px] mt-2 secondary-button"
                  // onClick={handlecancelValide}
                  onClick={() => {
                    handlecancelValide();
                    setUploadedFile(null);
                    setUploadedFileMourabaha(null);
                    handlecancelValide();
                    setUploadedFile(null);
                    setAvis("");
                    setmemoType("");
                    setTextContent("");
                  }}
                >
                  No, Annuler
                </Button>
                <Button
                  className="!w-full h-[50.6px] mt-2 primary-button"
                  loading={isPendigValider}
                  onClick={handleValiderLigne}
                >
                  Oui, Valider
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelRejeter}
            open={openPopupConfirmRejeter.open}
            footer={null}
            width={375}
            closeIcon={false}
            maskClosable={false}
          >
            <div className="flex flex-col items-center space-y-3 ">
              <div className="flex items-center justify-center space-x-3">
                <h1 className="text-xl font-bold text-gray-800">Rejeter</h1>
                <MdCancel size={32} className="text-red-500" />
              </div>

              {/* <label>Motif</label>
              <Select
                className="w-full h-[42px]"
                options={[
                  {
                    label: "Dossier incomplet",
                    value: "Dossier incomplet",
                  },
                  {
                    label: "Dossier non conforme",
                    value: "Dossier non conforme",
                  },
                  // {
                  //   label: "Capacité de remboursement insuffisante",
                  //   value: "Capacité de remboursement insuffisante",
                  // },
                  // {
                  //   label: "Historique de crédit défavorable",
                  //   value: "Historique de crédit défavorable",
                  // },
                  // {
                  //   label: "Endettement trop élevé",
                  //   value: "Endettement trop élevé",
                  // },
                  // {
                  //   label: "Revenus instables ou insuffisants",
                  //   value: "Revenus instables ou insuffisants",
                  // },
                  // {
                  //   label: "Garanties insuffisantes",
                  //   value: "Garanties insuffisantes",
                  // },
                  // {
                  //   label: "Secteur d'activité à risque",
                  //   value: "Secteur d'activité à risque",
                  // },
                  // {
                  //   label: "Ancienneté professionnelle insuffisante",
                  //   value: "Ancienneté professionnelle insuffisante",
                  // },
                  // {
                  //   label: "Montant demandé trop important",
                  //   value: "Montant demandé trop important",
                  // },
                  // {
                  //   label: "Durée de remboursement inadaptée",
                  //   value: "Durée de remboursement inadaptée",
                  // },
                  {
                    label: "Autre motif (préciser)",
                    value: "Autre",
                  },
                ]}
                value={motiv}
                onChange={SelectMotiv}
                placeholder="motif"
              />
              { motiv&& <><label>Document</label>

                 <Select
                className="w-full h-[42px]"
                options={PartiCiluerDocument}
                value={selectTypeDocument}
                onChange={selectDocument}
                placeholder="Select Document"
              /></>}
               */}

              <label>
                Motif de Rejet
                <Input
                  value={selectAutre}
                  onChange={(e) => setSelectAutre(e.target.value)}
                />
              </label>

              <p className=" my-2 text-[15px] text-center">
                Êtes-vous sûr de vouloir réjeter ce ligne ?
              </p>
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  className="w-[143px] h-[50.6px]   mt-2 secondary-button"
                  onClick={handlecancelRejeter}
                >
                  No, Annuler
                </Button>
                <Button
                  className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                  loading={isPendigRejeter}
                  onClick={handleRejeterLigne}
                >
                  Oui, Réjeter
                </Button>
              </div>
            </div>
          </Modal>
          {loading && <SpinnerLoader />}
        </div>
      </div>

      <div className="flex items-center max-lg:flex-col justify-center space-x-2 mt-2">
        <label className="w-[200px]">
          <Select
            value={filtreStatus}
            onChange={(value) => setFiltreStatus(value)}
            className="w-full h-[42px]"
            options={[
              { value: "all", label: "Tous les dossiers" },
              { value: "a_decider", label: "À décider par moi" },
              // { value: "en_cours", label: "En cours d'instruction" },
              // { value: "valides", label: "Dossiers validés" },
              // { value: "rejetes", label: "Dossiers rejetés" },
            ]}
            placeholder="Filtrer par statut"
          />
        </label>

        {/* Filtre existant par numéro client */}
        <form className="space-x-2 flex" onSubmit={funcCLick}>
          <Input
            type="number"
            value={cherche ?? ""}
            onChange={(e) => setcherche(e.target.value)}
            prefix={(<BiSearch />) as unknown as string}
            suffix={(<LuCircleUserRound size={20} />) as unknown as string}
            placeholder={"Rechercher par numéro client"}
            className="custom- lg:!w-[350px] max-lg:!w-full !h-[46px] flex !rounded-[10px]"
          />
          <Button
            className="!w-[150px] !h-[46px] text-[13px] auth-button"
            htmlType="submit"
          >
            Rechercher
          </Button>
        </form>

        {/* Filtre par date existant */}
        <RangePicker
          className="w-[350px] max-lg:w-[100px] border border-[#e7e7e7] rounded-[10px] !h-[46px]"
          onChange={handleDateChange}
          placeholder={["Date de début", "Date de fin"]}
        />
      </div>
      <div className="!max-w-full mt-4 md:!max-w-full overflow-x-auto">
        {(LigneDaTa?.length ?? 0) > 0 ? (
          // <Table<LigneCredit>
          //   dataSource={onlyPaticulier}
          //   columns={columnsLigne}
          //   loading={isPending}
          //   pagination={false}
          //   bordered
          //   className="rounded-xl overflow-auto"
          //   rowClassName={() => "custom-row-height"}
          // />
          <Table<LigneCredit>
            dataSource={lignesFiltrees}
            columns={columnsLigne}
            loading={isPending}
            pagination={false}
            bordered
            className="rounded-xl overflow-auto"
            rowClassName={() => "custom-row-height"}
          />
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] text-center">
            <HiOutlineInbox className="text-5xl text-main-color mb-4 rotate-45" />
            <p className="text-lg text-gray-500">
              Aucune dossier particulier à afficher
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticulierCreditView;
