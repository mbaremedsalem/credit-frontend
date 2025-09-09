import { Tabs, TabsProps } from "antd";

import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
import HistoriqueEntreprise from "./Entreprise/HistoriqueEntreprise";
import { useState } from "react";
import HistoriqueParticulier from "./Particulier/HistoriqueParticulier";

export default function HistoriqueView() {
  const [active, setActive] = useState("1")
  const onChange = (key: string) => {
    setActive(key)
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span className="tab-label">
          <BsAlignEnd className="tab-icon" />
         Historiques Particuliers
        </span>
      ),
      children: <HistoriqueParticulier />
    },
    {
      key: '2',
      label: (
        <span className="tab-label">
          <BsFillCreditCard2FrontFill className="tab-icon" />
          Historiques Entreprises
        </span>
      ),
      children: <HistoriqueEntreprise />
    }
  ];

  return (
    <div className="demande-view-container">
      <Tabs
        defaultActiveKey={active}
        items={items}
        onChange={onChange}
        centered
        animated

                className={`custom-tabs ${""}`}

      />
    </div>
  );
}
