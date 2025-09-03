import React from 'react';
import { ReactFlow, Background, Controls, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  {
    id: '0',
    type: 'input',
    position: { x: 250, y: -250 },
    data: { label: '🧑‍💼 Sélection du client' },
    style: {
      backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '18px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontWeight: 600
    }
  },
  {
    id: '0.1',
    position: { x: 250, y: -175 },
    data: { label: '📁 Création du dossier (Ligne / Crédit)' },
    style: {
      backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '18px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontWeight: 600
    }
  },
  {
    id: '0.2',
    position: { x: 250, y: -100 },
    data: { label: '✍️ Saisie des données du dossier' },
    style: {
      backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '18px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontWeight: 600
    }
  },
  {
    id: '0.3',
    position: { x: 250, y: -25 },
    data: { label: '✅ Validation du dossier (ligne valide ?)' },
    style: {
      backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '18px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontWeight: 600
    }
  },
  {
    id: '1',
    position: { x: 250, y: 50 },
    data: { label: 'Chargé de clientèle' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '2',
    position: { x: 250, y: 150 },
    data: { label: 'Chef d’agence' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '3',
    position: { x: 250, y: 250 },
    data: { label: 'Chef de département commercial' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '4',
    position: { x: 250, y: 350 },
    data: { label: 'Analyse des risques' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '5',
    position: { x: 250, y: 450 },
    data: { label: 'Comité de crédit (Directeur Risque)' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '6',
    type: 'output',
    position: { x: 100, y: 550 },
    data: { label: 'Crédit Validé ✅' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
  {
    id: '7',
    type: 'output',
    position: { x: 450, y: 550 },
    data: { label: 'Crédit Rejeté ❌' },
    style: {
      backgroundColor: '#141317', color: 'white', padding: '12px', borderRadius: '18px',
      fontWeight: 600, boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
    }
  },
];

const edges: Edge[] = [
  { id: 'e0-0.1', source: '0', target: '0.1', animated: true },
  { id: 'e0.1-0.2', source: '0.1', target: '0.2', animated: true },
  { id: 'e0.2-0.3', source: '0.2', target: '0.3', animated: true },
  { id: 'e0.3-1', source: '0.3', target: '1', animated: true },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
  { id: 'e5-6', source: '5', target: '6', label: 'Validé', className: 'text-green-500' },
  { id: 'e2-7', source: '2', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e3-7', source: '3', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e4-7', source: '4', target: '7', label: 'Rejeté', className: 'text-red-500' },
  { id: 'e5-7', source: '5', target: '7', label: 'Rejeté', className: 'text-red-500' },
];

const CreditProcessFlow: React.FC = () => {
  return (
    <div className="flex items-center flex-col justify-center w-full h-screen bg-white p-5">
      <h1 className='text-2xl font-bold mb-4 border-b-2 pb-2'>📊 Processus de Création et Validation de Crédit</h1>

      <div className="bg-white rounded-lg shadow-lg w-full h-full p-4" style={{ height: '90%' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#f0f0f0" gap={12} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CreditProcessFlow;
