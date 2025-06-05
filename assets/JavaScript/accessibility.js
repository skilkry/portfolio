// Accessibility Menu Functionality - Versión simplificada
document.addEventListener('DOMContentLoaded', () => {
    console.log('Accessibility script loaded');
    
    // Get elements
    const a11yButton = document.getElementById('a11yButton');
    const a11yMenu = document.getElementById('a11yMenu');
    
    // Debug
    console.log('a11yButton:', a11yButton);
    console.log('a11yMenu:', a11yMenu);
    
    // Toggle accessibility menu - Versión simplificada
    if (a11yButton && a11yMenu) {
        a11yButton.addEventListener('click', (e) => {
            console.log('Accessibility button clicked');
            e.preventDefault();
            e.stopPropagation();
            a11yMenu.classList.toggle('active');
        });
        
        // Close button
        const closeA11yButton = document.getElementById('closeA11yButton');
        if (closeA11yButton) {
            closeA11yButton.addEventListener('click', () => {
                a11yMenu.classList.remove('active');
            });
        }
    } else {
        console.error('Accessibility elements not found!');
    }
    const a11yButtons = document.querySelectorAll('.a11y-btn');
    
    // Font size adjustment variables
    let currentFontSize = 100;
    
    // Audio feedback
    const feedbackSound = new Audio('./assets/sounds/click.mp3');
    const successSound = new Audio('./assets/sounds/success.mp3');
    
    // Play feedback sound with volume from settings
    function playFeedbackSound(sound) {
        const volumeLevel = localStorage.getItem('volume-level') || 50;
        sound.volume = volumeLevel / 100;
        sound.currentTime = 0;
        sound.play().catch(err => console.log('Audio play failed:', err));
    }
    
    // Toggle accessibility menu
    if (a11yButton) {
        a11yButton.addEventListener('click', () => {
            a11yMenu.classList.toggle('active');
            playFeedbackSound(feedbackSound);
            
            // Close config menu if open
            const configMenu = document.getElementById('configMenu');
            if (configMenu && configMenu.classList.contains('active')) {
                configMenu.classList.remove('active');
            }
        });
    } else {
        console.error('Accessibility button not found!');
    }
    
    // Close menu
    if (closeA11yButton) {
        closeA11yButton.addEventListener('click', () => {
            a11yMenu.classList.remove('active');
            playFeedbackSound(feedbackSound);
        });
    } else {
        console.error('Close accessibility button not found!');
    }
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        if (a11yMenu && !a11yMenu.contains(e.target) && e.target !== a11yButton) {
            a11yMenu.classList.remove('active');
        }
    });
    
    // Handle accessibility options
    a11yButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            playFeedbackSound(feedbackSound);
            
            // Font size adjustments
            if (action === 'increase-font') {
                currentFontSize += 10;
                document.documentElement.style.fontSize = `${currentFontSize}%`;
                localStorage.setItem('a11y-font-size', currentFontSize);
            } else if (action === 'decrease-font') {
                currentFontSize = Math.max(90, currentFontSize - 10);
                document.documentElement.style.fontSize = `${currentFontSize}%`;
                localStorage.setItem('a11y-font-size', currentFontSize);
            } else if (action === 'reset-font') {
                currentFontSize = 100;
                document.documentElement.style.fontSize = '100%';
                localStorage.setItem('a11y-font-size', currentFontSize);
            }
            
            // Color and contrast adjustments
            else if (action === 'high-contrast') {
                document.body.classList.add('high-contrast');
                document.body.classList.remove('color-blind');
                localStorage.setItem('a11y-color-mode', 'high-contrast');
            } else if (action === 'color-blind') {
                document.body.classList.add('color-blind');
                document.body.classList.remove('high-contrast');
                localStorage.setItem('a11y-color-mode', 'color-blind');
            } else if (action === 'reset-colors') {
                document.body.classList.remove('high-contrast', 'color-blind');
                localStorage.setItem('a11y-color-mode', 'normal');
            }
            
            // Motion adjustments
            else if (action === 'reduce-motion') {
                document.body.classList.add('reduced-motion');
                localStorage.setItem('a11y-motion', 'reduced');
            } else if (action === 'enable-motion') {
                document.body.classList.remove('reduced-motion');
                localStorage.setItem('a11y-motion', 'enabled');
            }
            
            // Screen reader support
            else if (action === 'enable-reader') {
                enableScreenReaderDescriptions();
                localStorage.setItem('a11y-reader', 'enabled');
            } else if (action === 'disable-reader') {
                disableScreenReaderDescriptions();
                localStorage.setItem('a11y-reader', 'disabled');
            }
            
            // Reading mode
            else if (action === 'enable-reading-mode') {
                document.body.classList.add('reading-mode');
                localStorage.setItem('a11y-reading-mode', 'enabled');
                playFeedbackSound(successSound);
            } else if (action === 'disable-reading-mode') {
                document.body.classList.remove('reading-mode');
                localStorage.setItem('a11y-reading-mode', 'disabled');
            }
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        // Alt + A to toggle accessibility menu
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            if (a11yMenu) {
                a11yMenu.classList.toggle('active');
                playFeedbackSound(feedbackSound);
            }
        }
        
        // Escape key to close menu
        if (e.key === 'Escape') {
            if (a11yMenu && a11yMenu.classList.contains('active')) {
                a11yMenu.classList.remove('active');
                playFeedbackSound(feedbackSound);
            }
        }
        
        // Alt + C for high contrast
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            document.body.classList.toggle('high-contrast');
            document.body.classList.remove('color-blind');
            localStorage.setItem('a11y-color-mode', 
                document.body.classList.contains('high-contrast') ? 'high-contrast' : 'normal');
            playFeedbackSound(successSound);
        }
        
        // Alt + F to increase font size
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            currentFontSize += 10;
            document.documentElement.style.fontSize = `${currentFontSize}%`;
            localStorage.setItem('a11y-font-size', currentFontSize);
            playFeedbackSound(feedbackSound);
        }
    });
    
    // Add keyboard focus indicators
    function enhanceKeyboardFocus() {
        const style = document.createElement('style');
        style.textContent = `
            :focus {
                outline: 3px solid #9333ff !important;
                outline-offset: 3px !important;
            }
            
            body.high-contrast :focus {
                outline: 3px solid white !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceKeyboardFocus();
    
    // Enable screen reader descriptions
    function enableScreenReaderDescriptions() {
        // Add descriptions to menu buttons
        const menuButtons = document.querySelectorAll('.menu-button');
        menuButtons.forEach(button => {
            const icon = button.querySelector('i');
            const text = button.querySelector('span')?.textContent;
            if (text) {
                button.setAttribute('aria-label', `${text} button`);
            }
        });
        
        // Add descriptions to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.getAttribute('aria-label') && img.getAttribute('alt')) {
                img.setAttribute('aria-label', img.getAttribute('alt'));
            }
        });
        
        // Add descriptions to links
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (!link.getAttribute('aria-label') && link.textContent) {
                link.setAttribute('aria-label', `Link to ${link.textContent}`);
            }
        });
    }
    
    // Disable screen reader descriptions
    function disableScreenReaderDescriptions() {
        const elements = document.querySelectorAll('[aria-label]');
        elements.forEach(el => {
            if (!el.hasAttribute('data-original-aria-label')) {
                el.setAttribute('data-original-aria-label', el.getAttribute('aria-label'));
            }
            el.removeAttribute('aria-label');
        });
    }
    
    // Load preferences on page load
    function loadAccessibilityPreferences() {
        // Font size
        const savedFontSize = localStorage.getItem('a11y-font-size');
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            document.documentElement.style.fontSize = `${currentFontSize}%`;
        }
        
        // Color mode
        const savedColorMode = localStorage.getItem('a11y-color-mode');
        if (savedColorMode === 'high-contrast') {
            document.body.classList.add('high-contrast');
        } else if (savedColorMode === 'color-blind') {
            document.body.classList.add('color-blind');
        }
        
        // Motion
        const savedMotion = localStorage.getItem('a11y-motion');
        if (savedMotion === 'reduced') {
            document.body.classList.add('reduced-motion');
        }
        
        // Screen reader
        const savedReader = localStorage.getItem('a11y-reader');
        if (savedReader === 'enabled') {
            enableScreenReaderDescriptions();
        }
        
        // Reading mode
        const savedReadingMode = localStorage.getItem('a11y-reading-mode');
        if (savedReadingMode === 'enabled') {
            document.body.classList.add('reading-mode');
        }
    }
    
    // Load preferences on page load
    loadAccessibilityPreferences();
});