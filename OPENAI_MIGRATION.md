# 🔄 Migration zu OpenAI

Das Case Study Tool wurde erfolgreich von Anthropic Claude auf OpenAI GPT-4 Turbo umgestellt.

## Was wurde geändert?

### 1. API Service
- **Neu**: `src/openaiService.js` (ersetzt `claudeService.js`)
- **Modell**: GPT-4 Turbo (`gpt-4-turbo-preview`)
- **JSON Mode**: Nutzt OpenAI's `response_format: { type: "json_object" }` für garantierte JSON-Ausgabe

### 2. Dependencies
- **Entfernt**: `@anthropic-ai/sdk`
- **Hinzugefügt**: `openai` (v4.70.2)

### 3. Environment Variables
- **Alt**: `VITE_ANTHROPIC_API_KEY`
- **Neu**: `VITE_OPENAI_API_KEY`

### 4. UI-Texte
- Alle Referenzen zu "Claude" wurden durch "GPT-4 Turbo" ersetzt
- API-Key Anleitung verweist jetzt auf platform.openai.com

## 🚀 Setup-Anleitung

### Schritt 1: Dependencies installieren
```bash
npm install
```

### Schritt 2: API-Key einrichten
1. Gehen Sie zu [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Erstellen Sie einen neuen API-Key
3. Aktualisieren Sie Ihre `.env` Datei:

```bash
# Alte Variable entfernen (falls vorhanden)
# VITE_ANTHROPIC_API_KEY=...

# Neue Variable hinzufügen
VITE_OPENAI_API_KEY=sk-proj-...
```

### Schritt 3: Anwendung neu starten
```bash
# Development Server stoppen (Ctrl+C)
npm run dev
```

### Schritt 4: Browser-Cache leeren
```bash
# Hard Refresh im Browser
Cmd/Strg + Shift + R
```

## ⚙️ Technische Details

### API-Unterschiede

| Feature | Claude (Alt) | OpenAI (Neu) |
|---------|-------------|--------------|
| Modell | `claude-opus-4-5-20251101` | `gpt-4-turbo-preview` |
| Max Tokens | 8000 | 8000 |
| Temperature | 1 | 1 |
| JSON Mode | Parsing aus Text | Native `response_format` |
| SDK | `@anthropic-ai/sdk` | `openai` |

### Vorteile von GPT-4 Turbo

✅ **JSON Mode**: Garantierte JSON-Ausgabe ohne manuelles Parsing
✅ **Großes Context Window**: Bis zu 128k Tokens
✅ **Schnelle Response**: Optimiert für Speed
✅ **Günstigere Preise**: Im Vergleich zu Claude Opus

### Code-Beispiel

**Vorher (Claude):**
```javascript
const response = await client.messages.create({
  model: 'claude-opus-4-5-20251101',
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }]
});
const text = response.content[0]?.text;
const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
```

**Nachher (OpenAI):**
```javascript
const response = await client.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  response_format: { type: "json_object" }
});
const json = JSON.parse(response.choices[0].message.content);
```

## 🔍 Troubleshooting

### "VITE_OPENAI_API_KEY nicht gefunden"
➜ Stellen Sie sicher, dass:
- Die `.env` Datei im Root-Verzeichnis liegt
- Die Variable `VITE_OPENAI_API_KEY` heißt (mit `VITE_` Prefix!)
- Sie den Dev-Server neu gestartet haben

### "Invalid API Key"
➜ Überprüfen Sie:
- Haben Sie den richtigen Key aus platform.openai.com kopiert?
- Beginnt Ihr Key mit `sk-proj-` oder `sk-`?
- Ist Ihr OpenAI Account aktiv und hat Guthaben?

### "Rate Limit Exceeded"
➜ Lösungen:
- Warten Sie ein paar Minuten
- Überprüfen Sie Ihre Rate Limits in OpenAI Dashboard
- Upgraden Sie Ihren OpenAI Plan falls nötig

### "JSON Parse Error"
➜ Der JSON Mode sollte dies verhindern, aber falls es auftritt:
- Überprüfen Sie den System Prompt
- Stellen Sie sicher, dass das Modell `gpt-4-turbo-preview` ist
- Prüfen Sie die Logs in der Browser Console

## 📊 Kosten-Vergleich

**Claude Opus 4.5:**
- Input: $15 / 1M Tokens
- Output: $75 / 1M Tokens

**GPT-4 Turbo:**
- Input: $10 / 1M Tokens
- Output: $30 / 1M Tokens

➜ **GPT-4 Turbo ist deutlich günstiger!**

Beispiel-Case Study (~4000 Input + 4000 Output Tokens):
- Claude Opus: ~$0.36
- GPT-4 Turbo: ~$0.16

**Ersparnis: ~55%**

## ✅ Checklist

- [ ] `npm install` ausgeführt
- [ ] `.env` mit `VITE_OPENAI_API_KEY` aktualisiert
- [ ] Dev-Server neu gestartet
- [ ] Browser-Cache geleert (Hard Refresh)
- [ ] Test-Case Study erfolgreich geladen
- [ ] PDF-Export funktioniert
- [ ] Live-Preview mit Editing funktioniert

## 🎉 Fertig!

Ihr Case Study Builder läuft jetzt mit OpenAI GPT-4 Turbo!

Bei Fragen oder Problemen, schauen Sie in die Browser Console (F12) für detaillierte Fehlermeldungen.
