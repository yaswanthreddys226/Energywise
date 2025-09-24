/**
 * Energy Wise - Accessibility and Language Support
 * This script handles accessibility features and language translations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility features
    initAccessibilityMenu();
    
    // Apply saved preferences
    applySavedPreferences();
    
    // Setup event listeners
    setupAccessibilityListeners();
});

/**
 * Initialize the accessibility menu
 */
function initAccessibilityMenu() {
    // Create accessibility menu if it doesn't exist
    if (!document.querySelector('.accessibility-menu')) {
        const accessibilityMenu = document.createElement('div');
        accessibilityMenu.className = 'accessibility-menu';
        accessibilityMenu.setAttribute('aria-label', 'Accessibility Options');
        accessibilityMenu.innerHTML = `
            <button class="accessibility-toggle" aria-expanded="false" aria-controls="accessibility-panel">
                <i class="fas fa-universal-access" aria-hidden="true"></i>
                <span class="sr-only">Accessibility Options</span>
            </button>
            <div id="accessibility-panel" class="accessibility-panel" aria-hidden="true">
                <h3>Accessibility Options</h3>
                <div class="accessibility-options">
                    <div class="option">
                        <label for="high-contrast">
                            <input type="checkbox" id="high-contrast" name="high-contrast">
                            High Contrast
                        </label>
                    </div>
                    <div class="option">
                        <label for="large-text">
                            <input type="checkbox" id="large-text" name="large-text">
                            Large Text
                        </label>
                    </div>
                    <div class="option">
                        <label for="reduce-motion">
                            <input type="checkbox" id="reduce-motion" name="reduce-motion">
                            Reduce Motion
                        </label>
                    </div>
                    <div class="option">
                        <label for="screen-reader">
                            <input type="checkbox" id="screen-reader" name="screen-reader">
                            Screen Reader Optimization
                        </label>
                    </div>
                </div>
                <div class="language-selector">
                    <label for="language-select">Language:</label>
                    <select id="language-select" name="language">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="gu">Gujarati</option>
                        <option value="ta">Tamil</option>
                    </select>
                </div>
                <button class="reset-preferences">Reset to Default</button>
            </div>
        `;
        document.body.appendChild(accessibilityMenu);
    }
}

/**
 * Apply saved accessibility preferences from localStorage
 */
function applySavedPreferences() {
    // Check for saved preferences
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const largeText = localStorage.getItem('largeText') === 'true';
    const reduceMotion = localStorage.getItem('reduceMotion') === 'true';
    const screenReader = localStorage.getItem('screenReader') === 'true';
    const language = localStorage.getItem('language') || 'en';
    
    // Apply preferences to the page
    if (highContrast) {
        document.body.classList.add('high-contrast');
        document.getElementById('high-contrast').checked = true;
    }
    
    if (largeText) {
        document.body.classList.add('large-text');
        document.getElementById('large-text').checked = true;
    }
    
    if (reduceMotion) {
        document.body.classList.add('reduce-motion');
        document.getElementById('reduce-motion').checked = true;
    }
    
    if (screenReader) {
        document.body.classList.add('screen-reader-optimization');
        document.getElementById('screen-reader').checked = true;
    }
    
    // Set language
    document.getElementById('language-select').value = language;
    changeLanguage(language);
}

/**
 * Setup event listeners for accessibility features
 */
function setupAccessibilityListeners() {
    // Toggle accessibility panel
    const accessibilityToggle = document.querySelector('.accessibility-toggle');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    
    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            accessibilityPanel.setAttribute('aria-hidden', expanded);
            accessibilityPanel.classList.toggle('active');
        });
    }
    
    // High Contrast toggle
    const highContrastToggle = document.getElementById('high-contrast');
    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', function() {
            document.body.classList.toggle('high-contrast', this.checked);
            localStorage.setItem('highContrast', this.checked);
        });
    }
    
    // Large Text toggle
    const largeTextToggle = document.getElementById('large-text');
    if (largeTextToggle) {
        largeTextToggle.addEventListener('change', function() {
            document.body.classList.toggle('large-text', this.checked);
            localStorage.setItem('largeText', this.checked);
        });
    }
    
    // Reduce Motion toggle
    const reduceMotionToggle = document.getElementById('reduce-motion');
    if (reduceMotionToggle) {
        reduceMotionToggle.addEventListener('change', function() {
            document.body.classList.toggle('reduce-motion', this.checked);
            localStorage.setItem('reduceMotion', this.checked);
        });
    }
    
    // Screen Reader Optimization toggle
    const screenReaderToggle = document.getElementById('screen-reader');
    if (screenReaderToggle) {
        screenReaderToggle.addEventListener('change', function() {
            document.body.classList.toggle('screen-reader-optimization', this.checked);
            localStorage.setItem('screenReader', this.checked);
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
            localStorage.setItem('language', this.value);
        });
    }
    
    // Reset preferences
    const resetButton = document.querySelector('.reset-preferences');
    if (resetButton) {
        resetButton.addEventListener('click', resetAccessibilityPreferences);
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (accessibilityPanel && accessibilityPanel.classList.contains('active')) {
            const isClickInside = accessibilityPanel.contains(event.target) || 
                                 accessibilityToggle.contains(event.target);
            
            if (!isClickInside) {
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityPanel.setAttribute('aria-hidden', 'true');
                accessibilityPanel.classList.remove('active');
            }
        }
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(event) {
        // Close accessibility panel on Escape key
        if (event.key === 'Escape' && accessibilityPanel && accessibilityPanel.classList.contains('active')) {
            accessibilityToggle.setAttribute('aria-expanded', 'false');
            accessibilityPanel.setAttribute('aria-hidden', 'true');
            accessibilityPanel.classList.remove('active');
        }
    });
}

/**
 * Reset all accessibility preferences to default
 */
function resetAccessibilityPreferences() {
    // Remove classes
    document.body.classList.remove('high-contrast', 'large-text', 'reduce-motion', 'screen-reader-optimization');
    
    // Uncheck toggles
    document.getElementById('high-contrast').checked = false;
    document.getElementById('large-text').checked = false;
    document.getElementById('reduce-motion').checked = false;
    document.getElementById('screen-reader').checked = false;
    
    // Reset language
    document.getElementById('language-select').value = 'en';
    changeLanguage('en');
    
    // Clear localStorage
    localStorage.removeItem('highContrast');
    localStorage.removeItem('largeText');
    localStorage.removeItem('reduceMotion');
    localStorage.removeItem('screenReader');
    localStorage.removeItem('language');
    
    // Show confirmation
    showAccessibilityNotification('Preferences Reset', 'All accessibility settings have been reset to default.');
}

/**
 * Change the language of the website
 * @param {string} language - The language code to change to
 */
function changeLanguage(language) {
    // This would typically use a translation library or fetch translations from a server
    // For demo purposes, we'll just show a notification
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'ta': 'Tamil'
    };
    
    showAccessibilityNotification('Language Changed', `Website language changed to ${languages[language]}.`);
    
    // In a real implementation, this would update all text content on the page
    // Example of how this might work:
    // document.querySelectorAll('[data-i18n]').forEach(element => {
    //     const key = element.getAttribute('data-i18n');
    //     element.textContent = translations[language][key];
    // });
}

/**
 * Show a notification for accessibility changes
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 */
function showAccessibilityNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'accessibility-notification';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add skip link functionality for keyboard users
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
});