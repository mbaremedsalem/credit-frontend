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
} from "antd";
import { useEffect, useState } from "react";
import { HiOutlineInbox } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { LuCircleUserRound } from "react-icons/lu";
import { ColumnsType } from "antd/es/table";
import { MdCancel } from "react-icons/md";
const { RangePicker } = DatePicker;
import { BsThreeDotsVertical as DotIcon } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { RiFileHistoryFill } from "react-icons/ri";
import { CLientT, LigneCredit } from "../../../Services/type";
import { GiConfirmed } from "react-icons/gi";

import Toggle from "../../../Ui/Toggle";
import { useGetLingeCredit } from "../../../Services/Demandes/useGetLigneCredit";
import DetailsHistoriquePaticulier from "./DetailsHistoriqueParticulier";
import HistoriqueHistoriqueParticulier from "./HistoriqueHistoriqueParticulier";
import AuthService from "../../../Auth-Services/AuthService";
import { GetAgenceBYcode } from "../../../Lib/CustomFunction";
export type PopconfirmType = {
  client?: CLientT | null;
  open: boolean;
};
export type PopconfirmTypeDetails = {
  ligne?: LigneCredit | null;
  open: boolean;
};
function HistoriqueParticulier() {
  const [active, setactive] = useState<number>(0);

  const handletoggleChange = (index: number) => {
    setactive(index);
  };

  const [cherche, setcherche] = useState("");
  const [valueChercher, setValuecher] = useState("");
  const role = AuthService.getPostUserConnect();
  const agenceConnect = AuthService.getAGENCEUserConnect();

  const funcCLick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cherche) {
      return message.error("Entrez le numéro de client !");
    }
    setValuecher(cherche.trim());
  };
  useEffect(() => {
    if (cherche.trim() === "") {
      setValuecher("");
    }
  }, [cherche]);
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const handleDateChange = (values: any, dateStrings: [string, string]) => {
    console.log(values);
    setDates(dateStrings);
  };
  const { data: LigneDaTa = [], isPending } = useGetLingeCredit(
    valueChercher ?? "",
    dates?.[0] ?? null!,
    dates?.[1] ?? null!
  );

  const isCommercial =
    role === "Chargé de clientèle" || role === "Chef agence central"
      ? LigneDaTa.filter((agence) => agence?.agence === agenceConnect)
      : LigneDaTa;

  const onlyValidated = isCommercial.filter(
    (credit) => credit?.status === "VALIDÉ"
  );

  const onlyRejeter = isCommercial.filter(
    (credit) => credit?.status === "REJETÉ"
  );

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
  const [openPopupConfirmRejeter, setopenPopupConfirmRejeter] =
    useState<PopconfirmTypeDetails>({
      open: false,
      ligne: null,
    });

  const [motiv, setMotiv] = useState("");

  const handlecancelDetails = () => {
    setopenPopupConfirmDetails({
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

  const SelectMotiv = (value: string) => {
    setMotiv(value);
  };

  const columnsLigne: ColumnsType<LigneCredit> = [
    {
      title: "N° Credit",
      dataIndex: "id",
      key: "id",
    },
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
        return <div> {GetAgenceBYcode(record?.agence!)}</div>;
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
      title: "",
      key: "actions",
      render: (_, record) => {
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

  const onlyPaticulierValider = onlyValidated?.filter(
    (credit) => credit?.type_dossier === "Particulier"
  );
  const onlyPaticulierRejeter = onlyRejeter?.filter(
    (credit) => credit?.type_dossier === "Particulier"
  );
  return (
    <div className="min-h-screen">
      <div className="lg:flex  items-center justify-between ">
        <div className="flex flex-col ">
          <span className="text-[18px] font-bold">
            Historiques Particuliers
          </span>
          <span className="text-[13px] ">
            {active === 0
              ? onlyPaticulierValider?.length!
              : onlyPaticulierRejeter?.length!}{" "}
            Historique Crédit {active === 0 ? "Validé" : "Rejeté"}
          </span>
        </div>
        <div className="flex items-center gap-x-[13px] justify-center mt-3">
          <Modal
            className="rounded-lg"
            destroyOnClose={true}
            onCancel={handlecancelDetails}
            open={openPopupConfirmDetails.open}
            footer={null}
            width={1300}
            closeIcon={false}
            maskClosable={false}
          >
            <DetailsHistoriquePaticulier
              closeSecondModal={handlecancelDetails!}
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
            <HistoriqueHistoriqueParticulier
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
            width={375}
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
                Êtes-vous sûr de vouloir valider cette ligne ?
              </p>
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  className="w-[143px] h-[50.6px]   mt-2 secondary-button"
                  onClick={handlecancelValide}
                >
                  No, Annuler
                </Button>
                <Button className="w-[153.8px] h-[50.6px] mt-2 primary-button">
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

              <label>Motif</label>
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
                    value: "Autre motif",
                  },
                ]}
                value={motiv}
                onChange={SelectMotiv}
                placeholder="motif"
              />

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
                <Button className="w-[153.8px] h-[50.6px] mt-2 primary-button">
                  Oui, Réjeter
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Toggle
          options={["Validé", "Rejeté"]}
          activeIndex={active}
          onToggle={handletoggleChange}
        />
      </div>

      {active === 0 ? (
        <>
          <div className="flex items-center max-lg:flex-col justify-center space-x-2 mt-2">
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
                className=" !w-[150px] !h-[46px] text-[13px] auth-button "
                htmlType="submit"
              >
                Rechercher
              </Button>
            </form>

            <RangePicker
              className="w-[350px] max-lg:w-[100px] border border-[#e7e7e7] rounded-[10px] h-[46px] "
              onChange={handleDateChange}
              placeholder={["Date de début", "Date de fin"]}
            />
          </div>
          <div className="!max-w-full mt-4 md:!max-w-full overflow-x-auto">
            {(onlyPaticulierValider?.length ?? 0) > 0 ? (
              <Table<LigneCredit>
                dataSource={onlyPaticulierValider}
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
                  Aucune historique crédit particulier à afficher
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center max-lg:flex-col justify-center space-x-2 mt-2">
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
                className=" !w-[150px] !h-[46px] text-[13px] auth-button "
                htmlType="submit"
              >
                Rechercher
              </Button>
            </form>

            <RangePicker
              className="w-[350px] max-lg:w-[100px] border border-[#e7e7e7] rounded-[10px] h-[46px] "
              onChange={handleDateChange}
              placeholder={["Date de début", "Date de fin"]}
            />
          </div>
          <div className="!max-w-full mt-4 md:!max-w-full overflow-x-auto">
            {(onlyPaticulierRejeter?.length ?? 0) > 0 ? (
              <Table<LigneCredit>
                dataSource={onlyPaticulierRejeter}
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
                  Aucune crédit particulier Rejeté à afficher
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoriqueParticulier;


