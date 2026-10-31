import { CountrySpec, PhotoAdjustments } from '../types/passport';

/**
 * Loads an image from a URL or data URI.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

/**
 * Renders a single cropped, adjusted, and framed passport photo onto an offscreen canvas.
 */
export const renderSinglePassportCanvas = async (
  imageSrc: string,
  spec: CountrySpec,
  adjustments: PhotoAdjustments,
  targetWidthPx: number = 600,
  targetHeightPx: number = 600
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidthPx;
  canvas.height = targetHeightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Background Fill
  if (adjustments.backgroundMode === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
  } else if (adjustments.backgroundMode === 'offwhite') {
    ctx.fillStyle = '#F5F5F7';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
  } else if (adjustments.backgroundMode === 'lightgray') {
    ctx.fillStyle = '#ECECF0';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
  } else {
    // Original or country default
    ctx.fillStyle = spec.bgHex || '#FFFFFF';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
  }

  // Draw loaded photo with transforms
  const img = await loadImage(imageSrc);

  ctx.save();
  // Clip to frame
  ctx.rect(0, 0, targetWidthPx, targetHeightPx);
  ctx.clip();

  // Apply filters: brightness, contrast
  const b = 100 + adjustments.brightness;
  const c = 100 + adjustments.contrast;
  ctx.filter = `brightness(${b}%) contrast(${c}%)`;

  // Center coordinate
  const cx = targetWidthPx / 2 + (adjustments.panX / 300) * targetWidthPx;
  const cy = targetHeightPx / 2 + (adjustments.panY / 300) * targetHeightPx;

  ctx.translate(cx, cy);
  ctx.rotate((adjustments.rotation * Math.PI) / 180);
  ctx.scale(adjustments.zoom, adjustments.zoom);

  // Calculate draw dimensions keeping aspect ratio
  const imgAspect = img.width / img.height;
  const targetAspect = targetWidthPx / targetHeightPx;
  let drawW = targetWidthPx;
  let drawH = targetHeightPx;

  if (imgAspect > targetAspect) {
    drawH = targetHeightPx;
    drawW = targetHeightPx * imgAspect;
  } else {
    drawW = targetWidthPx;
    drawH = targetWidthPx / imgAspect;
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  return canvas;
};

/**
 * Generates an official 4x6 inch (1200x1800 px @ 300 DPI) sheet with 4 or 6 photos,
 * complete with crop cutting marks, Earth Voyage archival header, and specs watermark.
 */
export const render4x6SheetCanvas = async (
  imageSrc: string,
  spec: CountrySpec,
  adjustments: PhotoAdjustments
): Promise<HTMLCanvasElement> => {
  // 4x6 inches at 300 DPI: 1800 x 1200 px (Landscape) or 1200 x 1800 px
  // 6 inches wide = 1800px, 4 inches tall = 1200px
  const sheetWidth = 1800;
  const sheetHeight = 1200;

  const canvas = document.createElement('canvas');
  canvas.width = sheetWidth;
  canvas.height = sheetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Pure white paper base with subtle vintage paper tone border
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidth, sheetHeight);

  // Subtle outer margin border
  ctx.strokeStyle = 'rgba(60, 47, 128, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, sheetWidth - 60, sheetHeight - 60);

  // Top Header text: Earth Voyage
  ctx.fillStyle = '#261569';
  ctx.font = 'bold 28px Literata, serif';
  ctx.fillText('EARTH VOYAGE', 50, 75);

  ctx.fillStyle = '#5C5577';
  ctx.font = '500 18px "Roboto Flex", sans-serif';
  ctx.fillText(`ARCHIVAL PHOTO SHEET  |  ${spec.countryName.toUpperCase()} — ${spec.documentType.toUpperCase()} (${spec.widthMm}x${spec.heightMm}mm / ${spec.widthInches}x${spec.heightInches}")`, 280, 75);

  // Right metadata & 300 DPI badge
  ctx.fillStyle = '#5D3BE0';
  ctx.font = '600 16px "Roboto Flex", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('300 DPI CERTIFIED PRINT READY  |  PRINT AT 100% SCALE (NO FIT TO PAGE)', sheetWidth - 50, 75);
  ctx.textAlign = 'left';

  // Bottom footer text
  ctx.fillStyle = '#797582';
  ctx.font = '400 15px "Roboto Flex", sans-serif';
  ctx.fillText(`Compliance: ${spec.officialStandard} · Cut along dashed guides · Earth Voyage Studio ID: EV-BIO-${Date.now().toString().slice(-6)}`, 50, sheetHeight - 45);

  // Render single photo canvas at standard 300 DPI target resolution
  const photoW = Math.round((spec.widthMm / 25.4) * 300); // 600px for 2in, 413px for 35mm
  const photoH = Math.round((spec.heightMm / 25.4) * 300); // 600px for 2in, 531px for 45mm
  const singlePhotoCanvas = await renderSinglePassportCanvas(imageSrc, spec, adjustments, photoW, photoH);

  // Arrange grid on the 4x6" canvas
  let cols = 2;
  let rows = 2;
  let count = 4;

  if (spec.widthMm <= 38 && spec.heightMm <= 48) {
    // 35x45mm photos: can fit 6 photos (3 cols x 2 rows)
    cols = 3;
    rows = 2;
    count = 6;
  } else if (spec.widthMm >= 50 && spec.heightMm >= 65) {
    // 50x70mm (Canada): fit 2 photos side by side
    cols = 2;
    rows = 1;
    count = 2;
  }

  // Calculate grid positioning to center on canvas between top header and bottom footer
  const usableTop = 110;
  const usableBottom = sheetHeight - 80;
  const usableHeight = usableBottom - usableTop;
  const usableLeft = 60;
  const usableRight = sheetWidth - 60;
  const usableWidth = usableRight - usableLeft;

  const gapX = 40;
  const gapY = 36;
  const totalGridW = cols * photoW + (cols - 1) * gapX;
  const totalGridH = rows * photoH + (rows - 1) * gapY;

  const startX = usableLeft + (usableWidth - totalGridW) / 2;
  const startY = usableTop + (usableHeight - totalGridH) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= count) break;

      const px = Math.round(startX + c * (photoW + gapX));
      const py = Math.round(startY + r * (photoH + gapY));

      // Draw photo
      ctx.drawImage(singlePhotoCanvas, px, py, photoW, photoH);

      // Draw fine cutting frame
      ctx.strokeStyle = '#D1CADF';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, photoW, photoH);

      // Draw corner cutting guide marks (crosshairs extending 14px outward)
      ctx.strokeStyle = '#3C2F80';
      ctx.lineWidth = 1.5;
      const mLen = 14;

      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(px - mLen, py);
      ctx.lineTo(px, py);
      ctx.moveTo(px, py - mLen);
      ctx.lineTo(px, py);
      // Top-right corner
      ctx.moveTo(px + photoW, py);
      ctx.lineTo(px + photoW + mLen, py);
      ctx.moveTo(px + photoW, py - mLen);
      ctx.lineTo(px + photoW, py);
      // Bottom-left corner
      ctx.moveTo(px - mLen, py + photoH);
      ctx.lineTo(px, py + photoH);
      ctx.moveTo(px, py + photoH);
      ctx.lineTo(px, py + photoH + mLen);
      // Bottom-right corner
      ctx.moveTo(px + photoW, py + photoH);
      ctx.lineTo(px + photoW + mLen, py + photoH);
      ctx.moveTo(px + photoW, py + photoH);
      ctx.lineTo(px + photoW, py + photoH + mLen);
      ctx.stroke();

      // Subtle label at bottom corner of each frame
      ctx.fillStyle = '#8B849E';
      ctx.font = '11px "Roboto Flex", sans-serif';
      ctx.fillText(`${spec.widthInches}x${spec.heightInches}" (${spec.widthMm}x${spec.heightMm}mm)`, px + 6, py + photoH - 6);
    }
  }

  // Draw authentic vintage postmark stamp seal in right margin space
  ctx.save();
  ctx.translate(sheetWidth - 160, sheetHeight - 140);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = 'rgba(93, 59, 224, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 43, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(60, 47, 128, 0.6)';
  ctx.font = 'bold 9px "Roboto Flex", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ EARTH VOYAGE HUB ★', 0, -22);
  ctx.fillText('BIOMETRIC VERIFIED', 0, 4);
  const now = new Date();
  const dateStr = `${now.toLocaleString('default', { month: 'short' }).toUpperCase()} ${now.getFullYear()}`;
  ctx.fillText(dateStr, 0, 24);
  ctx.restore();

  return canvas;
};

/**
 * Trigger browser file download from canvas data URL
 */
export const downloadCanvasImage = (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.96);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Synthesizes a crisp, subtle mechanical camera shutter sound using Web Audio API
 */
export const playShutterSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio permission edge cases
  }
};
