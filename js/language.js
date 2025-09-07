// Language switcher functionality
const languageSelect = document.getElementById('language-select');
const elementsToTranslate = document.querySelectorAll('[data-translate]');

// Available languages
const languages = {
    'en': { name: 'English', flag: '🇬🇧' },
    'az': { name: 'Azərbaycanca', flag: '🇦🇿' },
    'ru': { name: 'Русский', flag: '🇷🇺' }
};

// Load language file
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error('Language file not found');
        return await response.json();
    } catch (error) {
        console.error('Error loading language file:', error);
        return null;
    }
}

// Update page content with translations
async function updateContent(lang) {
    const translations = await loadLanguage(lang);
    if (!translations) return;

    // Update page title
    document.title = translations.title || document.title;

    // Update elements with data-translate attribute
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (!key) return;
        
        // Handle array translations (e.g., "key.index")
        if (key.includes('.')) {
            const [arrayKey, index] = key.split('.');
            if (translations[arrayKey] && translations[arrayKey][parseInt(index)]) {
                element.textContent = translations[arrayKey][parseInt(index)];
            }
        } 
        // Handle simple key translations
        else if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    // Update language selector
    if (languageSelect) {
        languageSelect.innerHTML = '';
        Object.entries(languages).forEach(([code, langData]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${langData.flag} ${langData.name}`;
            option.selected = (code === lang);
            languageSelect.appendChild(option);
        });
    }

    // Set document language
    document.documentElement.lang = lang;
}

// Get system language with fallback to English
function getSystemLanguage() {
    // Get browser language (e.g., 'en-US' -> 'en')
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (languages[browserLang]) {
        return browserLang;
    }
    
    // Check for other possible language codes (like 'az' for 'az-Latn')
    for (const [code, _] of Object.entries(languages)) {
        if (browserLang.startsWith(code)) {
            return code;
        }
    }
    
    // Default to English if no match found
    return 'en';
}

// Initialize language
function initLanguage() {
    // Always use system language, don't save preference
    const systemLanguage = getSystemLanguage();
    
    // Set up language selector event
    if (languageSelect) {
        // Set the selected option to match system language
        languageSelect.value = systemLanguage;
        
        languageSelect.addEventListener('change', (e) => {
            updateContent(e.target.value);
        });
    }

    // Set initial language
    updateContent(systemLanguage);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage);
