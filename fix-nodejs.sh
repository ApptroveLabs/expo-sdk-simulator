#!/bin/bash

echo "🔧 Fixing Node.js path for Android Studio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

NODE_PATH=$(which node)
echo "✅ Found Node.js at: $NODE_PATH"

# Create symlinks in user's local bin directory
mkdir -p ~/.local/bin

# Create symlinks
ln -sf "$NODE_PATH" ~/.local/bin/node
ln -sf "$(which npm)" ~/.local/bin/npm

echo "✅ Created symlinks in ~/.local/bin/"

# Add to PATH if not already there
if ! echo "$PATH" | grep -q "$HOME/.local/bin"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
    echo "✅ Added ~/.local/bin to PATH in ~/.zshrc"
    echo "🔄 Please restart your terminal or run: source ~/.zshrc"
fi

echo ""
echo "🎉 Node.js setup complete!"
echo "📱 You can now open the project in Android Studio."
echo ""
echo "If you still get errors:"
echo "1. Restart Android Studio"
echo "2. In Android Studio: File > Invalidate Caches and Restart"
echo "3. Clean and rebuild the project"
