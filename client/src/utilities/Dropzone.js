import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import upload from "../images/upload.png";
import { useData } from "../Context/DataContext";

export default function Dropzone({ selectImage }) {
  const value = useData();

  const onDrop = useCallback(async (acceptedFiles) => {
 
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    if(acceptedFiles.length !== 0) {
      selectImage(acceptedFiles[0] , value.twitterCounter) ; 
    }
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
