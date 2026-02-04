# 🔄 Logo von PDF zu SVG/PNG konvertieren

## Problem:
jsPDF kann PDF-Dateien nicht als Logo einbetten. Wir brauchen **SVG**, **PNG** oder **JPG**.

## ✅ Lösung: Konvertieren Sie das Logo

### Option 1: Online (Schnell & Einfach)

**CloudConvert** (kostenlos):
1. Gehen Sie zu: https://cloudconvert.com/pdf-to-svg
2. Laden Sie Ihr Logo-PDF hoch
3. Wählen Sie "SVG" als Zielformat
4. Konvertieren & herunterladen
5. Legen Sie die SVG-Datei hier ab:
   ```
   /Users/kevinpiela/Documents/Claude/public/sipgate-logo.svg
   ```

**Alternative - zu PNG konvertieren:**
https://cloudconvert.com/pdf-to-png

### Option 2: Mit Adobe Illustrator (falls vorhanden)

1. PDF in Illustrator öffnen
2. "Datei" → "Exportieren" → "Exportieren als..."
3. Format: "SVG" wählen
4. Speichern unter `sipgate-logo.svg`
5. In `public/` Ordner legen

### Option 3: Mit macOS Vorschau

1. PDF mit Vorschau öffnen
2. "Datei" → "Exportieren..."
3. Format: "PNG" wählen
4. Auflösung: 300 DPI oder höher
5. Speichern unter `sipgate-logo.png`
6. In `public/` Ordner legen

### Option 4: Mit Inkscape (Kostenlos, Open Source)

1. Inkscape herunterladen: https://inkscape.org/
2. PDF öffnen
3. "Datei" → "Speichern unter..."
4. Format: "Optimized SVG" wählen
5. Als `sipgate-logo.svg` speichern

---

## 📋 Nach der Konvertierung:

**Legen Sie die Datei hier ab:**
```bash
/Users/kevinpiela/Documents/Claude/public/sipgate-logo.svg
```

**Oder als PNG:**
```bash
/Users/kevinpiela/Documents/Claude/public/sipgate-logo.png
```

**Dann sagen Sie mir Bescheid** und ich integriere es ins PDF!

---

## 🎨 Empfohlene Einstellungen:

- **Format:** SVG (beste Qualität, skaliert perfekt)
- **Alternative:** PNG mit transparentem Hintergrund
- **Größe:** Breite ca. 800-1000px (wird automatisch skaliert)
- **Hintergrund:** Transparent (funktioniert auf Lime-Header)

---

## ⚡ Schnellste Methode:

**Für Mac-Nutzer mit Vorschau:**
1. PDF öffnen
2. Cmd+Shift+E (Exportieren)
3. Format: PNG, Auflösung: 300
4. Speichern als `sipgate-logo.png`
5. In `public/` Ordner ziehen
6. Fertig! ✅

**Sagen Sie mir dann:** "Logo ist jetzt als PNG/SVG im public Ordner" und ich integriere es!
