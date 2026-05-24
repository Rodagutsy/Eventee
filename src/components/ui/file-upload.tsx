"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  previews?: string[];
  onRemove?: (index: number) => void;
  className?: string;
}

function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  previews = [],
  onRemove,
  className = "",
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxSizeMB * 1024 * 1024) continue;
      if (previews.length + valid.length >= maxFiles) break;
      valid.push(file);
    }
    if (valid.length) onFilesSelected(valid);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-[1px] border-dashed rounded-[12px] p-8 text-center cursor-pointer transition-colors ${
          dragOver ? "border-[#4338CA] bg-[#EEF2FF]" : "border-[#DEE2E6] hover:border-[#ADB5BD]"
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-[#ADB5BD]" />
        <p className="text-[13px] text-[#6C757D]">
          Drag & drop images here, or <span className="text-[#4338CA] font-medium">browse</span>
        </p>
        <p className="text-[11px] text-[#ADB5BD] mt-1">Max {maxFiles} images, {maxSizeMB}MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-[8px] overflow-hidden border border-[#DEE2E6]">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {onRemove && (
                <button
                  onClick={() => onRemove(i)}
                  className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
export type { FileUploadProps };
