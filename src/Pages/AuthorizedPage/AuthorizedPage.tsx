



import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Typography, Space, Alert } from 'antd';
import { SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AuthorizedPage: React.FC = () => {
  const handleRedirect = () => {
    // Redirection vers Aubstream
    window.location.href = 'http://aubstream:9060';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-center">
              <SafetyCertificateOutlined className="text-3xl text-white mr-3" />
              <Title level={3} className="!text-white mb-0">Accès Crédit</Title>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Alert
                message="Authentification requise"
                description={
                  <Text className="text-gray-700">
                    Pour accéder au crédit, il faut se connecter depuis Aubstream
                  </Text>
                }
                type="info"
                showIcon
                className="mb-6"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Text className="text-gray-600 block mb-2">
                Redirection vers le portail d'authentification :
              </Text>
              <Text code className="text-sm bg-gray-100 p-2 rounded">
                http://aubstream:9060
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={handleRedirect}
                className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                icon={<ArrowRightOutlined />}
              >
                <Space>
                  <span>Se connecter à Aubstream</span>
                </Space>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Text type="secondary" className="text-sm">
                Vous serez redirigé vers le portail d'authentification sécurisé
              </Text>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthorizedPage;