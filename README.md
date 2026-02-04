# Case Study Builder für sipgate AI Agents

Ein professionelles Tool zur Generierung branchenspezifischer Case Studies mit OpenAI GPT-4 Turbo und hochwertiger PDF-Ausgabe.

## Features

- **GPT-4 Turbo Integration** - Nutzt OpenAI's leistungsstärkstes Modell mit JSON Mode
- **Hochwertige PDF-Generierung** - Professionelle 2-Seiten PDFs mit jsPDF und sipgate Logo
- **Live-Preview mit Inline-Editing** - Bearbeiten Sie alle Inhalte direkt im PDF-Layout
- **Mehrere Export-Formate** - PDF, HTML, Markdown und JSON
- **Branchenspezifisch** - Angepasste Inhalte für verschiedene Branchen
- **Agent-Konfiguration** - Exportiert fertige Playbook-Konfigurationen
- **Test-Modus** - Laden Sie Beispiel-Case Studies ohne API-Key

## Setup & Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. API-Key einrichten

Erstellen Sie eine `.env` Datei im Projektverzeichnis:

```bash
cp .env.example .env
```

Öffnen Sie `.env` und fügen Sie Ihren OpenAI API-Key ein:

```
VITE_OPENAI_API_KEY=sk-proj-...
```

**API-Key erhalten:**
1. Besuchen Sie [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Erstellen Sie einen neuen API-Key
3. Kopieren Sie den Key in die `.env` Datei

**💡 Tipp:** Sie können das Tool auch ohne API-Key testen! Laden Sie einfach die Beispiel-Case Study.

### 3. Anwendung starten

```bash
npm run dev
```

Die Anwendung läuft unter: **http://localhost:3000**

## Verwendung

1. **Branche eingeben** - z.B. "Autohaus", "Zahnarztpraxis", "Steuerberater"
2. **Unternehmensgröße angeben** - z.B. "25 Mitarbeiter"
3. **Anrufvolumen** - z.B. "80 Anrufe pro Tag"
4. **Optional: Spezifischer Use Case** - z.B. "Terminvereinbarung"
5. **Optional: Ihr Name** - Wird im Dokument als Ansprechpartner angezeigt
6. **"Case Study erstellen" klicken**

Nach ca. 30-60 Sekunden erhalten Sie:
- ✅ Hochwertiges PDF (2 Seiten, professionelles Layout)
- ✅ HTML-Version (zum Drucken oder Weiterverarbeiten)
- ✅ Markdown-Format (für Content-Management-Systeme)
- ✅ Agent-Konfiguration als JSON (für Demo-Agents)

## Technische Details

### Verwendetes Modell

- **Modell:** Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- **Vorteile:** Höchste Qualität, beste Reasoning-Fähigkeiten, konsistente Ausgaben
- **Context Window:** 200k Tokens

### PDF-Generierung

- **Library:** jsPDF
- **Format:** A4 (210mm x 297mm)
- **Seiten:** 2 Seiten mit professionellem Layout
- **Features:**
  - Farbige Header mit Lime-Branding
  - Strukturierte Tabellen für Playbooks
  - Vorher/Nachher-Vergleiche
  - Workflow-Visualisierungen
  - Automatisierungs-Übersichten

### Projektstruktur

```
/Users/kevinpiela/Documents/Claude/
├── src/
│   ├── main.jsx              # Einstiegspunkt
│   ├── CaseStudyBuilder.jsx  # Hauptkomponente
│   ├── claudeService.js      # Claude API Integration
│   ├── pdfService.js         # PDF-Generierung
│   └── index.css             # Tailwind CSS
├── .env                      # API-Key (nicht committen!)
├── .env.example              # Template für .env
├── package.json              # Dependencies
├── vite.config.js            # Vite Konfiguration
└── README.md                 # Diese Datei
```

## Wichtige Hinweise

### Sicherheit

⚠️ **Browser-basierte API-Aufrufe sind nur für Entwicklung geeignet!**

Für Produktivumgebungen sollte der API-Key über ein Backend verwaltet werden, um:
- Den API-Key vor Benutzern zu verbergen
- Anfragen zu limitieren
- Kosten zu kontrollieren

### API-Kosten

Claude Opus 4.5 ist das Premium-Modell:
- Input: ~$15 pro 1M Tokens
- Output: ~$75 pro 1M Tokens
- Eine Case Study kostet ca. $0.20-0.40

Für günstigere Tests können Sie in `src/claudeService.js` das Modell auf `claude-sonnet-4-20250514` ändern.

### Fehlerbehandlung

Wenn Sie Fehler erhalten:

1. **"VITE_ANTHROPIC_API_KEY nicht gefunden"**
   - Prüfen Sie, ob die `.env` Datei existiert
   - Starten Sie die Anwendung neu nach `.env` Änderungen

2. **"API-Anfrage fehlgeschlagen"**
   - Prüfen Sie Ihren API-Key
   - Prüfen Sie Ihr API-Guthaben auf console.anthropic.com
   - Prüfen Sie Ihre Internetverbindung

3. **"Keine gültige JSON-Antwort"**
   - Das Modell hat kein valides JSON zurückgegeben
   - Versuchen Sie es erneut (sehr selten)

## Weiterentwicklung

### Modell ändern

In `src/claudeService.js` Zeile 20:

```javascript
const MODEL = 'claude-opus-4-5-20251101';  // Premium
// const MODEL = 'claude-sonnet-4-20250514';  // Günstiger
```

### PDF-Layout anpassen

In `src/pdfService.js` können Sie:
- Farben ändern (Zeile 3: `LIME`)
- Layout-Struktur anpassen (Funktionen `renderPage1`, `renderPage2`)
- Schriftgrößen ändern
- Abstände anpassen

### Prompt optimieren

In `src/CaseStudyBuilder.jsx` ab Zeile 9 finden Sie den `SYSTEM_PROMPT`, der die Qualität der Case Studies bestimmt.

## Build für Produktion

```bash
npm run build
```

Erstellt optimierte Dateien im `dist/` Ordner.

## Support

Bei Fragen oder Problemen:
- Prüfen Sie die Browser-Konsole für Fehlermeldungen
- Überprüfen Sie die `.env` Datei
- Stellen Sie sicher, dass alle Dependencies installiert sind

---

**Entwickelt mit Claude Opus 4.5 und jsPDF** 🚀
