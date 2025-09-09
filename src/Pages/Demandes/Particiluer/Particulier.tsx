import { Button, Input, message, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { BiSearch, BiErrorCircle } from "react-icons/bi";
import { LuCircleUserRound } from "react-icons/lu";
import { ColumnsType } from "antd/es/table";
import { IoAddCircleSharp } from "react-icons/io5";
import { CLientT } from "../../../Services/type";
import { useGetClients } from "../../../Services/Demandes/useGetClients";
import AjoutCreditPaticulier from "./AjoutCreditPaticulier";
import SpinnerLoader from "../../../Ui/Spinner";

export type PopconfirmType = {
  client?: CLientT | null;
  open: boolean;
};

function DemandesParticulier() {
  const [cherche, setcherche] = useState("");
  const [valueChercher, setValuecher] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: ClientsData, isPending } = useGetClients(valueChercher);
  const [openPopupConfirm, setOpenPopupConfirm] = useState<PopconfirmType>({
    open: false,
    client: null,
  });

 
  const funcCLick = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); 
  if(!cherche){
    return message.error("entrer le numero de client !")
  }
  setHasSearched(true);
  setValuecher(cherche.trim());
}

  const showModal = (client: CLientT) => {
    setOpenPopupConfirm({ open: true, client });
  };

  const handleCancel = () => {
    setOpenPopupConfirm({ open: false, client: null });
  };

  const columns: ColumnsType<CLientT> = [
    {
      title: "Numéro Client",
      dataIndex: "CLIENT",
      key: "client",
    },
      {
      title: "Nature de compte",
      dataIndex: "Nature_de_compte",
      key: "Nature_de_compte",
    },
    {
      title: "Compte",
      dataIndex: "COMPTE",
      key: "COMPTE",
    },
    {
      title: "Nom",
      dataIndex: "NOM",
      key: "nom_client",
    },
    {
      title: "Prenom",
      dataIndex: "PRENOM",
      key: "prenom",
    },
    {
      title: "TEL",
      dataIndex: "TEL",
      key: "TEL",
    },
    {
      title: "NNI",
      dataIndex: "NNI",
      key: "NNI",
    },
    {
      title: "Date Naissance",
      dataIndex: "DATNAIS",
      key: "DATNAIS",
      render: (_, record) => (
        <span>{record?.DATNAIS? record?.DATNAIS?.slice(0, 10) : ""}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button className="auth-button w-full" onClick={() => showModal(record)}>
          Ajouter Crédit <IoAddCircleSharp />
        </Button>
      ),
    },
  ];

  useEffect(() => {
  if (cherche.trim() === "") {
    setHasSearched(false);   
    setValuecher("");        
  }
}, [cherche]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <div className="flex flex-col items-center w-full max-w-md gap-4 mt-10">
        <h1 className="text-xl font-bold">Recherche Particulier</h1>
        <form className="gap-4 space-y-3" onSubmit={funcCLick}>
          <Input
          value={cherche}
          onChange={(e) => setcherche(e.target.value)}
          prefix={<BiSearch />}
          suffix={<LuCircleUserRound size={20} />}
          placeholder="Rechercher par numéro client"
          className="!rounded-xl !h-12 !text-base"
          type="number"
        />
        <Button htmlType="submit"
         className="auth-button !w-full !h-11">
          Rechercher
        </Button>
        </form>
      </div>

      <div className="w-full mt-8 ">
        {isPending && <SpinnerLoader/>}

        {!isPending && hasSearched && !ClientsData && (
          <div className="flex flex-col items-center justify-center mt-10 text-red-600">
            <BiErrorCircle size={40} />
            <p className="mt-2 text-lg font-semibold">Aucun client trouvé pour ce numéro.</p>
          </div>
        )}

        {!isPending && ClientsData && ClientsData.length > 0 && (
          <Table<CLientT>
            dataSource={ClientsData}
            columns={columns}
            pagination={false}
            bordered
            className="rounded-xl overflow-auto mt-6"
            rowClassName={() => "custom-row-height"}
          />
        )}
      </div>

      <Modal
        destroyOnClose={true}
        onCancel={handleCancel}
        open={openPopupConfirm.open}
        footer={null}
        width={950}
        closable={false}
          maskClosable={false}
      >
        <AjoutCreditPaticulier
          typeFile={"particulier"}
          onCloseModal={handleCancel}
          widt={950}
          client={openPopupConfirm.client!}
        />
      </Modal>
    </div>
  );
}

export default DemandesParticulier;
