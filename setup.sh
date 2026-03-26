#!/bin/bash
# Quick Setup Script
# Run this to start the deployment process

echo "🚀 Chatsuu Deployment Setup"
echo "============================"
echo ""
echo "Step 1: Create Backend Environment File"
echo "----------------------------------------"
echo "Create backend/.env with these variables:"
cat << 'EOF'

NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=will_be_your_frontend_domain

EOF

echo ""
echo "Step 2: Create Frontend Environment File (if using Vercel)"
echo "-----------------------------------------------------------"
echo "Create frontend/.env.production with:"
cat << 'EOF'

VITE_API_URL=https://your-backend-domain.com

EOF

echo ""
echo "Step 3: Push to GitHub"
echo "----------------------"
echo "Run these commands:"
echo ""
echo "  git add ."
echo '  git commit -m "Add deployment configuration"'
echo "  git push origin main"
echo ""

echo "Step 4: Deploy"
echo "---------------"
echo "Option A - RENDER (Recommended):"
echo "  • Go to https://render.com"
echo "  • New Web Service → Backend"
echo "  • New Static Site → Frontend"
echo ""
echo "Option B - VERCEL + RENDER:"
echo "  • Deploy frontend on https://vercel.com"
echo "  • Deploy backend on https://render.com"
echo ""

echo "📚 Documentation Files:"
echo "  • DEPLOY_SUMMARY.md - Overview"
echo "  • DEPLOYMENT_GUIDE.md - Detailed step-by-step (📖 READ THIS FIRST!)"
echo "  • QUICK_DEPLOY.md - Cheat sheet"
echo "  • ARCHITECTURE.md - How everything connects"
echo "  • TROUBLESHOOTING.md - Common issues & fixes"
echo ""
echo "Ready? Let's go! 🚀"
