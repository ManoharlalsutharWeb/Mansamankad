# 🚀 Quick Start - 2 Minute Setup

## Fastest Way to Start

### Method 1: Just Open (Works Right Now!)
```
1. Double-click: index.html
2. Login: Admin / Guruji@1379
3. Done! ✅
```

**Note:** First time, image processing will be slower (uses online libraries). For offline performance, see Method 2.

---

### Method 2: Offline Optimized (Best for Production)

**Step 1: Download Libraries** (~10 seconds)

**Windows/Mac (using curl):**
```bash
cd libs
curl -o opencv.js https://docs.opencv.org/4.5.2/opencv.js
curl -o pdf-lib.min.js https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
cd ..
```

**Or manually:**
1. Click: https://docs.opencv.org/4.5.2/opencv.js → Save As → `libs/opencv.js`
2. Click: https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js → Save As → `libs/pdf-lib.min.js`

**Step 2: Open App**
```
Double-click: index.html
```

**Step 3: Login**
```
Username: Admin
Password: Guruji@1379
```

✅ **Done! Now fully offline-capable**

---

## What to Try First

### 📝 Create a New Report

1. **Click:** "नया रिपोर्ट" (New Report)
2. **Fill:**
   - नाम: Your name
   - Hand: बाएं/दाएं/दोनों (Left/Right/Both)
   - Timeline: 5/10/15/20 वर्ष (years)
3. **Upload:** Palm image (inner palm)
4. **Click:** "प्रीव्यू और जारी रखें" (Preview & Continue)
5. **Generate:** "PDF रिपोर्ट बनाएं" (Generate PDF Report)
6. **Download:** PDF automatically saves

### 📚 View History

1. **Click:** "इतिहास" (History tab)
2. **See:** All previous reports
3. **Download:** Any previous report
4. **Delete:** Individual reports

### ⚙️ Settings

1. **Click:** "सेटिंग्स" (Settings)
2. **Change Password:** पासवर्ड बदलें
3. **Delete All Data:** सभी डेटा हटाएं

---

## Login Credentials

```
Username: Admin (fixed, cannot change)
Password: Guruji@1379 (can be changed in Settings)
```

✅ **Auto-seeded on first run** - No manual setup needed!

---

## Features At A Glance

| Feature | Status | Location |
|---------|--------|----------|
| Palm image upload | ✅ | New Report |
| Image processing | ✅ | Auto |
| Hindi predictions | ✅ | Preview |
| PDF generation | ✅ | Generate |
| Report history | ✅ | History tab |
| Offline mode | ✅ | Works offline |
| Multi-language | ✅ | Hindi UI |

---

## Troubleshooting (30 seconds)

### Can't upload image
→ Try smaller image (< 5MB)
→ Reload page (F5)
→ Try different browser

### PDF won't generate
→ Reload page
→ Check console (F12)
→ Try again

### Forgot password
→ Clear IndexedDB: DevTools → App → IDB → Delete guruji → Refresh
→ Login with default: Admin / Guruji@1379

### App won't load
→ Clear cache (Ctrl+Shift+Del)
→ Try incognito/private mode
→ Use different browser

---

## Customization (5 minutes)

### Change Logo
1. Replace: `/assets/guruji-logo.png` (512x512, circular)
2. Replace: `/assets/guruji-logo-square.png` (512x512, rounded)
3. Reload: F5

### Change Default Password
1. Edit: `src/config.js`
2. Find: `ADMIN_DEFAULT_PASSWORD: 'Guruji@1379'`
3. Change to your password
4. Reload: F5

### Add Custom Rules
1. Edit: `src/rules/10-education.json` (or any category)
2. Add new rule object
3. Reload: F5 - Rules auto-load!

---

## Deploy to Internet (Optional)

### GitHub Pages (Free)
```bash
1. Push to GitHub
2. Settings → Pages → Enable
3. Visit: https://your-username.github.io/guruji-hastrekha-dashboard/
```

### Vercel (Free)
```bash
1. npm install -g vercel
2. vercel
3. Follow prompts
```

### Netlify (Free)
```bash
1. Drag-drop folder to Netlify UI
2. Done!
```

---

## File Structure (Know Your App)

```
📦 guruji-hastrekha-dashboard/
├── 🎨 index.html          (Main UI)
├── 🎨 style.css           (Styling)
├── 📖 README.md           (Full docs)
├── 🚀 SETUP.md            (Installation)
├── 📋 package.json        (Metadata)
│
├── 🎯 assets/
│   ├── guruji-logo.png
│   └── guruji-logo-square.png
│
├── 📚 libs/
│   ├── opencv.js          (Download: Image processing)
│   └── pdf-lib.min.js     (Download: PDF generation)
│
└── ⚙️ src/
    ├── app.js             (Main app logic)
    ├── auth.js            (Login security)
    ├── storage.js         (Data storage)
    ├── ui.js              (User interface)
    ├── preprocess.js      (Image processing)
    ├── features.js        (Extract features)
    ├── engine.js          (Predictions)
    ├── report.js          (PDF generation)
    ├── timeline.js        (Future projection)
    ├── config.js          (Settings)
    ├── i18n-hi.js         (Hindi text)
    │
    └── rules/             (Prediction rules)
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

## Data Security

✅ **Your data is protected:**
- Passwords: PBKDF2 hashed (SHA-256, 100k iterations)
- Storage: Local IndexedDB only
- Internet: Zero data upload
- Delete: One-click data wipe

⚠️ **Note:**
- This is client-side security (browser-based)
- For production, add backend server
- DevTools can access data (browser limitation)

---

## Performance

| Task | Time | Notes |
|------|------|-------|
| First load | 2-5 sec | Libraries download on first use |
| Login | 1 sec | Instant |
| Image upload | 1-2 sec | Depends on file size |
| PDF generation | 5-10 sec | Creates multi-page document |
| Report save | 1 sec | Auto-saved |

---

## Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | Best support |
| Firefox | ✅ Full | Fully compatible |
| Safari | ✅ Full | iOS 13+ |
| Edge | ✅ Full | Latest versions |
| IE 11 | ❌ No | Not supported |

---

## Pro Tips 💡

1. **For images:** Use clear, well-lit palm photos
2. **For PDF:** Keep report range under 20 years
3. **For speed:** Close other browser tabs
4. **For offline:** Download libraries first (Method 2)
5. **For backup:** Download PDFs regularly

---

## Next Steps

1. ✅ Open and try the app
2. ⏳ Download libraries (optional, for offline)
3. 🎨 Customize logo if needed
4. 🌐 Deploy to GitHub Pages (optional)
5. 🔗 Share URL with users

---

## Need Full Documentation?

- **Complete Guide:** See `README.md`
- **Setup Details:** See `SETUP.md`
- **Library Info:** See `libs/OPENCV_SETUP.txt` and `libs/PDF_LIB_SETUP.txt`

---

**Ready to go! Happy analyzing! 🔮✨**

Questions? Check the README.md file for comprehensive documentation.
