import { themeManager } from './themeManager.js';
import { audioManager } from './audioManager.js';
import { languageManager } from './languageManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const configButton = document.getElementById('configButton');
    const configMenu = document.getElementById('configMenu');
    const closeConfigButton = document.getElementById('closeConfigButton');
    const configMenuItems = document.querySelectorAll('.config-menu-item span');
    
    // Add data-text attribute for glitch effect
    configMenuItems.forEach(item => {
        item.setAttribute('data-text', item.textContent);
    });
    
    // Toggle config menu
    configButton.addEventListener('click', () => {
        configMenu.classList.toggle('active');
        configButton.classList.toggle('active');
        
        // Add glitch effect to button when opening
        if (configMenu.classList.contains('active')) {
            configButton.style.animation = 'glitchButton 0.3s';
            setTimeout(() => {
                configButton.style.animation = '';
            }, 300);
        }
    });
    
    // Close config menu
    closeConfigButton.addEventListener('click', () => {
        configMenu.classList.remove('active');
        configButton.classList.remove('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!configMenu.contains(e.target) && e.target !== configButton) {
            configMenu.classList.remove('active');
            configButton.classList.remove('active');
        }
    });
    
    // Add hover sound effect
    const configMenuItemsAll = document.querySelectorAll('.config-menu-item');
    configMenuItemsAll.forEach(item => {
        item.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
    
    // Create audio context for hover sound
    let audioContext;
    
    function playHoverSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.error('Error playing hover sound:', error);
        }
    }
    
    // Add click sound effect for menu items
    configMenuItemsAll.forEach(item => {
        item.addEventListener('click', () => {
            playClickSound();
        });
    });
    
    function playClickSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.error('Error playing click sound:', error);
        }
    }
    
    // Add glitch animation to menu items periodically
    setInterval(() => {
        const randomItem = configMenuItemsAll[Math.floor(Math.random() * configMenuItemsAll.length)];
        if (randomItem) {
            randomItem.classList.add('glitch-effect');
            setTimeout(() => {
                randomItem.classList.remove('glitch-effect');
            }, 500);
        }
    }, 3000);
    
    // Inicializar controles
    initThemeControls();
    initSoundControls();
    initLanguageControls();
});


function initSoundControls() {
    const soundToggle = document.getElementById('sound-toggle');
    const volumeSlider = document.getElementById('sound-volume');
    
    if (soundToggle) {
        // Establecer el icono inicial según el estado guardado
        const isMuted = localStorage.getItem('siteMuted') === 'true';
        const icon = soundToggle.querySelector('i');
        icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        
        soundToggle.addEventListener('click', () => {
            const isEnabled = audioManager.toggleSound();
            const icon = soundToggle.querySelector('i');
            
            if (isEnabled) {
                icon.className = 'fas fa-volume-up';
            } else {
                icon.className = 'fas fa-volume-mute';
            }
        });
    }
    
    if (volumeSlider) {
        // Establecer el valor inicial según el volumen guardado
        const savedVolume = localStorage.getItem('siteVolume') || 0.5;
        volumeSlider.value = savedVolume * 100;
        
        volumeSlider.addEventListener('input', (e) => {
            audioManager.setVolume(e.target.value / 100);
        });
    }
}

function initThemeControls() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Establecer el icono inicial según el tema guardado
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                          (!document.body.classList.contains('light-theme') && 
                           localStorage.getItem('theme') !== 'light');
        const icon = themeToggle.querySelector('i');
        icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
        
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
            
            // Actualizar el icono según el tema actual
            const isLightTheme = document.body.classList.contains('light-theme');
            icon.className = isLightTheme ? 'fas fa-sun' : 'fas fa-moon';
            
            // Add cyberpunk glitch effect on toggle
            themeToggle.classList.add('glitch-effect');
            setTimeout(() => {
                themeToggle.classList.remove('glitch-effect');
            }, 500);
        });
    }
}

function initLanguageControls() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        // Establecer el valor inicial según el idioma guardado
        const savedLanguage = localStorage.getItem('language') || 'es';
        languageSelector.value = savedLanguage;
        
        languageSelector.addEventListener('change', () => {
            languageManager.setLanguage(languageSelector.value);
        });
    }
}