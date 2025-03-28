import { ImageFilter, ImageAdjustments } from "@shared/schema";

export function applyFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: ImageFilter
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  switch (filter) {
    case "grayscale":
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // r
        data[i + 1] = avg; // g
        data[i + 2] = avg; // b
      }
      break;
    case "sepia":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;
    case "invert":
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // r
        data[i + 1] = 255 - data[i + 1]; // g
        data[i + 2] = 255 - data[i + 2]; // b
      }
      break;
    case "blur":
      // For blur, we'll use the built-in canvas filter
      // First clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Apply blur filter and redraw
      const originalDrawImage = ctx.drawImage;
      ctx.filter = "blur(4px)";
      
      // We'll use the original image from canvas
      // Get a temporary canvas to hold the original image
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      
      if (tempCtx) {
        // Copy current image to temp canvas
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw temp canvas to main canvas with blur
        ctx.drawImage(tempCanvas, 0, 0);
        
        // Reset filter
        ctx.filter = "none";
      }
      
      return; // Return early as we've already applied changes
    case "vintage":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, r * 0.9 + 20);
        data[i + 1] = Math.min(255, g * 0.8 + 10);
        data[i + 2] = Math.min(255, b * 0.7);
      }
      break;
    case "cool":
      for (let i = 0; i < data.length; i += 4) {
        data[i + 2] = Math.min(255, data[i + 2] + 30); // Add blue
      }
      break;
    case "warm":
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 30); // Add red
        data[i + 1] = Math.min(255, data[i + 1] + 15); // Add some green
      }
      break;
    case "sharpen":
      // For sharpen, we'll use a convolution filter
      // First reset the canvas with the original image
      ctx.clearRect(0, 0, width, height);
      
      // Apply a contrast filter to create a sharpening effect
      ctx.filter = "contrast(120%)";
      
      // We'll use the original image from canvas
      // Get a temporary canvas to hold the original image
      const tempCanvasSharpen = document.createElement("canvas");
      tempCanvasSharpen.width = width;
      tempCanvasSharpen.height = height;
      const tempCtxSharpen = tempCanvasSharpen.getContext("2d");
      
      if (tempCtxSharpen) {
        // Copy current image to temp canvas
        tempCtxSharpen.putImageData(imageData, 0, 0);
        
        // Draw temp canvas to main canvas with sharpening
        ctx.drawImage(tempCanvasSharpen, 0, 0);
        
        // Reset filter
        ctx.filter = "none";
      }
      
      return; // Return early as we've already applied changes
    default:
      return; // No filter or unrecognized filter
  }

  ctx.putImageData(imageData, 0, 0);
}

export function applyAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: ImageAdjustments
): void {
  // Get the current image data from the canvas
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply brightness, contrast, saturation adjustments
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    const brightnessAdjustment = adjustments.brightness * 2.55; // Convert to 0-255 scale
    r += brightnessAdjustment;
    g += brightnessAdjustment;
    b += brightnessAdjustment;

    // Contrast
    const contrastFactor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Saturation
    const satFactor = 1 + adjustments.saturation / 100;
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    r = gray + satFactor * (r - gray);
    g = gray + satFactor * (g - gray);
    b = gray + satFactor * (b - gray);

    // Apply changes, ensuring values are in valid range
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));

    // Opacity
    data[i + 3] = data[i + 3] * (adjustments.opacity / 100);
  }

  // Apply the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Apply hue rotation using a temporary canvas 
  // as it's better handled with CSS filters
  if (adjustments.hue !== 0) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.filter = `hue-rotate(${adjustments.hue}deg)`;
      tempCtx.drawImage(ctx.canvas, 0, 0);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }
}
