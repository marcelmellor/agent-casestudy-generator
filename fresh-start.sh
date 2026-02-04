#!/bin/bash

echo "🧹 Bereinige Cache und starte neu..."
echo ""

# Stoppe laufende Prozesse
pkill -f "vite" 2>/dev/null
sleep 1

# Lösche Cache
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

echo "✅ Cache gelöscht"
echo ""

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null
then
    echo "❌ Node.js ist nicht installiert!"
    echo "Bitte installieren Sie Node.js von: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js gefunden: $(node --version)"
echo ""

# Prüfe ob node_modules existiert
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starte Entwicklungsserver..."
echo ""
echo "📍 Öffnen Sie im Browser: http://localhost:3000"
echo ""
echo "🔄 Wichtig: Im Browser HARD REFRESH machen:"
echo "   • Chrome/Edge (Mac): Cmd + Shift + R"
echo "   • Chrome/Edge (Win): Strg + Shift + R"
echo "   • Firefox: Strg/Cmd + Shift + R"
echo "   • Safari: Cmd + Option + R"
echo ""
echo "💡 Sie sollten jetzt den grünen 'Beispiel-Case Study laden' Button sehen!"
echo ""
echo "⏸️  Drücken Sie Strg+C um den Server zu stoppen"
echo ""

npm run dev
