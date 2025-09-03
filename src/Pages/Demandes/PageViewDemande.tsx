import { Tabs, TabsProps } from "antd";
import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
import DemandesParticulier from "./Particiluer/Particulier";
import DemandesEntreprise from "./Entreprise/Entreprise";

export default function DemandeView() {
  const onChange = (key: string) => {
    console.log("Tab sélectionné:", key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span className="tab-label">
          <BsAlignEnd className="tab-icon" />
          Particuliers
        </span>
      ),
      children: <DemandesParticulier />
    },
    {
      key: '2',
      label: (
        <span className="tab-label">
          <BsFillCreditCard2FrontFill className="tab-icon" />
        Entreprises
        </span>
      ),
      children: <DemandesEntreprise/>
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
