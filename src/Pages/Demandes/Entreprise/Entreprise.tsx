import { Button, Input, message, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { BiSearch, BiErrorCircle } from "react-icons/bi";
import { LuCircleUserRound } from "react-icons/lu";
import { ColumnsType } from "antd/es/table";
import { IoAddCircleSharp } from "react-icons/io5";
import SpinnerLoader from "../../../Ui/Spinner";
import { useGetEntreprises } from "../../../Services/Demandes/Entreprise/useGetEntreprise";
import { EnterpriseType } from "../../../Services/Demandes/Entreprise/Type";
import AjoutCreditEntreprise from "./AjoutCreditEntreprise";

export type PopconfirmType = {
  client?: EnterpriseType | null;
  open: boolean;
};

function DemandesEntreprise() {
  const [cherche, setcherche] = useState("");
  const [valueChercher, setValuecher] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: ClientsData, isPending } = useGetEntreprises(valueChercher);
  console.log("data : ", ClientsData)
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

  const showModal = (client: EnterpriseType) => {
    setOpenPopupConfirm({ open: true, client });
  };

  const handleCancel = () => {
    setOpenPopupConfirm({ open: false, client: null });
  };

   const columns: ColumnsType<EnterpriseType> = [
  {
    title: "Numéro Client",
    dataIndex: "CLIENT",
    key: "CLIENT",
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
    title: "Agence",
    dataIndex: "Agence",
    key: "Agence",
  },
  {
    title: "Raison sociale",
    dataIndex: "Raison_sociale",
    key: "Raison_sociale",
  },
  {
    title: "NIF",
    dataIndex: "NIF",
    key: "NIF",
  },
  {
    title: "RC",
    dataIndex: "RC",
    key: "RC",
  },
  {
    title: "Adresse",
    dataIndex: "Address",
    key: "Address",
  },
  {
    title: "Téléphone",
    dataIndex: "TEL",
    key: "TEL",
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
      {/* Input centré */}
      <div className="flex flex-col items-center w-full max-w-md gap-4 mt-10">
        <h1 className="text-xl font-bold">Recherche Entreprise</h1>
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
          <Table<EnterpriseType>
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
        width={1400}
        closable={false}
          maskClosable={false}
      >
        <AjoutCreditEntreprise
          typeFile={"entreprise"}
          onCloseModal={handleCancel}
          widt={950}
          client={openPopupConfirm.client!}
        />
      </Modal>
    </div>
  );
}

export default DemandesEntreprise;
