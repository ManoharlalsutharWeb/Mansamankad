# Guruji Hastrekha Admin Dashboard

एक offline-first, GitHub Pages deployable static web app जो हस्तरेखा विश्लेषण के लिए AI-powered predictions प्रदान करता है।

🔮 **Live Feature**: Admin login → Palm image upload → OpenCV processing → Hindi predictions → Multi-page PDF report → History management

---

## ⚡ Quick Start

### Option 1: Offline (Local Computer)

1. **Repo डाउनलोड करें**
   ```bash
   git clone https://github.com/YOUR_USERNAME/guruji-hastrekha-dashboard.git
   cd guruji-hastrekha-dashboard
   ```

2. **index.html खोलें (Double-click)**
   ```
   Double-click guruji-hastrekha-dashboard/index.html
   ```

3. **Login करें**
   - Username: `Admin`
   - Password: `Guruji@1379`

   ✅ पहली बार लॉगिन में auto-seed होता है - कोई extra setup नहीं!

### Option 2: GitHub Pages (Online)

1. **Github repo बनाएं**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/guruji-hastrekha-dashboard.git
   git push -u origin main
   ```

2. **GitHub Pages Enable करें**
   - Settings → Pages → Source: main branch → Save
   - URL: `https://YOUR_USERNAME.github.io/guruji-hastrekha-dashboard/`

3. **Access करें**
   - उपरोक्त URL खोलें
   - Login credentials same

---

## 🏗️ Project Structure

```
guruji-hastrekha-dashboard/
├── index.html                          # Main HTML file
├── style.css                           # Complete styling
├── README.md                           # This file
│
├── assets/
│   ├── guruji-logo.png                # 512x512 circular badge
│   └── guruji-logo-square.png         # 512x512 rounded square (PDF)
│
├── libs/
│   ├── opencv.js                      # Image processing (local)
│   └── pdf-lib.min.js                 # PDF generation (local)
│
└── src/
    ├── config.js                      # Configuration constants
    ├── i18n-hi.js                     # Hindi translations
    ├── auth.js                        # PBKDF2 auth (no plain passwords!)
    ├── storage.js                     # IndexedDB management
    ├── preprocess.js                  # OpenCV image processing
    ├── overlay.js                     # Line visualization
    ├── features.js                    # Feature extraction
    ├── engine.js                      # Rule engine
    ├── timeline.js                    # Timeline projection
    ├── report.js                      # PDF report generation
    ├── ui.js                          # UI management
    ├── app.js                         # Application orchestration
    │
    └── rules/
        ├── 00-core.json               # Core quality rules
        ├── 10-education.json          # शिक्षा (Education)
        ├── 20-marriage.json           # विवाह (Marriage)
        ├── 30-children.json           # संतान (Children)
        ├── 40-career-job.json         # करियर (Career)
        ├── 50-business.json           # व्यापार (Business)
        ├── 60-money.json              # धन (Money/Wealth)
        ├── 70-health.json             # स्वास्थ्य (Health)
        └── 80-timeline.json           # समय प्रक्षेपण (Timeline)
```

---

## 🔐 Security & Authentication

### Password Security

✅ **What's Protected:**
- Passwords are **NEVER stored in plain text**
- PBKDF2 hashing with 100,000 iterations + random salt
- SHA-256 algorithm
- Secure session tokens (24-hour expiry)

✅ **First Run:**
- Auto-seeded with default credentials
- Hash generated on first login
- No manual setup needed

⚠️ **Client-Side Limitation (Important):**
```
यह एक static, offline-first application है।
- कोई server-side security नहीं
- Login केवल UI gatekeeping है
- Browser DevTools से data access संभव है
- Production के लिए backend server जोड़ें
```

### Data Storage

- ✅ **Local Only**: सभी data IndexedDB में locally stored
- ✅ **No Internet**: बिना internet के काम करता है
- ✅ **User Control**: सभी data delete करने का option

---

## 📋 Features

### 1. Admin Login
```
Username: Admin (fixed)
Password: Guruji@1379 (changeable)
```

### 2. New Report
- **Personal Info**: नाम (required), DOB & Time (optional)
- **Hand Selection**: Left / Right / Both
- **Image Upload**: Inner palm की स्पष्ट तस्वीरें
- **Timeline Range**: 5 / 10 / 15 / 20 years

### 3. Image Processing
- OpenCV.js के साथ preprocessing
- Edge detection, contrast enhancement, denoising
- Quality score & confidence calculation
- Visual line overlay

### 4. Predictions (Advanced Hindi)
- 🎓 **शिक्षा**: Education prospects
- 💍 **विवाह**: Marriage timing (range + confidence)
- 👶 **संतान**: Children count & timing
- 💼 **करियर**: Career prospects
- 🏢 **व्यापार**: Business success/risk
- 💰 **धन**: Wealth & prosperity
- 🏥 **स्वास्थ्य**: Health & energy (non-medical)
- ⏰ **समय**: 5/10/15/20 year timeline

### 5. PDF Report
- Multi-page Hindi A4 PDF
- Cover page with logo, name, date
- Original + overlay images
- Predictions for each category
- Timeline blocks
- Disclaimer page
- Page numbers & header/footer

### 6. History Management
- सभी reports IndexedDB में save
- Download previous reports
- Delete individual reports
- Delete all data at once

---

## 🔧 Configuration

### Edit Default Admin Password

**File**: `src/config.js`

```javascript
ADMIN_DEFAULT_PASSWORD: 'Guruji@1379',  // Change this
```

⚠️ फिर `index.html` को clear cache के साथ reload करें, या manually hash बदलें।

### Edit Image Processing Parameters

**File**: `src/config.js`

```javascript
IMAGE_PROCESSING: {
    MAX_WIDTH: 1200,
    JPEG_QUALITY: 0.9,
}
```

### Edit PDF Configuration

**File**: `src/config.js`

```javascript
PDF: {
    PAGE_SIZE: 'A4',
    MARGIN: { top: 10, bottom: 10, left: 10, right: 10 },
    FONT_SIZE_TITLE: 24,
}
```

---

## 📝 Edit Prediction Rules

### Rule File Format

**Path**: `src/rules/[category].json`

```json
[
  {
    "id": "UNIQUE_RULE_ID",
    "category": "education",           // education, marriage, children, career, business, money, health, overall
    "priority": 80,                    // 0-100 (higher = more important)
    "when": [
      {"path": "headLine.length", "op": ">=", "value": 0.70},
      {"path": "mounts.jupiter", "op": ">=", "value": 0.55}
    ],
    "weight": 0.8,                     // Rule importance
    "confidenceImpact": 0.1,           // How much it affects confidence
    "outputs": {
      "title": "Hindi Title",
      "text": "Hindi description..."
    },
    "tags": ["tag1", "tag2"]
  }
]
```

### Available Operators
- `>=` (greater than or equal)
- `>` (greater than)
- `<=` (less than or equal)
- `<` (less than)
- `==` (equal)
- `!=` (not equal)

### Available Paths
```javascript
features.qualityScore       // 0-1
features.confidence         // 0-1
features.lineDensity        // 0-1

features.lifeLine.length    // 0-1
features.lifeLine.depth     // 0-1
features.lifeLine.breaks    // integer
features.lifeLine.forks     // integer

features.headLine.length    // 0-1
features.headLine.depth     // 0-1
features.headLine.slope     // -1 to 1
features.headLine.breaks    // integer
features.headLine.forks     // integer

features.heartLine.length   // 0-1
features.heartLine.depth    // 0-1
features.heartLine.breaks   // integer
features.heartLine.forks    // integer

features.fateLine.present   // 0-1
features.fateLine.strength  // 0-1
features.fateLine.breaks    // integer

features.mounts.venus       // 0-1
features.mounts.moon        // 0-1
features.mounts.jupiter     // 0-1
features.mounts.saturn      // 0-1
features.mounts.apollo      // 0-1
features.mounts.mercury     // 0-1
```

### Example: Add New Education Rule

**File**: `src/rules/10-education.json`

```json
{
  "id": "EDU_CUSTOM_01",
  "category": "education",
  "priority": 80,
  "when": [
    {"path": "mounts.saturn", "op": ">=", "value": 0.65}
  ],
  "weight": 0.75,
  "confidenceImpact": 0.09,
  "outputs": {
    "title": "गहन अध्ययन की क्षमता",
    "text": "शनि पर्वत गहन, विश्लेषणात्मक और केंद्रित अध्ययन की क्षमता दर्शाता है।"
  },
  "tags": ["analysis", "focus"]
}
```

फिर app reload करें - नए rules automatically लोड होंगे!

---

## 🎨 Logo Setup

### Option 1: Auto-Generated Placeholder
- App default placeholder SVG दिखाता है
- Functionality पूरी तरह काम करती है

### Option 2: Custom Logo

#### Step 1: Logo Image बनाएं

**From JPG Photo**:
1. JPG से head + turban crop करें (512x512)
2. Circular mask लगाएं
3. Saffron background जोड़ें (#FF9A2F)

#### Step 2: Logo Files Upload

```
/assets/guruji-logo.png
  - 512x512
  - Circular badge
  - Saffron background
  
/assets/guruji-logo-square.png
  - 512x512
  - Rounded square (radius: 48px)
  - For PDF cover
```

#### Step 3: Test
1. App reload करें
2. Header में नया logo दिखेगा
3. PDF reports में भी दिखेगा

---

## 🚀 Deployment

### GitHub Pages (Recommended for Static)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Enable Pages**
   - Settings → Pages → Deploy from main

3. **Access**
   ```
   https://YOUR_USERNAME.github.io/guruji-hastrekha-dashboard/
   ```

### Vercel (Alternative)
```bash
npm install -g vercel
vercel
```

### Netlify (Alternative)
- Drag-drop `guruji-hastrekha-dashboard` folder
- Auto-deployed on every save

---

## 🔧 Troubleshooting

### ❌ "OpenCV.js not loaded"
```
समस्या: Image processing काम नहीं कर रहा
समाधान:
1. libs/opencv.js चेक करें (file present है?)
2. Page reload करें (F5)
3. Browser console errors चेक करें
```

### ❌ "PDF generation fails"
```
समस्या: PDF नहीं बन रहा
समाधान:
1. pdf-lib.min.js present है?
2. बड़ी तस्वीरें use न करें (max 1200px)
3. Browser console errors देखें
```

### ❌ "Login screen stuck"
```
समस्या: Login form काम नहीं कर रहा
समाधान:
1. Browser cache clear करें (Ctrl+Shift+Del)
2. Incognito window में test करें
3. IndexedDB reset: DevTools → Application → IDB → Delete
```

### ❌ "Can't change password"
```
समस्या: Password change नहीं हो रहा
समाधान:
1. Current password सही है?
2. New passwords match हैं?
3. Settings page reload करें
```

### ❌ "PDF में logo नहीं दिखा"
```
समस्या: Logo PDF में missing है
समाधान:
1. /assets/guruji-logo-square.png check करें
2. File PNG format में है?
3. Size check करें (512x512)
```

---

## 📱 Browser Support

| Browser | Offline | Online | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅      | ✅     | Best support |
| Firefox | ✅      | ✅     | Full support |
| Safari  | ✅      | ✅     | iOS 13+ |
| Edge    | ✅      | ✅     | Full support |
| IE 11   | ❌      | ❌     | Not supported |

---

## 📖 API Reference

### Storage API
```javascript
// Save report
await storage.saveReport(reportData);

// Get all reports
const reports = await storage.getAllReports();

// Delete report
await storage.deleteReport(reportId);
```

### Auth API
```javascript
// Login
const result = await auth.login(username, password);

// Change password
const result = await auth.changePassword(current, newPassword);

// Logout
auth.logout();
```

### Image Processing API
```javascript
// Preprocess image
const result = await preprocessor.preprocess(file);

// Extract features
const result = await featuresExtractor.extractFeatures(file, hand);
```

### Report Generation API
```javascript
// Generate PDF
const result = await pdfGenerator.generateReport(
    clientData, 
    features, 
    predictions, 
    timeline, 
    images
);
```

---

## 📋 Checklist for Production Deployment

- [ ] Logo files replaced (/assets/)
- [ ] Default password changed (if needed)
- [ ] Rules customized per your standards
- [ ] Tested offline (double-click index.html)
- [ ] Tested on GitHub Pages
- [ ] Tested on multiple browsers
- [ ] PDF generation tested
- [ ] History save/load tested
- [ ] All Hindi text reviewed
- [ ] Disclaimer customized

---

## ⚠️ Important Notes

### Data Privacy
- ✅ सभी data locally stored है
- ✅ कोई server को नहीं जाता
- ✅ User control में है delete करने का

### Security Disclosure
```
⚠️ यह client-side app है:
- Browser DevTools से data accessible है
- Plain-text passwords नहीं stored हैं
- Client-side auth केवल UI gatekeeping है
- Production में backend add करें
```

### Browser Storage
- IndexedDB की limit: ~50MB
- Older browsers में काम नहीं करेगा (IE 10 या पुराना)
- Data automatically backed up नहीं है

---

## 📞 Support

### Common Questions

**Q: क्या बिना internet के चल सकता है?**
A: हाँ! Fully offline-first है। index.html को double-click करके चला सकते हो।

**Q: Data कहाँ save होता है?**
A: सब कुछ browser के IndexedDB में locally save है। कहीं upload नहीं होता।

**Q: क्या multiple users support करता है?**
A: नहीं, केवल single Admin है। Multi-user के लिए backend add करना होगा।

**Q: Rules कैसे update करूँ?**
A: `src/rules/*.json` files edit करके reload करें।

**Q: Logo कैसे change करूँ?**
A: `/assets/` में नई PNG files डालें (size: 512x512)।

---

## 🎯 Future Enhancements

- [ ] Multi-user support
- [ ] Backend API integration
- [ ] Advanced image cropping tool
- [ ] Custom rule builder UI
- [ ] Report templates
- [ ] Email export
- [ ] Analytics dashboard

---

## 📄 License

Copyright © 2025 Guruji Hastrekha. All rights reserved.

---

## 🙏 Disclaimer

**यह application केवल मनोरंजन और शैक्षणिक उद्देश्यों के लिए है।**

- यह चिकित्सा सलाह नहीं है
- यह कानूनी सलाह नहीं है
- यह वित्तीय सलाह नहीं है
- किसी भी महत्वपूर्ण निर्णय से पहले योग्य विशेषज्ञों से परामर्श लें

---

**Happy Reading! 🔮✨**
