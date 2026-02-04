#!/bin/bash

echo "🔄 Switching Case Study Builder to OpenAI..."
echo ""

# 1. Install OpenAI SDK
echo "📦 Installing OpenAI SDK..."
npm uninstall @anthropic-ai/sdk 2>/dev/null
npm install openai
echo "✅ OpenAI SDK installed"
echo ""

# 2. Update .env file
if [ -f .env ]; then
    echo "🔧 Updating .env file..."

    # Backup old .env
    cp .env .env.backup
    echo "📋 Backup created: .env.backup"

    # Check if VITE_ANTHROPIC_API_KEY exists
    if grep -q "VITE_ANTHROPIC_API_KEY" .env; then
        OLD_KEY=$(grep "VITE_ANTHROPIC_API_KEY" .env | cut -d '=' -f2)
        echo ""
        echo "⚠️  Found old Anthropic API Key"
        echo "   Please get a new OpenAI API Key from: https://platform.openai.com/api-keys"
        echo ""
        echo "   Then add it to your .env file:"
        echo "   VITE_OPENAI_API_KEY=your_openai_key_here"
        echo ""

        # Remove old key from .env
        sed -i.bak '/VITE_ANTHROPIC_API_KEY/d' .env
        rm .env.bak 2>/dev/null

        # Add placeholder for new key
        echo "" >> .env
        echo "# OpenAI API Key" >> .env
        echo "VITE_OPENAI_API_KEY=your_openai_key_here" >> .env
    else
        echo "⚠️  No Anthropic key found in .env"
        echo "   Please add your OpenAI API Key:"
        echo "   VITE_OPENAI_API_KEY=your_openai_key_here"
    fi
else
    echo "⚠️  No .env file found"
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo "   Please add your OpenAI API Key to .env"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Get your OpenAI API Key from: https://platform.openai.com/api-keys"
echo "   2. Update VITE_OPENAI_API_KEY in your .env file"
echo "   3. Restart the dev server: npm run dev"
echo "   4. Hard refresh your browser: Cmd/Ctrl + Shift + R"
echo ""
echo "📖 For detailed instructions, see: OPENAI_MIGRATION.md"
