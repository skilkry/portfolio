// Importar el ThemeManager
import { themeManager } from './themeManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el tema desde localStorage
    themeManager.initTheme();
    
    // Buscar el botón de toggle si existe en la página actual
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
        });
    }
    
    // Load accessibility script
    const accessibilityScript = document.createElement('script');
    accessibilityScript.src = './assets/JavaScript/accessibility.js';
    document.body.appendChild(accessibilityScript);
});