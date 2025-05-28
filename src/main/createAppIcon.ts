import { existsSync } from 'fs';
import { join } from 'path';

// Use the custom app icon from assets (for window icons, not dock)
const createAppIcon = () => {
  // For window icons, use smaller sizes to avoid dock sizing issues
  const icnsPath = join(__dirname, '../../assets/app.icns');
  const mediumResPath = join(__dirname, '../../assets/256.png'); // Good size for windows
  const smallResPath = join(__dirname, '../../assets/128.png'); // Fallback size
  const originalIconPath = join(__dirname, '../../assets/app.png');
  const fallbackPath = join(__dirname, '../../assets/icon.png');

  if (existsSync(icnsPath)) {
    console.log(`Using ICNS app icon from: ${icnsPath}`);
    return icnsPath;
  } else if (existsSync(mediumResPath)) {
    console.log(`Using medium-resolution app icon from: ${mediumResPath}`);
    return mediumResPath;
  } else if (existsSync(smallResPath)) {
    console.log(`Using small-resolution app icon from: ${smallResPath}`);
    return smallResPath;
  } else if (existsSync(originalIconPath)) {
    console.log(`Using original app icon from: ${originalIconPath}`);
    return originalIconPath;
  } else if (existsSync(fallbackPath)) {
    console.log(`Using fallback icon from: ${fallbackPath}`);
    return fallbackPath;
  } else {
    throw new Error('No app icon found');
  }
};

// Also create a function to get NativeImage for dock
export const createAppIconNative = () => {
  const { nativeImage } = require('electron');
  const iconPath = createAppIcon();
  return nativeImage.createFromPath(iconPath);
};

export default createAppIcon;
