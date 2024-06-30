"use client";

import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

interface DropzoneProps {
  doc: File | null;
  handleFileChange: (value: File | null) => void;
}

export const Dropzone = ({ doc, handleFileChange }: DropzoneProps) => {
  const onDrop = useCallback(
    (file: File[]) => {
      if (file.length > 0) {
        handleFileChange(file[0]);
      }
    },
    [handleFileChange]
  );
  const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "application/pdf": [".pdf"] },
    disabled: doc !== null,
    maxSize: MAX_UPLOAD_SIZE,
  });

  function removeFile() {
    handleFileChange(null);
  }

  const status = isDragActive || doc ? "active" : "pending";

  return (
    <div
      {...getRootProps()}
      data-status={status}
      className="flex h-24 items-center justify-center border-2
      border-dashed border-border text-sm bg-transparent rounded-md overflow-hidden
      data-[status=active]:bg-zinc-500/20
      ">
      <input {...getInputProps()} />
      {status === "pending" && (
        <div className="flex flex-col items-center gap-1.5">
          <Upload className=" size-5" />
          <p>Drag your File here...</p>
        </div>
      )}
      {status === "active" && (
        <div className=" relative w-full h-full flex flex-col items-center justify-center gap-1.5 ">
          {isDragActive ? (
            <p>Drop here...</p>
          ) : (
            <>
              <p className=" text-center text-sm">
                {doc &&
                  doc.name.length > 20 &&
                  doc?.name.substring(0, 20).concat("...")}
              </p>
              <div className=" absolute top-1 right-1">
                <Button
                  aria-label="remove file"
                  onClick={removeFile}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-4 p-0 ">
                  <X className="size-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
