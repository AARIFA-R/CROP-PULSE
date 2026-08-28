/**
 * High-Performance Client-Side Canvas Image Compressor
 * Downscales mobile camera imagery to max 1024px width/height at 80% JPEG quality.
 */

export interface CompressionResult {
  dataUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
  compressionRatio: number;
}

export async function compressImage(
  input: File | Blob | string,
  maxDimension: number = 1024,
  quality: number = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    let sourceUrl = '';
    let isCreatedObjectUrl = false;
    let originalSize = 0;

    if (input instanceof File || input instanceof Blob) {
      originalSize = input.size;
      sourceUrl = URL.createObjectURL(input);
      isCreatedObjectUrl = true;
    } else if (typeof input === 'string') {
      sourceUrl = input;
      // Estimate size if base64
      if (input.startsWith('data:')) {
        const base64Length = input.length - (input.indexOf(',') + 1);
        originalSize = Math.round(base64Length * 0.75);
      } else {
        originalSize = 1024 * 500; // estimated fallback
      }
    } else {
      return reject(new Error('Invalid image input provided for compression'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        let targetW = origW;
        let targetH = origH;

        if (origW > maxDimension || origH > maxDimension) {
          if (origW >= origH) {
            targetW = maxDimension;
            targetH = Math.round((origH * maxDimension) / origW);
          } else {
            targetH = maxDimension;
            targetW = Math.round((origW * maxDimension) / origH);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
          throw new Error('Canvas 2D context creation failed');
        }

        // Enable high-quality bilinear image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw white background in case source has PNG transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);

        // Render downscaled image
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Export as 80% quality JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate compressed size
        const base64Data = compressedDataUrl.substring(compressedDataUrl.indexOf(',') + 1);
        const compressedSize = Math.round(base64Data.length * 0.75);
        const compressionRatio = originalSize > 0 
          ? Math.max(1, Math.round((originalSize / compressedSize) * 10) / 10) 
          : 1;

        if (isCreatedObjectUrl) {
          URL.revokeObjectURL(sourceUrl);
        }

        resolve({
          dataUrl: compressedDataUrl,
          width: targetW,
          height: targetH,
          originalWidth: origW,
          originalHeight: origH,
          originalSize,
          compressedSize,
          mimeType: 'image/jpeg',
          compressionRatio
        });
      } catch (err) {
        if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
        reject(err);
      }
    };

    img.onerror = (err) => {
      if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
      reject(new Error('Failed to load image for canvas compression'));
    };

    img.src = sourceUrl;
  });
}
