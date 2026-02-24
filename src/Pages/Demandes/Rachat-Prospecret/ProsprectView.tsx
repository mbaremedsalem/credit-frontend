import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Input,
  Button,
  Card,
  Form,
  Steps,
  Upload,
  message,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Modal,
  Tooltip,
  Badge,
  Progress,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  MailOutlined,
  BankOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  DownloadOutlined,
  FileOutlined,
  CalendarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { Check, HomeOutlined } from "@mui/icons-material";
import { typeAddRachat } from "../../../Services/Rachat/typeRachat";
import AuthService from "../../../Auth-Services/AuthService";
import { useAddRachat } from "../../../Services/Rachat/useAddRachat";

const { Step } = Steps;
const { Title, Text } = Typography;

export default function ProsprectView() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<typeAddRachat>>({});

  const [carteIdentite, setCarteIdentite] = useState<UploadFile[]>([]);
  const [justificatifDomicile, setJustificatifDomicile] = useState<
    UploadFile[]
  >([]);
  const [bulletinSalaire, setBulletinSalaire] = useState<UploadFile[]>([]);
  const [autreDocument, setAutreDocument] = useState<UploadFile[]>([]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewFileType, setPreviewFileType] = useState("");

  const { mutate: addRachat, isPending } = useAddRachat();

  const steps = [
    {
      title: "Informations Personnelles",
      icon: <UserOutlined />,
      description: "Coordonnées et identité",
    },
    {
      title: "Informations Financières",
      icon: <BankOutlined />,
      description: "Détails du rachat",
    },
    {
      title: "Documents Requis",
      icon: <FileTextOutlined />,
      description: "Pièces justificatives",
    },
    {
      title: "Validation",
      icon: <CheckCircleOutlined />,
      description: "Vérification finale",
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();

      if (currentStep === 2) {
        if (carteIdentite.length === 0) {
          message.error("Veuillez télécharger la carte d'identité (requis)");
          return;
        }
        if (justificatifDomicile.length === 0) {
          message.error(
            "Veuillez télécharger le justificatif de domicile (requis)",
          );
          return;
        }
        if (bulletinSalaire.length === 0) {
          message.error("Veuillez télécharger le bulletin de salaire (requis)");
          return;
        }
      }
      
      setFormData({ ...formData, ...values });
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      message.error("Veuillez remplir tous les champs obligatoires");
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fonction de prévisualisation améliorée
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    const fileType = file.type || "";
    setPreviewFileType(fileType);

    if (fileType.startsWith("image/")) {
      // Pour les images, afficher l'image
      setPreviewImage(file.url || (file.preview as string));
    } else {
      // Pour les PDF, créer une URL blob
      if (file.originFileObj) {
        const blob = new Blob([file.originFileObj], { type: fileType });
        const url = URL.createObjectURL(blob);
        setPreviewImage(url);
      } else if (file.url) {
        setPreviewImage(file.url);
      }
    }

    setPreviewVisible(true);
    setPreviewTitle(file.name || "Aperçu du fichier");
  };

  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Fonction pour gérer le changement des fichiers
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<UploadFile[]>>) =>
    (info: any) => {
      let newFileList = [...info.fileList];

      // Limiter à 1 fichier
      newFileList = newFileList.slice(-1);

      setter(newFileList);

      // Gérer les messages
      if (info.file.status === "done") {
        message.success(`${info.file.name} téléchargé avec succès`);
      } else if (info.file.status === "error") {
        message.error(`Échec du téléchargement de ${info.file.name}`);
      } else if (info.file.status === "removed") {
        message.info(`${info.file.name} supprimé`);
      }
    };

  // Fonction pour supprimer un fichier
  const handleRemove =
    (setter: React.Dispatch<React.SetStateAction<UploadFile[]>>) =>
    (file: UploadFile) => {
      setter([]);
      message.info(`${file.name} supprimé`);
    };

  // Validation avant upload
  const beforeUpload = (file: RcFile) => {
    const isImageOrPdf =
      file.type === "application/pdf" || file.type.startsWith("image/");
    if (!isImageOrPdf) {
      message.error("Vous ne pouvez télécharger que des PDF ou des images!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Le fichier doit faire moins de 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // Upload personnalisé (simulé)
  const customUpload = async (options: any) => {
    const { onSuccess, onError } = options;

    // Simuler un upload
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess("ok");
    } catch (err) {
      onError({ err });
    }
  };

  // Configuration des props pour l'upload
  const getUploadProps = (
    fileList: UploadFile[],
    setter: React.Dispatch<React.SetStateAction<UploadFile[]>>,
  ): UploadProps => ({
    name: "file",
    multiple: false,
    customRequest: customUpload,
    fileList,
    beforeUpload,
    onChange: handleChange(setter),
    onRemove: handleRemove(setter),
    onPreview: handlePreview,
    accept: ".pdf,.jpg,.jpeg,.png",
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: true,
      showPreviewIcon: true,
      downloadIcon: <DownloadOutlined />,
      removeIcon: <DeleteOutlined />,
      previewIcon: <EyeOutlined />,
    },
    itemRender: (_originNode, file, _fileList, actions) => {
      const isImage = file.type?.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center justify-between p-3 bg-white border rounded-lg mt-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <Space>
            {isImage ? (
              <FileImageOutlined className="text-blue-500 text-xl" />
            ) : isPdf ? (
              <FilePdfOutlined className="text-red-500 text-xl" />
            ) : (
              <FileOutlined className="text-gray-500 text-xl" />
            )}
            <div className="flex flex-col">
              <Text className="text-sm font-medium max-w-[200px] truncate">
                {file.name}
              </Text>
              <Text type="secondary" className="text-xs">
                {(file.size! / 1024).toFixed(2)} KB
              </Text>
            </div>
          </Space>
          <Space size={2}>
            <Tooltip title="Voir">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => actions.preview()}
                size="small"
                className="hover:text-blue-500"
              />
            </Tooltip>
            <Tooltip title="Télécharger">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  if (file.originFileObj) {
                    const url = URL.createObjectURL(file.originFileObj);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                size="small"
                className="hover:text-green-500"
              />
            </Tooltip>
            <Tooltip title="Supprimer">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => actions.remove()}
                size="small"
              />
            </Tooltip>
          </Space>
        </motion.div>
      );
    },
  });

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

  const ValidationStep = () => {
    const formValues = form.getFieldsValue();
    const allData = { ...formData, ...formValues };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.12,
          delayChildren: 0.2,
          staggerDirection: 1,
        },
      },
    };

    const cardVariants = {
      hidden: (i: number) => ({
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotateX: i * 10 - 10,
        filter: "blur(10px)",
      }),
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 12,
          delay: i * 0.15,
          duration: 0.8,
        },
      }),
      hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 30px 60px rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.1)",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, x: -20, scale: 0.95 },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      },
      hover: {
        x: 5,
        backgroundColor: "rgba(59, 130, 246, 0.05)",
        transition: { duration: 0.2 },
      },
    };

    const badgeVariants = {
      hidden: { scale: 0, rotate: -180, opacity: 0 },
      visible: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 15,
        },
      },
    };

    const floatingParticleVariants = {
      animate: (i: number) => ({
        y: [0, -30, 0],
        x: [0, i % 2 === 0 ? 15 : -15, 0],
        rotate: [0, i * 10, 0],
        transition: {
          duration: 5 + i,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        },
      }),
    };

    const DescriptiveItem = ({ label, value, icon, trend }: any) => (
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        className="group relative"
      >
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm hover:border-blue-200 transition-all duration-300">
          <Space size="middle" className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center text-blue-600 group-hover:text-blue-700 group-hover:rotate-12 transition-all duration-300">
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <Text
                type="secondary"
                className="text-sm group-hover:text-blue-600 transition-colors"
              >
                {label}
              </Text>
              <div className="flex items-center gap-2">
                <Text strong className="text-lg">
                  {value || (
                    <span className="text-gray-400 italic">Non renseigné</span>
                  )}
                </Text>
                {trend && (
                  <Tag color="green" className="text-xs">
                    {/* <CountUp end={trend} suffix="%" duration={2} /> */}
                  </Tag>
                )}
              </div>
            </div>
          </Space>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-gray-300 group-hover:text-blue-400"
          >
            <GlobalOutlined />
          </motion.div>
        </div>
      </motion.div>
    );

    // Composant de statut de document amélioré
    const DocumentStatus = ({ label, file, required, icon }: any) => (
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <div className="relative h-full bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-500" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:text-purple-700 group-hover:rotate-12 transition-all duration-300">
                  {icon}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3"
                >
                  {file ? (
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  ) : required ? (
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  ) : null}
                </motion.div>
              </div>
              {required && (
                <Badge.Ribbon text="Requis" color="red" className="text-xs">
                  <div className="w-16" />
                </Badge.Ribbon>
              )}
            </div>
            <Text
              strong
              className="block mb-2 group-hover:text-purple-700 transition-colors"
            >
              {label}
            </Text>
            {file ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg"
              >
                <CheckCircleOutlined className="text-sm" />
                <Text className="text-xs text-green-700 truncate flex-1">
                  {file.name}
                </Text>
              </motion.div>
            ) : (
              <Text type="secondary" className="text-sm italic">
                {required ? "Document requis" : "Optionnel"}
              </Text>
            )}
          </div>
        </div>
      </motion.div>
    );

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-8 overflow-hidden px-4 py-6"
      >
        {/* Éléments d'arrière-plan animés sophistiqués */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={floatingParticleVariants}
              animate="animate"
              className="absolute w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
              style={{
                top: `${i * 20}%`,
                left: `${i * 15}%`,
                filter: "blur(60px)",
              }}
            />
          ))}
        </div>

        {/* En-tête premium avec animations avancées */}
        <motion.div variants={badgeVariants} className="relative">
          <motion.div
            animate={{
              boxShadow: [
                "0 20px 40px -15px rgba(59,130,246,0.3)",
                "0 30px 50px -15px rgba(147,51,234,0.5)",
                "0 20px 40px -15px rgba(59,130,246,0.3)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative overflow-hidden rounded-2xl bg-main-color to-purple-600 p-[2px]"
          >
            <div className="relative bg-white rounded-2xl overflow-hidden">
              {/* Ligne de lumière animée */}
              {/* <div className="">
                <TwoHandsWaveAnimation />
              </div> */}

              <div className="relative py-8 px-10">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1 px-6">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Title
                        level={2}
                        className="!text-3xl !mb-2 bg-main-color bg-clip-text text-transparent font-bold"
                      >
                        Récapitulatif de demande
                      </Title>
                    </motion.div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mt-6">
                  <Progress
                    percent={100}
                    showInfo={false}
                    strokeColor={{
                      "0%": "black",
                      "100%": "black",
                    }}
                    className="!m-0"
                  />
                  <div className="flex justify-between mt-2">
                    <Text type="secondary">Début</Text>
                    <Tag color="blue" className="font-semibold">
                      Étape finale
                    </Tag>
                    <Text type="secondary">Validation</Text>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <Row gutter={[24, 24]}>
          {/* Carte Informations Personnelles */}
          <Col xs={24} lg={12}>
            <motion.div
              custom={0}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card
                className="h-full border-0 shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm"
                bodyStyle={{ padding: 0 }}
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"
                  />

                  <div className="relative !bg-main-color p-5">
                    <div className="flex items-center justify-between">
                      <Space size="middle" className="text-white">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        >
                          <UserOutlined className="text-2xl" />
                        </motion.div>
                        <div>
                          <Title
                            level={4}
                            className="!text-white !m-0 font-semibold"
                          >
                            Informations Personnelles
                          </Title>
                          <Text className="text-white/80 text-sm">
                            Identité & coordonnées
                          </Text>
                        </div>
                      </Space>
                      <Tag
                        color="blue"
                        className="bg-white/20 border-0 text-white"
                      >
                        {/* <CountUp end={100} suffix="%" duration={2} /> complet */}
                      </Tag>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <DescriptiveItem
                    label="Nom complet"
                    value={`${allData.nom || ""} ${allData.prenom || ""}`}
                    icon={<UserOutlined />}
                  />
                  <DescriptiveItem
                    label="Téléphone"
                    value={allData.tel}
                    icon={<PhoneOutlined />}
                  />
                  <DescriptiveItem
                    label="Email"
                    value={allData.email}
                    icon={<MailOutlined />}
                    trend={98}
                  />
                  <DescriptiveItem
                    label="NNI"
                    value={allData.nni}
                    icon={<IdcardOutlined />}
                  />
                  <DescriptiveItem
                    label="Adresse"
                    value={allData.adresse}
                    icon={<HomeOutlined />}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Carte Informations Financières */}
          <Col xs={24} lg={12}>
            <motion.div
              custom={1}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card
                className="h-full border-0 shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-green-50/30 backdrop-blur-sm"
                bodyStyle={{ padding: 0 }}
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -2, 2, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"
                  />

                  <div className="relative !bg-main-color p-5">
                    <div className="flex items-center justify-between">
                      <Space size="middle" className="text-white">
                        <motion.div
                          animate={{
                            rotate: [0, -360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        >
                          <BankOutlined className="text-2xl" />
                        </motion.div>
                        <div>
                          <Title
                            level={4}
                            className="!text-white !m-0 font-semibold"
                          >
                            Informations Financières
                          </Title>
                          <Text className="text-white/80 text-sm">
                            Crédit & mensualités
                          </Text>
                        </div>
                      </Space>
                      <Tag
                        color="green"
                        className="bg-white/20 border-0 text-white"
                      >
                        {/* <DollarOutlined /> Montant: <CountUp end={parseInt(allData.montant_rachat) || 0} separator=" " /> MRU */}
                      </Tag>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <DescriptiveItem
                    label="Montant du rachat"
                    value={
                      allData.montant_rachat
                        ? `${allData.montant_rachat} MRU`
                        : ""
                    }
                    icon={<CreditCardOutlined />}
                  />
                  <DescriptiveItem
                    label="Institution actuelle"
                    value={allData.institution_actuelle}
                    icon={<BankOutlined />}
                  />
                  <DescriptiveItem
                    label="Type de crédit"
                    value={allData.type_credit}
                    icon={<FileTextOutlined />}
                  />
                  <DescriptiveItem
                    label="Durée restante"
                    value={
                      allData.duree_restante_mois
                        ? `${allData.duree_restante_mois} mois`
                        : ""
                    }
                    icon={<ClockCircleOutlined />}
                  />
                  {allData.mensualite_actuelle && (
                    <DescriptiveItem
                      label="Mensualité actuelle"
                      value={`${allData.mensualite_actuelle} MRU`}
                      icon={<CalendarOutlined />}
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Carte Documents */}
          <Col span={24}>
            <motion.div custom={2} variants={cardVariants} whileHover="hover">
              <Card
                className="border-0 shadow-xl overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-purple-50/30 backdrop-blur-sm"
                bodyStyle={{ padding: 0 }}
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -left-10 -top-10 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                  />

                  <div className="relative !bg-main-color p-5">
                    <div className="flex items-center justify-between">
                      <Space size="middle" className="text-white">
                        <motion.div
                          animate={{
                            rotateY: [0, 180, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 8, repeat: Infinity }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        >
                          <FileTextOutlined className="text-2xl" />
                        </motion.div>
                        <div>
                          <Title
                            level={4}
                            className="!text-white !m-0 font-semibold"
                          >
                            Documents Téléchargés
                          </Title>
                          <Text className="text-white/80 text-sm">
                            Pièces justificatives
                          </Text>
                        </div>
                      </Space>
                      <Badge
                        count={`${[carteIdentite[0], justificatifDomicile[0], bulletinSalaire[0], autreDocument[0]].filter(Boolean).length}/4`}
                        className="bg-white/20 text-white border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <Row gutter={[16, 16]}>
                    {[
                      {
                        label: "Carte d'identité",
                        file: carteIdentite[0],
                        required: true,
                        icon: <IdcardOutlined />,
                      },
                      {
                        label: "Justificatif de domicile",
                        file: justificatifDomicile[0],
                        required: true,
                        icon: <HomeOutlined />,
                      },
                      {
                        label: "Bulletin de salaire",
                        file: bulletinSalaire[0],
                        required: true,
                        icon: <FileTextOutlined />,
                      },
                      {
                        label: "Autre document",
                        file: autreDocument[0],
                        required: false,
                        icon: <FileOutlined />,
                      },
                    ].map((doc, index) => (
                      <Col xs={24} sm={12} md={6} key={index}>
                        <DocumentStatus
                          label={doc.label}
                          file={doc.file}
                          required={doc.required}
                          icon={doc.icon}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Section de confirmation finale premium */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
            className="flex justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 10px 30px -10px rgba(34,197,94,0.2)",
                  "0 20px 40px -10px rgba(34,197,94,0.4)",
                  "0 10px 30px -10px rgba(34,197,94,0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-main-color rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative flex items-center space-x-3 px-8 py-4 bg-main-color rounded-full shadow-xl">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircleOutlined className="text-white text-2xl" />
                </motion.div>
                <Text className="text-white font-semibold text-lg">
                  Toutes les informations sont validées et prêtes à être
                  soumises
                </Text>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {/* <ThunderboltOutlined className="text-white text-xl" /> */}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  const handleSubmitData = async () => {
    const formValues = form.getFieldsValue();
    const allData = { ...formData, ...formValues };

    setIsSubmitting(true);

    // Vérifier que tous les documents requis sont uploadés
    if (carteIdentite.length === 0) {
      message.error("La carte d'identité est requise");
      setIsSubmitting(false);
      setCurrentStep(2);
      return;
    }
    if (justificatifDomicile.length === 0) {
      message.error("Le justificatif de domicile est requis");
      setIsSubmitting(false);
      setCurrentStep(2);
      return;
    }
    if (bulletinSalaire.length === 0) {
      message.error("Le bulletin de salaire est requis");
      setIsSubmitting(false);
      setCurrentStep(2);
      return;
    }
    //  count={`${[carteIdentite[0], justificatifDomicile[0], bulletinSalaire[0], autreDocument[0]].filter(Boolean).length}/4`}
    const params: typeAddRachat = {
      createur_id: Number(AuthService.getIDUserConnect()),
      nom: allData.nom,
      prenom: allData.prenom,
      tel: allData.tel,
      email: allData.email,
      nni: allData.nni,
      adresse: allData.adresse,
      montant_rachat: allData.montant_rachat,
      institution_actuelle: allData.institution_actuelle,
      type_credit: allData.type_credit,
      duree_restante_mois: allData.duree_restante_mois,

      carte_identite_file: carteIdentite[0].originFileObj,
      justificatif_domicile_file: justificatifDomicile[0].originFileObj,
    };

    console.log("|params   |||   : ,    ", params);
    await addRachat(params, {
      onSuccess: () => {
        console.log("data submitted : ", params);
      },
    });
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8"
    >
      <div className=" mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Tag color="blue" className="px-4 py-1 text-sm mb-4">
              Demande de Rachat de Crédit
            </Tag>
          </motion.div>
          <Title
            level={1}
            className="!text-3xl md:!text-4xl !text-gray-800 mb-2"
          >
            Nouvelle Demande
          </Title>
          <Text type="secondary" className="text-lg">
            Remplissez le formulaire ci-dessous pour initier votre demande de
            rachat de crédit
          </Text>
        </motion.div>

        {/* Steps */}
        <motion.div variants={itemVariants} className="mb-5">
          <Steps
            current={currentStep}
            className="custom-steps"
            responsive
            labelPlacement="vertical"
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={
                  <Text
                    strong={index === currentStep}
                    className={index === currentStep ? "text-blue-600" : ""}
                  >
                    {step.title}
                  </Text>
                }
                // description={step.description}
                icon={
                  <motion.div
                    animate={{
                      scale: index === currentStep ? [1, 1.2, 1] : 1,
                      color: index === currentStep ? "#1890ff" : undefined,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentStep > index ? (
                      <Check className="text-2xl" />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                }
              />
            ))}
          </Steps>
        </motion.div>

        {/* Formulaire */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="shadow-2xl border-0 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: "40px" }}
            >
              <Form
                form={form}
                layout="vertical"
                size="large"
                onValuesChange={(_, values) =>
                  setFormData({ ...formData, ...values })
                }
              >
                {/* Étape 1: Informations Personnelles */}
                {currentStep === 0 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <Title
                      level={3}
                      className="!text-blue-600 !mb-3 text-center"
                    >
                      Informations Personnelles
                    </Title>

                    <div className="grid grid-cols-2 gap-4">
                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              Nom <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="nom"
                          rules={[
                            { required: true, message: "Le nom est requis" },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Votre nom"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              Prénom <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="prenom"
                          rules={[
                            { required: true, message: "Le prénom est requis" },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Votre prénom"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              Téléphone <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="tel"
                          rules={[
                            {
                              required: true,
                              message: "Le téléphone est requis",
                            },
                            {
                              pattern: /^[2-4][0-9]{7}$/,
                              message: "Format invalide (ex: 48354773)",
                            },
                          ]}
                        >
                          <Input
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            placeholder="48354773"
                            maxLength={8}
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              Email <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="email"
                          rules={[
                            { required: true, message: "L'email est requis" },
                            { type: "email", message: "Email invalide" },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="med@gmail.com"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              NNI <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="nni"
                          rules={[
                            { required: true, message: "Le NNI est requis" },
                            {
                              len: 10,
                              message: "Le NNI doit contenir 10 chiffres",
                            },
                            {
                              pattern: /^[0-9]+$/,
                              message:
                                "Le NNI ne doit contenir que des chiffres",
                            },
                          ]}
                        >
                          <Input
                            prefix={
                              <IdcardOutlined className="text-gray-400" />
                            }
                            placeholder="1234567890"
                            maxLength={10}
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col>
                        <Form.Item
                          label={
                            <Text strong>
                              Adresse complète{" "}
                              <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="adresse"
                          rules={[
                            {
                              required: true,
                              message: "L'adresse est requise",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Votre adresse complète"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2: Informations Financières */}
                {currentStep === 1 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <Title level={3} className="!text-blue-600 !mb-6">
                      Détails du Rachat
                    </Title>

                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label={
                            <Text strong>
                              Montant du rachat (MRU){" "}
                              <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="montant_rachat"
                          rules={[
                            {
                              required: true,
                              message: "Le montant est requis",
                            },
                            {
                              pattern: /^[0-9]+$/,
                              message: "Le montant doit être un nombre",
                            },
                          ]}
                        >
                          <Input
                            prefix={
                              <CreditCardOutlined className="text-gray-400" />
                            }
                            placeholder="50000"
                            suffix="MRU"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          label={
                            <Text strong>
                              Institution actuelle (Banque){" "}
                              <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="institution_actuelle"
                          rules={[
                            {
                              required: true,
                              message: "L'institution est requise",
                            },
                          ]}
                        >
                          <Input placeholder="banque" className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          label={
                            <Text strong>
                              Type de crédit{" "}
                              <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="type_credit"
                          rules={[
                            {
                              required: true,
                              message: "Le type de crédit est requis",
                            },
                          ]}
                        >
                          <Input
                            placeholder="type de crédit"
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          label={
                            <Text strong>
                              Durée (mois){" "}
                              <span className="text-red-500">*</span>
                            </Text>
                          }
                          name="duree_restante_mois"
                          rules={[
                            { required: true, message: "La durée est requise" },
                            {
                              pattern: /^[0-9]+$/,
                              message: "La durée doit être un nombre",
                            },
                          ]}
                        >
                          <Input
                            prefix={
                              <ClockCircleOutlined className="text-gray-400" />
                            }
                            placeholder="12"
                            suffix="mois"
                            className="hover:border-blue-400 focus:shadow-md"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {/* Étape 3: Documents */}
                {currentStep === 2 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <Title level={3} className="!text-blue-600">
                        Documents Requis
                      </Title>
                      <Text type="secondary">
                        Formats acceptés : PDF, JPG, PNG (Max 5MB)
                      </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                      <Col xs={24} md={12}>
                        <Card
                          className={`document-card h-full ${carteIdentite.length === 0 ? "border-red-200" : "border-green-200"}`}
                        >
                          <Form.Item
                            label={
                              <Space>
                                <Text strong>
                                  Carte d'identité{" "}
                                  <span className="text-red-500">*</span>
                                </Text>
                                <Tag
                                  color={
                                    carteIdentite.length > 0
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {carteIdentite.length > 0
                                    ? "Téléchargé"
                                    : "Requis"}
                                </Tag>
                              </Space>
                            }
                            required
                          >
                            <Upload
                              {...getUploadProps(
                                carteIdentite,
                                setCarteIdentite,
                              )}
                              className="w-full"
                            >
                              {carteIdentite.length === 0 && (
                                <Button
                                  icon={<UploadOutlined />}
                                  className="w-full h-24 border-dashed hover:border-blue-400"
                                >
                                  Cliquez ou glissez pour télécharger
                                </Button>
                              )}
                            </Upload>
                          </Form.Item>
                        </Card>
                      </Col>

                      <Col xs={24} md={12}>
                        <Card
                          className={`document-card h-full ${justificatifDomicile.length === 0 ? "border-red-200" : "border-green-200"}`}
                        >
                          <Form.Item
                            label={
                              <Space>
                                <Text strong>
                                  Justificatif de domicile{" "}
                                  <span className="text-red-500">*</span>
                                </Text>
                                <Tag
                                  color={
                                    justificatifDomicile.length > 0
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {justificatifDomicile.length > 0
                                    ? "Téléchargé"
                                    : "Requis"}
                                </Tag>
                              </Space>
                            }
                            required
                          >
                            <Upload
                              {...getUploadProps(
                                justificatifDomicile,
                                setJustificatifDomicile,
                              )}
                              className="w-full"
                            >
                              {justificatifDomicile.length === 0 && (
                                <Button
                                  icon={<UploadOutlined />}
                                  className="w-full h-24 border-dashed hover:border-blue-400"
                                >
                                  Cliquez ou glissez pour télécharger
                                </Button>
                              )}
                            </Upload>
                          </Form.Item>
                        </Card>
                      </Col>

                      <Col xs={24} md={12}>
                        <Card
                          className={`document-card h-full ${bulletinSalaire.length === 0 ? "border-red-200" : "border-green-200"}`}
                        >
                          <Form.Item
                            label={
                              <Space>
                                <Text strong>
                                  Bulletin de salaire{" "}
                                  <span className="text-red-500">*</span>
                                </Text>
                                <Tag
                                  color={
                                    bulletinSalaire.length > 0
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {bulletinSalaire.length > 0
                                    ? "Téléchargé"
                                    : "Requis"}
                                </Tag>
                              </Space>
                            }
                            required
                          >
                            <Upload
                              {...getUploadProps(
                                bulletinSalaire,
                                setBulletinSalaire,
                              )}
                              className="w-full"
                            >
                              {bulletinSalaire.length === 0 && (
                                <Button
                                  icon={<UploadOutlined />}
                                  className="w-full h-24 border-dashed hover:border-blue-400"
                                >
                                  Cliquez ou glissez pour télécharger
                                </Button>
                              )}
                            </Upload>
                          </Form.Item>
                        </Card>
                      </Col>

                      <Col xs={24} md={12}>
                        <Card className="document-card h-full">
                          <Form.Item
                            label={
                              <Space>
                                <Text strong>Autre document</Text>
                                <Tag color="blue">Optionnel</Tag>
                              </Space>
                            }
                          >
                            <Upload
                              {...getUploadProps(
                                autreDocument,
                                setAutreDocument,
                              )}
                              className="w-full"
                            >
                              {autreDocument.length === 0 && (
                                <Button
                                  icon={<UploadOutlined />}
                                  className="w-full h-24 border-dashed hover:border-blue-400"
                                >
                                  Cliquez ou glissez pour télécharger
                                </Button>
                              )}
                            </Upload>
                          </Form.Item>
                        </Card>
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {/* Étape 4: Validation */}
                {currentStep === 3 && <ValidationStep />}

                {/* Étape 5: Succès */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 0.8 }}
                      className="inline-block mb-6"
                    >
                      <CheckCircleOutlined className="text-green-500 text-7xl" />
                    </motion.div>

                    <Title level={2} className="!text-gray-800 mb-4">
                      Demande Soumise avec Succès !
                    </Title>

                    <Text
                      type="secondary"
                      className="text-lg block mb-8 max-w-md mx-auto"
                    >
                      demande de rachat de crédit a été enregistrée
                    </Text>

                    <div className="bg-blue-50 p-6 rounded-xl mb-8 max-w-md mx-auto">
                      <Text strong className="text-blue-700 block mb-2">
                        Numéro de dossier
                      </Text>
                      <Text copyable className="text-2xl font-mono">
                        RAC-
                        {Math.random()
                          .toString(36)
                          .substring(2, 10)
                          .toUpperCase()}
                      </Text>
                    </div>

                    <Space size="large">
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        className="rounded-lg px-8"
                      >
                        Suivre ma demande
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields();
                          setCarteIdentite([]);
                          setJustificatifDomicile([]);
                          setBulletinSalaire([]);
                          setAutreDocument([]);
                          setCurrentStep(0);
                        }}
                        size="large"
                        className="rounded-lg px-8"
                      >
                        Nouvelle demande
                      </Button>
                    </Space>
                  </motion.div>
                )}
              </Form>

              {/* Navigation */}
              {currentStep < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 pt-4 mt-3 gap-4 border-t border-gray-200"
                >
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="rounded-lg px-8 h-12"
                    size="large"
                  >
                    Précédent
                  </Button>

                  {currentStep === 3 ? (
                    <Button
                      onClick={handleSubmitData}
                      loading={isPending}
                      icon={<CheckCircleOutlined />}
                      className="rounded-lg px-8 h-12 !bg-main-color !text-white border-0 hover:shadow-lg"
                      size="large"
                    >
                      {isSubmitting ? "Traitement..." : "Confirmer la demande"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      icon={<ArrowRightOutlined />}
                      className="rounded-lg px-8 h-12 !bg-main-color !border-0 hover:shadow-lg !text-white"
                      size="large"
                    >
                      Suivant
                    </Button>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal de prévisualisation amélioré */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          if (previewFileType === "application/pdf" && previewImage) {
            URL.revokeObjectURL(previewImage);
          }
        }}
        width={previewFileType === "application/pdf" ? "80%" : "auto"}
        className="preview-modal"
      >
        {previewFileType?.startsWith("image/") ? (
          <img
            alt="preview"
            style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            src={previewImage}
          />
        ) : previewFileType === "application/pdf" ? (
          <iframe
            src={previewImage}
            title={previewTitle}
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        ) : (
          <div className="text-center p-8">
            <FileOutlined className="text-6xl text-gray-400 mb-4" />
            <Text>Aperçu non disponible pour ce type de fichier</Text>
          </div>
        )}
      </Modal>

      <style>{`
        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background: #1890ff;
          border-color: #1890ff;
        }
        .document-card {
          transition: all 0.3s ease;
          border-width: 2px;
        }
        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .ant-upload-list {
          margin-top: 8px;
        }
        .preview-modal .ant-modal-body {
          padding: 0;
          max-height: 80vh;
          overflow: auto;
        }
      `}</style>
    </motion.div>
  );
}
