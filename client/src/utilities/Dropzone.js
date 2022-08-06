import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import upload from "../images/upload.png";
import { useData } from "../Context/DataContext";

export default function Dropzone({ selectImage }) {
  const value = useData();

  const onDrop = useCallback((acceptedFiles) => {
    const uploadPictures = async (image) => {
      await selectImage(image);
    };
    uploadPictures(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    console.log("files are ", acceptedFiles);
  }, [acceptedFiles]);
  return (
    <div
      className="border w-xl border-dashed border-dblue p-2 rounded-lg flex flex-col space-y-3 items-center justify-center min-h-[200px] "
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col space-y-3 items-center justify-center">
        <img src={upload} />
        <p className="font-black">Drag files here</p>
        <p className="text-dblue font-black">Or select file to Upload</p>
      </div>
    </div>
  );
}
