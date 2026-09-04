export function formatNumber(num) {
  const value = Number(num) || 0;

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
}

export function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((name) => name?.[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toDateString();
}

/**
 * Reads an image file and returns a resized JPEG data URL, so images can be
 * stored on the API without needing a separate object-storage service.
 */
export function compressImage(file, maxSize = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file selected"));
    if (!file.type?.startsWith("image/"))
      return reject(new Error("Please select an image file"));

    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read the selected file"));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Could not load the selected image"));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
