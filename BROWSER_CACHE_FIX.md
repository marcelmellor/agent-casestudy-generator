# 🔄 Browser-Cache leeren

Wenn Sie die alte Version ohne den grünen Test-Button sehen, liegt das am Browser-Cache.

## Schnelle Lösung:

### 1. Server neu starten
```bash
# Im Terminal: Strg+C drücken um den Server zu stoppen
# Dann neu starten:
npm run dev
```

### 2. Browser-Cache leeren (Hard Refresh)

**Chrome/Edge (Windows/Linux):**
- Drücken Sie: `Strg + Shift + R`
- Oder: `Strg + F5`

**Chrome/Edge (Mac):**
- Drücken Sie: `Cmd + Shift + R`

**Firefox (Windows/Linux):**
- Drücken Sie: `Strg + Shift + R`
- Oder: `Strg + F5`

**Firefox (Mac):**
- Drücken Sie: `Cmd + Shift + R`

**Safari (Mac):**
- Drücken Sie: `Cmd + Option + R`
- Oder: `Cmd + Option + E` (Cache leeren) → dann `Cmd + R`

### 3. Alternative: Private/Incognito Mode
Öffnen Sie die URL in einem Inkognito-/Privaten Fenster:
- **Chrome/Edge:** `Strg/Cmd + Shift + N`
- **Firefox:** `Strg/Cmd + Shift + P`
- **Safari:** `Cmd + Shift + N`

Dann öffnen Sie: `http://localhost:3000`

## Was Sie sehen sollten:

✅ **Richtige Version (mit Test-Button):**
```
⚠️ API-Key erforderlich

So richten Sie den API-Key ein:
[Anleitung...]

💡 PDF-Export direkt testen
Möchten Sie den PDF-Export ohne API-Key testen?
[Beispiel-Case Study laden →]  ← DIESER GRÜNE BUTTON!
```

❌ **Alte Version (ohne Test-Button):**
```
⚠️ API-Key erforderlich

So richten Sie den API-Key ein:
[Anleitung...]

[Kein grüner Button]
```

## Immer noch die alte Version?

Dann machen Sie folgendes:

### Kompletter Cache-Reset:

1. **Server stoppen:** `Strg+C` im Terminal
2. **Build-Cache löschen:**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   ```
3. **Server neu starten:**
   ```bash
   npm run dev
   ```
4. **Browser komplett schließen** und neu öffnen
5. **URL neu aufrufen:** `http://localhost:3000`

---

Wenn es dann immer noch nicht funktioniert, lassen Sie es mich wissen!
