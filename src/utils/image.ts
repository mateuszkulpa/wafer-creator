export const getImageByFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const imgObj = new Image();

      if (typeof event.target?.result === "string") {
        imgObj.src = event.target.result;
        imgObj.onload = () => {
          resolve(imgObj);
        };
      }
    };
    reader.onerror = error => reject(error);
  });
