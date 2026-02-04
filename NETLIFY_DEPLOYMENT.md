# Netlify Deployment Guide

## Sichere API-Key Konfiguration

Die Anwendung nutzt jetzt **Netlify Functions** als sicheren Backend-Proxy für API-Aufrufe. Die API-Keys bleiben auf dem Server und werden nie im Client-Code exponiert.

## Setup-Schritte

### 1. Umgebungsvariablen in Netlify konfigurieren

Gehen Sie zu Ihrem Netlify-Dashboard:

1. Öffnen Sie Ihr Site Dashboard
2. Navigieren Sie zu **Site configuration** → **Environment variables**
3. Fügen Sie die folgenden Variablen hinzu:

**WICHTIG:** Verwenden Sie **NICHT** das `VITE_` Präfix in Netlify!

#### Für OpenAI:
```
Key: OPENAI_API_KEY
Value: sk-proj-...
```

#### Für Anthropic Claude:
```
Key: ANTHROPIC_API_KEY
Value: sk-ant-api03-...
```

### 2. Deployment triggern

Nach dem Hinzufügen der Umgebungsvariablen:

1. Commiten und pushen Sie Ihre Änderungen
2. Netlify wird automatisch neu deployen
3. Die Netlify Functions werden automatisch bereitgestellt

### 3. Testen

Nach dem Deployment:

1. Öffnen Sie Ihre deployed Site
2. Die App sollte automatisch erkennen, dass sie in Produktion läuft
3. API-Aufrufe werden automatisch über die Netlify Functions geroutet
4. Keine API-Keys sind im Browser sichtbar

## Wie es funktioniert

### Entwicklung (lokal)
- Nutzt `VITE_OPENAI_API_KEY` oder `VITE_ANTHROPIC_API_KEY` aus `.env`
- Direkte API-Aufrufe an OpenAI/Anthropic
- `dangerouslyAllowBrowser: true` ist aktiv

### Produktion (Netlify)
- Keine `VITE_` Präfix-Variablen im Client
- API-Aufrufe gehen an `/.netlify/functions/generate-casestudy`
- Netlify Function nutzt `OPENAI_API_KEY` oder `ANTHROPIC_API_KEY` (Server-seitig)
- API-Keys bleiben sicher auf dem Server

## Dateien

- `netlify/functions/generate-casestudy.js` - Backend-Proxy für API-Aufrufe
- `netlify.toml` - Netlify-Konfiguration
- `src/openaiService.js` - Erkennt Umgebung und wählt passende Methode
- `src/claudeService.js` - Erkennt Umgebung und wählt passende Methode

## Fehlerbehebung

### "Secret detected" Fehler beim Build
- **Ursache:** `VITE_` Präfix-Variablen werden in den Build eingebettet
- **Lösung:** Verwenden Sie `OPENAI_API_KEY` und `ANTHROPIC_API_KEY` ohne `VITE_` Präfix in Netlify

### Function returns 500 Error
- Prüfen Sie die Netlify Function Logs im Dashboard
- Stellen Sie sicher, dass die Umgebungsvariablen korrekt gesetzt sind (ohne `VITE_` Präfix)
- Prüfen Sie, ob die API-Keys gültig sind

### App funktioniert lokal, aber nicht auf Netlify
- Stellen Sie sicher, dass Sie die Umgebungsvariablen in Netlify hinzugefügt haben
- Triggern Sie ein neues Deployment nach dem Hinzufügen der Variablen
- Prüfen Sie die Browser Console auf Fehler

## Sicherheit

Die neue Implementierung ist sicher, weil:

1. API-Keys sind nur auf dem Server (Netlify Functions)
2. Client-Code enthält keine Keys
3. Netlify's Secret Scanner wird keine Keys mehr im Build finden
4. Keys sind nicht im Browser sichtbar (DevTools, Network Tab, etc.)

## Entwicklung vs. Produktion

Die Services erkennen automatisch die Umgebung:

```javascript
// Prüft, ob wir in Produktion sind
const isProduction = () => {
  return !import.meta.env.VITE_OPENAI_API_KEY;
};
```

- **Entwicklung:** `VITE_` Variable vorhanden → Direkter API-Aufruf
- **Produktion:** Keine `VITE_` Variable → Netlify Function als Proxy
