class LanguageManager {
    constructor() {
        this.currentLanguage = 'es'; // Idioma por defecto: español
        this.translations = {
            es: {
                // Textos de navegación
                'back-to-home': 'Volver al Inicio',
                'my-cv': 'Mi CV',
                'my-certificates': 'Mis Certificados',
                
                // Textos de configuración
                'menu': 'Menú',
                'navigation': 'Navegación',
                'settings': 'Configuración',
                'theme': 'Tema',
                'volume': 'Volumen',
                'language': 'Idioma',
                'register': 'Regístrate',
                
                // Textos de la página principal
                'web-developer': 'Desarrollador Web',
                'about-me': 'Sobre Mí',
                'projects': 'Proyectos',
                'contact': 'Contacto',
                'contact-me': 'Contáctame',  // Añadido para el botón de contacto
                'sign-up': 'Regístrate',     // Añadido para el botón de registro
                'more': 'Más',
                
                // Textos del perfil
                'developer': 'Desarrollador',
                'designer': 'Diseñador',
                'online': 'En línea',
                'skills': 'Habilidades',
                'links': 'Enlaces',
                
                // Textos del footer
                'all-rights-reserved': 'Todos los derechos reservados'
            },
            en: {
                // Navigation texts
                'back-to-home': 'Back to Home',
                'my-cv': 'My CV',
                'my-certificates': 'My Certificates',
                'all-rights-reserved': 'Todos los derechos reservados',
                'contact-me': 'Contact Me',
                'sign-up': 'Sign Up',
                // Configuration texts
                'menu': 'Menu',
                'navigation': 'Navigation',
                'settings': 'Settings',
                'theme': 'Theme',
                'volume': 'Volume',
                'language': 'Language',
                'register': 'Register',  // Añadida la traducción en inglés
                
                // Main page texts
                'web-developer': 'Web Developer',
                'about-me': 'About Me',
                'projects': 'Projects',
                'contact': 'Contact',
                'more': 'More',
                
                // Profile texts
                'developer': 'Developer',
                'designer': 'Designer',
                'online': 'Online',
                'skills': 'Skills',
                'links': 'Links',
                
                // Footer texts
                'all-rights-reserved': 'All rights reserved'
            }
        };
        
        this.initLanguage();
    }
    
    initLanguage() {
        // Recuperar preferencia guardada (si existe)
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
        
        // Configurar atributos de traducción
        this.setupTranslationAttributes();
        
        // Establecer el valor del selector de idioma
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
            
            // Añadir event listener para cambios
            languageSelector.addEventListener('change', () => {
                this.setLanguage(languageSelector.value);
            });
        }
        
        // Aplicar traducciones iniciales
        this.applyTranslations();
    }
    
    setLanguage(language) {
        console.log('Setting language to:', language);
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.applyTranslations();
            
            // Actualizar el valor del selector de idioma
            const languageSelector = document.getElementById('language-selector');
            if (languageSelector) {
                languageSelector.value = language;
            }
            
            // Disparar un evento personalizado para que otros componentes puedan reaccionar
            const event = new CustomEvent('languageChanged', { detail: { language } });
            document.dispatchEvent(event);
            
            console.log('Language changed successfully to:', language);
        } else {
            console.error('Language not supported:', language);
        }
    }
    
    applyTranslations() {
        console.log('Applying translations to language:', this.currentLanguage);
        const elements = document.querySelectorAll('[data-i18n]');
        console.log('Found elements to translate:', elements.length);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            console.log('Translating element with key:', key);
            
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
                console.log('Translated to:', this.translations[this.currentLanguage][key]);
            } else {
                console.warn('Translation not found for key:', key, 'in language:', this.currentLanguage);
            }
        });
        
        // También traducir atributos placeholder, title, etc.
        const elementsWithPlaceholder = document.querySelectorAll('[data-i18n-placeholder]');
        elementsWithPlaceholder.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.setAttribute('placeholder', this.translations[this.currentLanguage][key]);
            }
        });
        
        // Traducir atributos title
        const elementsWithTitle = document.querySelectorAll('[data-i18n-title]');
        elementsWithTitle.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.setAttribute('title', this.translations[this.currentLanguage][key]);
            }
        });
    }
    
    // Nuevo método para añadir atributos data-i18n automáticamente
    setupTranslationAttributes() {
        // Mapa de selectores CSS a claves de traducción
        const selectorToKeyMap = {
            '.section-title:contains("Navigation")': 'navigation',
            '.section-title:contains("Navegación")': 'navigation',
            '.section-title:contains("Settings")': 'settings',
            '.section-title:contains("Configuración")': 'settings',
            'label[for="theme-toggle"]': 'theme',
            'label[for="sound-volume"]': 'volume',
            'label[for="language-selector"]': 'language',
            '.config-menu-header h3': 'menu',
            '.config-menu-item span:contains("My CV")': 'my-cv',
            '.config-menu-item span:contains("Mi CV")': 'my-cv',
            '.config-menu-item span:contains("My Certificates")': 'my-certificates',
            '.config-menu-item span:contains("Mis Certificados")': 'my-certificates',
            '.menu-button.more span': 'contact-me',  // Selector para el botón de contacto
            '.menu-button.extra span': 'sign-up',    // Selector para el botón de registro
            'contact-me': 'Contáctame',
            'sign-up': 'Regístrate',

        };
        
        // Función auxiliar para encontrar elementos por texto
        const findElementsByText = (selector, text) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).filter(el => el.textContent.includes(text));
        };
        
        // Aplicar atributos data-i18n basados en el contenido
        Object.entries(selectorToKeyMap).forEach(([selector, key]) => {
            if (selector.includes(':contains')) {
                const [baseSelector, textFilter] = selector.split(':contains');
                const text = textFilter.replace(/['"()]/g, '');
                const elements = findElementsByText(baseSelector, text);
                elements.forEach(el => {
                    if (!el.hasAttribute('data-i18n')) {
                        el.setAttribute('data-i18n', key);
                        console.log(`Added data-i18n="${key}" to element:`, el);
                    }
                });
            } else {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!el.hasAttribute('data-i18n')) {
                        el.setAttribute('data-i18n', key);
                        console.log(`Added data-i18n="${key}" to element:`, el);
                    }
                });
            }
        });
        
        // También podemos añadir atributos basados en el texto exacto
        const textToKeyMap = {
            'Volver al Inicio': 'back-to-home',
            'Back to Home': 'back-to-home',
            'Sobre Mí': 'about-me',
            'About Me': 'about-me',
            'Proyectos': 'projects',
            'Projects': 'projects',
            'Contacto': 'contact',
            'Contact': 'contact',
            'Desarrollador': 'developer',
            'Developer': 'developer',
            'Diseñador': 'designer',
            'Designer': 'designer',
            'En línea': 'online',
            'Online': 'online',
            'Habilidades': 'skills',
            'Skills': 'skills',
            'Enlaces': 'links',
            'Links': 'links',
            'Contáctame': 'contact-me',
            'Contáctame': 'contact-me',
            'Sign Up': 'sign-up',
            'Regístrate': 'sign-up',
            // Añade más textos según sea necesario
        };
        
        // Buscar elementos de texto y añadir atributos
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = textNodes.nextNode()) {
            const text = node.textContent.trim();
            if (text && textToKeyMap[text] && node.parentNode && !node.parentNode.hasAttribute('data-i18n')) {
                node.parentNode.setAttribute('data-i18n', textToKeyMap[text]);
                console.log(`Added data-i18n="${textToKeyMap[text]}" to element with text "${text}":`, node.parentNode);
            }
        }
    }
    
    // Método para obtener una traducción específica
    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

export const languageManager = new LanguageManager();