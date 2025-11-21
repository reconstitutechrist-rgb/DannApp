# 🚀 Deployment Guide

Complete guide to deploying your AI-generated applications.

---

## 📋 Overview

After building your app with DannApp's AI App Builder, you can deploy it to various platforms. This guide covers:
- Exporting your code
- Preparing for deployment
- Platform-specific instructions
- Environment configuration
- Custom domains
- Troubleshooting

---

## 📦 Step 1: Export Your Code

### Download as ZIP

1. Click the **"Download"** button in the AI App Builder
2. Save the `.zip` file to your computer
3. Extract the ZIP file to a folder

**What you get:**
```
my-app/
├── src/
│   ├── App.tsx          # Your main component
│   ├── index.tsx        # Entry point
│   └── ...              # Other generated files
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind config
└── README.md           # Basic instructions
```

### Copy Individual Files

Alternatively, copy specific files:
1. View any file in the editor
2. Click "Copy" to copy code to clipboard
3. Paste into your local project

---

## 🔧 Step 2: Setup Locally

### Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager

### Initialize Project

```bash
# Navigate to your extracted folder
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Your app will open at `http://localhost:3000`

### Verify Everything Works

Check that:
- ✅ App loads without errors
- ✅ All features work correctly
- ✅ Console has no critical errors
- ✅ Styling renders properly

---

## 🌐 Step 3: Choose Deployment Platform

### Platform Comparison

| Platform | Difficulty | Free Tier | Best For |
|----------|-----------|-----------|----------|
| **Vercel** | ⭐ Easy | Yes (Generous) | Next.js apps |
| **Netlify** | ⭐ Easy | Yes (Good) | Static sites |
| **AWS Amplify** | ⭐⭐ Medium | Yes (Limited) | AWS users |
| **GitHub Pages** | ⭐⭐ Medium | Yes | Static sites |
| **Railway** | ⭐ Easy | Yes (Limited) | Full-stack |
| **Render** | ⭐⭐ Medium | Yes (Limited) | Full-stack |

**Recommendation:** Start with **Vercel** - it's designed for Next.js and has the best developer experience.

---

## 🔷 Vercel Deployment (Recommended)

### Why Vercel?

- ✅ Made by Next.js creators
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier is generous
- ✅ Continuous deployment

### Method 1: Deploy via Git (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub
# Then push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Vercel auto-detects Next.js settings
6. Click **"Deploy"**

**Done!** Your app is live in ~2 minutes.

#### Step 3: Configure Environment Variables (if needed)

1. Go to Project Settings → Environment Variables
2. Add any API keys:
   ```
   ANTHROPIC_API_KEY=your_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```
3. Redeploy to apply changes

### Method 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts to set up project
```

### Method 3: Deploy via Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Drag your project folder onto the page
3. Wait for deployment

**Note:** This method doesn't auto-deploy on future changes.

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `myapp.com`)
3. Update DNS records as instructed
4. Wait for DNS propagation (can take 24-48 hours)

---

## 🟢 Netlify Deployment

### Why Netlify?

- ✅ Great for static sites
- ✅ Simple interface
- ✅ Good free tier
- ✅ Form handling built-in
- ✅ Split testing features

### Method 1: Deploy via Git

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"New site from Git"**
4. Choose your repository
5. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: out
   ```
6. Click **"Deploy"**

### Method 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Method 3: Drag & Drop

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Build your site locally:
   ```bash
   npm run build
   ```
3. Drag the `out/` folder to Netlify

### Environment Variables on Netlify

1. Site Settings → Environment Variables
2. Add your variables
3. Redeploy

---

## 🟠 AWS Amplify

### Why AWS Amplify?

- ✅ Integration with AWS services
- ✅ Global deployment
- ✅ Scalable
- ⚠️ More complex setup

### Deployment Steps

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Save and deploy

### Environment Variables

1. Go to App Settings → Environment Variables
2. Add variables
3. Redeploy

---

## 📘 GitHub Pages

### Why GitHub Pages?

- ✅ Free for public repos
- ✅ Integrated with GitHub
- ⚠️ Static sites only (no server-side rendering)

### Setup

#### 1. Install gh-pages package

```bash
npm install --save-dev gh-pages
```

#### 2. Update package.json

```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### 3. Deploy

```bash
npm run deploy
```

#### 4. Configure GitHub

1. Go to repository Settings → Pages
2. Source: gh-pages branch
3. Save

Your site will be live at `https://yourusername.github.io/your-repo-name`

### Limitations

- No server-side rendering
- No API routes
- Static content only

**Solution:** Use for frontend-only apps or use with external API backend.

---

## 🛠️ Environment Variables

### What Are They?

Environment variables store sensitive data like API keys outside your code.

### Common Variables

```bash
# Anthropic API (for AI features in builder, not needed in deployed apps)
ANTHROPIC_API_KEY=your_anthropic_key

# Supabase (if using authentication/database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Other APIs
NEXT_PUBLIC_API_URL=https://api.yourservice.com
API_SECRET_KEY=your_secret_key
```

### Setting Up

#### Local Development (.env.local)

Create `.env.local` file:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

**Important:** Never commit `.env.local` to Git!

#### Production (Deployment Platform)

Each platform has its own interface:
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Environment Variables
- **AWS Amplify:** App Settings → Environment Variables

### Public vs Private Variables

**Public (NEXT_PUBLIC_*):**
- Exposed to browser
- Use for frontend configuration
- Examples: API URLs, public keys

**Private (no prefix):**
- Server-side only
- Use for secrets
- Examples: API secret keys, database credentials

---

## 🌍 Custom Domains

### Why Use a Custom Domain?

- Professional appearance
- Better branding
- SEO benefits
- Custom email addresses

### Steps to Add Custom Domain

#### 1. Purchase Domain

Register at:
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://cloudflare.com)
- [GoDaddy](https://godaddy.com)

#### 2. Configure DNS

Get DNS records from your deployment platform:

**Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: your-site.netlify.app
```

#### 3. Add Domain to Platform

**Vercel:**
1. Project Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Wait for verification

**Netlify:**
1. Domain Settings → Add custom domain
2. Follow DNS instructions
3. Wait for verification

#### 4. Enable HTTPS

Most platforms auto-provision SSL certificates:
- Vercel: Automatic
- Netlify: Automatic
- Others: May require manual setup

### DNS Propagation

- Takes 24-48 hours typically
- Check status: [whatsmydns.net](https://whatsmydns.net)
- Use incognito mode to see changes faster

---

## 🔒 Security Best Practices

### 1. Environment Variables

✅ **DO:**
- Use environment variables for sensitive data
- Add `.env*.local` to `.gitignore`
- Rotate keys regularly
- Use different keys for dev/prod

❌ **DON'T:**
- Commit API keys to Git
- Share keys publicly
- Use same keys everywhere

### 2. API Security

If your app calls external APIs:
- Use API key authentication
- Implement rate limiting
- Validate all inputs
- Use HTTPS only

### 3. Content Security

- Sanitize user inputs
- Implement CORS properly
- Use security headers
- Keep dependencies updated

### 4. Authentication

If using Supabase or similar:
- Enable RLS (Row Level Security)
- Use secure session storage
- Implement proper logout
- Use secure password requirements

---

## 📊 Monitoring & Analytics

### Performance Monitoring

**Vercel Analytics:**
1. Enable in project settings
2. View real-time data
3. See Web Vitals scores

**Google Analytics:**
1. Create GA4 property
2. Add tracking code to `_app.tsx`
3. View in Google Analytics dashboard

### Error Tracking

**Sentry:**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

**LogRocket:**
```bash
npm install logrocket

# In your app
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

### Uptime Monitoring

Services:
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://pingdom.com) - Paid
- [StatusCake](https://statuscake.com) - Free tier

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build errors during deployment

**Solutions:**
1. Check build logs for specific errors
2. Test build locally: `npm run build`
3. Verify all dependencies in package.json
4. Check Node.js version compatibility
5. Clear build cache and retry

### Environment Variables Not Working

**Issue:** Variables undefined in production

**Solutions:**
1. Verify variables are set in platform settings
2. Check variable names (case-sensitive)
3. Ensure `NEXT_PUBLIC_` prefix for client-side variables
4. Redeploy after adding variables
5. Check build logs for variable-related errors

### Site Shows 404

**Issue:** Deployed site returns 404

**Solutions:**
1. Verify build output directory is correct
2. Check routing configuration
3. Ensure `_redirects` or `next.config.js` is correct
4. Clear CDN cache
5. Check platform status page

### Images Not Loading

**Issue:** Images work locally but not in production

**Solutions:**
1. Use Next.js Image component
2. Configure image domains in `next.config.js`
3. Check image paths are relative
4. Ensure images are in public folder
5. Verify CDN is serving images

### Slow Performance

**Issue:** Site loads slowly

**Solutions:**
1. Enable CDN/caching
2. Optimize images (use Next.js Image)
3. Implement code splitting
4. Enable compression
5. Use production build (not dev)
6. Analyze with Lighthouse

### API Routes Failing

**Issue:** API routes work locally but fail in production

**Solutions:**
1. Check serverless function logs
2. Verify API route exports are correct
3. Check function timeout settings
4. Ensure CORS is configured
5. Verify environment variables are set

---

## 🚀 Advanced Deployment

### Continuous Deployment

**What it is:** Automatically deploy when you push to Git

**Setup on Vercel:**
1. Connect Git repository
2. Choose production branch (usually `main`)
3. Each push triggers auto-deploy
4. Preview deployments for pull requests

**Setup on Netlify:**
1. Connect Git repository  
2. Configure branch settings
3. Set deploy contexts (production, preview)
4. Enable automatic deploys

### Staging Environments

Create separate environments:

**Vercel:**
- Production: `main` branch → `yourapp.com`
- Staging: `staging` branch → `staging-yourapp.vercel.app`
- Preview: PRs → `pr-123-yourapp.vercel.app`

**Netlify:**
- Production: `main` branch
- Deploy previews: Automatic for PRs
- Branch deploys: Configure in settings

### Monorepo Deployment

If using monorepo structure:

```bash
# Set root directory in platform settings
Root Directory: apps/web

# Or use custom build command
Build Command: npm run build --workspace=web
```

### Docker Deployment

For custom servers:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## 📈 Optimization Tips

### 1. Performance

```javascript
// next.config.js
module.exports = {
  // Enable compression
  compress: true,
  
  // Image optimization
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable SWC minification
  swcMinify: true,
}
```

### 2. Caching

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}
```

### 3. Code Splitting

```javascript
// Dynamic imports
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>,
});
```

### 4. SEO

```javascript
// pages/_app.tsx
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Your App Name</title>
        <meta name="description" content="Your app description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

---

## 📚 Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance testing
- [WebPageTest](https://webpagetest.org) - Performance analysis
- [GTmetrix](https://gtmetrix.com) - Speed testing

---

## ✅ Deployment Checklist

Before deploying to production:

**Code Quality:**
- [ ] All tests passing
- [ ] No console errors
- [ ] Code linted and formatted
- [ ] Build succeeds locally

**Configuration:**
- [ ] Environment variables set
- [ ] API keys secured
- [ ] CORS configured (if needed)
- [ ] Domain DNS configured

**Content:**
- [ ] Meta tags added
- [ ] Favicon included
- [ ] 404 page created
- [ ] Loading states implemented

**Performance:**
- [ ] Images optimized
- [ ] Code split
- [ ] Compression enabled
- [ ] Caching configured

**Security:**
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] No hardcoded secrets
- [ ] Dependencies updated

**Monitoring:**
- [ ] Analytics setup
- [ ] Error tracking enabled
- [ ] Uptime monitoring configured
- [ ] Performance monitoring active

---

## 🎉 You're Ready to Deploy!

Choose your platform, follow the steps, and your app will be live in minutes.

**Need help?** Check the troubleshooting section or open an issue on GitHub.

**Happy deploying! 🚀**
