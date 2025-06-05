document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let currentFontSize = parseInt(localStorage.getItem('a11y-font-size')) || 100;
    const a11yButtons = document.querySelectorAll('.a11y-btn');
    
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
    
    // Load saved preferences
    function loadAccessibilityPreferences() {
        // Font size
        if (localStorage.getItem('a11y-font-size')) {
            currentFontSize = parseInt(localStorage.getItem('a11y-font-size'));
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
    
    // Handle button clicks
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
    
    // Enable screen reader descriptions
    function enableScreenReaderDescriptions() {
        // Add descriptions to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text + ' button');
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
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
    
    // Load preferences on page load
    loadAccessibilityPreferences();
    
    console.log('Accessibility page script loaded');
});