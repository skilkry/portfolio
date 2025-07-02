class SeriousModeManager {
    constructor() {
        this.isSerious = false;
        this.originalContent = null;
        this.seriousContentHTML = null;
        this.originalScripts = [];
        this.init();
    }

    async init() {
        await this.loadSeriousHTML();
        const toggle = document.getElementById('serious-mode-toggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                this.toggleMode(e.target.checked);
            });
        }
    }

    loadSeriousCSS() {
        if (!document.getElementById('serious-mode-styles')) {
            const link = document.createElement('link');
            link.id = 'serious-mode-styles';
            link.rel = 'stylesheet';
            link.href = './assets/css/serious_mode.css';
            document.head.appendChild(link);
        }
    }

    removeSeriousCSS() {
        const seriousStyles = document.getElementById('serious-mode-styles');
        if (seriousStyles) {
            seriousStyles.remove();
        }
    }

    async loadSeriousHTML() {
        try {
            const response = await fetch('./assets/html/serious_mode.html');
            this.seriousContentHTML = await response.text();
        } catch (error) {
            console.warn('No se pudo cargar el contenido del modo serio desde archivo externo. Usando contenido interno.');
            this.seriousContentHTML = this.getSeriousContentFallback();
        }
    }

    getSeriousContentFallback() {
        return `
            <section class="serious-hero">
                <div class="serious-container">
                    <div class="serious-hero-content">
                        <div class="serious-profile-image">
                            <img src="./assets/images/profilePicture.png" alt="Daniel Sardina" class="serious-avatar">
                        </div>
                        <div class="serious-hero-text">
                            <h1 class="serious-name">Daniel Sardina</h1>
                            <h2 class="serious-title">Front end & Android Developer</h2>
                            <p class="serious-description">
                                Experienced software developer specializing in modern web technologies, 
                                interactive applications, and user-centered design solutions.
                            </p>
                            <div class="serious-cta-buttons">
                                <button class="serious-btn serious-btn-primary" data-scroll-to="projects">
                                    View My Work
                                </button>
                                <button class="serious-btn serious-btn-secondary" data-scroll-to="contact">
                                    Get In Touch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="serious-contact" id="contact">
                <div class="serious-container">
                    <div class="serious-contact-content">
                        <div class="serious-contact-info">
                            <h2>Let's Work Together</h2>
                            <p>I'm always interested in discussing new opportunities and challenging projects.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    toggleMode(isSerious) {
        this.isSerious = isSerious;

        if (isSerious) {
            this.saveOriginalContent();
            this.loadSeriousMode();
        } else {
            this.restoreOriginalContent();
        }

        document.body.classList.toggle('serious-mode', isSerious);
    }

    saveOriginalContent() {
        // Guardar todo el estado original
        this.originalContent = {
            title: document.title,
            mainContent: document.querySelector('.main-content-area').innerHTML,
            bodyClass: document.body.className.replace(' serious-mode', ''), // Excluir la clase serious-mode
            headContent: this.getHeadStylesSnapshot()
        };

        // Guardar scripts originales si es necesario
        this.saveOriginalScripts();
    }

    getHeadStylesSnapshot() {
        // Crear una lista de todos los estilos actuales (excluyendo serious-mode-styles)
        const styleElements = document.head.querySelectorAll('link[rel="stylesheet"], style');
        return Array.from(styleElements)
            .filter(el => el.id !== 'serious-mode-styles')
            .map(el => ({
                tagName: el.tagName,
                href: el.href || null,
                textContent: el.textContent || null,
                id: el.id || null,
                className: el.className || null
            }));
    }

    saveOriginalScripts() {
        // Aquí puedes guardar referencias a scripts que necesites recargar
        // Por ejemplo, si tienes scripts específicos del modo normal
        this.originalScripts = [];
    }

    loadSeriousMode() {
        // Cargar estilos del modo serio
        this.loadSeriousCSS();

        // Cambiar título
        document.title = "Daniel Sardina - Software Developer";

        // Reemplazar contenido
        const mainArea = document.querySelector('.main-content-area');
        if (mainArea) {
            mainArea.innerHTML = this.seriousContentHTML;
            document.querySelectorAll('h2').forEach(el => {
                el.style.fontFamily = 'Poppins, sans-serif'
                el.style.fontStyle = 'italic';
            });


            // Agregar event listeners para el nuevo contenido
            this.attachSeriousEventListeners();
        }
    }

    attachSeriousEventListeners() {
        // Smooth scroll para navegación
        const scrollButtons = document.querySelectorAll('[data-scroll-to]');
        scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('data-scroll-to');
                this.scrollToSection(targetId);
            });
        });

        // Event listener para el formulario de contacto
        const contactForm = document.getElementById('serious-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleContactForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        console.log('Contact form data:', data);

        // Mostrar mensaje de confirmación
        alert('Thank you for your message! I\'ll get back to you soon.');
        event.target.reset();
    }

    restoreOriginalContent() {
        if (this.originalContent) {
            // Remover estilos del modo serio
            this.removeSeriousCSS();

            // Restaurar título y contenido
            document.title = this.originalContent.title;

            const mainArea = document.querySelector('.main-content-area');
            if (mainArea) {
                mainArea.innerHTML = this.originalContent.mainContent;
            }

            // Restaurar clases del body (sin serious-mode)
            document.body.className = this.originalContent.bodyClass;

            // Recargar scripts originales si es necesario
            this.reloadOriginalScripts();
        }
    }

    reloadOriginalScripts() {
        // Aquí puedes recargar los scripts del modo original si es necesario
        // Por ejemplo, si tienes animaciones o funcionalidades específicas

        // Ejemplo de cómo podrías recargar un script:
        /*
        this.originalScripts.forEach(scriptInfo => {
            if (scriptInfo.src) {
                const script = document.createElement('script');
                script.src = scriptInfo.src;
                document.head.appendChild(script);
            }
        });
        */

        // Si tienes funciones específicas del modo original que necesitas reinicializar:
        this.reinitializeOriginalMode();
    }

    reinitializeOriginalMode() {
        // Aquí puedes reinicializar cualquier funcionalidad del modo original
        // Por ejemplo, si tienes animaciones, event listeners específicos, etc.

        // Ejemplo:
        /*
        if (window.initOriginalAnimations) {
            window.initOriginalAnimations();
        }
        */

        // Disparar un evento personalizado para que otros scripts sepan que se restauró el modo original
        const event = new CustomEvent('originalModeRestored', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    // Método para limpiar completamente al destruir la instancia
    destroy() {
        this.removeSeriousCSS();
        this.restoreOriginalContent();

        const toggle = document.getElementById('serious-mode-toggle');
        if (toggle) {
            toggle.removeEventListener('change', this.toggleMode);
        }
    }
}

// Crear instancia global
const seriousMode = new SeriousModeManager();

export default SeriousModeManager;