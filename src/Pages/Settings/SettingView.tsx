import { useState, useEffect } from "react";
import { motion, PanInfo, useAnimation, AnimatePresence } from "framer-motion";
import {
  FaUserSlash,
  FaUserCheck,
  FaSync,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { RiUserUnfollowLine, RiUserFollowLine } from "react-icons/ri";
import { GiBackwardTime, GiSwitchWeapon } from "react-icons/gi";
import { useGetProcessusUsers } from "../../Services/processus/useGetProcessusUsers";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  role: string;
  lastAction?: string;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "mohamed mbeirick",
      email: "med@gmail.com",
      status: "active",
      role: "User",
      lastAction: "Activé le 12/01/2026",
    },
    {
      id: "2",
      name: "mbare med salem",
      email: "mbare@example.com",
      status: "active",
      role: "Admin",
      lastAction: "Activé le 10/01/2026",
    },
    {
      id: "3",
      name: "moulay diallo",
      email: "moulay@gmail.com",
      status: "suspended",
      role: "User",
      lastAction: "Suspendu le 11/01/2026",
    },
  ]);

  const [activeAction, setActiveAction] = useState<{
    type: "activate" | "suspend";
    userId: string;
  } | null>(null);
  const [draggedUserId, setDraggedUserId] = useState<string | null>(null);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null
  );
  const [showTutorial, setShowTutorial] = useState(true);
  const { data: getUser, isPending } = useGetProcessusUsers();

  // Auto-hide tutorial after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = async (
    userId: string,
    info: PanInfo,
    controls: any
  ) => {
    const threshold = 80;
    const velocityThreshold = 300;

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const direction = info.offset.x > 0 ? "right" : "left";
    setDragDirection(direction);
    const isSuspended = user.status === "suspended";

    // Check if drag exceeds threshold
    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > velocityThreshold
    ) {
      const newStatus = direction === "right" ? "active" : "suspended";
      const actionType = newStatus === "active" ? "activate" : "suspend";

      // Animation circulaire professionnelle pendant le swipe
      if (direction === "right") {
        await controls.start({
          x: 120,
          rotate: isSuspended ? 30 : 5, // Conserver l'inclinaison si suspendu
          scale: 0.95,
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
            rotate: {
              type: "spring",
              stiffness: 200,
              damping: 15,
            },
          },
        });
      } else {
        await controls.start({
          x: -120,
          rotate: isSuspended ? -30 - 5 : -5, // Conserver l'inclinaison si suspendu
          scale: 0.95,
          backgroundColor: "rgba(234, 179, 8, 0.15)",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
            rotate: {
              type: "spring",
              stiffness: 200,
              damping: 15,
            },
          },
        });
      }

      // Animation de confirmation circulaire
      await controls.start({
        scale: [0.95, 1.05, 0.98, 1],
        rotate: isSuspended
          ? [
              direction === "right" ? -30 : -30,
              direction === "right" ? -35 : -55,
              -45,
            ]
          : [
              direction === "right" ? 5 : -5,
              direction === "right" ? 10 : -10,
              0,
            ],
        transition: {
          duration: 0.4,
          times: [0, 0.5, 0.8, 1],
          ease: "easeInOut",
        },
      });

      // Show action confirmation
      setActiveAction({ type: actionType, userId });

      // Wait a moment, then apply the action and reset
      setTimeout(() => {
        toggleUserStatus(userId);
        const newIsSuspended = newStatus === "suspended";
        controls.start({
          x: 0,
          rotate: newIsSuspended ? -30 : 0, // 45° si suspendu, 0° si actif
          scale: 1,
          backgroundColor: "transparent",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            rotate: {
              type: "spring",
              stiffness: newIsSuspended ? 80 : 150,
              damping: newIsSuspended ? 10 : 15,
            },
          },
        });
        setActiveAction(null);
        setDragDirection(null);
      }, 600);
    } else {
      // Return to original position with circular spring animation
      controls.start({
        x: 0,
        rotate: isSuspended ? -30 : 0, // Retour à -45° si suspendu
        scale: 1,
        backgroundColor: "transparent",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
          rotate: {
            type: "spring",
            stiffness: isSuspended ? 80 : 200,
            damping: isSuspended ? 10 : 15,
          },
        },
      });
      setDragDirection(null);
    }

    setDraggedUserId(null);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
              lastAction: `${
                user.status === "active" ? "Suspendu" : "Activé"
              } le ${new Date().toLocaleDateString("fr-FR")}`,
            }
          : user
      )
    );
  };

  // Floating Action Indicator Component avec animation circulaire
  const FloatingActionIndicator = () => {
    if (!activeAction || !activeAction.userId) return null;

    const user = users.find((u) => u.id === activeAction.userId);
    if (!user) return null;

    const config =
      activeAction.type === "activate"
        ? {
            emoji: "🎉",
            title: "Utilisateur Activé!",
            message: `${user.name} est maintenant actif`,
            icon: RiUserFollowLine,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          }
        : {
            emoji: "⏸️",
            title: "Utilisateur Suspendu!",
            message: `${user.name} a été suspendu`,
            icon: RiUserUnfollowLine,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          };

    const Icon = config.icon;

    return (
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.8, rotate: -180 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
        exit={{ y: -100, opacity: 0, scale: 0.8, rotate: 180 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          rotate: { type: "spring", stiffness: 150, damping: 15 },
        }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 ${config.bgColor} ${config.color} 
          px-6 py-4 rounded-2xl shadow-xl border ${config.borderColor} flex items-center space-x-4 z-50 min-w-[300px]`}
      >
        {/* Animation circulaire autour de l'emoji */}
        <motion.div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full border-2 opacity-50"
            style={{ borderColor: config.color.replace("text-", "") + "30" }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
            }}
          />
          <motion.div
            animate={{
              rotate: [0, 15, -15, 15, 0],
              scale: [1, 1.1, 1.1, 1.1, 1],
            }}
            transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="text-3xl relative z-10"
          >
            {config.emoji}
          </motion.div>
        </motion.div>
        <div className="flex-1">
          <div className="font-bold">{config.title}</div>
          <div className="text-sm opacity-90">{config.message}</div>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <Icon className="text-xl" />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence>
          {activeAction && <FloatingActionIndicator />}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Gestion des Utilisateurs
              </h1>
              <p className="text-slate-600 mt-2">
                Glissez un utilisateur pour changer son statut
              </p>
            </div>
            <motion.button
              //   whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              onClick={() => setShowTutorial(!showTutorial)}
              className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <motion.div
                animate={{ rotate: showTutorial ? 180 : 0 }}
                transition={{ type: "spring" }}
              >
                <FaInfoCircle className="text-slate-500 text-xl" />
              </motion.div>
            </motion.button>
          </div>

          {/* Stats Cards avec animations circulaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Utilisateurs",
                value: users.length,
                icon: FaUserCheck,
                color: "text-blue-500",
              },
              {
                label: "Actifs",
                value: users.filter((u) => u.status === "active").length,
                icon: FaUserCheck,
                color: "text-green-500",
              },
              {
                label: "Suspendus",
                value: users.filter((u) => u.status === "suspended").length,
                icon: FaUserSlash,
                color: "text-yellow-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0, rotate: -5 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                // whileHover={{
                //   scale: 1.02,
                //   rotate: 2,
                //   transition: { type: "spring", stiffness: 300 },
                // }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        repeat: Infinity,
                        duration: 3,
                        delay: index * 0.5,
                      },
                      scale: {
                        repeat: Infinity,
                        duration: 2,
                        delay: index * 0.5,
                      },
                    }}
                    className={`p-3 rounded-full ${stat.color.replace(
                      "text",
                      "bg"
                    )} bg-opacity-10`}
                  >
                    <stat.icon className={`${stat.color} text-xl`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tutorial Banner */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ height: 0, opacity: 0, rotateX: -90 }}
              animate={{ height: "auto", opacity: 1, rotateX: 0 }}
              exit={{ height: 0, opacity: 0, rotateX: 90 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                    }}
                    className="p-3 bg-white rounded-xl shadow-sm"
                  >
                    <GiSwitchWeapon className="text-blue-500 text-2xl" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">
                      Comment utiliser
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      <motion.span
                        // whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mr-2"
                      >
                        <FaArrowLeft />{" "}
                        <span>Glisser à gauche pour suspendre</span>
                      </motion.span>
                      <motion.span
                        // whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      >
                        <FaArrowRight />{" "}
                        <span>Glisser à droite pour activer</span>
                      </motion.span>
                    </p>
                  </div>
                  <motion.button
                    // whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTutorial(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users List */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getUser?.map((user, index) => {
            const controls = useAnimation();
            const isSuspended = user.plafond === 0;

            return (
              <motion.div
                key={user.id}
                initial={{
                  y: 20,
                  opacity: 0,
                  scale: 0.95,
                  rotate: isSuspended ? -45 : 0, // 45° exactement
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotate: isSuspended ? -45 : 0, // 45° exactement
                }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  rotate: {
                    type: "spring",
                    stiffness: isSuspended ? 40 : 100, // Plus souple pour 45°
                    damping: isSuspended ? 8 : 15,
                  },
                }}
                className="relative"
                // whileHover={{
                //   scale: 1.02,
                //   transition: { type: "spring", stiffness: 300 }
                // }}
              >
                {/* Badge circulaire pour les suspendus */}
                {isSuspended && (
                  <motion.div
                    className="absolute -top-2 -right-2 z-10"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: -45 }}
                    transition={{ type: "spring", delay: index * 0.2 + 0.3 }}
                    // whileHover={{
                    //   scale: 1.1,
                    //   rotate: [0, 45, 0],
                    //   transition: { duration: 0.5 }
                    // }}
                  >
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "linear",
                        }}
                      >
                        <FaUserSlash />
                      </motion.div>
                      <span className="font-bold">SUSPENDU</span>
                    </div>
                  </motion.div>
                )}

                {/* Direction Indicators avec animations circulaires */}
                <AnimatePresence>
                  {draggedUserId === user.id && (
                    <>
                      {dragDirection !== "right" && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, x: -50 }}
                          animate={{ scale: 1, opacity: 1, x: 0 }}
                          exit={{ scale: 0, opacity: 0, x: -50 }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        >
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-full shadow-lg">
                            <motion.div
                              animate={{
                                rotate: [0, -30, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                              }}
                            >
                              <FaArrowLeft className="text-xl" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      {dragDirection !== "left" && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, x: 50 }}
                          animate={{ scale: 1, opacity: 1, x: 0 }}
                          exit={{ scale: 0, opacity: 0, x: 50 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full shadow-lg">
                            <motion.div
                              animate={{
                                rotate: [0, 30, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                              }}
                            >
                              <FaArrowRight className="text-xl" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>

                {/* User Card */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                  onDragStart={() => setDraggedUserId(user.id)}
                  onDragEnd={(_, info) =>
                    handleDragEnd(user.id, info, controls)
                  }
                  animate={controls}
                  //   whileHover={{
                  //     scale: 1.02,
                  //     rotate: isSuspended ? -42 : 0, // Légère correction pendant hover
                  //     boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
                  //   }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6 
            cursor-grab active:cursor-grabbing select-none group h-full
            "
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Background Glow Effect avec animation circulaire */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                    animate={
                      isSuspended
                        ? {
                            scale: [1, 1.1, 1],
                            rotate: [-45, -40, -45],
                          }
                        : {
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, 0],
                          }
                    }
                    transition={
                      isSuspended
                        ? {
                            scale: {
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut",
                            },
                            rotate: {
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut",
                            },
                          }
                        : {
                            scale: {
                              repeat: Infinity,
                              duration: 4,
                              ease: "easeInOut",
                            },
                            rotate: {
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut",
                            },
                          }
                    }
                    style={{
                      background:
                        user.plafond !== 0
                          ? "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15), transparent 70%)"
                          : "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.15), transparent 70%)",
                    }}
                  />

                  {/* Animation circulaire de confirmation améliorée */}
                  <AnimatePresence>
                    {activeAction?.userId === user.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      >
                        {/* Cercles concentriques animés */}
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full border-4"
                            style={{
                              borderColor:
                                activeAction.type === "activate"
                                  ? "rgba(34, 197, 94, 0.3)"
                                  : "rgba(239, 68, 68, 0.3)",
                              width: `${i * 30}px`,
                              height: `${i * 30}px`,
                            }}
                            animate={{
                              scale: [0, 1.5, 2],
                              opacity: [0.8, 0.4, 0],
                              rotate: [0, i * 120, 360],
                            }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                          />
                        ))}

                        {/* Icone centrale */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className={`p-4 rounded-full ${
                            activeAction.type === "activate"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {activeAction.type === "activate" ? (
                            <FaUserCheck className="text-green-600 text-2xl" />
                          ) : (
                            <FaUserSlash className="text-red-600 text-2xl" />
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar avec animation circulaire */}
                      <motion.div
                        animate={{
                          rotate: isSuspended
                            ? [-45, -30, -45, -60, -45] // Animation circulaire autour de -45°
                            : draggedUserId === user.id
                            ? [0, 360]
                            : 0,
                          scale: draggedUserId === user.id ? [1, 1.2, 1.1] : 1,
                        }}
                        transition={{
                          rotate: isSuspended
                            ? {
                                repeat: Infinity,
                                duration: 4,
                                ease: "easeInOut",
                              }
                            : {
                                repeat:
                                  draggedUserId === user.id ? Infinity : 0,
                                duration: 1.5,
                                ease: "linear",
                              },
                          scale: {
                            repeat: draggedUserId === user.id ? Infinity : 0,
                            duration: 0.8,
                            ease: "easeInOut",
                          },
                        }}
                        className={`p-4 rounded-full shadow-md ${
                          user.plafond !== 0
                            ? "bg-gradient-to-br from-green-100 to-emerald-100"
                            : "bg-gradient-to-br from-red-100 to-orange-100"
                        }`}
                      >
                        {user.plafond !== 0 ? (
                          <FaUserCheck className="text-green-600 text-2xl" />
                        ) : (
                          <FaUserSlash className="text-red-600 text-2xl" />
                        )}
                      </motion.div>

                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-slate-800 text-lg">
                            {user?.username}
                          </h3>
                          {/* Badge de statut avec animation */}
                          <motion.div
                            animate={
                              isSuspended
                                ? {
                                    scale: [1, 1.05, 1],
                                    rotate: [-45, -35, -45],
                                    y: [0, -2, 0],
                                  }
                                : {
                                    scale: [1, 1.03, 1],
                                    y: [0, -1, 0],
                                  }
                            }
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut",
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                              user.plafond !== 0
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                            }`}
                          >
                            <span className="flex items-center space-x-1">
                              {user.plafond !== 0 ? (
                                <>
                                  <motion.span
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 3,
                                      ease: "linear",
                                    }}
                                  >
                                    ✓
                                  </motion.span>
                                  <span>ACTIF</span>
                                </>
                              ) : (
                                <>
                                  <motion.span
                                    animate={{ rotate: [0, 180, 0] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    ⏸
                                  </motion.span>
                                  <span>SUSPENDU</span>
                                </>
                              )}
                            </span>
                          </motion.div>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">
                          {user.email}
                        </p>
                        <p className="text-slate-500 text-xs mt-2 flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              repeat: Infinity,
                              duration: 8,
                              ease: "linear",
                            }}
                          >
                            <GiBackwardTime />
                          </motion.div>
                          {/* <span>{user.lastAction}</span> */}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {/* Role badge avec animation */}
                      <motion.span
                        animate={
                          isSuspended
                            ? {
                                rotate: [-45, -40, -45],
                                scale: [1, 1.05, 1],
                              }
                            : undefined
                        }
                        transition={
                          isSuspended
                            ? {
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut",
                              }
                            : undefined
                        }
                        className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 
                  rounded-full text-sm font-medium border border-slate-200 shadow-sm"
                      >
                        {user.poste}
                      </motion.span>

                      {/* Drag Hint Dots avec animation circulaire améliorée */}
                      <motion.div
                        animate={{
                          opacity: draggedUserId === user.id ? 0 : 0.8,
                          scale: draggedUserId === user.id ? 0 : 1,
                          x: isSuspended ? [-2, 2, -2] : [0, 0, 0],
                        }}
                        transition={{
                          x: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                          },
                        }}
                        className="flex space-x-1.5 pt-2"
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -4, 0],
                              scale: [1, 1.3, 1],
                              backgroundColor: isSuspended
                                ? ["#ef4444", "#f97316", "#ef4444"]
                                : ["#94a3b8", "#cbd5e1", "#94a3b8"],
                            }}
                            transition={{
                              repeat: Infinity,
                              delay: i * 0.15,
                              duration: 1.2,
                              ease: "easeInOut",
                            }}
                            className="w-2 h-2 rounded-full"
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  {/* Status Indicator Line avec animation circulaire */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1.5 rounded-b-2xl ${
                      user.plafond !== 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-red-500 to-orange-500"
                    }`}
                    initial={{ width: "100%" }}
                    animate={{
                      width: draggedUserId === user.id ? "80%" : "100%",
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />

                  {/* Effet de bordure circulaire */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 pointer-events-none opacity-0 group-hover:opacity-30"
                    animate={
                      isSuspended
                        ? {
                            borderColor: [
                              "rgba(239, 68, 68, 0.3)",
                              "rgba(249, 115, 22, 0.3)",
                              "rgba(239, 68, 68, 0.3)",
                            ],
                          }
                        : {
                            borderColor: [
                              "rgba(34, 197, 94, 0.3)",
                              "rgba(16, 185, 129, 0.3)",
                              "rgba(34, 197, 94, 0.3)",
                            ],
                          }
                    }
                    transition={{
                      borderColor: {
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note avec animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="mt-12 text-center text-slate-500 text-sm"
        >
          <p className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <FaSync />
            </motion.div>
            <span>
              Glissez les cartes horizontalement pour modifier le statut des
              utilisateurs
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
