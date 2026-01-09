import { useEffect } from "react";
import { useState } from "react";

const useImagePreview = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {

    return () => {
        if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
    }
  }, [preview]);


  const handleFileChange = (event) => {
    // console.log("INSDIE OWKED");
    
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (preview) {
        URL.revokeObjectURL(preview);
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    // console.log("URLCREATE", objectUrl);
    
    setPreview(objectUrl);
  };

  const showImage = (imageUrl) => {
    if (preview) {
        URL.revokeObjectURL(preview);
    }
    setPreview(imageUrl);
    setFile(null);
  }
  const clear = () => {
    if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  }

  return {
    file,
    preview,
    handleFileChange,
    clear,
    showImage
  };
};
export default useImagePreview;
