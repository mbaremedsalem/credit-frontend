import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { ChartOptions, ChartData } from "chart.js";
import { Link, useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);
import { MdOutlineRealEstateAgent } from "react-icons/md";

const ChartTypeDossier = () => {
    const navigate = useNavigate()
  const options: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return `${label}: ${percentage}`;
          },
        },
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
      },
    },
    onClick: (event: any, elements: any) => {
      console.log("event : ", event)
      if(elements[0].index === 0){
        navigate(`/virement/interne/?agence=2r`);

      } else {
        navigate(`/virement/externe/?agence=34`);

      }
    },
  };


    
  
  const data: ChartData<'doughnut'> = {
    labels: ["Interne", "Externe"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["black", "yellow"],
        borderWidth: 0,
      },
    ],
  };


  return (
    <Card className="flex flex-col items- justify-center">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-2 mb-5">
            <span className="font-bold text-2xl">Agence</span>
            <MdOutlineRealEstateAgent />
          </div>
        </CardTitle>
        
      </CardHeader>
      <CardBody className="">
        <div style={{ height: 290 }}>
          <Doughnut data={data} className="cursor-pointer" options={options} />
        </div>
      <div className="flex flex-col items-center">
      <div className="flex justify-between mt-3 mb-1">
        
        </div>
        <Link to={`/virement/interne/?agence=test`}>
        <div className="flex justify-between mb-1 cursor-pointer">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full cursor-pointer"></div>
            <span className="font-bold ml-2 mr-1">Interne</span>
            <span> -  38 </span>
          </div>
        </div>
        </Link>
        <Link to={`/virement/externe/?agence=sidi`}>
        <div className="flex justify-between cursor-pointer">
          <div className="flex items-center">
            <div className="w-4 h-4  bg-yellow-500  rounded-full cursor-pointer"></div>

            <span className="font-bold ml-2 mr-1 ">Externe</span>
            <span>- 27</span>
          </div>
        </div>
</Link>

      </div>
      </CardBody>
    </Card>
  );
};

export default ChartTypeDossier;