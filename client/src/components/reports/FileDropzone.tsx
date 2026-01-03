import { useCallback } from "react";
import { Button } from "@nextui-org/react";
import { UploadCloud } from "lucide-react";

interface FileDropzoneProps {
  disabled: boolean;
  onFileSelected: (file: File) => void;
}

const FileDropzone = ({ disabled, onFileSelected }: FileDropzoneProps) => {
  const handleFile = useCallback(
    (file?: File) => {
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={`rad-card p-6 border-dashed border-2 ${
        disabled ? "opacity-50" : "border-rose-200"
      }`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <UploadCloud className="text-rose-500" />
        <p className="text-sm text-slate-600">
          Drag & drop a PDF radiology report or click to upload.
        </p>
        <Button
          color="primary"
          isDisabled={disabled}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          Upload PDF
        </Button>
        <input
          id="file-input"
          type="file"
          accept="application/pdf"
          hidden
          disabled={disabled}
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export default FileDropzone;
