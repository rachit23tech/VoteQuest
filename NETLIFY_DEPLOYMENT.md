# 🚀 Netlify Deployment Guide - VoteQuest Frontend

> Deploy the VoteQuest frontend to Netlify with drag-and-drop simplicity

---

## 📋 Prerequisites

- ✅ Frontend fully built (run `npm run build` to generate `/out` folder)
- ✅ `netlify.toml` configuration file present
- ✅ Netlify account created at [netlify.app](https://netlify.app)

---

## 🎯 Quick Deployment (Drag & Drop)

### Step 1: Build the Frontend
```bash
cd frontend
npm install
npm run build
```
✅ This creates the `/out` folder with all static files ready to deploy

### Step 2: Open Netlify Dashboard
Go to [app.netlify.com](https://app.netlify.com) and log in to your Netlify account

### Step 3: Drag & Drop Deploy
1. Look for **"Drag and drop your site output folder here"** section
2. Drag the **`frontend/out`** folder into the drop zone
3. Netlify will automatically upload and deploy your site
4. Your site will be live at a temporary URL (e.g., `https://xyz123.netlify.app`)

✨ **That's it!** Your frontend is now live!

---

## 🔄 Automatic Deployments (Recommended)

### Connect GitHub Repository

1. **Click "Deploy with Git"** on Netlify Dashboard
2. **Authorize Netlify** to access your GitHub
3. **Select repository** (your VoteQuest repo)
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18.17.0`
5. **Deploy** - Netlify will build and deploy automatically on every push to main

---

## 🌐 Custom Domain Setup

### Add Your Domain
1. Go to **Site Settings → Domain Management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS setup instructions for your domain registrar

### Enable HTTPS
✅ Automatically configured with free SSL certificate via Let's Encrypt

---

## 🔗 Connect Backend API

### Update Environment Variables
In Netlify Dashboard, go to **Site Settings → Build & Deploy → Environment**

Add:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

Then rebuild the site or redeploy.

---

## 📁 What Gets Deployed

The `/out` folder contains:
- **Static HTML files** - all pages pre-rendered
- **CSS bundles** - optimized Tailwind CSS
- **JavaScript bundles** - React components compiled
- **Assets** - images, fonts, icons
- **API routes** (if any) - handled by Netlify Functions

**Total Size:** ~2-5 MB (gzipped)

---

## 🛠️ Build & Deployment Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js configuration with `output: 'export'` |
| `netlify.toml` | Netlify build & deployment settings |
| `.gitignore` | Excludes build artifacts from Git |
| `out/` | **Deployment folder - ready for Netlify** |

---

## ✅ Health Checks

After deployment, verify:

- [ ] Home page loads: `https://your-site.netlify.app/`
- [ ] Auth pages accessible: `/auth/login`, `/auth/signup`
- [ ] Game pages load: `/game`, `/game/level/1`
- [ ] API calls working: Check Network tab in DevTools
- [ ] No console errors: Open DevTools (F12)

---

## 🔧 Troubleshooting

### "Build Failed" Error
- Check build logs in Netlify Dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in `package.json`

### "Cannot find page" Error
- Ensure `netlify.toml` redirects are configured
- Check that `out/` folder is correctly set as publish directory

### API Calls Return 404
- Update `NEXT_PUBLIC_API_URL` environment variable
- Rebuild site after changing env vars
- Ensure backend API is running and accessible

### CSS/Styling Missing
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild and redeploy
- Check Tailwind CSS is properly built into `out/` folder

---

## 📊 Deployment Monitoring

### View Deployment History
- Go to **Deploys** tab in Netlify Dashboard
- See all previous deployments and logs
- Rollback to previous version if needed

### Enable Deploy Notifications
- Go to **Site Settings → Notifications**
- Setup email alerts for deployments
- Integrate with Slack or Discord

---

## 🎉 Advanced: Deploy Multiple Environments

### Staging Environment
1. Create new branch: `staging`
2. Create new Netlify site for staging
3. Connect staging branch
4. Deploy changes to staging before production

### Production Environment
1. Keep `main` branch for production
2. Netlify auto-deploys on merge to `main`
3. Use pull requests for code review before merge

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [Netlify TOML Reference](https://docs.netlify.com/configure-builds/file-conventions/)

---

**Questions?** Check Netlify support or visit the [Netlify Community](https://community.netlify.com/)
