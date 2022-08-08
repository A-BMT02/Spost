import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../utilities/canvasPreview";
import { useDebounceEffect } from "../utilities/useDebounceEffect";
import { useData } from "../Context/DataContext";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function PreviewImage() {
  const { state } = useLocation();
  const [image, setImage] = useState(state.image);

  const value = useData();

  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    minWidth: 600,
    minHeight: 335,
  });
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState();
  const [showError, setShowError] = useState(false);
  const [imageError, setImageError] = useState("");

  const navigate = useNavigate();

  const error = useRef(null);
  const { dispatch } = useData();

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const checkImageSpec = () => {
    let pass = false;
    const url = previewCanvasRef.current.toDataURL();
    const width = previewCanvasRef.current.width;
    const height = previewCanvasRef.current.height;

    if (state.social === "twitter") {
      if ((width >= 600) & (height >= 335)) {
        pass = true;
      } else {
        pass = false;
        setImageError("Image width must be at least 600 X 335");
        return;
      }
    } else if (state.social === "facebook") {
      if ((width >= 600) & (height >= 315)) {
        pass = true;
      } else {
        pass = false;
        setImageError("Image width must be at least 600 X 315");
        return;
      }
    }
    let extension = "";
    if (state.extension === "jpg" || state.extension === "png") {
      extension = "image/jpeg";
    } else if (state.extension === "gif") {
      extension = "image/gif";
    }
  

    convertAndSave(extension, pass);
  };

  const convertAndSave = (extension, pass) => {
    previewCanvasRef.current.toBlob(function (blob) {
      const imageObject = URL.createObjectURL(blob);

      const blobSize = blob.size / 1000000;
      if (blobSize <= 5) {
        pass = true;
      } else {
        pass = false;
        setImageError("image size must not exceed 5mb");
        return;
      }
      pass = true;
      setImageError("");
      switch (state.for) {
        case "twitter":
          let type;
          if (imageObject.indexOf("blob") !== -1) {
            type = "image";
          }
          dispatch({
            type: "addPicture",
            fileType: type,
            file: imageObject,
            index: value.twitterCounter,
          });

          navigate("/newpost");
        case "facebook":
          return value.setFacebookPicture(state.image);
        case "linkedin":
          return value.setLinkedinPicture(state.image);
      }
      navigate("/newpost");
    }, extension);
  };


  useEffect(() => {
    setCrop(undefined);
    const reader = new FileReader();
    reader.addEventListener("load", () => setImage(back));
  }, []);

  useEffect(() => {
    if (imageError !== "") {
      setShowError(true);
    }
  }, [imageError]);

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  return (
    <div className="flex flex-col space-y-6 w-full h-screen items-center mt-10 ">
      <div
        ref={error}
        className={
          showError
            ? "flex space-x-6 ixed  top-2 mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite "
            : "hidden"
        }
      >
        <p className="font-inter font-bold">{imageError}</p>
        <p
          onClick={(e) => {
            error.current.classList.add("hidden");
            setShowError(false);
            setImageError("");
          }}
          className="font-inter font-black"
        >
          X
        </p>
      </div>

      <div className="border-b pb-2 border-dblue mt-12">
        <p className="text-3xl text-dblue">Crop Image for {state.social}</p>
      </div>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
      >
        <img
          className="!max-w-lg"
          ref={imgRef}
          alt="Cropped image"
          src={image}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          onLoad={onImageLoad}
        />
      </ReactCrop>

      <div>
        <button
          className="bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2"
          onClick={(e) => checkImageSpec()}
        >
          Save
        </button>
      </div>
      <div className="hidden">
        {Boolean(completedCrop) && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </div>

      <div className="flex justify-center mx-5 md:mx-0">
        <div className="flex flex-col font-inter font-bold space-y-2 ">
          <div className="border-b pb-2 border-dblue w-fit mb-3">
            <h2 className="font-bold text-dblue text-xl">
              {state.social} image specifications
            </h2>
          </div>
          {state.social === "twitter" && (
            <div className="flex flex-col font-inter font-bold space-y-2">
              <div>
                <p>
                  <span className="text-ored">*</span>Minimum size: 600 by 335
                  pixels
                </p>
              </div>
              <div>
                <p>
                  <span className="text-ored">*</span>Recommended aspect ratio:
                  any aspect between 2:1 and 1:1 on desktop; 2:1, 3:4 and 16:9
                  on mobile
                </p>
              </div>
              <div>
                <p>
                  <span className="text-ored">*</span>Supported formats: GIF,
                  JPG and PNG
                </p>
              </div>
              <div>
                <p>
                  <span className="text-ored">*</span>Maximum file size: Up to
                  5MB for photos and GIFs on mobile. Up to 15MB on the web.
                </p>
              </div>
            </div>
          )}
          {state.social === "facebook" && (
            <div className="flex flex-col font-inter font-bold space-y-2">
              <div>
                <p>
                  <span className="text-ored">*</span>Minimum size: 600 x 315
                  pixels
                </p>
              </div>
              <div>
                <p>
                  <span className="text-ored">*</span>Recommended size: 1200 x
                  630 pixels
                </p>
              </div>
            </div>
          )}
          {state.social === "linkedin" && (
            <div className="flex flex-col font-inter font-bold space-y-2">
              <div>
                <p>
                  <span className="text-ored">*</span>Recommended size: 1200 x
                  627 pixels
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
