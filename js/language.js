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

    // Save selected language
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
}

// Initialize language
function initLanguage() {
    // Try to get language from localStorage or browser settings
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    const defaultLanguage = Object.keys(languages).includes(browserLanguage) ? browserLanguage : 'en';
    const initialLanguage = savedLanguage || defaultLanguage;

    // Set up language selector event
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateContent(e.target.value);
        });
    }

    // Set initial language
    updateContent(initialLanguage);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage);
