import { Tabs, TabsProps } from "antd";

import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
import ParticulierCreditView from "./Particulier/ParticulierCredit";
import EntrepriseCreditView from "./Entreprise/EntrepriseCredit";

export default function ConsultationViewDossier() {
  const onChange = (key: string) => {
    console.log("Tab sélectionné:", key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span className="tab-label">
          <BsAlignEnd className="tab-icon" />
         Dossiers Particuliers
        </span>
      ),
      children: <ParticulierCreditView />
    },
    {
      key: '2',
      label: (
        <span className="tab-label">
          <BsFillCreditCard2FrontFill className="tab-icon" />
          Dossiers Entreprises
        </span>
      ),
      children: <EntrepriseCreditView />
    }
  ];

  return (
    <div className="demande-view-container">
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        centered
        animated
        className="custom-tabs"
      />
    </div>
  );
}
