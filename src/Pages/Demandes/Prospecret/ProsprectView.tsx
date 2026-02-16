import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DatePicker,
  Input,
  Button,
  Card,
  Form,
  Steps,
  Upload,
  message,
  Space,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  UploadOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Step } = Steps;

export default function ProsprectView() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const steps = [
    {
      title: "Informations Personnelles",
      icon: <UserOutlined />,
    },
    {
      title: "Documents",
      icon: <IdcardOutlined />,
    },
    {
      title: "Validation",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    const values = await form.validateFields();
    console.log("values : ", values.phone);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      console.log("Form values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Prospect créé avec succès !");
      setCurrentStep(3);
    } catch (error) {
      message.error("Veuillez remplir tous les champs obligatoires");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} téléchargé avec succès`);
      setDocuments([...documents, info.file]);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} échec du téléchargement`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6"
    >
      {/* Header avec animation */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="inline-block mb-2"
        ></motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
        >
          Nouveau Prospect
        </motion.h1>
        <p className="text-gray-600">Remplissez les informations du prospect</p>
      </motion.div>

      {/* Steps avec animation */}
      <motion.div variants={itemVariants} className="mb-10">
        <Steps current={currentStep} className="custom-steps">
          {steps.map((step, index) => (
            <Step
              key={index}
              title={
                <motion.span
                  animate={{
                    color: index === currentStep ? "#1890ff" : "#8c8c8c",
                    fontWeight: index === currentStep ? "bold" : "normal",
                  }}
                >
                  {step.title}
                </motion.span>
              }
              icon={step.icon}
            />
          ))}
        </Steps>
      </motion.div>

      {/* Contenu du formulaire */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="max-w-6xl mx-auto"
          >
            <Card
              className="shadow-xl border-0 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: "32px" }}
              styles={{
                body: {
                  padding: "32px",
                },
              }}
            >
              <Form
                form={form}
                layout="vertical"
                size="large"
                className="space-y-6"
              >
                {/* Étape 1: Informations Personnelles */}
                {currentStep === 0 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <motion.div variants={itemVariants}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              <UserOutlined className="mr-2" />
                              Nom *
                            </span>
                          }
                          name="lastName"
                          rules={[
                            { required: true, message: "Le nom est requis" },
                          ]}
                        >
                          <Input
                            placeholder="Entrez le nom"
                            prefix={<UserOutlined className="text-gray-400" />}
                            className="rounded-lg transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:shadow-lg"
                          />
                        </Form.Item>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              <UserOutlined className="mr-2" />
                              Prénom *
                            </span>
                          }
                          name="firstName"
                          rules={[
                            { required: true, message: "Le prénom est requis" },
                          ]}
                        >
                          <Input
                            placeholder="Entrez le prénom"
                            prefix={<UserOutlined className="text-gray-400" />}
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              <PhoneOutlined className="mr-2" />
                              Téléphone *
                            </span>
                          }
                          name="phone"
                          rules={[
                            {
                              required: true,
                              message: "Le téléphone est requis",
                            },
                            {
                              pattern: /^[2-4][0-9]{7}$/,
                              message:
                                "Le numéro doit commencer par 2, 3 ou 4 et avoir 8 chiffres",
                            },
                          ]}
                        >
                          <Input
                            maxLength={8}
                            type="tel"
                            placeholder="48354773"
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            className="rounded-lg"
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const target = e.target as HTMLInputElement;
                              // Limite à 8 caractères et uniquement des chiffres
                              target.value = target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 8);
                            }}
                          />
                        </Form.Item>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              <IdcardOutlined className="mr-2" />
                              NNI *
                            </span>
                          }
                          name="nni"
                          rules={[
                            { required: true, message: "Le NNI est requis" },
                            {
                              len: 10,
                              message: "Le NNI doit avoir 10 chiffres",
                            },
                          ]}
                        >
                          <Input
                            placeholder="1234567890"
                            prefix={
                              <IdcardOutlined className="text-gray-400" />
                            }
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="md:col-span-2"
                      >
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              <CalendarOutlined className="mr-2" />
                              Date de Naissance *
                            </span>
                          }
                          name="birthDate"
                          rules={[
                            {
                              required: true,
                              message: "La date de naissance est requise",
                            },
                          ]}
                        >
                          <DatePicker
                            className="w-full rounded-lg"
                            format="DD/MM/YYYY"
                            suffixIcon={<CalendarOutlined />}
                          />
                        </Form.Item>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3: Documents */}
                {currentStep === 1 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Documents Requis
                      </h3>
                      <p className="text-gray-500">
                        Téléchargez les documents nécessaires pour le traitement
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Carte d'identité",
                          name: "idCard",
                          required: true,
                        },
                        {
                          label: "Justificatif de domicile",
                          name: "proofOfAddress",
                          required: true,
                        },
                        {
                          label: "Bulletin de salaire",
                          name: "paySlip",
                          required: false,
                        },
                        {
                          label: "Autres documents",
                          name: "otherDocuments",
                          required: false,
                        },
                      ].map((doc, index) => (
                        <motion.div
                          key={doc.name}
                          variants={itemVariants}
                          custom={index}
                        >
                          <Card
                            hoverable
                            className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-all duration-300"
                          >
                            <Form.Item
                              label={
                                <span className="font-semibold">
                                  {doc.label}
                                  {doc.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </span>
                              }
                              name={doc.name}
                              rules={
                                doc.required
                                  ? [
                                      {
                                        required: true,
                                        message: "Ce document est requis",
                                      },
                                    ]
                                  : []
                              }
                            >
                              <Upload
                                name={doc.name}
                                action="/api/upload"
                                onChange={handleDocumentUpload}
                                showUploadList={true}
                                maxCount={3}
                              >
                                <Button
                                  icon={<UploadOutlined />}
                                  className="w-full h-20 flex flex-col items-center justify-center"
                                >
                                  Cliquez ou glissez pour télécharger
                                </Button>
                              </Upload>
                            </Form.Item>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Étape 4: Validation */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 1 }}
                      className="inline-block mb-6"
                    >
                      <CheckCircleOutlined className="text-green-500 text-6xl" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Prospect Créé avec Succès !
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Les informations du prospect ont été enregistrées. Vous
                      pouvez maintenant suivre le traitement de sa demande.
                    </p>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        className="rounded-lg"
                      >
                        Voir le Dossier
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields();
                          setCurrentStep(0);
                        }}
                        size="large"
                        className="rounded-lg"
                      >
                        Nouveau Prospect
                      </Button>
                    </Space>
                  </motion.div>
                )}
              </Form>

              {/* Boutons de navigation */}
              {currentStep < 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-gray-200"
                >
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="rounded-lg px-6 h-[46px]"
                  >
                    Précédent
                  </Button>

                  {currentStep === 2 ? (
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      icon={<CheckCircleOutlined />}
                      className="rounded-lg px-8 bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:shadow-lg"
                      size="large"
                    >
                      {isSubmitting
                        ? "Enregistrement..."
                        : "Enregistrer le Prospect"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="primary"
                        onClick={handleNext}
                        icon={<ArrowRightOutlined />}
                        className="rounded-lg px-8 !bg-main-color !h-[46px]"
                        //   size="large"
                      >
                        Suivant
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Footer avec statistiques */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-gray-500 text-sm"
      >
        <p>© 2024 Gestion des Prospects - Tous droits réservés</p>
      </motion.div> */}
    </motion.div>
  );
}
