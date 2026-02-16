import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Edge, Node, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGetProcessusUsers } from '../../Services/processus/useGetProcessusUsers';

// Styles communs pour tous les nœuds (comme votre exemple)
const nodeStyle = {
  backgroundColor: "#141317",
  color: "white",
  padding: "12px",
  borderRadius: "18px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  fontWeight: 600,
  border: "0"
};

// Configuration des couleurs pour chaque poste
const posteColors: Record<string, string> = {
  "Chargé de clientèle": "bg-blue-600",
  "Chef agence central": "bg-indigo-600",
  "Directeur de département Islamique": "bg-purple-600",
  "Chef de département commercial": "bg-purple-600",
  "Directeur commercial": "bg-gray-600",
  "Analyse de Risque": "bg-gray-600",
  "Directeur Risque": "bg-yellow-600",
  "Directeur Engagement": "bg-green-600",
  "DEVELOPPEUR": "bg-gray-400",
};

// Configuration des positions (comme votre exemple)
const positions = [
  { x: 250, y: 0 },   // Chargé de clientèle
  { x: 250, y: 100 }, // Chef agence
  { x: 250, y: 200 }, // Département Islamique/Commercial
  { x: 250, y: 300 }, // Directeur commercial
  { x: 250, y: 400 }, // Analyse de Risque
  { x: 250, y: 500 }, // Directeur Risque
  { x: 250, y: 600 }, // Import Complément
  { x: 250, y: 700 }, // Directeur Engagement
];

// Ordre hiérarchique des postes
const hierarchyOrder = [
  "Chargé de clientèle",
  "Chef agence central",
  "Directeur de département Islamique",
  "Chef de département commercial",
  "Directeur commercial",
  "Analyse de Risque",
  "Directeur Risque",
  "Import Complément",
  "Directeur Engagement"
];

const CreditProcessFlow: React.FC = () => {
  const { data: DataProcessus, isPending } = useGetProcessusUsers();

  // Créer les nœuds dynamiquement
  const dynamicNodes = useMemo(() => {
    const nodes: Node[] = [];
    
    if (!DataProcessus || DataProcessus.length === 0) return nodes;

    // Filtrer les postes uniques et prendre le premier utilisateur pour chaque poste
    const uniquePostes = new Map<string, any>();
    
    DataProcessus.forEach(user => {
      // Ignorer le développeur du processus de validation
      if (user.poste === "DEVELOPPEUR") return;
      
      // Pour chaque poste, prendre seulement le premier utilisateur
      if (!uniquePostes.has(user.poste)) {
        uniquePostes.set(user.poste, user);
      }
    });

    // Organiser les postes selon l'ordre hiérarchique
    let positionIndex = 0;
    
    hierarchyOrder.forEach((posteHierarchique, index) => {
      // Chercher les postes correspondants dans nos données
      const matchingPostes = Array.from(uniquePostes.entries())
        .filter(([poste]) => {
          if (posteHierarchique === "Import Complément") {
            return poste === "Chargé de clientèle"; // Import Complément est aussi un Chargé de clientèle
          }
          return poste.includes(posteHierarchique) || posteHierarchique.includes(poste);
        });

      if (matchingPostes.length > 0) {
        const [poste, user] = matchingPostes[0];
        const position = positions[positionIndex] || { x: 250, y: positionIndex * 100 };
        
        // Type de nœud spécial pour le premier et dernier
        const nodeType = positionIndex === 0 ? 'input' : 
                        (posteHierarchique === "Directeur Engagement" ? 'output' : 'default');
        
        nodes.push({
          id: (positionIndex + 1).toString(),
          type: nodeType,
          position,
          data: { 
            label: (
              <div className="text-center">
                <div className="font-semibold mb-2">
                  {posteHierarchique === "Import Complément" ? "Import Complément" : poste}
                </div>
                <div className="text-sm opacity-80">
                  {user.username}
                  {user.plafond > 0 && ` - Plafond: ${user.plafond}M`}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  {user.description_plafond}
                </div>
              </div>
            )
          },
          className: `${posteColors[poste] || 'bg-gray-600'} text-white font-semibold py-3 px-6 rounded-lg shadow-xl`,
          style: nodeStyle
        });

        positionIndex++;
        
        // Si c'est un Chargé de clientèle et qu'on a aussi besoin d'un Import Complément
        if (poste === "Chargé de clientèle" && posteHierarchique === "Chargé de clientèle") {
          // On gardera la place pour l'Import Complément plus tard
        }
      }
    });

    // Ajouter le nœud Import Complément (s'il faut le montrer séparément)
    if (nodes.some(n => n.data.label.props.children[0].props.children === "Chargé de clientèle")) {
      const importPosition = { x: 250, y: 600 };
      const chargeClientNode = DataProcessus.find(u => u.poste === "Chargé de clientèle");
      
      if (chargeClientNode) {
        nodes.push({
          id: (nodes.length + 1).toString(),
          position: importPosition,
          data: { 
            label: (
              <div className="text-center">
                <div className="font-semibold mb-2">Import Complément</div>
                <div className="text-sm opacity-80">
                  {chargeClientNode.username}
                  {chargeClientNode.plafond > 0 && ` - Plafond: ${chargeClientNode.plafond}M`}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Complément d'information
                </div>
              </div>
            )
          },
          className: 'bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
          style: nodeStyle
        });
      }
    }

    // Ajouter les nœuds de décision finale
    nodes.push(
      {
        id: 'decision-valid',
        type: 'output',
        position: { x: 50, y: 800 },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-semibold mb-2">Crédit Validé ✅</div>
              <div className="text-xs opacity-60">
                Processus terminé
              </div>
            </div>
          )
        },
        className: 'bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl border-none',
        style: nodeStyle
      },
      {
        id: 'decision-reject',
        type: 'output',
        position: { x: 500, y: 800 },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-semibold mb-2">Crédit Rejeté ❌</div>
              <div className="text-xs opacity-60">
                Processus arrêté
              </div>
            </div>
          )
        },
        className: 'bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-xl',
        style: nodeStyle
      }
    );

    return nodes;
  }, [DataProcessus]);

  // Créer les edges dynamiquement
  const dynamicEdges = useMemo(() => {
    const edges: Edge[] = [];
    
    if (!dynamicNodes.length) return edges;

    // Trouver les IDs des nœuds importants
    const nodeIds: Record<string, string> = {};
    dynamicNodes.forEach(node => {
      if (typeof node.id === 'string') {
        const label = node.data?.label?.props?.children[0]?.props?.children;
        if (label) {
          nodeIds[label] = node.id;
        }
      }
    });

    // Chemins de progression (comme votre exemple)
    const progressionPaths = [
      ['Chargé de clientèle', 'Chef agence central'],
      ['Chef agence central', 'Directeur de département Islamique'],
      ['Directeur de département Islamique', 'Chef de département commercial'],
      ['Chef de département commercial', 'Directeur commercial'],
      ['Directeur commercial', 'Analyse de Risque'],
      ['Analyse de Risque', 'Directeur Risque'],
      ['Directeur Risque', 'Import Complément'],
      ['Import Complément', 'Directeur Engagement'],
    ];

    // Créer les edges de progression
    progressionPaths.forEach(([from, to], index) => {
      const fromId = Object.entries(nodeIds).find(([label]) => label.includes(from) || from.includes(label))?.[1];
      const toId = Object.entries(nodeIds).find(([label]) => label.includes(to) || to.includes(label))?.[1];
      
      if (fromId && toId) {
        edges.push({
          id: `e${fromId}-${toId}`,
          source: fromId,
          target: toId,
          animated: true,
          className: 'text-gray-500',
          style: { stroke: '#4B5563', strokeWidth: 2 }
        });
      }
    });

    // Connecter le dernier niveau à la validation
    const lastNode = dynamicNodes.find(n => 
      n.data?.label?.props?.children[0]?.props?.children === 'Directeur Engagement'
    );
    
    if (lastNode && lastNode.id && nodeIds['Crédit Validé ✅']) {
      edges.push({
        id: `e${lastNode.id}-decision-valid`,
        source: lastNode.id,
        target: 'decision-valid',
        label: 'Validé',
        className: 'text-green-500',
        style: { stroke: '#10B981', strokeWidth: 2 }
      });
    }

    // Ajouter les possibilités de rejet (comme votre exemple)
    const rejectionNodes = [
      'Chef agence central',
      'Directeur de département Islamique',
      'Chef de département commercial',
      'Directeur commercial',
      'Analyse de Risque',
      'Directeur Risque'
    ];

    rejectionNodes.forEach(nodeLabel => {
      const nodeId = Object.entries(nodeIds).find(([label]) => label.includes(nodeLabel) || nodeLabel.includes(label))?.[1];
      
      if (nodeId && nodeIds['Crédit Rejeté ❌']) {
        edges.push({
          id: `reject-${nodeId}`,
          source: nodeId,
          target: 'decision-reject',
          label: 'Rejeté',
          className: 'text-red-500',
          style: { stroke: '#EF4444', strokeWidth: 2 }
        });
      }
    });

    return edges;
  }, [dynamicNodes]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <div className="text-lg text-gray-600 animate-pulse">
          Chargement du processus de crédit...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col justify-center w-full h-full bg-white p-5">
      <h1 className='text-main-color font-bold text-2xl border-b-2 border-main-color mb-4'>
        Processus de Crédit
      </h1>
        
      <div className="bg-white rounded-lg shadow-2xl w-full h-full p-4">
        {dynamicNodes.length > 0 ? (
          <ReactFlow nodes={dynamicNodes} edges={dynamicEdges} fitView>
            <Background
              color="#f0f0f0"
              gap={10}
              size={1}
            />
            <Controls showZoom={true} showInteractive={true} />
          </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-600 text-xl">Aucune donnée disponible</p>
              <p className="text-gray-400 mt-2">
                Aucun utilisateur de processus chargé
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper avec ReactFlowProvider
const CreditProcessFlowWithProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CreditProcessFlow />
    </ReactFlowProvider>
  );
};

export default CreditProcessFlowWithProvider;


