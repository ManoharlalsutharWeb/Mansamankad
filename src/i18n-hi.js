/**
 * Hindi i18n Module
 * All Hindi translations and language strings
 */

const I18N = {
    COMMON: {
        APP_NAME: 'Guruji Hastrekha',
        APP_TITLE: 'Guruji Hastrekha Admin Dashboard',
        LOADING: 'प्रसंस्करण जारी है...',
        PROCESSING: 'प्रसंस्करण जारी है...',
        SUCCESS: 'सफल',
        ERROR: 'त्रुटि',
        WARNING: 'चेतावनी',
        INFO: 'जानकारी',
        CLOSE: 'बंद करें',
        SAVE: 'सहेजें',
        CANCEL: 'रद्द करें',
        DELETE: 'हटाएं',
        DOWNLOAD: 'डाउनलोड करें',
        BACK: 'वापस जाएं',
        NEXT: 'आगे',
        PREVIOUS: 'पिछला',
        SUBMIT: 'जमा करें',
        CONFIRM: 'पुष्टि करें',
    },

    LOGIN: {
        TITLE: 'Guruji Hastrekha',
        SUBTITLE: 'Admin Dashboard',
        USERNAME: 'उपयोगकर्ता नाम',
        PASSWORD: 'पासवर्ड',
        LOGIN_BTN: 'लॉगिन करें',
        INVALID_CREDENTIALS: 'अमान्य उपयोगकर्ता नाम या पासवर्ड',
        LOGIN_FAILED: 'लॉगिन विफल। कृपया पुनः प्रयास करें।',
        SESSION_EXPIRED: 'आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।',
    },

    DASHBOARD: {
        TITLE: 'Guruji Hastrekha Admin',
        SETTINGS: 'सेटिंग्स',
        LOGOUT: 'लॉगआउट करें',
        NEW_REPORT: 'नया रिपोर्ट',
        HISTORY: 'इतिहास',
        SETTINGS_TAB: 'सेटिंग्स',
    },

    FORM: {
        CLIENT_INFO: 'व्यक्तिगत जानकारी',
        NAME: 'नाम',
        NAME_REQUIRED: 'नाम आवश्यक है',
        DOB: 'जन्मतिथि',
        DOB_OPTIONAL: 'जन्मतिथि (वैकल्पिक)',
        TIME: 'समय',
        TIME_OPTIONAL: 'जन्म का समय (वैकल्पिक)',
        HAND_SELECTION: 'हाथ का चयन',
        LEFT_HAND: 'बाएं हाथ',
        RIGHT_HAND: 'दाएं हाथ',
        BOTH_HANDS: 'दोनों हाथ',
        HAND_REQUIRED: 'हाथ का चयन आवश्यक है',
        UPLOAD_IMAGES: 'हस्तरेखा की तस्वीर अपलोड करें',
        UPLOAD_HINT: 'सूचना: हथेली की आंतरिक हथेली की स्पष्ट तस्वीर अपलोड करें',
        UPLOAD_BOTH_IMAGES: 'दोनों हाथों की तस्वीरें अपलोड करें',
        SELECT_IMAGE: 'तस्वीर क्लिक करके चुनें',
        IMAGE_REQUIRED: 'कम से कम एक तस्वीर आवश्यक है',
        TIMELINE_RANGE: 'रिपोर्ट समय सीमा',
        SELECT_TIMELINE: 'समय सीमा चुनें',
        TIMELINE_REQUIRED: 'समय सीमा चयन आवश्यक है',
        YEARS_5: '5 वर्ष',
        YEARS_10: '10 वर्ष',
        YEARS_15: '15 वर्ष',
        YEARS_20: '20 वर्ष',
    },

    PREVIEW: {
        TITLE: 'रिपोर्ट प्रीव्यू',
        UPLOADED_IMAGES: 'अपलोड की गई तस्वीरें',
        OVERLAY_ANALYSIS: 'पंक्तियों का विश्लेषण (ओवरले)',
        QUALITY_CONFIDENCE: 'गुणवत्ता और आत्मविश्वास',
        GENERATE_PDF: 'PDF रिपोर्ट बनाएं',
        QUALITY_SCORE: 'गुणवत्ता स्कोर',
        CONFIDENCE: 'आत्मविश्वास',
        LINE_DENSITY: 'पंक्ति घनत्व',
        GENERATING_PDF: 'रिपोर्ट बना रहे हैं...',
        PDF_GENERATED: 'PDF रिपोर्ट तैयार है',
        PDF_DOWNLOAD_READY: 'PDF डाउनलोड के लिए तैयार है',
    },

    HISTORY: {
        TITLE: 'पिछली रिपोर्ट',
        EMPTY: 'कोई रिपोर्ट नहीं मिली',
        CREATED: 'निर्मित',
        CREATED_AT: 'तिथि',
        DOWNLOAD: 'डाउनलोड करें',
        REGENERATE: 'पुनः बनाएं',
        DELETE_CONFIRM: 'क्या आप इस रिपोर्ट को हटाना चाहते हैं?',
        DELETED: 'रिपोर्ट हटा दी गई है',
    },

    SETTINGS: {
        TITLE: 'सेटिंग्स',
        CHANGE_PASSWORD: 'पासवर्ड बदलें',
        CURRENT_PASSWORD: 'वर्तमान पासवर्ड',
        NEW_PASSWORD: 'नया पासवर्ड',
        CONFIRM_PASSWORD: 'पासवर्ड की पुष्टि करें',
        CHANGE_PASSWORD_BTN: 'पासवर्ड बदलें',
        PASSWORD_CHANGED: 'पासवर्ड सफलतापूर्वक बदल दिया गया है',
        PASSWORD_MISMATCH: 'नया पासवर्ड मेल नहीं खाता',
        CURRENT_PASSWORD_INCORRECT: 'वर्तमान पासवर्ड गलत है',
        DATA_MANAGEMENT: 'डेटा प्रबंधन',
        DELETE_ALL_DATA: 'सभी डेटा हटाएं',
        DELETE_ALL_CONFIRM: 'क्या आप सभी स्थानीय डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
        ALL_DATA_DELETED: 'सभी डेटा हटा दिया गया है',
        LOGO_ADJUSTMENT: 'लोगो समायोजन (वैकल्पिक)',
        ADJUST_LOGO_CROP: 'लोगो फसल समायोजित करें',
    },

    PREDICTIONS: {
        EDUCATION: 'शिक्षा',
        MARRIAGE: 'विवाह',
        CHILDREN: 'संतान',
        CAREER: 'करियर/नौकरी',
        BUSINESS: 'व्यापार',
        MONEY: 'धन/संपत्ति',
        HEALTH: 'स्वास्थ्य/ऊर्जा/तनाव',
        TIMELINE: 'समय प्रक्षेपण',
        OVERALL: 'समग्र सारांश',

        TIMING_RANGE: 'संभावित समय खिड़की',
        CONFIDENCE_SCORE: 'आत्मविश्वास स्कोर',
        SUCCESS_PROBABILITY: 'सफलता की संभावना',
        RISK_LEVEL: 'जोखिम स्तर',
        RECOMMENDATIONS: 'सुझाव/उपाय',

        TIMING_YEARS: 'वर्षों में',
        COUNT_RANGE: 'संख्या की सीमा',
        STABLE: 'स्थिर',
        CHALLENGING: 'चुनौतीपूर्ण',
        FAVORABLE: 'अनुकूल',
        UNCERTAIN: 'अनिश्चित',
    },

    PDF: {
        TITLE: 'Guruji Hastrekha Analysis Report',
        COVER_TITLE: 'हस्तरेखा विश्लेषण रिपोर्ट',
        NAME: 'नाम',
        DATE: 'तिथि',
        TIME: 'समय',
        TIMELINE_RANGE: 'रिपोर्ट समय सीमा',
        DISCLAIMER: 'अस्वीकरण',
        PRIVACY: 'गोपनीयता नोट',
        DISCLAIMER_TEXT: 'यह रिपोर्ट पारंपरिक हस्तरेखा विश्लेषण पर आधारित है और केवल मनोरंजन/शैक्षणिक उद्देश्य के लिए है। यह चिकित्सा, कानूनी या वित्तीय सलाह नहीं है। कोई भी निर्णय लेने से पहले योग्य व्यावहारिक विशेषज्ञों से परामर्श लें।',
        PRIVACY_TEXT: 'आपकी व्यक्तिगत जानकारी और तस्वीरें केवल इस स्थानीय रिपोर्ट के लिए उपयोग की जाती हैं। कोई सर्वर पर अपलोड नहीं है। सभी डेटा आपके डिवाइस पर संग्रहीत है।',
        PHOTO_QUALITY: 'तस्वीर की गुणवत्ता',
        LEFT_HAND: 'बाएं हाथ',
        RIGHT_HAND: 'दाएं हाथ',
        BOTH_HANDS: 'दोनों हाथ',
        ANALYSIS: 'विश्लेषण',
        ORIGINAL_IMAGE: 'मूल तस्वीर',
        OVERLAY_IMAGE: 'पंक्तियों का विश्लेषण',
        PAGE: 'पृष्ठ',
        OF: 'का',
    },

    ERRORS: {
        GENERIC_ERROR: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        FILE_UPLOAD_ERROR: 'फाइल अपलोड विफल',
        IMAGE_PROCESSING_ERROR: 'तस्वीर प्रसंस्करण विफल',
        PDF_GENERATION_ERROR: 'PDF बनाने में विफल',
        DATABASE_ERROR: 'डेटाबेस त्रुटि',
        OPENCV_NOT_LOADED: 'OpenCV.js लोड नहीं हो सका',
        INVALID_IMAGE: 'अमान्य तस्वीर फाइल',
        IMAGE_TOO_SMALL: 'तस्वीर बहुत छोटी है (कम से कम 300x300px)',
    },

    SUCCESS: {
        PASSWORD_UPDATED: 'पासवर्ड सफलतापूर्वक अपडेट किया गया',
        REPORT_GENERATED: 'रिपोर्ट सफलतापूर्वक बनाई गई',
        REPORT_DELETED: 'रिपोर्ट सफलतापूर्वक हटाई गई',
        DATA_SAVED: 'डेटा सफलतापूर्वक सहेजा गया',
    },
};

// Utility function to get translation
function t(key, defaultValue = '') {
    const keys = key.split('.');
    let value = I18N;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue || key;
        }
    }
    
    return value || defaultValue || key;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18N, t };
}
