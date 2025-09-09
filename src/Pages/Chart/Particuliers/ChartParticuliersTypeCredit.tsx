import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { ChartOptions, ChartData } from "chart.js";
import { Link } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);
import { BsCreditCard2FrontFill } from "react-icons/bs";

const ChartParticuliersTypeCredit = () => {
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

      } else {

      }
    },
  };


    
  
  const data: ChartData<'doughnut'> = {
    labels: ["Crédit à la consommation", "Crédit Immobilier", "Rachat de Crédit", "Crédit bail", "Autre" ],
    datasets: [
      {
        data: [23, 40, 12, 16, 34],
        backgroundColor: ["#7367F0", "#89785A", "#33FFBD", "#FFD700", "#800080"],
        borderWidth: 0,
      },
    ],
  };


  return (
    <Card className="flex flex-col items- justify-center">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-2 mb-5">
            <span className="font-bold text-2xl">Type de Crédit</span>
            <BsCreditCard2FrontFill  size={35} />
          </div>
        </CardTitle>
        
      </CardHeader>
      <CardBody className="">
        <div style={{ height: 290 }}>
          <Doughnut data={data} className="cursor-pointer" options={options} />
        </div>
      <div className="flex items-center justify-between max-lg:grid max-lg:grid-cols-2 mt-2">
      
        <Link to={``}>
        <div className="flex justify-between mb-1 cursor-pointer">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#7367F0] rounded-full cursor-pointer"></div>
            <span className="font-bold ml-2 mr-1 text-[12px]">Crédit à la consommation</span>
            <span className="text-[12px]"> -  38 </span>
          </div>
        </div>
        </Link>
        <Link to={``}>
        <div className="flex justify-between cursor-pointer">
          <div className="flex items-center">
            <div className="w-4 h-4  bg-[#89785A] rounded-full cursor-pointer"></div>

            <span className="font-bold ml-2 mr-1 text-[12px]">Crédit Immobilier</span>
            <span className="text-[12px]">- 27</span>
          </div>
        </div>
</Link>
<Link to={``}>
        <div className="flex justify-between cursor-pointer">
          <div className="flex items-center">
            <div className="w-4 h-4  bg-[#33FFBD] rounded-full cursor-pointer"></div>

            <span className="font-bold ml-2 mr-1 text-[12px]">Rachat de Crédit</span>
            <span className="text-[12px]">- 27</span>
          </div>
        </div>
</Link>



      </div>

      <div className="flex items-center justify-around max-lg:grid max-lg:grid-cols-2 mt-2">
      
      <Link to={``}>
      <div className="flex justify-between mb-1 cursor-pointer">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#FFD700] rounded-full cursor-pointer"></div>
          <span className="font-bold ml-2 mr-1 text-[12px]">Crédit bail</span>
          <span className="text-[12px]"> -  20 </span>
        </div>
      </div>
      </Link>
      
<Link to={``}>
      <div className="flex justify-between cursor-pointer">
        <div className="flex items-center">
          <div className="w-4 h-4  bg-[#800080] rounded-full cursor-pointer"></div>

          <span className="font-bold ml-2 mr-1 text-[12px]">Autre</span>
          <span className="text-[12px]">- 27</span>
        </div>
      </div>
</Link>



    </div>
      </CardBody>
    </Card>
  );
};

export default ChartParticuliersTypeCredit;

