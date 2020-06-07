import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./Dropzone.css";

interface Props {
  onFileUploaded: (file: File) => void;
}

const DropZone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileURL, setSelectedFileURL] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileURL(fileUrl);
    onFileUploaded(file);
    
  }, [onFileUploaded]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileURL ? (
        <img src={selectedFileURL} alt="imagem do estabelecimento" />
      ) : (
        <p>
          <FiUpload /> Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default DropZone;
