import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

type ImageUploaderProps = {
  onChange?: (file: File) => void;
};

export function ImageUploader({ onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    onChange?.(file);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div
      className="border border-input rounded-lg bg-background p-4 flex items-center justify-center cursor-pointer h-[180px] sm:h-[200px]"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {previewUrl ? (
        <div className="flex flex-col items-center">
          <img
            src={previewUrl}
            alt="Token logo preview"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="border border-dashed border-input rounded-lg p-4 sm:p-6">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
            Drag & drop or click to upload (max 1 MB)
          </p>
        </div>
      )}
    </div>
  );
}
