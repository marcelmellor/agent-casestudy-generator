#!/bin/bash

echo "🚀 Case Study Builder - Starte Anwendung..."
echo ""

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null
then
    echo "❌ Node.js ist nicht installiert!"
    echo "Bitte installieren Sie Node.js von: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js gefunden: $(node --version)"
echo "✅ npm gefunden: $(npm --version)"
echo ""

# Prüfe ob node_modules existiert
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
    echo ""
fi

echo "🎨 Starte Entwicklungsserver..."
echo "📍 Die Anwendung wird unter http://localhost:3000 geöffnet"
echo ""
echo "💡 Tipp: Klicken Sie auf 'Beispiel-Case Study laden' um den PDF-Export zu testen!"
echo ""
echo "⏸️  Drücken Sie Strg+C um den Server zu stoppen"
echo ""

npm run dev
