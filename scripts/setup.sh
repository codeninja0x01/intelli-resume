#!/bin/bash

# Intelli Resume Project Setup Script

echo "🚀 Setting up Intelli Resume project..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from env.example..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual Supabase credentials"
else
    echo "✅ .env file already exists"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Express.js TypeScript API with Supabase Auth + Sequelize ORM"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Supabase credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000/health to test"
echo "" 