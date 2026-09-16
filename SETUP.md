# Guruji Hastrekha - Complete Setup Guide

## 🚀 Quick Setup (5 minutes)

### Option A: Online (Easiest - No downloads needed)

The app will automatically use CDN versions:
- OpenCV.js from: `https://docs.opencv.org/4.5.2/opencv.js`
- PDF-lib from: `https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js`

Just open `index.html` - everything works!

**Pros:**
- No downloads
- Always latest version
- Works immediately

**Cons:**
- Requires internet for first load
- Slower image processing

---

### Option B: Offline-First (Recommended - Fully Self-Contained)

#### Step 1: Download OpenCV.js

**Size:** ~10-12 MB

**Method 1: Direct Download**
```bash
cd libs/
curl -o opencv.js https://docs.opencv.org/4.5.2/opencv.js
```

**Method 2: Manual Download**
1. Visit: https://docs.opencv.org/4.5.2/opencv.js
2. Right-click → Save As
3. Save to: `libs/opencv.js`

**Method 3: Using wget**
```bash
cd libs/
wget https://docs.opencv.org/4.5.2/opencv.js
```

#### Step 2: Download pdf-lib

**Size:** ~200 KB

**Method 1: CDN Download**
```bash
cd libs/
curl -o pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
```

**Method 2: Manual Download**
1. Visit: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
2. Right-click → Save As
3. Save to: `libs/pdf-lib.min.js`

**Method 3: npm (if you have Node.js)**
```bash
npm install pdf-lib
# Then copy from node_modules/pdf-lib/dist/pdf-lib.min.js to libs/
```

#### Step 3: Verify Setup

```bash
ls -lh libs/
```

You should see:
```
-rw-r--r--  10M  opencv.js
-rw-r--r-- 200K  pdf-lib.min.js
```

#### Step 4: Test

1. Open `index.html` (double-click)
2. Try uploading an image
3. Check browser console (F12) for any errors
4. Generate PDF to test pdf-lib

---

## 🔧 Library Versions

| Library | Version | Size | Purpose |
|---------|---------|------|---------|
| OpenCV.js | 4.5.2 | ~10MB | Image processing |
| pdf-lib | 1.17.1 | ~200KB | PDF generation |

---

## 📋 File Structure After Setup

```
guruji-hastrekha-dashboard/
├── index.html
├── style.css
├── README.md
├── SETUP.md (this file)
├── .gitignore
│
├── assets/
│   ├── guruji-logo.png (placeholder or custom)
│   └── guruji-logo-square.png (placeholder or custom)
│
├── libs/
│   ├── opencv.js (10MB - download)
│   ├── pdf-lib.min.js (200KB - download)
│   ├── OPENCV_SETUP.txt
│   └── PDF_LIB_SETUP.txt
│
└── src/
    ├── config.js
    ├── i18n-hi.js
    ├── auth.js
    ├── storage.js
    ├── preprocess.js
    ├── overlay.js
    ├── features.js
    ├── engine.js
    ├── timeline.js
    ├── report.js
    ├── ui.js
    ├── app.js
    │
    └── rules/
        ├── 00-core.json
        ├── 10-education.json
        ├── 20-marriage.json
        ├── 30-children.json
        ├── 40-career-job.json
        ├── 50-business.json
        ├── 60-money.json
        ├── 70-health.json
        └── 80-timeline.json
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `index.html` opens in browser
- [ ] Login screen appears
- [ ] Can login with Admin / Guruji@1379
- [ ] Can upload image
- [ ] Image processes without errors
- [ ] PDF generates successfully
- [ ] History saves and loads
- [ ] Can download PDF
- [ ] Can change password

---

## 🔍 Troubleshooting Setup

### ❌ "OpenCV.js not loaded" warning

**Fix:**
1. Check if `libs/opencv.js` exists
2. File size should be ~10MB (if <1MB, download failed)
3. Reload page (Ctrl+R or Cmd+R)
4. Check console (F12) for network errors

**Fallback:**
- The app will use CDN version automatically
- Functionality preserved, just slower

### ❌ "PDF generation fails"

**Fix:**
1. Check if `libs/pdf-lib.min.js` exists
2. File size should be ~200KB
3. Reload page and try again
4. Check console for specific errors

**Fallback:**
- The app will try CDN version
- Functionality preserved

### ❌ "CORS error" on GitHub Pages

**This won't happen** because:
- We're using local files (no CORS issues)
- Static files on GitHub Pages don't have CORS restrictions
- CDN fallbacks are available

### ❌ Files won't download (slow internet)

**Options:**
1. Try different download method (wget, curl, or manual)
2. Split download over multiple sessions
3. Use CDN version (no download needed)
4. Download on WiFi instead of mobile data

---

## 🌐 Deployment Checklist

### For GitHub Pages

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: Guruji Hastrekha Admin Dashboard"

# 4. Add remote
git remote add origin https://github.com/YOUR_USERNAME/guruji-hastrekha-dashboard.git

# 5. Push
git push -u origin main

# 6. Enable Pages in GitHub
# Settings → Pages → Branch: main → Folder: / (root)

# 7. Access at
# https://YOUR_USERNAME.github.io/guruji-hastrekha-dashboard/
```

### For Vercel

```bash
npm install -g vercel
vercel
# Follow prompts
```

### For Netlify

```bash
npm install -g netlify-cli
netlify deploy --dir=. --prod
# Or drag-drop folder in Netlify UI
```

---

## 📱 Testing on Different Devices

### Desktop/Laptop
```bash
# Option 1: Open directly
double-click index.html

# Option 2: Python server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Mobile (iOS/Android)
```bash
# Option 1: On same WiFi, open
http://YOUR_COMPUTER_IP:8000

# Option 2: Deploy to GitHub Pages
https://YOUR_USERNAME.github.io/guruji-hastrekha-dashboard/
```

---

## 🎯 Performance Tips

### Speed Up Image Processing
- Use images < 1MB
- Prefer 1000x1000px size
- Avoid very high resolution scans

### Speed Up PDF Generation
- Limit to first 4-5 timeline blocks
- Use compressed images
- Avoid very large batch operations

### Browser Performance
- Use Chrome/Edge for best performance
- Clear cache if slow (Ctrl+Shift+Del)
- Close other tabs during processing

---

## 🔒 Offline Functionality

✅ **Works Fully Offline With Local Libraries:**
```
Offline Mode Checklist:
☑ No internet required after first load
☑ All libraries local (opencv.js + pdf-lib.min.js)
☑ All data stored locally (IndexedDB)
☑ All rules in /src/rules/*.json
☑ No external API calls
```

❌ **Will Need Internet (if using CDN):**
- First load to download libraries
- Updating rules from external sources

---

## 🚀 Next Steps

1. **Setup Libraries** (Option A or B above)
2. **Test Offline** (double-click index.html)
3. **Customize Logo** (replace /assets/ files)
4. **Edit Rules** (modify /src/rules/*.json)
5. **Deploy** (GitHub Pages / Vercel / Netlify)
6. **Share Link** (with users or clients)

---

## 📞 Need Help?

- Check console errors: F12 → Console tab
- Read OPENCV_SETUP.txt and PDF_LIB_SETUP.txt
- Verify file sizes match documentation
- Try CDN fallback versions
- Clear browser cache and reload

---

**Project Ready! 🎉**

Happy analyzing! 🔮✨
