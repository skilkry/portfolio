// La importación debe estar al principio del archivo, fuera de cualquier clase
import { languageManager } from './languageManager.js';

class ThemeManager {
    constructor() {
        this.darkTheme = true; // Asegúrate de que esto sea true por defecto
        this.initTheme();
    }

    initTheme() {
        // Recuperar preferencia guardada (si existe)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.darkTheme = savedTheme === 'dark';
        }
        
        // Aplicar el tema inicial
        this.applyTheme();
        
        // Asegurarse de que los elementos de fondo estén correctamente inicializados
        if (this.darkTheme) {
            this.initDarkThemeElements();
        }
    }

    initDarkThemeElements() {
        // Asegurarse de que los elementos de fondo existan y sean visibles
        const backgroundSystem = document.querySelector('.background-system');
        if (!backgroundSystem) {
            this.createCyberpunkBackground();
        } else {
            backgroundSystem.style.display = 'block';
            backgroundSystem.style.opacity = '1';
            backgroundSystem.style.visibility = 'visible';
        }
        
        // Asegurarse de que todos los elementos dentro sean visibles
        const elements = ['.grid', '.vignette', '.glow-points', '.scan-lines', '.cyber-text', '.cyber-text-2'];
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'block';
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const isLightTheme = body.classList.contains('light-theme');
        
        if (isLightTheme) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
        
        // Save the theme preference
        localStorage.setItem('theme', isLightTheme ? 'dark' : 'light');
    }

    // Modificar el método applyTheme para que también actualice los textos
    applyTheme() {
        document.body.classList.toggle('light-theme', !this.darkTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.darkTheme ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Modificar elementos de fondo según el tema
        this.updateBackgroundElements();
        
        // Actualizar textos según el idioma actual
        if (languageManager) {
            languageManager.applyTranslations();
        }
    }

    // Nuevo método para controlar los elementos de fondo
    updateBackgroundElements() {
        const scanLines = document.querySelector('.scan-lines');
        const grid = document.querySelector('.grid');
        const glowPoints = document.querySelector('.glow-points');
        const vignette = document.querySelector('.vignette');
        const backgroundSystem = document.querySelector('.background-system');
        const cyberParticles = document.querySelector('.cyber-particles');
        const cyberText = document.querySelector('.cyber-text');
        const cyberText2 = document.querySelector('.cyber-text-2');
        
        if (!this.darkTheme) {
            // Modo claro: ocultar completamente los elementos
            if (scanLines) scanLines.style.display = 'none';
            if (grid) grid.style.display = 'none';
            if (glowPoints) glowPoints.style.display = 'none';
            if (vignette) vignette.style.display = 'none';
            if (backgroundSystem) backgroundSystem.style.display = 'none';
            if (cyberParticles) cyberParticles.style.display = 'none';
            if (cyberText) cyberText.style.display = 'none';
            if (cyberText2) cyberText2.style.display = 'none';
            
            // Eliminar cualquier fondo adicional
            document.body.style.backgroundImage = 'none';
            
            // Cambiar el color de fondo directamente
            document.body.style.backgroundColor = '#E8B4B8';
        } else {
            // Modo oscuro: restaurar elementos y asegurarse de que sean visibles
            if (scanLines) {
                scanLines.style.display = 'block';
                scanLines.style.opacity = '1';
                scanLines.style.visibility = 'visible';
            }
            
            // Hacer lo mismo para los demás elementos
            if (grid) {
                grid.style.display = 'block';
                grid.style.opacity = '1';
                grid.style.visibility = 'visible';
            }
            
            if (glowPoints) glowPoints.style.display = 'block';
            if (vignette) vignette.style.display = 'block';
            if (backgroundSystem) backgroundSystem.style.display = 'block';
            if (cyberParticles) cyberParticles.style.display = 'block';
            if (cyberText) cyberText.style.display = 'block';
            if (cyberText2) cyberText2.style.display = 'block';
            
            // Restaurar el color de fondo
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            
            // Asegurarse de que el background-system esté visible
            if (backgroundSystem) {
                backgroundSystem.style.display = 'block';
                backgroundSystem.style.opacity = '1';
                backgroundSystem.style.visibility = 'visible';
            } else {
                // Si no existe, crearlo
                this.initDarkThemeElements();
            }
        }
    }

    // El método debe estar dentro de la clase, no fuera
    createCyberpunkBackground() {
        // Verificar si ya existe el fondo
        if (!document.querySelector('.background-system')) {
            const backgroundSystem = document.createElement('div');
            backgroundSystem.classList.add('background-system');
            
            // Añadir elementos de fondo
          
            
            // Insertar al inicio del body
            document.body.insertBefore(backgroundSystem, document.body.firstChild);
        }
    }
}

export const themeManager = new ThemeManager();