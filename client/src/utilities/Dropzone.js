import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import upload from "../images/upload.png";
import { useData } from "../Context/DataContext";

export default function Dropzone({ selectImage }) {
  const ref = useRef();
  const value = useData();

  const [mobileMedia, setMobileMedia] = useState([]);
  const onDrop = useCallback(async (acceptedFiles) => {}, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "video/mp4": [".mp4", ".MP4"],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      selectImage(acceptedFiles[0], value.twitterCounter);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (mobileMedia.length !== 0) {
      selectImage(mobileMedia[0], value.twitterCounter);
    }
  }, [mobileMedia]);
  return (
    <div>
      <div
        className="hidden md:flex border w-xl border-dashed border-dblue p-2 rounded-lg flex-col space-y-3 items-center justify-center min-h-[200px] "
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col space-y-3 items-center justify-center">
          <img src={upload} />
          <p className="">Drag files here</p>
          <p className="text-dblue ">Or select file to Upload</p>
        </div>
      </div>

      <div
        onClick={(e) => {
          ref.current.click();
        }}
        className="flex border w-xl border-dashed border-dblue p-2 rounded-lg flex-col space-y-3 items-center justify-center min-h-[200px] md:hidden "
      >
        <input
          type="file"
          onChange={(e) => {
            setMobileMedia(e.target.files);
          }}
          ref={ref}
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col space-y-3 items-center justify-center">
          <img src={upload} />
          <p className="text-dblue ">Select file to Upload</p>
        </div>
      </div>
    </div>
  );
}
