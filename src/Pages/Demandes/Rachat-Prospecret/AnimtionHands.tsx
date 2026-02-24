


// import WavingHandIcon from "@mui/icons-material/WavingHand";


// import { motion } from "framer-motion";

// // Version professionnelle avec 2 mains
// const TwoHandsWaveAnimation = () => {
//   // Variants pour l'apparition des mains
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const handVariants = {
//     hidden: (custom: number) => ({
//       scale: 0,
//       rotate: custom === 0 ? -180 : 180,
//       opacity: 0,
//       x: custom === 0 ? -100 : 100,
//       y: 50,
//     }),
//     visible: (custom: number) => ({
//       scale: 1,
//       rotate: 0,
//       opacity: 1,
//       x: 0,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 150,
//         damping: 15,
//         duration: 1,
//       },
//     }),
//   };

//   // Animation de vague pour chaque main
//   const waveAnimation = (isLeft: boolean) => ({
//     y: [0, -15, 15, -10, 10, 0],
//     rotate: isLeft 
//       ? [0, 25, -20, 20, -15, 0]  // Main gauche
//       : [0, -25, 20, -20, 15, 0],  // Main droite (symétrique)
//     scale: [1, 1.15, 0.95, 1.1, 1],
//     transition: {
//       duration: 2.8,
//       repeat: Infinity,
//       repeatType: "mirror" as const,
//       ease: [0.43, 0.13, 0.23, 0.96], // Courbe de Bézier personnalisée
//     }
//   });

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="relative w-full h-64 flex items-center justify-center"
//     >
//       {/* Effet de fond commun */}
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-full blur-3xl"
//         animate={{
//           scale: [1, 1.2, 1],
//           rotate: [0, 5, -5, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       />

//       {/* Main Gauche */}
//       <motion.div
//         custom={0}
//         variants={handVariants}
//         animate={waveAnimation(true)}
//         className="relative mr-8"
//         whileHover={{
//           scale: 1.2,
//           rotate: 10,
//           transition: { duration: 0.3 }
//         }}
//       >
//         {/* Halo de la main gauche */}
//         <motion.div
//           className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl"
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.2, 0.4, 0.2],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             delay: 0.5,
//           }}
//         />
        
//         <WavingHandIcon className="!w-20 !h-30 text-blue-500 drop-shadow-2xl transform -scale-x-100" />
        
//         {/* Étincelles main gauche */}
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={`left-${i}`}
//             className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
//             initial={{
//               x: "50%",
//               y: "50%",
//             }}
//             animate={{
//               x: `${50 + Math.cos(i * 60 * Math.PI / 180) * 100}%`,
//               y: `${50 + Math.sin(i * 60 * Math.PI / 180) * 100}%`,
//               scale: [0, 1, 0],
//               opacity: [0, 1, 0],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: i * 0.3,
//               ease: "easeOut",
//             }}
//           />
//         ))}
//       </motion.div>

//       {/* Main Droite */}
//       <motion.div
//         custom={1}
//         variants={handVariants}
//         animate={waveAnimation(false)}
//         className="relative ml-8"
//         whileHover={{
//           scale: 1.2,
//           rotate: -10,
//           transition: { duration: 0.3 }
//         }}
//       >
//         {/* Halo de la main droite */}
//         <motion.div
//           className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-2xl"
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.2, 0.4, 0.2],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             delay: 0.2,
//           }}
//         />
        
//         <WavingHandIcon className="!w-20 !h-20 text-purple-500 drop-shadow-2xl" />
        
//         {/* Étincelles main droite */}
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={`right-${i}`}
//             className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
//             initial={{
//               x: "50%",
//               y: "50%",
//             }}
//             animate={{
//               x: `${50 + Math.cos(i * 60 * Math.PI / 180 + 30) * 100}%`,
//               y: `${50 + Math.sin(i * 60 * Math.PI / 180 + 30) * 100}%`,
//               scale: [0, 1, 0],
//               opacity: [0, 1, 0],
//             }}
//             transition={{
//               duration: 2.2,
//               repeat: Infinity,
//               delay: i * 0.25 + 0.5,
//               ease: "easeOut",
//             }}
//           />
//         ))}
//       </motion.div>

//       {/* Lien de connexion entre les deux mains (effet visuel) */}
//       <motion.div
//         className="absolute w-32 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
//         initial={{ scaleX: 0, opacity: 0 }}
//         animate={{
//           scaleX: [0, 1, 0.8, 1],
//           opacity: [0, 0.5, 0.3, 0.5],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           delay: 0.5,
//         }}
//       />
//     </motion.div>
//   );
// };

// // Version avec animation de va-et-vient (bye-bye classique)
// const TwoHandsByeByeAnimation = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="relative w-full h-80 flex items-center justify-center perspective-1000"
//     >
//       {/* Arrière-plan animé */}
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-purple-100/20 to-pink-100/20 rounded-full blur-3xl"
//         animate={{
//           scale: [1, 1.3, 1],
//           rotate: [0, 180, 360],
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       />

//       <div className="flex items-center space-x-12">
//         {/* Main Gauche */}
//         <motion.div
//           animate={{
//             x: [0, -20, 0, 20, 0],
//             y: [0, -15, 15, -10, 0],
//             rotate: [0, 30, -20, 20, 0],
//             scale: [1, 1.15, 0.95, 1.1, 1],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//             times: [0, 0.25, 0.5, 0.75, 1],
//           }}
//           className="relative transform -scale-x-100"
//         >
//           {/* Effet de glow */}
//           <motion.div
//             className="absolute inset-0 rounded-full bg-blue-400 blur-2xl"
//             animate={{
//               scale: [1, 1.4, 1],
//               opacity: [0.2, 0.5, 0.2],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//             }}
//           />
          
//           <WavingHandIcon className="!w-36 !h-36 text-blue-500 drop-shadow-2xl" />
//         </motion.div>

//         {/* Main Droite */}
//         <motion.div
//           animate={{
//             x: [0, 20, 0, -20, 0],
//             y: [0, -15, 15, -10, 0],
//             rotate: [0, -30, 20, -20, 0],
//             scale: [1, 1.15, 0.95, 1.1, 1],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//             times: [0, 0.25, 0.5, 0.75, 1],
//           }}
//           className="relative"
//         >
//           {/* Effet de glow */}
//           <motion.div
//             className="absolute inset-0 rounded-full bg-purple-400 blur-2xl"
//             animate={{
//               scale: [1, 1.4, 1],
//               opacity: [0.2, 0.5, 0.2],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: 0.5,
//             }}
//           />
          
//           <WavingHandIcon className="!w-36 !h-36 text-purple-500 drop-shadow-2xl" />
//         </motion.div>
//       </div>

//       {/* Particules décoratives */}
//       {[...Array(16)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-2 h-2 rounded-full"
//           style={{
//             background: i % 2 === 0 ? '#3B82F6' : '#A855F7',
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//           }}
//           animate={{
//             y: [0, -30, 0],
//             x: [0, i % 2 === 0 ? 20 : -20, 0],
//             scale: [0, 1, 0],
//             opacity: [0, 0.6, 0],
//           }}
//           transition={{
//             duration: 3 + i * 0.2,
//             repeat: Infinity,
//             delay: i * 0.2,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </motion.div>
//   );
// };

// // Version avec effet 3D et rotation
// const TwoHands3DWaveAnimation = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.8 }}
//       className="relative w-full h-96 flex items-center justify-center"
//       style={{ perspective: 1200 }}
//     >
//       {/* Anneau rotatif autour des mains */}
//       <motion.div
//         className="absolute w-72 h-72 rounded-full border-4 border-dashed border-purple-300/50"
//         animate={{
//           rotate: [0, 360],
//           scale: [1, 1.1, 1],
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       />

//       <div className="relative flex items-center space-x-16">
//         {/* Main Gauche avec rotation 3D */}
//         <motion.div
//           animate={{
//             rotateY: [0, 30, -30, 20, 0],
//             rotateZ: [0, 15, -15, 10, 0],
//             y: [0, -20, 20, -10, 0],
//             x: [0, -10, 10, -5, 0],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: [0.65, 0, 0.35, 1],
//           }}
//           style={{ transformStyle: "preserve-3d" }}
//           className="relative"
//         >
//           {/* Ombre portée 3D */}
//           <motion.div
//             className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-md"
//             animate={{
//               scaleX: [1, 1.3, 1],
//               opacity: [0.2, 0.4, 0.2],
//             }}
//           />
          
//           <WavingHandIcon className="!w-40 !h-40 text-blue-500 drop-shadow-2xl transform -scale-x-100" />
//         </motion.div>

//         {/* Main Droite avec rotation 3D */}
//         <motion.div
//           animate={{
//             rotateY: [0, -30, 30, -20, 0],
//             rotateZ: [0, -15, 15, -10, 0],
//             y: [0, -20, 20, -10, 0],
//             x: [0, 10, -10, 5, 0],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: [0.65, 0, 0.35, 1],
//             delay: 0.2,
//           }}
//           style={{ transformStyle: "preserve-3d" }}
//           className="relative"
//         >
//           {/* Ombre portée 3D */}
//           <motion.div
//             className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-md"
//             animate={{
//               scaleX: [1, 1.3, 1],
//               opacity: [0.2, 0.4, 0.2],
//             }}
//             transition={{ delay: 0.2 }}
//           />
          
//           <WavingHandIcon className="!w-40 !h-40 text-purple-500 drop-shadow-2xl" />
//         </motion.div>
//       </div>

//       {/* Lignes de mouvement */}
//       <motion.div
//         className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
//         animate={{
//           scaleX: [0, 1, 0],
//           opacity: [0, 0.5, 0],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       />
//     </motion.div>
//   );
// };

// // Exportez la version que vous préférez
// export { TwoHandsWaveAnimation, TwoHandsByeByeAnimation, TwoHands3DWaveAnimation };