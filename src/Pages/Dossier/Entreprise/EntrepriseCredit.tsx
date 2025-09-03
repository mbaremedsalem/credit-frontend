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
import HistoriqueEntreprise from "./HistoriqueCredit";
import DetailsCreditEntreprise from "./DetailsCreditEntreprise";
import RemonterANouveauEntreprise from "./RemounterNouveauEntreprise";
import { FaFileAlt, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord, FaUpload } from "react-icons/fa";
export type PopconfirmType = {
  client?: CLientT | null;
  open: boolean;
};
export type PopconfirmTypeDetails = {
  ligne?: LigneCredit | null;
  open: boolean;
};
type UploadedFile = {
  file: File;
  previewUrl: string;
};
function EntrepriseCreditView() {
  const [memoType, setmemoType] = useState("");
  const [avis, setAvis] = useState("");
  const [selectAutre, setSelectAutre] = useState("");
  const [cherche, setcherche] = useState("");
  const [valueChercher, setValuecher] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [loading, setLoading] = useState(false);
const [textContent, setTextContent] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
      const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };
  console.log("open new opp : ", open);
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

  const [motiv, setMotiv] = useState("");

  const [filtreStatus, setFiltreStatus] = useState<string>("all");

    useEffect(() => {
    if (cherche.trim() === "") {
      setValuecher("");
    }
  }, [cherche]);
  

useEffect(() => {
  setFiltreStatus("a_decider");
}, [dates]);

 const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="file-icon pdf" />;
    if (fileType.includes('image')) return <FaFileImage className="file-icon image" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FaFileExcel className="file-icon excel" />;
    if (fileType.includes('word')) return <FaFileWord className="file-icon word" />;
    return <FaFileAlt className="file-icon generic" />;
  };

  // Nettoyer les URLs créées pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (uploadedFile?.previewUrl) {
        URL.revokeObjectURL(uploadedFile.previewUrl);
      }
    };
  }, [uploadedFile])
  // Fonction pour déterminer si l'utilisateur doit prendre une décision sur cette ligne
  const doitPrendreDecision = (ligne: LigneCredit): boolean => {
    const dossierPoints = ligne.points_valides ?? 0;
    const dossierStatus = ligne.status;

    if (dossierStatus !== "EN_COURS") return false;

    // Logique pour déterminer si l'utilisateur doit prendre une décision
      if (role === "Chargé de clientèle" && dossierPoints === 0) return true;
      if (role === "Chargé de clientèle" && dossierPoints === 48) return true;
    if (role === "Chef agence central" && dossierPoints === 2) return true;
    if (role === "Chef de département commercial" && dossierPoints === 6)
      return true;
    if (role === "Analyse de Risque" && dossierPoints === 12) return true;
    if (role === "Directeur Risque" && dossierPoints === 24) return true;
       if (role === "Directeur Engagement" && dossierPoints === 50) return true;


    return false;
  };

  // Ajoutez cette fonction pour filtrer les données en fonction de la sélection
  const filtrerLignesCredit = (lignes: LigneCredit[] | undefined) => {
    if (!lignes) return [];

    switch (filtreStatus) {
      case "all":
        return lignes;
      case "a_decider":
        // Filtre les crédits où l'utilisateur connecté doit prendre une décision
        return lignes.filter(doitPrendreDecision);
      case "valides":
        return lignes.filter((ligne) => ligne.status === "VALIDÉ");
      case "rejetes":
        return lignes.filter((ligne) => ligne.status === "REJETÉ");
      case "en_cours":
        return lignes.filter((ligne) => ligne.status === "EN_COURS");
      default:
        return lignes;
    }
  };

  const role = AuthService.getPostUserConnect();

  console.log("role est : ", role);
  const idUserConnect = AuthService.getIDUserConnect();

  console.log("selectAutre : ", selectAutre);

  const { TextArea } = Input;

  const { mutate: ValiderLigne, isPending: isPendigValider } =
    useValiderLigne();
  const { mutate: rejeterligne, isPending: isPendigRejeter } =
    useRejeterLigne();

  // const handleFileChange = (info: any) => {
  //   const newFiles = info.fileList
  //     .filter((file: any) => file.originFileObj)
  //     .map((file: any) => ({
  //       file: file.originFileObj,
  //       previewUrl: URL.createObjectURL(file.originFileObj),
  //     }));

  //   setUploadedFile(newFiles[0] || null);
  // };

    const handleFileChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (!file) {
      setUploadedFile(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedFile({ file, previewUrl });

    // Si c'est un fichier texte, on lit son contenu
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setTextContent('');
    }
  };
  const post = AuthService.getPostUserConnect();
  const poit = AuthService.getPoitUserConnect();

  const funcCLick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cherche) {
      return message.error("Entrez le numéro de client !");
    }
    setValuecher(cherche.trim());
  };

  console.log("dates : ", dates[0]);
  const handleDateChange = (values: any, dateStrings: [string, string]) => {
    console.log(values);
    setDates(dateStrings);
  };
  const { data: LigneDaTa, isPending } = useGetLingeCredit(
    valueChercher,
    dates[0]!,
    dates[1]!
  );
  const agenceConnect = AuthService.getAGENCEUserConnect();

  const isCommercial =
    role === "Chargé de clientèle" || role === "Chef agence central"
      ? LigneDaTa?.filter((agence) => agence.agence === agenceConnect)
      : LigneDaTa;

  console.log("dates : ", dates);
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
  const onlyEnattente = isCommercial?.filter(
    (ligne) => ligne.status === "EN_COURS"
  );

  const onlyPaticulier = onlyEnattente?.filter(
    (credit) => credit.type_dossier === "Entreprise"
  );

  const lignesFiltrees = filtrerLignesCredit(onlyPaticulier);

  const handleValiderLigne = () => {
    if (!uploadedFile && role === "Analyse de Risque") {
      return message.error("importer document risque");
    } else if (!uploadedFile && role === "Directeur Risque") {
      return message.error("importer pv");
    }
    const params: ValiderLigne = {
      id_credit: Number(openPopupConfirmValider?.ligne?.id),
      user_id: Number(idUserConnect)!,
      memo: memoType,
      motiv: avis,
      documents: uploadedFile?.file!,
    };

    ValiderLigne(params, {
      onSuccess: () => {
        setAvis("");
        setmemoType("");
        handlecancelValide();
      },
    });
  };

  const SelectMotiv = (value: string) => {
    setMotiv(value);
  };

  const handleRejeterLigne = () => {
    if (!motiv) {
      return enqueueSnackbar("Veuillez Selectionner le motiv ! ", {
        variant: "error",
      });
    }
    // {motiv === "Autre" && <Input value={selectAutre}
    //       onChange={(e) => setSelectAutre(e.target.value)}

    //           />
    else if (motiv === "Autre" && !selectAutre) {
      return message.error("Veuillez saisir le motif de rejet !");
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const params: RejeterLigne = {
        id_credit: Number(openPopupConfirmRejeter?.ligne?.id),
        user_id: Number(idUserConnect)!,
        motif: motiv === "Autre" ? selectAutre : motiv,
      };
      console.log("params : ", params);
      rejeterligne(params, {
        onSuccess: () => {
          setMotiv("");
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
      title: "NIF",
      dataIndex: ["client", "NIF"],
      key: "prenom",
    },
    {
      title: "TEL",
      dataIndex: ["client", "tel"],
      key: "tel",
    },
    {
      title: "Address",
      dataIndex: ["client", "Address"],
      key: "Address",
    },
    {
      title: "Montant de Crédit (MRU)",
      key: "credit",
      render: (_, record) => {
        return (
          // <span>{record?.client?.credits?.[0]?.montant.toLocaleString()}</span>
          <span>
            {new Intl.NumberFormat("fr-FR").format(
              Number(record?.client?.credits?.[0]?.montant?.toLocaleString())
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
      key: "Type",
      render: (_, record) => record?.type_credit,
    },
    {
      title: "Nature Crédit",
      key: "duree",
      render: (_, record) => record?.nature_credit,
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
         if (role === "Chargé de clientèle" ) {
          return record.points_valides! > 0 && record.points_valides!<48 ? (
            <Tag color="green">Déjà remonté</Tag>
          ) : record.points_valides! === 48 ?(
            <Tag color="orange">En attente de Table d'amortissement</Tag>
          ) : record.points_valides!> 48 ?   <Tag color="green">Déjà remonté</Tag>
          : <Tag color="orange">En attente de remontée</Tag>;
        } else if (role === "Chef agence central") {
          return record?.points_valides! > 4 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {/* {record.status === "REJETÉ" ? "Déjà Rejeté" : "Déjà Validé"} */}
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
          return record?.points_valides! > 6 ? (
            <Tag color={record.status === "REJETÉ" ? "red" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : "remonté"}
            </Tag>
          ) : record.points_valides === 6 && record.status === "EN_COURS" ? (
            <Tag color="orange">En attente de votre décision</Tag>
          ) : record.status === "REJETÉ" ? (
            <Tag color="red">Déjà Rejeté</Tag>
          ) : record?.points_valides! < 6 ? (
            <Tag color="yellow">En cours d'instruction</Tag>
          ) : (
            ""
          );
        } else if (role === "Analyse de Risque") {
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
        } 
        else if (role === "Directeur Engagement") {
          return record?.points_valides! > 48 ? (
             <Tag color={record.status === "REJETÉ" ? "red" : record.status === "EN_COURS" ? "orange" : "green"}>
              {record.status === "REJETÉ" ? "Déjà Rejeté" : record.status === "EN_COURS" ? "En attente de votre décision" : "remonté"}
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
              },
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
        } if (
            connectedUser.post === "Chargé de clientèle" &&
            dossierPoints === 48
          ) {
            items.push(
              {
                label: (
                  <div className="flex items-center justify-between space-x-3">
                    <span> Joindre le tableau d'amortissement </span>
                    <GrValidate color="green" size={17} />
                  </div>
                ),
                key: "3",
                onClick: () => showModalValider(record),
              },
             
            );
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
            {lignesFiltrees?.length} Dossiers Entreprises
          </span>
        </div>
        <div className="flex items-center gap-x-[13px] justify-center mt-3">
          <Modal
            destroyOnClose={true}
            onCancel={handlecancelRemonterANouveau}
            open={openPopupRemonterAnouveau.open}
            footer={null}
            width={1350}
            closable={false}
          >
            <RemonterANouveauEntreprise
              closeSecondModal={handlecancelRemonterANouveau}
              ligne={openPopupRemonterAnouveau.ligne!}
              Credit_id={openPopupRemonterAnouveau?.ligne?.id!}
            />
          </Modal>

          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelDetails}
            open={openPopupConfirmDetails.open}
            footer={null}
            width={1200}
            closeIcon={false}
          >
            <DetailsCreditEntreprise
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
          >
            <HistoriqueEntreprise
              onClose={handlecancelHistorique}
              credit={openPopupConfirmHistorique?.ligne?.id!}
            />
          </Modal>
            <Modal
        title={`Aperçu de ${uploadedFile?.file.name || 'fichier'}`}
        open={previewVisible}
        onCancel={handleCancelPreview}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {uploadedFile && (
          uploadedFile.file.type.startsWith('image/') ? (
            <img src={uploadedFile.previewUrl} alt="Aperçu" style={{ width: '100%' }} />
          ) : uploadedFile.file.type === 'application/pdf' ? (
            <iframe 
              src={uploadedFile.previewUrl} 
              title="Aperçu PDF"
              width="100%" 
              height="600px"
            />
          ) : (
            <div>
              <p><strong>Nom:</strong> {uploadedFile.file.name}</p>
              <p><strong>Taille:</strong> {(uploadedFile.file.size / 1024).toFixed(2)} KB</p>
              <p><strong>Type:</strong> {uploadedFile.file.type}</p>
              <p>Pour visualiser ce type de fichier, vous devrez peut-être le télécharger.</p>
            </div>
          )
        )}
      </Modal>
          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelValide}
            open={openPopupConfirmValider.open}
            footer={null}
            width={uploadedFile ? 800 : 375}
            closeIcon={false}
          >
            <div className="flex flex-col items-center space-y-3 ">
              <div className="flex items-center justify-center space-x-3">
                <h1 className="text-xl font-bold text-gray-800">
                  Confirmation
                </h1>
                <GiConfirmed size={32} className="text-green-500" />
              </div>
              <p className=" my-2 text-[15px] text-center">
                {/* Êtes-vous sûr de vouloir valider ce Crédit ? */}
                Êtes-vous sûr de vouloir remonter ce Crédit ?
              </p>
              <div className="w-full">
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
                 {role === "Analyse de Risque" && (
                  <div className="mt-3">
                    Fichier <span style={{ color: "red" }}>*</span>
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
                          Importer Fichier Risque
                        </Button>
                      </div>
                    </Upload>
                            {uploadedFile && (
        <div className="file-preview-section">
          <h3>Aperçu du fichier:</h3>
          <div className="file-info">
            {getFileIcon(uploadedFile.file.type)}
            <span className="file-name">{uploadedFile.file.name}</span>
            <span className="file-size">({(uploadedFile.file.size / 1024).toFixed(2)} KB)</span>
          </div>

          <div className="preview-content">
            {uploadedFile.file.type.startsWith('image/') ? (
              <div className="image-preview">
                <img src={uploadedFile.previewUrl} alt="Aperçu" />
              </div>
            ) : uploadedFile.file.type === 'application/pdf' ? (
              <div className="pdf-preview">
                <iframe 
                  ref={iframeRef}
                  src={uploadedFile.previewUrl} 
                  title="Aperçu PDF"
                  width="100%" 
                  height="500px"
                />
                <Button  onClick={handlePreview} className="w-[153.8px] h-[50.6px] mt-2 primary-button">
                  Ouvrir en plein écran
                </Button>
              </div>
            ) : textContent ? (
              <div className="text-preview">
                <h4>Contenu du fichier texte:</h4>
                <pre>{textContent}</pre>
              </div>
            ) : (
              <div className="unsupported-preview">
                <p>L'aperçu direct n'est pas disponible pour ce type de fichier.</p>
                <Button type="primary" onClick={handlePreview} className="preview-button">
                  Voir les détails du fichier
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
                    PV <span style={{ color: "red" }}>*</span>
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
                          Importer PV
                        </Button>
                      </div>
                    </Upload>

                         {uploadedFile && (
        <div className="file-preview-section">
          <h3>Aperçu du fichier:</h3>
          <div className="file-info">
            {getFileIcon(uploadedFile.file.type)}
            <span className="file-name">{uploadedFile.file.name}</span>
            <span className="file-size">({(uploadedFile.file.size / 1024).toFixed(2)} KB)</span>
          </div>

          <div className="preview-content">
            {uploadedFile.file.type.startsWith('image/') ? (
              <div className="image-preview">
                <img src={uploadedFile.previewUrl} alt="Aperçu" />
              </div>
            ) : uploadedFile.file.type === 'application/pdf' ? (
              <div className="pdf-preview">
                <iframe 
                  ref={iframeRef}
                  src={uploadedFile.previewUrl} 
                  title="Aperçu PDF"
                  width="100%" 
                  height="500px"
                />
                <Button  onClick={handlePreview} className="w-[153.8px] h-[50.6px] mt-2 primary-button">
                  Ouvrir en plein écran
                </Button>
              </div>
            ) : textContent ? (
              <div className="text-preview">
                <h4>Contenu du fichier texte:</h4>
                <pre>{textContent}</pre>
              </div>
            ) : (
              <div className="unsupported-preview">
                <p>L'aperçu direct n'est pas disponible pour ce type de fichier.</p>
                <Button type="primary" onClick={handlePreview} className="preview-button">
                  Voir les détails du fichier
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
                  </div>
                )}




                 {role === "Chargé de clientèle" && openPopupConfirmValider?.ligne?.points_valides! === 48 && (
                  <div className="mt-3">
                    Tableau d'amortissement <span style={{ color: "red" }}>*</span>
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
                          Importer Tableau d'amortissement
                        </Button>
                      </div>
                    </Upload>

                         {uploadedFile && (
        <div className="file-preview-section">
          <h3>Aperçu du Tableau d'amortissement:</h3>
          <div className="file-info">
            {getFileIcon(uploadedFile.file.type)}
            <span className="file-name">{uploadedFile.file.name}</span>
            <span className="file-size">({(uploadedFile.file.size / 1024).toFixed(2)} KB)</span>
          </div>

          <div className="preview-content">
            {uploadedFile.file.type.startsWith('image/') ? (
              <div className="image-preview">
                <img src={uploadedFile.previewUrl} alt="Aperçu" />
              </div>
            ) : uploadedFile.file.type === 'application/pdf' ? (
              <div className="pdf-preview">
                <iframe 
                  ref={iframeRef}
                  src={uploadedFile.previewUrl} 
                  title="Aperçu PDF"
                  width="100%" 
                  height="500px"
                />
                <Button  onClick={handlePreview} className="w-[153.8px] h-[50.6px] mt-2 primary-button">
                  Ouvrir en plein écran
                </Button>
              </div>
            ) : textContent ? (
              <div className="text-preview">
                <h4>Contenu du fichier texte:</h4>
                <pre>{textContent}</pre>
              </div>
            ) : (
              <div className="unsupported-preview">
                <p>L'aperçu direct n'est pas disponible pour ce type de fichier.</p>
                <Button type="primary" onClick={handlePreview} className="preview-button">
                  Voir les détails du fichier
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  className="w-[143px] h-[50.6px]   mt-2 secondary-button"
                  onClick={handlecancelValide}
                >
                  No, Annuler
                </Button>
                <Button
                  className="w-[153.8px] h-[50.6px] mt-2 primary-button"
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
          >
            <div className="flex flex-col items-center space-y-3 ">
              <div className="flex items-center justify-center space-x-3">
                <h1 className="text-xl font-bold text-gray-800">Rejeter</h1>
                <MdCancel size={32} className="text-red-500" />
              </div>

              <label>Motif</label>
              <Select
                className="w-full h-[42px]"
                // options={[
                //   {
                //     label: "Dossier incomplete",
                //     value: "Dossier incomplete",
                //   },
                //   {
                //     label: "Dossier No Conform",
                //     value: "Dossier No Conform",
                //   },
                // ]}
                options={[
                  {
                    label: "Dossier incomplet",
                    value: "Dossier incomplet",
                  },
                  {
                    label: "Dossier non conforme",
                    value: "Dossier non conforme",
                  },
                  {
                    label: "Capacité de remboursement insuffisante",
                    value: "Capacité de remboursement insuffisante",
                  },
                  {
                    label: "Historique de crédit défavorable",
                    value: "Historique de crédit défavorable",
                  },
                  {
                    label: "Endettement trop élevé",
                    value: "Endettement trop élevé",
                  },
                  {
                    label: "Revenus instables ou insuffisants",
                    value: "Revenus instables ou insuffisants",
                  },
                  {
                    label: "Garanties insuffisantes",
                    value: "Garanties insuffisantes",
                  },
                  {
                    label: "Secteur d'activité à risque",
                    value: "Secteur d'activité à risque",
                  },
                  {
                    label: "Ancienneté professionnelle insuffisante",
                    value: "Ancienneté professionnelle insuffisante",
                  },
                  {
                    label: "Montant demandé trop important",
                    value: "Montant demandé trop important",
                  },
                  {
                    label: "Durée de remboursement inadaptée",
                    value: "Durée de remboursement inadaptée",
                  },
                  {
                    label: "Autre motif (préciser)",
                    value: "Autre",
                  },
                ]}
                value={motiv}
                onChange={SelectMotiv}
                placeholder="motif"
              />
              {motiv === "Autre" && (
                <label>
                  Motif de Rejet
                  <Input
                    value={selectAutre}
                    onChange={(e) => setSelectAutre(e.target.value)}
                  />
                </label>
              )}

              <p className=" my-2 text-[15px] text-center">
                Êtes-vous sûr de vouloir réjeter ce ligne ?
              </p>
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  className="w-[143px] h-[50.6px]   mt-2 secondary-button"
                  onClick={handlecancelRejeter}
                >
                  Annuler
                </Button>
                <Button
                  className="w-[153.8px] h-[50.6px] mt-2 primary-button"
                  loading={isPendigRejeter}
                  onClick={handleRejeterLigne}
                >
                  Réjeter
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
              Aucune dossier Entreprise à afficher
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntrepriseCreditView;
