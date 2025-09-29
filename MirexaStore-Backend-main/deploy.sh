#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in dist/ directory"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo "📝 Next steps:"
echo "1. Commit and push your changes to your repository"
echo "2. Deploy to your hosting platform (Vercel, Railway, etc.)"
echo "3. Set environment variables on your hosting platform"