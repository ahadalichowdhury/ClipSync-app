import { app, nativeImage } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

// Create a polished icon for the tray using custom app icon
const createTrayIcon = () => {
  console.log('Creating tray icon from custom app icon');

  // Try to use the CS diary icon - prefer 16x16 size for optimal tray display
  const iconPaths = [
    join(__dirname, '../../assets/16.png'), // Perfect size for tray
    join(__dirname, '../../assets/32.png'), // Good fallback
    join(__dirname, '../../assets/app.png'), // Main app icon
    join(process.resourcesPath, 'assets', '16.png'), // Production 16x16
    join(process.resourcesPath, 'assets', '32.png'), // Production 32x32
    join(process.resourcesPath, 'assets', 'app.png'), // Production main
  ];

  let image: Electron.NativeImage;
  let iconLoaded = false;

  for (const iconPath of iconPaths) {
    if (existsSync(iconPath)) {
      try {
        console.log('Trying CS diary icon path:', iconPath);
        const customImage = nativeImage.createFromPath(iconPath);

        if (!customImage.isEmpty()) {
          // If it's already 16x16, use as-is, otherwise resize
          const size = customImage.getSize();
          if (size.width === 16 && size.height === 16) {
            image = customImage;
            console.log('Using perfect 16x16 CS diary icon for tray');
          } else {
            image = customImage.resize({ width: 16, height: 16 });
            console.log(
              `Using CS diary icon for tray, resized from ${size.width}x${size.height} to 16x16`
            );
          }
          iconLoaded = true;
          break;
        }
      } catch (error) {
        console.warn(`Error loading CS diary icon from ${iconPath}:`, error);
      }
    }
  }

  if (!iconLoaded) {
    console.warn('No CS diary icon found, using fallback');
    image = createFallbackTrayIcon();
  }

  // In production, save to userData directory instead of assets
  let iconPath: string;
  try {
    if (app.isPackaged) {
      // Production: use userData directory
      const userDataPath = app.getPath('userData');
      const iconsDir = join(userDataPath, 'icons');

      // Ensure icons directory exists
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }

      iconPath = join(iconsDir, 'tray-icon-template.png');
    } else {
      // Development: use assets directory
      iconPath = join(__dirname, '../../assets/tray-icon-template.png');

      // Ensure assets directory exists
      const assetsDir = dirname(iconPath);
      if (!existsSync(assetsDir)) {
        mkdirSync(assetsDir, { recursive: true });
      }
    }

    writeFileSync(iconPath, image.toPNG());
    return iconPath;
  } catch (error) {
    console.error('Error saving tray icon:', error);

    // Fallback: return the image directly without saving
    // This should work in most cases
    return image;
  }
};

// Fallback function to create CS diary tray icon if custom icon fails
const createFallbackTrayIcon = (): Electron.NativeImage => {
  const size = 16;
  const data = Buffer.alloc(size * size * 4); // RGBA format

  // Colors for modern CS clipboard icon (matching the main icon)
  const colors = {
    clipboardBlue: [52, 73, 94, 255], // Dark blue #34495e
    clipGray: [149, 165, 166, 255], // Gray clip #95a5a6
    bindingBrown: [180, 140, 100, 255], // Brown binding #b48c64
    textWhite: [255, 255, 255, 255], // White text
    transparent: [0, 0, 0, 0], // Transparent
  };

  // Draw modern CS clipboard icon at 16x16 size
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Convert to coordinate system (0-16 scaled from 0-100)
      const cx = (x / size) * 100;
      const cy = (y / size) * 100;

      let color = colors.transparent;

      // Main clipboard body (simplified for small size)
      const isMainBody = cx >= 20 && cx <= 80 && cy >= 15 && cy <= 90;

      // Metal clip at top (simplified)
      const isClip = cx >= 35 && cx <= 65 && cy >= 5 && cy <= 20;

      // Spiral binding rings (simplified - just one ring for 16x16)
      const ringCenter = { x: 15, y: 50 };
      const ringRadius = 6;
      const isRing =
        Math.sqrt(
          Math.pow(cx - ringCenter.x, 2) + Math.pow(cy - ringCenter.y, 2)
        ) <= ringRadius;

      // "CS" text (simplified for small size)
      const textCenterX = 50;
      const textCenterY = 52;

      // Letter "C" (simplified)
      const isLetterC =
        Math.sqrt(
          Math.pow(cx - (textCenterX - 8), 2) + Math.pow(cy - textCenterY, 2)
        ) <= 8 &&
        Math.sqrt(
          Math.pow(cx - (textCenterX - 8), 2) + Math.pow(cy - textCenterY, 2)
        ) >= 5 &&
        cx <= textCenterX - 2;

      // Letter "S" (simplified)
      const isLetterS =
        // Top line
        (cx >= textCenterX + 2 &&
          cx <= textCenterX + 14 &&
          cy >= textCenterY - 8 &&
          cy <= textCenterY - 4) ||
        // Middle line
        (cx >= textCenterX + 2 &&
          cx <= textCenterX + 14 &&
          cy >= textCenterY - 2 &&
          cy <= textCenterY + 2) ||
        // Bottom line
        (cx >= textCenterX + 2 &&
          cx <= textCenterX + 14 &&
          cy >= textCenterY + 4 &&
          cy <= textCenterY + 8) ||
        // Left vertical (top)
        (cx >= textCenterX + 2 &&
          cx <= textCenterX + 5 &&
          cy >= textCenterY - 8 &&
          cy <= textCenterY + 2) ||
        // Right vertical (bottom)
        (cx >= textCenterX + 11 &&
          cx <= textCenterX + 14 &&
          cy >= textCenterY - 2 &&
          cy <= textCenterY + 8);

      // Apply colors (simplified layering)
      if (isClip) {
        color = colors.clipGray; // Gray clip
      } else if (isRing) {
        color = colors.bindingBrown; // Brown ring
      } else if (isMainBody) {
        if (isLetterC || isLetterS) {
          color = colors.textWhite; // White text
        } else {
          color = colors.clipboardBlue; // Blue clipboard body
        }
      }

      // Set pixel color
      data[i] = color[0]; // R
      data[i + 1] = color[1]; // G
      data[i + 2] = color[2]; // B
      data[i + 3] = color[3]; // A
    }
  }

  return nativeImage.createFromBuffer(data, {
    width: size,
    height: size,
  });
};

export default createTrayIcon;
