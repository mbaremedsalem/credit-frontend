import { Tabs, TabsProps } from "antd";
import { BsFillCreditCard2FrontFill, BsAlignEnd } from "react-icons/bs";
import { useMemo } from "react";
import DemandesEntreprise from "./Entreprise/Entreprise";
// import ProsprectView from "./Rachat-Prospecret/ProsprectView";
import DemandesParticulier from "./Particiluer/Particulier";
import { UsersIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PreparedLaterView from "../PraparedLater/PraparedLaterView";

// Composant NewBadge avec Framer Motion
const NewBadge = () => {
  return (
    <motion.span
      initial={{ opacity: 0, x: -800 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 1,
        ease: "easeOut",
        delay: 0.4
      }}
      className="inline-block bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 shadow-md"
    >
      Nouveau
    </motion.span>
  );
};

export default function DemandeView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Déterminer l'onglet actif basé sur le paramètre URL
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
    console.log("Tab sélectionné:", key);
    // Mettre à jour l'URL quand l'utilisateur change d'onglet
    const tabName = key === '1' ? 'particulier' : key === '2' ? 'entreprise' : 'rachat';
    setSearchParams({ tab: tabName });
  };

  const items = useMemo<TabsProps['items']>(() => [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BsAlignEnd className="text-lg" />
          Particuliers
        </span>
      ),
      children: <DemandesParticulier />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <BsFillCreditCard2FrontFill className="text-lg" />
          Entreprises
        </span>
      ),
      children: <DemandesEntreprise />,
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          Rachat
          <NewBadge />
        </span>
      ),
      // children: <ProsprectView />,
      children: <PreparedLaterView progress={92} />,
    },
  ], []);

  return (
    <div className="w-full demande-view-container">
      <Tabs
        activeKey={getActiveKey()}
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