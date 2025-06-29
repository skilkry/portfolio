// =============================================================================
// SISTEMA DE MENÚ DE CONFIGURACIÓN - configMenu.js
// =============================================================================

class ConfigurationManager {
    constructor() {
        this.config = {
            language: 'es',
            theme: 'neon-pink',
            highContrast: false,
            reduceMotion: false
        };

        this.translations = {
            es: {
                menu: 'Menú',
                settings: 'Configuración',
                accessibility: 'Accesibilidad',
                links: 'Enlaces',
                language: 'Idioma',
                theme: 'Tema',
                high_contrast: 'Alto Contraste',
                reduce_motion: 'Reducir Movimiento',
                cv: 'Mi CV',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                theme_changed: 'Tema cambiado',
                language_changed: 'Idioma cambiado',
                accessibility_changed: 'Configuración de accesibilidad actualizada'
            },
            en: {
                menu: 'Menu',
                settings: 'Settings',
                accessibility: 'Accessibility',
                links: 'Links',
                language: 'Language',
                theme: 'Theme',
                high_contrast: 'High Contrast',
                reduce_motion: 'Reduce Motion',
                cv: 'My CV',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                theme_changed: 'Theme changed',
                language_changed: 'Language changed',
                accessibility_changed: 'Accessibility settings updated'
            }
        };

        this.init();
    }

    init() {
        this.loadConfiguration();
        this.bindEvents();
        this.applyConfiguration();
        this.detectSystemPreferences();
    }

    // Cargar configuración guardada
    loadConfiguration() {
        try {
            const savedConfig = localStorage.getItem('portfolioConfig');
            if (savedConfig) {
                this.config = { ...this.config, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.warn('Error loading configuration:', error);
        }
    }

    // Guardar configuración
    saveConfiguration() {
        try {
            localStorage.setItem('portfolioConfig', JSON.stringify(this.config));
        } catch (error) {
            console.warn('Error saving configuration:', error);
        }
    }

    // Vincular eventos
    bindEvents() {
        // Elementos del menú
        const configButton = document.getElementById('configButton');
        const configMenu = document.getElementById('configMenu');
        const closeButton = document.getElementById('closeConfigButton');

        if (!configButton || !configMenu || !closeButton) {
            console.warn('Elementos del menú de configuración no encontrados');
            return;
        }

        // Botón de apertura/cierre del menú
        configButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        closeButton.addEventListener('click', () => this.closeMenu());

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!configMenu.contains(e.target) && !configButton.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Selector de idioma
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Selector de tema
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // Toggle de alto contraste
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', () => {
                this.toggleHighContrast();
            });
        }

        // Toggle de reducir movimiento
        const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
        if (reduceMotionToggle) {
            reduceMotionToggle.addEventListener('click', () => {
                this.toggleReduceMotion();
            });
        }

        // Tecla ESC para cerrar menú
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    // Aplicar configuración actual
    applyConfiguration() {
        this.updateUI();
        this.applyTheme(this.config.theme);
        this.applyLanguage(this.config.language);
        this.applyAccessibility();
    }

    // Actualizar interfaz de usuario
    updateUI() {
        // Actualizar selectores
        const languageSelector = document.getElementById('language-selector');
        const themeSelector = document.getElementById('theme-selector');

        if (languageSelector) {
            languageSelector.value = this.config.language;
        }

        if (themeSelector) {
            themeSelector.value = this.config.theme;
        }

        // Actualizar toggles
        this.updateToggle('high-contrast-toggle', this.config.highContrast);
        this.updateToggle('reduce-motion-toggle', this.config.reduceMotion);
    }

    // Actualizar estado de un toggle
    updateToggle(id, state) {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.setAttribute('aria-checked', state.toString());
            toggle.textContent = state ? 'ON' : 'OFF';
        }
    }

    // Abrir/cerrar menú
    toggleMenu() {
        const menu = document.getElementById('configMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }

    // Cerrar menú
    closeMenu() {
        const menu = document.getElementById('configMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }

    // Cambiar idioma
    changeLanguage(language) {
        if (this.translations[language]) {
            this.config.language = language;
            this.applyLanguage(language);
            this.saveConfiguration();
            this.showNotification(this.translations[language].language_changed);
        }
    }

    // Aplicar idioma
    applyLanguage(language) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[language] && this.translations[language][key]) {
                element.textContent = this.translations[language][key];
            }
        });

        // Actualizar opciones del selector de tema
        this.updateThemeOptions(language);

        // Actualizar atributo lang del documento
        document.documentElement.lang = language;
    }

    // Actualizar opciones del selector de tema según idioma
    updateThemeOptions(language) {
        const themeSelector = document.getElementById('theme-selector');
        if (!themeSelector) return;

        const themeOptions = {
            es: {
                'neon-pink': 'Neón Rosa',
                'cyber-cyan': 'Cyber Cian',
                'hacker-green': 'Hacker Green'
            },
            en: {
                'neon-pink': 'Neon Pink',
                'cyber-cyan': 'Cyber Cyan',
                'hacker-green': 'Hacker Green'
            }
        };

        Array.from(themeSelector.options).forEach(option => {
            if (themeOptions[language] && themeOptions[language][option.value]) {
                option.textContent = themeOptions[language][option.value];
            }
        });
    }

    // Cambiar tema
    changeTheme(theme) {
        this.config.theme = theme;
        this.applyTheme(theme);
        this.saveConfiguration();
        this.showNotification(this.translations[this.config.language].theme_changed);
    }

    // Aplicar tema
    applyTheme(theme) {
        // Remover clases de tema anteriores
        document.body.classList.remove('theme-neon-pink', 'theme-cyber-cyan', 'theme-hacker-green');
        
        // Aplicar nuevo tema
        document.body.classList.add(`theme-${theme}`);
        document.body.setAttribute('data-theme', theme);

        // Actualizar variables CSS si existen
        this.updateThemeVariables(theme);
    }

    // Actualizar variables CSS del tema
    updateThemeVariables(theme) {
        const root = document.documentElement;
        
        const themes = {
            'neon-pink': {
                '--accent-color': '#ff1493',
                '--terminal-border-inner': 'rgba(255, 20, 147, 0.6)',
                '--success-color': '#ff69b4'
            },
            'cyber-cyan': {
                '--accent-color': '#00ffff',
                '--terminal-border-inner': 'rgba(0, 255, 255, 0.6)',
                '--success-color': '#40e0d0'
            },
            'hacker-green': {
                '--accent-color': '#00ff00',
                '--terminal-border-inner': 'rgba(0, 255, 0, 0.6)',
                '--success-color': '#32cd32'
            }
        };

        if (themes[theme]) {
            Object.entries(themes[theme]).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        }
    }

    // Toggle alto contraste
    toggleHighContrast() {
        this.config.highContrast = !this.config.highContrast;
        this.updateToggle('high-contrast-toggle', this.config.highContrast);
        this.applyAccessibility();
        this.saveConfiguration();
        this.showNotification(this.translations[this.config.language].accessibility_changed);
    }

    // Toggle reducir movimiento
    toggleReduceMotion() {
        this.config.reduceMotion = !this.config.reduceMotion;
        this.updateToggle('reduce-motion-toggle', this.config.reduceMotion);
        this.applyAccessibility();
        this.saveConfiguration();
        this.showNotification(this.translations[this.config.language].accessibility_changed);
    }

    // Aplicar configuración de accesibilidad
    applyAccessibility() {
        const body = document.body;
        
        // Alto contraste
        if (this.config.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Reducir movimiento
        if (this.config.reduceMotion) {
            body.classList.add('reduce-motion');
        } else {
            body.classList.remove('reduce-motion');
        }
    }

    // Detectar preferencias del sistema
    detectSystemPreferences() {
        try {
            // Detectar preferencia de movimiento reducido
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                if (!localStorage.getItem('portfolioConfig')) {
                    this.config.reduceMotion = true;
                    this.updateToggle('reduce-motion-toggle', true);
                    this.applyAccessibility();
                }
            }

            // Detectar preferencia de alto contraste
            if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
                if (!localStorage.getItem('portfolioConfig')) {
                    this.config.highContrast = true;
                    this.updateToggle('high-contrast-toggle', true);
                    this.applyAccessibility();
                }
            }

            // Listener para cambios en tiempo real
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                if (e.matches && !this.config.reduceMotion) {
                    this.toggleReduceMotion();
                }
            });

            window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
                if (e.matches && !this.config.highContrast) {
                    this.toggleHighContrast();
                }
            });

        } catch (error) {
            console.warn('Error detecting system preferences:', error);
        }
    }

    // Mostrar notificación
    showNotification(message) {
        // Crear elemento de notificación si no existe
        let notification = document.getElementById('config-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'config-notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--accent-color, #9333ff);
                color: #000;
                padding: 1rem;
                border-radius: 5px;
                font-size: 0.7rem;
                font-family: 'Press Start 2P', monospace;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1001;
                max-width: 250px;
                word-wrap: break-word;
            `;
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }

    // Método público para obtener configuración actual
    getConfig() {
        return { ...this.config };
    }

    // Método público para establecer configuración
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.applyConfiguration();
        this.saveConfiguration();
    }
}

// Instancia global del gestor de configuración
let configManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    configManager = new ConfigurationManager();
    
    // Hacer disponible globalmente para otros scripts
    window.ConfigManager = configManager;
});

// Exportar para uso en módulos ES6
export default ConfigurationManager;