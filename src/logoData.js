/**
 * Lädt das sipgate Logo als Base64-String
 */
export const loadSipgateLogo = async () => {
  try {
    // Logo aus public/ Ordner laden
    const response = await fetch('/180227_sipgate_wort-bild-marke_schwarz_RGB.png');
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Logo konnte nicht geladen werden:', error);
    return null;
  }
};

// Fallback: Text-Logo
export const sipgateLogoText = {
  type: 'text',
  text: 'sipgate',
  font: 'helvetica',
  weight: 'bold',
  size: 16
};
