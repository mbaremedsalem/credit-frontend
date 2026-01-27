import React from "react";
import { Upload, Button, message } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { FaUpload } from "react-icons/fa";
import { useGetTypeDocument } from "../../Services/Demandes/useGetListTypeDocument";
import SpinnerLoader from "../../Ui/Spinner";
import { motion } from "framer-motion";

interface FileUploadComponentProps {
  client: { CLIENT: string };
  type: string;
  handleFileChange: (
    info: { fileList: UploadFile[] },
    clientId: string,
    documentType: string
  ) => void;
  documentsExistants?: { type_document: string }[];
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  client,
  documentsExistants,
  handleFileChange,
  type,
}) => {
  const { data: DateDocument, isPending } = useGetTypeDocument(type);

  // Fonction pour valider la taille du fichier avant l'upload
  const beforeUpload = (file: File): boolean => {
    // const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const MAX_FILE_SIZE = 101 * 1024 * 1024; // 101MB

    if (file.size > MAX_FILE_SIZE) {
      message.error(
        `Le fichier "${file.name}" dépasse la limite de 101MB. Taille: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      return Upload.LIST_IGNORE as unknown as boolean; // Empêche complètement l'ajout
    }

    return true;
  };

  const onUploadChange =
    (documentType: string) => (info: { fileList: UploadFile[] }) => {
      handleFileChange(info, client.CLIENT, documentType);
    };

  // type FileTypetest = TypeDocument["nom"];

  if (isPending) {
    return <SpinnerLoader />;
  }

  return (
    <div className="space-y-4">
      <motion.div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
        {DateDocument?.map((type, index) => {
          const isUploaded = documentsExistants?.some(
            (doc) => doc.type_document === type.nom
          );

          if (isUploaded) return null;

          return (
            <motion.div
              initial={{ opacity: 0, x: index % 2 !== 0 ? "100vw" : "-100vw" }}
              animate={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1 * index,
                ease: "circInOut",
              }}
              viewport={{ once: true }}
              key={type.value}
              className={`w-full ${
                index % 2 !== 0 ? "col-start-2 justify-self-end" : "col-start-1"
              }`}
            >
              <label className="font-semibold text-[13px]">
                {type.nom}
                <span className="text-xs text-gray-500 ml-1">(Max: 101MB)</span>
              </label>
              <Upload
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
                maxCount={1}
                beforeUpload={beforeUpload} // Validation de taille
                onChange={onUploadChange(type.nom)}
                showUploadList={true}
              >
                <Button
                  type="dashed"
                  icon={<FaUpload />}
                  className="!h-[43px] rounded-lg flex justify-center items-center gap-2 w-full"
                >
                  Télécharger
                </Button>
              </Upload>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FileUploadComponent;
