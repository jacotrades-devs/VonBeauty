/**
 * Utility to compress images in browser memory using HTML5 Canvas.
 * Allows storing portfolio photos directly in Firestore without needing Firebase Storage
 * or requiring a paid/Blaze billing account with a credit card.
 */

export interface CompressedImageResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export const compressImageToDataUrl = (
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.8
): Promise<CompressedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved downscaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Use high quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for superior compression, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If WebP is not supported or yielded a huge size, ensure JPEG fallback
        if (!dataUrl.startsWith('data:image/webp') && !dataUrl.startsWith('data:image/jpeg')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Estimate size in bytes from base64 length
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const sizeBytes = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          sizeBytes,
          width,
          height
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
