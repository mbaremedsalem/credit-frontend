import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
};
import { motion } from "framer-motion";
import { Card, Statistic, Row, Col, Badge } from "antd";
import {
  MdOutlineTrendingUp,
  MdOutlinePending,
  MdOutlineCheckCircle,
  MdOutlineCancel,
} from "react-icons/md";
import { useGetStats } from "../Services/Home/UseGetStat";
import SpinnerLoader from "../Ui/Spinner";
import ValidationStatsPage from "./PageStats";
import { useGetStatParagence } from "../Services/Home/useGetStatParagence";
import { getUserInfo } from "../Services/Auth/useGetUserInfo";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
import NumberFlow from '@number-flow/react'
export default function CreditStatsHomePage() {


  const { data: userInfo } = getUserInfo();
  const { data: StatsData, isPending } = useGetStats();
  const { data: StatsParAgence } = useGetStatParagence();

  // Déterminer si l'utilisateur est Chef agence central ou Chargé de clientèle
  const isAgenceUser = userInfo?.post === "Chef agence central" || userInfo?.post === "Chargé de clientèle";
  const agenceCode = userInfo?.agnece;

  // Si user agence, on prend les stats de son agence, sinon global
  let statsToDisplay: any = StatsData;
  if (isAgenceUser && StatsParAgence && agenceCode && StatsParAgence[agenceCode]) {
    statsToDisplay = StatsParAgence[agenceCode];
  }

  if (isPending) return <SpinnerLoader />;
  // if (isPending || (isAgenceUser)) return <SpinnerLoader />;
  // if (isPending || (isAgenceUser && isPendingAgence)) return <SpinnerLoader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <Row gutter={[16, 16]}>
        <StatCard icon={<MdOutlineTrendingUp size={24} className="text-main-color " />} title="Total Dossiers" value={statsToDisplay?.total || 0} />
        <StatCard icon={<MdOutlinePending size={24} />} title="En Cours" value={statsToDisplay?.en_cours || 0} />
        <StatCard icon={<MdOutlineCheckCircle size={24} />} title="Validés" value={statsToDisplay?.valides || 0} />
        <StatCard icon={<MdOutlineCancel size={24} />} title="Rejetés" value={statsToDisplay?.rejetes || 0} />
      </Row>

      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} lg={12}>
          <Card title={isAgenceUser ? "Répartition par type de dossier" : "Répartition par agence"}>
            <ResponsiveContainer width="100%" height={250}>
              {isAgenceUser ? (
                <BarChart data={statsToDisplay?.repartition_type_dossier || []}>
                  <XAxis dataKey="type_dossier" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={StatsData?.credits_par_agence}>
                  <XAxis
                    dataKey="agence"
                    tickFormatter={(value: string) =>
                      value === "00001"
                        ? "NOUAKCHOTT"
                        : value === "00002"
                        ? "NOUADHIBOU"
                        : value
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Répartition par type de client">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statsToDisplay?.repartition_type_dossier || []}
                  dataKey="count"
                  nameKey="type_dossier"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {(statsToDisplay?.repartition_type_dossier || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} lg={12}>
          <Card title="Montant & Durée Moyenne">
            <div className="flex flex-col gap-2">
              <Badge color="#1890ff" text={`Montant Total : ${statsToDisplay?.montant_total?.toLocaleString()} MRU`} />
              <Badge color="#52c41a" text={`Durée Moyenne : ${statsToDisplay?.duree_moyenne} mois`} />
              <Badge color="#faad14" text={`Délai Moyen de Traitement : ${statsToDisplay?.delai_moyen_traitement_jours} jours`} />
            </div>
          </Card>
        </Col>
      </Row>
      <ValidationStatsPage />
    </motion.div>
  );
}

// function StatCard({ icon, title, value }: { icon: any; title: string; value: number }) {
//   return (
//     <Col xs={24} sm={12} lg={6}>
//       <Card>
        
//         <Statistic
//           title={<span className="flex items-center gap-2">{icon} {title}</span>}
//           value={value}
//         />
//       </Card>
//     </Col>
//   );
// }

 function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title={<span className="flex items-center gap-2">{icon} {title}</span>}
          valueRender={() => <NumberFlow value={value} />}
        />
      </Card>
    </Col>
  );
}