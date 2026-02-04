# Quick Start - PDF-Export testen (OHNE API-Key)

Sie möchten den PDF-Export testen, ohne einen API-Key einzurichten? Kein Problem!

## Schnellstart (3 Schritte)

### 1. Node.js installieren (falls noch nicht vorhanden)

Besuchen Sie: https://nodejs.org/
Laden Sie die **LTS-Version** herunter und installieren Sie sie.

### 2. Projekt starten

**Empfohlen (löscht Cache automatisch):**
```bash
cd /Users/kevinpiela/Documents/Claude
./fresh-start.sh
```

**Alternativ (manuell):**
```bash
cd /Users/kevinpiela/Documents/Claude
npm install
npm run dev
```

### 3. PDF-Export testen

1. Öffnen Sie im Browser: **http://localhost:3000**
2. **WICHTIG:** Machen Sie einen Hard Refresh (Cache leeren):
   - **Mac:** `Cmd + Shift + R`
   - **Windows/Linux:** `Strg + Shift + R`
3. Sie sehen eine Meldung "⚠️ API-Key erforderlich"
4. Scrollen Sie nach unten zum grünen Kasten **"💡 PDF-Export direkt testen"**
5. Klicken Sie auf den grünen Button **"Beispiel-Case Study laden →"**
6. ✅ Fertig! Sie können jetzt alle Export-Formate testen

**Sie sehen den grünen Button nicht?** → Schauen Sie in `BROWSER_CACHE_FIX.md`

## Was können Sie testen?

Die Beispiel-Case Study ist eine vollständige **Autohaus Case Study** mit:
- ✅ 4 Playbooks (Probefahrt, Werkstatt, Fahrzeuganfrage, Finanzierung)
- ✅ 5 Use Cases
- ✅ Vorher/Nachher-Vergleiche
- ✅ Automatisierungen (Pre-Call, In-Call, Post-Call)
- ✅ Workflow-Beispiel
- ✅ Alle Features vollständig

## Export-Formate testen

Nach dem Laden der Beispiel-Case Study können Sie herunterladen:

### 📄 PDF (Empfohlen!)
**Hochwertiges 2-Seiten PDF** mit professionellem Layout
- Lime-Branding
- Strukturierte Tabellen
- Workflow-Visualisierungen
- Druckfertig in A4

### 🌐 HTML
HTML-Version zum Drucken oder Weiterverarbeiten

### 📝 Markdown
Vollständiger Inhalt für Content-Management-Systeme

### 🤖 JSON
Agent-Konfiguration für Demo-Agents

## Eigene Case Studies generieren

Wenn Sie eigene Case Studies generieren möchten, benötigen Sie einen Anthropic API-Key:

1. Besuchen Sie: https://console.anthropic.com/settings/keys
2. Erstellen Sie einen API-Key
3. Erstellen Sie eine `.env` Datei:
   ```bash
   cp .env.example .env
   ```
4. Fügen Sie Ihren Key ein:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
5. Starten Sie die Anwendung neu

## Probleme?

**Port bereits belegt?**
```bash
# In vite.config.js einen anderen Port einstellen
# z.B. port: 3001
```

**npm nicht gefunden?**
- Node.js installieren (siehe Schritt 1)
- Terminal neu starten

**Beispiel-Case Study lädt nicht?**
- Browser-Cache löschen (Strg+Shift+R / Cmd+Shift+R)
- Konsole auf Fehler prüfen (F12)

---

**Viel Erfolg beim Testen! 🚀**
