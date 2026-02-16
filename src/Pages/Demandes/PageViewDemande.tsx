import { Tabs, TabsProps } from "antd";
import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
import { useMemo } from "react";
import DemandesEntreprise from "./Entreprise/Entreprise";
import ProsprectView from "./Prospecret/ProsprectView";
import DemandesParticulier from "./Particiluer/Particulier";

export default function DemandeView() {
  const onChange: TabsProps['onChange'] = (key) => {
    console.log("Tab sélectionné:", key);
  };

  const items = useMemo<TabsProps['items']>(() => [
    {
      key: "1",
      label: (
        <span className="tab-label">
          <BsAlignEnd className="tab-icon" />
          Particuliers
        </span>
      ),
      children: <DemandesParticulier />,
    },
    {
      key: "2",
      label: (
        <span className="tab-label">
          <BsFillCreditCard2FrontFill className="tab-icon" />
          Entreprises
        </span>
      ),
      children: <DemandesEntreprise />,
    },
    {
      key: "3",
      label: (
        <span className="tab-label">
          <BsFillCreditCard2FrontFill className="tab-icon" />
          Prospect & Rachat
        </span>
      ),
      children: <ProsprectView />,
    },
  ], []);

  return (
    <div className="demande-view-container">
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        centered
        animated
        destroyInactiveTabPane
        className="custom-tabs"
      />
    </div>
  );
}
