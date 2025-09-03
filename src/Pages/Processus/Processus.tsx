import React from 'react';
import { ReactFlow, Background, Controls, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Chargé de clientèle' },
    className: 'bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}
  },
  {
    id: '2',
    position: { x: 250, y: 100 },
    data: { label: 'Chef d’agence' },
    className: 'bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}
    
  },
  {
    id: '3',
    position: { x: 250, y: 200 },
    data: { label: 'Chef de département commercial' },
    className: 'bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}

  },
  {
    id: '4',
    position: { x: 250, y: 300 },
    data: { label: 'Analyse des risques' },
    className: 'bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}

  },
  {
    id: '5',
    position: { x: 250, y: 400 },
    data: { label: 'Comité de crédit (Directeur Risque)' },
    className: 'bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px",boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}

  },
  {
    id: '6',
    type: 'output',
    position: { x: 50, y: 500 },
    data: { label: 'Crédit Validé ✅', Background:"red" },
    className: 'bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl border-none',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", fontWeight:600, border:"0"}
    
  },
  {
    id: '7',
    type: 'output',
    position: { x: 500, y: 500 },
    data: { label: 'Crédit Rejeté ❌' },
    className: 'bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
    style : {"backgroundColor" : "#141317", color : "white", padding : "12px", borderRadius:"18px", fontWeight:600, border:"0" ,   boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",}

  },
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, className: 'text-gray-500', },
  { id: 'e2-3', source: '2', target: '3', animated: true, className: 'text-gray-500' },
  { id: 'e3-4', source: '3', target: '4', animated: true, className: 'text-gray-500' },
  { id: 'e4-5', source: '4', target: '5', animated: true, className: 'text-gray-500' },
  { id: 'e5-6', source: '5', target: '6', label: 'Validé', className: 'text-green-500' },
  { id: 'e2-7', source: '2', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e3-7', source: '3', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e4-7', source: '4', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e5-7', source: '5', target: '7', label: 'Rejeté', className: 'text-red-500' },
];

const CreditProcessFlow: React.FC = () => {
  return (
    <div className="flex items-center flex-col justify-center w-full h-full bg-white p-5">
      <h1 className='text-main-color font-bold text-2xl border-b-2 border-main-color '>Processus de Crédit</h1>
        
      <div className="bg-white rounded-lg shadow-2xl w-full h-full p-4">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background
            color="#f0f0f0"
            gap={10}
            size={1}
          />
          <Controls showZoom={true} showInteractive={true} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CreditProcessFlow;
