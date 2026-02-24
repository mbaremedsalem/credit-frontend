// import { Tabs, TabsProps } from "antd";

// import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
// import { useState } from "react";


// export default function HistoriqueView() {
//   const [active, setActive] = useState("1")
//   const onChange = (key: string) => {
//     setActive(key)
//   };

//   const items: TabsProps['items'] = [
//     {
//       key: '1',
//       label: (
//         <span className="tab-label">
//           <BsAlignEnd className="tab-icon" />
//          Historiques Particuliers
//         </span>
//       ),
//       children: <HistoriqueParticulier />
//     },
//     {
//       key: '2',
//       label: (
//         <span className="tab-label">
//           <BsFillCreditCard2FrontFill className="tab-icon" />
//           Historiques Entreprises
//         </span>
//       ),
//       children: <HistoriqueEntreprise />
//     },
//       {
//       key: '3',
//       label: (
//         <span className="tab-label">
//           <BsFillCreditCard2FrontFill className="tab-icon" />
//           Historiques Rachats
//         </span>
//       ),
//       children: <HistoriqueRachatView />
//     }
//   ];

//   return (
//     <div className="demande-view-container">
//       <Tabs
//         defaultActiveKey={active}
//         items={items}
//         onChange={onChange}
//         centered
//         animated

//                 className={`custom-tabs ${""}`}

//       />
//     </div>
//   );
// }











import HistoriqueParticulier from "./Particulier/HistoriqueParticulier";
// import HistoriqueRachatView from "./Rachat/HistoriqueRachatView";
import HistoriqueEntreprise from "./Entreprise/HistoriqueEntreprise";

import { Tabs, TabsProps } from "antd";
import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
// import RachatListView from "./Rachat/RachatListView";
import { UsersIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PreparedLaterView from "../PraparedLater/PraparedLaterView";

// Composant NewBadge avec Framer Motion
const NewBadge = () => {
  return (
    <motion.span
      initial={{ opacity: 0, x: 800 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }}
      className="inline-block bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 shadow-md"
    >
      Nouveau
    </motion.span>
  );
};

export default function ConsultationViewDossier() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const getActiveKey = () => {
    switch(tabParam) {
      case 'rachat':
        return '3';
      case 'entreprise':
        return '2';
      case 'particulier':
      default:
        return '1';
    }
  };

  const onChange = (key: string) => {
    const tabName = key === '1' ? 'particulier' : key === '2' ? 'entreprise' : 'rachat';
    setSearchParams({ tab: tabName });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BsAlignEnd className="text-lg" />
          Historiques Particuliers
        </span>
      ),
      children: <HistoriqueParticulier />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <BsFillCreditCard2FrontFill className="text-lg" />
          Historiques Entreprises
        </span>
      ),
      children: <HistoriqueEntreprise />,
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          Historiques Rachat
          <NewBadge />
        </span>
      ),
      // children: <RachatListView />,
      children : <PreparedLaterView progress={28}/>
    },
  ];

  return (
    <div className="w-full demande-view-container">
      <Tabs
        activeKey={getActiveKey()}
        items={items}
        onChange={onChange}
        centered
        animated
        className="custom-tabs"
      />
    </div>
  );
}