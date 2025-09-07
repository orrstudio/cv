// Theme switcher functionality
const themeSwitch = document.querySelector('.theme-switch__checkbox');

// Function to apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeSwitch.checked = theme === 'dark';
}

// Function to detect system theme
function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
}

// Apply system theme on page load
function initTheme() {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    
    // Update switch position based on current theme
    themeSwitch.checked = systemTheme === 'dark';
}

// Theme switch event listener - temporary change until page refresh
themeSwitch.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Initialize theme when page loads
initTheme();