# 🖼️ Logo: SVG zu PNG konvertieren

## Problem:
Das sipgate SVG-Logo ist zu komplex für jsPDF (enthält Gradienten, Masken, Clippaths).

## ✅ Lösung: Als PNG exportieren

### Schritt 1: SVG zu PNG konvertieren

**Online (Einfachste Methode):**
1. Gehen Sie zu: https://svgtopng.com/
2. Laden Sie die Datei hoch: `180227_sipgate_wort-bild-marke_schwarz_RGB.svg`
3. Wählen Sie Größe: **Breite 200px** (behält Seitenverhältnis)
4. Download PNG

**Alternativ - CloudConvert:**
1. https://cloudconvert.com/svg-to-png
2. Hochladen, Breite auf 200px setzen
3. Konvertieren & downloaden

### Schritt 2: PNG zu Base64 konvertieren

**Online:**
1. Gehen Sie zu: https://www.base64-image.de/
2. PNG hochladen
3. Base64-String kopieren

### Schritt 3: Base64 einfügen

Öffnen Sie: `src/logoData.js` und ersetzen Sie:

```javascript
export const sipgateLogoPNG = 'data:image/png;base64,IHR_BASE64_STRING_HIER';
```

### Schritt 4: Mir Bescheid sagen!

Sobald Sie den Base64-String haben, geben Sie mir Bescheid und ich integriere das Logo ins PDF!

---

## 🎨 Empfohlene PNG-Einstellungen:

- **Breite:** 200px (für 100px im PDF bei 2x Auflösung)
- **Höhe:** Auto (behält Seitenverhältnis)
- **Hintergrund:** Transparent
- **Format:** PNG-24 oder PNG-32

---

## ⚡ Schnellste Methode:

1. SVG öffnen in **Vorschau** (Mac) oder **Browser**
2. Screenshot machen (Cmd+Shift+4)
3. In Vorschau öffnen → Größe ändern auf 200px Breite
4. Als PNG exportieren
5. Auf base64-image.de hochladen
6. Base64 kopieren
7. Mir geben! ✅

---

**Momentan verwende ich:** Text "sipgate" als Logo.
**Nach PNG-Konvertierung:** Echtes sipgate Logo im PDF! 🎉
