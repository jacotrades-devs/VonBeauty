/**
 * Utility to compress images in browser memory using HTML5 Canvas.
 * Strictly preserves the exact original aspect ratio so images never stretch or distort.
 */

export interface CompressedImageResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export const compressImageToDataUrl = (
  file: File,
  maxWidth = 1440,
  maxHeight = 1440,
  quality = 0.82
): Promise<CompressedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        const originalWidth = img.naturalWidth || img.width;
        const originalHeight = img.naturalHeight || img.height;

        if (originalWidth === 0 || originalHeight === 0) {
          reject(new Error('Invalid image dimensions'));
          return;
        }

        // Strictly preserve aspect ratio with uniform scaling factor
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (originalWidth > maxWidth || originalHeight > maxHeight) {
          const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
          targetWidth = Math.max(1, Math.round(originalWidth * scale));
          targetHeight = Math.max(1, Math.round(originalHeight * scale));
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Try WebP first for superior compression, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (!dataUrl || (!dataUrl.startsWith('data:image/webp') && !dataUrl.startsWith('data:image/jpeg'))) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Estimate size in bytes from base64 length
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const sizeBytes = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          sizeBytes,
          width: targetWidth,
          height: targetHeight
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
