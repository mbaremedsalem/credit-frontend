import React from "react";
import { Button, Space, Typography, Card } from "antd";
import { LockOutlined, HomeOutlined, WarningOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface UnauthorizedProps {
  message?: string;
  showHomeButton?: boolean;
  showLoginButton?: boolean;
  onHomeClick?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

const UnauthorizedPage: React.FC<UnauthorizedProps> = ({
  message = "Vous n'avez pas les autorisations nécessaires pour accéder à cette page",
  showHomeButton = true,
  onHomeClick,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate("/");
    }
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const shieldVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden ${className}`}
    >
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
          >
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl"
              animate={{
                x: [0, -50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          {/* Icônes de verrouillage flottantes */}
          <motion.div
            className="absolute top-20 left-20 text-red-200 opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <LockOutlined style={{ fontSize: 60 }} />
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-20 text-orange-200 opacity-20"
            animate={{
              y: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <LockOutlined style={{ fontSize: 80 }} />
          </motion.div>
        </>
      )}

      {/* Carte principale */}
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.4,
        }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card
          className="shadow-2xl rounded-3xl border-0 overflow-hidden backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Bande d'avertissement en haut */}
          <motion.div
            className="h-2 bg-gradient-to-r from-main-color to-main-color"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 md:p-12"
          >
            {/* Code d'erreur */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                variants={iconVariants}
                className="relative inline-block mb-6"
              >
                {/* Bouclier avec animation */}
                <motion.div
                  variants={!prefersReducedMotion ? shieldVariants : {}}
                  initial="initial"
                  animate={!prefersReducedMotion ? "pulse" : {}}
                  className="relative"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-main-color to-main-color rounded-full flex items-center justify-center shadow-xl">
                    <LockOutlined className="text-5xl text-white" />
                  </div>

                  {/* Cercle de warning */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <WarningOutlined className="text-white text-xl" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Title
                  level={2}
                  className="!mb-4 !text-3xl md:!text-4xl font-bold text-gray-800"
                >
                  Accès Non Autorisé
                </Title>

                <Space direction="vertical" size="small" className="mb-8">
                  <Text className="text-gray-600 text-lg md:text-xl max-w-md mx-auto">
                    {message}
                  </Text>
                </Space>
              </motion.div>
            </motion.div>

            {/* Raisons possibles */}
            {/* <motion.div variants={itemVariants} className="mb-10">
              <Card
                className="bg-gray-50 border-0 rounded-2xl"
                bordered={false}
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <Text className="text-gray-700 font-medium text-base">
                    <WarningOutlined className="text-amber-500 mr-2" />
                    Raisons possibles :
                  </Text>

                  <motion.ul className="list-none space-y-3">
                    {[
                      "Session expirée ou invalide",
                      "Privilèges insuffisants pour cette ressource",
                      "Tentative d'accès à une zone restreinte",
                      "Authentification requise",
                    ].map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="flex items-center text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3" />
                        {reason}
                      </motion.li>
                    ))}
                  </motion.ul>
                </Space>
              </Card>
            </motion.div> */}

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {showHomeButton && (
                <motion.div
                  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                  className="flex-1"
                >
                  <Button
                    type="default"
                    size="large"
                    icon={<HomeOutlined />}
                    onClick={handleHomeClick}
                    className="w-full h-12 text-base font-medium border-2 hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    Retour à l'accueil
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Badge de sécurité */}
          <motion.div
            className="absolute bottom-4 right-4 bg-gray-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }}
          >
            <Space size={4}>
              <LockOutlined className="text-gray-500 text-xs" />
              <Text className="text-gray-500 text-xs">Sécurisé</Text>
            </Space>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UnauthorizedPage;
