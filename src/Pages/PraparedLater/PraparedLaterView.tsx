import React, { useEffect, useState, useMemo } from "react";
import { Card, Typography, Space, Badge, Button } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { motion, useAnimation } from "framer-motion";

const { Text } = Typography;

interface PreparedLaterProps {
  progress?: number;
  estimatedTime?: string;
  transactionId?: string;
  steps?: string[];
  onComplete?: () => void;
  className?: string;
}

const PreparedLaterView: React.FC<PreparedLaterProps> = ({
  progress = 75,
  steps = [
    "Design UI/UX",
    "Integration API",
    "Verification",
    "Test & Validation",
  ],
  onComplete,
  className = "",
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
        if (progress === 100 && onComplete) {
          onComplete();
        }
      }, 500);

      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
      }));

      return () => clearTimeout(timer);
    } catch (err) {
      setError("Failed to initialize animations");
    }
  }, [progress, controls, onComplete]);

  // Calculate completed steps
  const completedSteps = Math.floor((currentProgress / 100) * steps.length);

  // Memoized variants
  const progressBarVariants = useMemo(
    () => ({
      hidden: { width: 0 },
      visible: {
        width: `${currentProgress}%`,
        transition: {
          duration: prefersReducedMotion ? 0 : 1.5,
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.5,
        },
      },
    }),
    [currentProgress, prefersReducedMotion],
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center">
          <Text type="danger" className="block mb-4">
            {error}
          </Text>
          <Button type="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden ${className}`}
    >
      {/* Animated background elements - disabled for reduced motion */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        >
          {/* ... background animations ... */}
        </motion.div>
      )}

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.3 : 0.8,
          type: "spring",
          bounce: 0.4,
        }}
        className="w-full max-w-lg relative z-10"
      >
        <Card
          className="shadow-2xl rounded-3xl border-0 overflow-hidden backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Live badge */}
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              status="processing"
              text="En direct"
              className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-xs font-medium"
            />
          </motion.div>

          <div className="p-8">
            {/* Header section */}
            <div className="text-center mb-8">
              <div
                className="relative inline-block mb-6"
                role="status"
                aria-label="Processing"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-black to-black rounded-full flex items-center justify-center shadow-lg">
                  {!prefersReducedMotion ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <LoadingOutlined className="text-4xl text-white" />
                    </motion.div>
                  ) : (
                    <LoadingOutlined className="text-4xl text-white" />
                  )}
                </div>

                {/* Progress ring */}
                <svg
                  className="absolute top-0 left-0 w-24 h-24 -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-blue-100"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-main-color"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: currentProgress / 100 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 1.5,
                      delay: 0.8,
                    }}
                    style={{
                      strokeDasharray: "276 276",
                    }}
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-main-color to-main-color bg-clip-text text-transparent">
                Rachat en cours
              </h1>

              <Space align="center" className="m">
                <ClockCircleOutlined className="!text-main-color" />
              </Space>
            </div>

            {/* Progress section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <Text className="font-medium text-gray-700">Progression</Text>
                <motion.div
                  key={currentProgress}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  <Badge
                    count={`${currentProgress}%`}
                    className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold"
                  />
                </motion.div>
              </div>

              <div
                role="progressbar"
                aria-valuenow={currentProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Transaction progress"
                className="relative h-3 bg-gray-100 rounded-full overflow-hidden"
              >
                <motion.div
                  variants={progressBarVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute h-full bg-gradient-to-r from-main-color via-main-color to-main-color rounded-full"
                >
                  {/* Shimmer effect - disabled for reduced motion */}
                  {!prefersReducedMotion && (
                    <motion.div
                      animate={{
                        x: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 w-20 bg-white opacity-30 transform -skew-x-20"
                    />
                  )}
                </motion.div>
              </div>

              {/* Steps */}
              <div className="flex justify-between mt-4 text-xs">
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mx-auto mb-1 transition-colors duration-300 ${
                        index < completedSteps
                          ? "!bg-main-color"
                          : "bg-gray-300"
                      }`}
                      aria-hidden="true"
                    />
                    <Text
                      className={`text-xs transition-colors duration-300 ${
                        index < completedSteps
                          ? "!text-main-color font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </Text>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Confirmation message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="!bg-main-color p-4 rounded-xl text-white relative overflow-hidden"
            >
              {/* Shimmer effect - disabled for reduced motion */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              <Space align="start" className="relative z-10">
                <CheckCircleOutlined className="text-xl" />
                <div>
                  <Text className="text-white font-medium block mb-1">
                    Presque terminé !
                  </Text>
                </div>
              </Space>
            </motion.div>

            {/* Update indicator */}
            <div className="text-center mt-6">
              <Space className="text-gray-400 text-xs">
                {!prefersReducedMotion && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1 h-1 !bg-main-color rounded-full" />
                  </motion.div>
                )}
                <Text className="text-gray-400">
                  Mise à jour en temps réel • Dernière actualisation à l'instant
                </Text>
              </Space>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PreparedLaterView;
