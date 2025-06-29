// ===========================================
// SISTEMA COMPLETO MODO SERIO
// Reemplaza TODO el contenido del portfolio
// ===========================================

class SeriousModeManager {
    constructor() {
        this.isSerious = false;
        this.originalContent = null;
        this.init();
    }

    init() {
        const toggle = document.getElementById('serious-mode-toggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                this.toggleMode(e.target.checked);
            });
        }
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
        this.originalContent = {
            title: document.title,
            mainContent: document.querySelector('.main-content-area').innerHTML,
            bodyClass: document.body.className
        };
    }

    loadSeriousMode() {
        // Cambiar título
        document.title = "Daniel García - Software Developer";
        
        // Crear nuevo contenido profesional
        const newContent = this.createSeriousContent();
        
        // Reemplazar contenido
        const mainArea = document.querySelector('.main-content-area');
        mainArea.innerHTML = newContent;
        
        // Agregar event listeners para el nuevo contenido
        this.attachSeriousEventListeners();
    }

    createSeriousContent() {
        return `
            <!-- HERO SECTION PROFESIONAL -->
            <section class="serious-hero">
                <div class="serious-container">
                    <div class="serious-hero-content">
                        <div class="serious-profile-image">
                            <img src="./assets/images/profilePicture.png" alt="Daniel García" class="serious-avatar">
                        </div>
                        <div class="serious-hero-text">
                            <h1 class="serious-name">Daniel Sardina</h1>
                            <h2 class="serious-title">Front end & Android Developer</h2>
                            <p class="serious-description">
                                Experienced software developer specializing in modern web technologies, 
                                interactive applications, and user-centered design solutions.
                            </p>
                            <div class="serious-cta-buttons">
                                <button class="serious-btn serious-btn-primary" onclick="seriousMode.scrollToSection('projects')">
                                    View My Work
                                </button>
                                <button class="serious-btn serious-btn-secondary" onclick="seriousMode.scrollToSection('contact')">
                                    Get In Touch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SKILLS SECTION -->
            <section class="serious-skills" id="skills">
                <div class="serious-container">
                    <h2 class="serious-section-title">Technical Expertise</h2>
                    <div class="serious-skills-grid">
                        <div class="serious-skill-category">
                            <h3>Frontend Development</h3>
                            <div class="serious-skill-tags">
                                <span class="serious-tag">JavaScript</span>
                                <span class="serious-tag">React</span>
                                <span class="serious-tag">Vue.js</span>
                                <span class="serious-tag">HTML5/CSS3</span>
                                <span class="serious-tag">TypeScript</span>
                            </div>
                        </div>
                        <div class="serious-skill-category">
                            <h3>Backend Development</h3>
                            <div class="serious-skill-tags">
                                <span class="serious-tag">Node.js</span>
                                <span class="serious-tag">Python</span>
                                <span class="serious-tag">PHP</span>
                                <span class="serious-tag">MySQL</span>
                                <span class="serious-tag">API Development</span>
                            </div>
                        </div>
                        <div class="serious-skill-category">
                            <h3>Tools & Technologies</h3>
                            <div class="serious-skill-tags">
                                <span class="serious-tag">Git</span>
                                <span class="serious-tag">Docker</span>
                                <span class="serious-tag">AWS</span>
                                <span class="serious-tag">Figma</span>
                                <span class="serious-tag">Webpack</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- EXPERIENCE SECTION -->
            <section class="serious-experience" id="experience">
                <div class="serious-container">
                    <h2 class="serious-section-title">Professional Experience</h2>
                    <div class="serious-timeline">
                        <div class="serious-timeline-item">
                            <div class="serious-timeline-date">03/2025 - 06/2025</div>
                            <div class="serious-timeline-content">
                                <h3>VentaOne</h3>
                                <p>Network solutions, android app development, automization scripts with bash, </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- PROJECTS PREVIEW -->
            <section class="serious-projects-preview" id="projects">
                <div class="serious-container">
                    <h2 class="serious-section-title">Featured Projects</h2>
                    <div class="serious-projects-grid">
                        <div class="serious-project-card">
                            <div class="serious-project-image">
                                <div class="serious-project-placeholder">
                                    <i class="fas fa-code"></i>
                                </div>
                            </div>
                            <div class="serious-project-content">
                                <h3>E-Commerce Platform</h3>
                                <p>Full-stack e-commerce solution with modern UI/UX and secure payment integration.</p>
                                <div class="serious-project-tech">
                                    <span class="serious-tech-tag">React</span>
                                    <span class="serious-tech-tag">Node.js</span>
                                    <span class="serious-tech-tag">MongoDB</span>
                                </div>
                            </div>
                        </div>
                        <div class="serious-project-card">
                            <div class="serious-project-image">
                                <div class="serious-project-placeholder">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                            </div>
                            <div class="serious-project-content">
                                <h3>Task Management App</h3>
                                <p>Collaborative task management application with real-time updates and team features.</p>
                                <div class="serious-project-tech">
                                    <span class="serious-tech-tag">Vue.js</span>
                                    <span class="serious-tech-tag">Firebase</span>
                                    <span class="serious-tech-tag">PWA</span>
                                </div>
                            </div>
                        </div>
                        <div class="serious-project-card">
                            <div class="serious-project-image">
                                <div class="serious-project-placeholder">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <div class="serious-project-content">
                                <h3>Analytics Dashboard</h3>
                                <p>Interactive data visualization dashboard for business intelligence and reporting.</p>
                                <div class="serious-project-tech">
                                    <span class="serious-tech-tag">D3.js</span>
                                    <span class="serious-tech-tag">Python</span>
                                    <span class="serious-tech-tag">PostgreSQL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="serious-projects-cta">
                        <a href="./projects.html" class="serious-btn serious-btn-outline">View All Projects</a>
                    </div>
                </div>
            </section>

            <!-- CONTACT SECTION -->
            <section class="serious-contact" id="contact">
                <div class="serious-container">
                    <div class="serious-contact-content">
                        <div class="serious-contact-info">
                            <h2>Let's Work Together</h2>
                            <p>I'm always interested in discussing new opportunities and challenging projects.</p>
                            <div class="serious-contact-methods">
                                <a href="mailto:ssdsardina@gmail.com" class="serious-contact-method">
                                    <i class="fas fa-envelope"></i>
                                    <span>ssdsardina@gmail.com</span>
                                </a>
                                <a href="https://wa.me/+34663323852" class="serious-contact-method">
                                    <i class="fas fa-phone"></i>
                                    <span>+34 663 32 38 52</span>
                                </a>
                                <a href="https://github.com/skilkry" class="serious-contact-method" target="_blank">
                                    <i class="fab fa-github"></i>
                                    <span>GitHub Profile</span>
                                </a>
                            </div>
                        </div>
                        <div class="serious-contact-form">
                            <form class="serious-form" onsubmit="seriousMode.handleContactForm(event)">
                                <div class="serious-form-group">
                                    <label for="serious-name">Name</label>
                                    <input type="text" id="serious-name" name="name" required>
                                </div>
                                <div class="serious-form-group">
                                    <label for="serious-email">Email</label>
                                    <input type="email" id="serious-email" name="email" required>
                                </div>
                                <div class="serious-form-group">
                                    <label for="serious-message">Message</label>
                                    <textarea id="serious-message" name="message" rows="5" required></textarea>
                                </div>
                                <button type="submit" class="serious-btn serious-btn-primary serious-btn-full">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    attachSeriousEventListeners() {
        // Smooth scroll para navegación
        const buttons = document.querySelectorAll('[onclick*="scrollToSection"]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.scrollToSection(targetId);
            });
        });
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
        
        // Aquí puedes agregar la lógica para enviar el formulario
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
            document.title = this.originalContent.title;
            document.querySelector('.main-content-area').innerHTML = this.originalContent.mainContent;
            
            // Recargar scripts originales si es necesario
            this.reloadOriginalScripts();
        }
    }

    reloadOriginalScripts() {
        // Aquí puedes recargar los scripts específicos del modo pro
        // Por ejemplo, reinicializar animaciones, parallax, etc.
        
        // Ejemplo: reinicializar botones del modo original
        const originalButtons = document.querySelectorAll('.terminal-button');
        originalButtons.forEach(button => {
            // Reagregar event listeners si es necesario
        });
    }
}

// Crear instancia global
const seriousMode = new SeriousModeManager();

// CSS para el modo serio
const seriousCSS = `
/* ===========================================
   SERIOUS MODE - NUEVO PORTFOLIO COMPLETO
   =========================================== */

:root {
    --bg-color: #F8F9FA;
    --text-color: #212529;
    --text-color-darker: #6C757D;
    --accent-primary: #007BFF;
    --accent-secondary: #28A745;
    --panel-bg: #FFFFFF;
    --panel-border: #DEE2E6;
}

body.serious-mode {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--bg-color);
    margin: 0;
    padding: 0;
}

/* Container común */
.serious-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ===========================================
   HERO SECTION
   =========================================== */
.serious-hero {
border-radius: 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--accent-primary) 0%, #0056b3 100%);
    color: white;
    padding: 80px 0;
}

img{
object-fit: cover;
}

.serious-hero-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 60px;
    align-items: center;
}

.serious-profile-image {
    text-align: center;
}

.serious-avatar {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    border: 6px solid rgba(255,255,255,0.2);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.serious-name {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    letter-spacing: -1px;
}

.serious-title {
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0 0 30px 0;
    opacity: 0.9;
    color: var(--panel-border);
}

.serious-description {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 40px;
    opacity: 0.9;
}

.serious-cta-buttons {
    display: flex;
    gap: 20px;
}

/* ===========================================
   BOTONES
   =========================================== */
.serious-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}

.serious-btn-primary {
    background: var(--accent-primary);
    color: white;
}

.serious-btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4);
}

.serious-btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
}

.serious-btn-secondary:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.6);
}

.serious-btn-outline {
    background: transparent;
    color: var(--accent-primary);
    border: 2px solid var(--accent-primary);
}

.serious-btn-outline:hover {
    background: var(--accent-primary);
    color: white;
}

.serious-btn-full {
    width: 100%;
}

/* ===========================================
   SECCIONES
   =========================================== */
.serious-skills, .serious-experience, .serious-projects-preview {
    padding: 100px 0;
    background: var(--bg-color);
}

.serious-contact {
    padding: 100px 0;
    background: var(--panel-bg);
}

.serious-section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 60px;
    color: var(--text-color);
}

/* ===========================================
   SKILLS
   =========================================== */
.serious-skills {
    background: var(--panel-bg);
}

.serious-skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.serious-skill-category {
    background: var(--bg-color);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid var(--panel-border);
}

.serious-skill-category h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: var(--text-color);
}

.serious-skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.serious-tag {
    background: var(--panel-bg);
    color: var(--text-color-darker);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid var(--panel-border);
}

/* ===========================================
   TIMELINE
   =========================================== */
.serious-timeline {
    max-width: 800px;
    margin: 0 auto;
}

.serious-timeline-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 40px;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--panel-border);
}

.serious-timeline-date {
    font-weight: 600;
    color: var(--accent-primary);
    font-size: 1.1rem;
}

.serious-timeline-content h3 {
    font-size: 1.4rem;
    margin: 0 0 5px 0;
    color: var(--text-color);
}

.serious-timeline-content h4 {
    font-size: 1.1rem;
    margin: 0 0 15px 0;
    color: var(--text-color-darker);
    font-weight: 500;
}

.serious-timeline-content p {
    color: var(--text-color-darker);
}

/* ===========================================
   PROJECTS
   =========================================== */
.serious-projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    margin-bottom: 60px;
}

.serious-project-card {
    background: var(--panel-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid var(--panel-border);
    transition: transform 0.3s ease;
}

.serious-project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.serious-project-image {
    height: 200px;
    background: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--panel-border);
}

.serious-project-placeholder {
    font-size: 3rem;
    color: var(--text-color-darker);
}

.serious-project-content {
    padding: 30px;
}

.serious-project-content h3 {
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    color: var(--text-color);
}

.serious-project-content p {
    color: var(--text-color-darker);
    margin-bottom: 20px;
}

.serious-project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
}

.serious-tech-tag {
    background: var(--bg-color);
    color: var(--accent-primary);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--panel-border);
}

.serious-projects-cta {
    text-align: center;
}

/* ===========================================
   CONTACT
   =========================================== */
.serious-contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
}

.serious-contact-info h2 {
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: var(--text-color);
}

.serious-contact-info p {
    color: var(--text-color-darker);
    font-size: 1.1rem;
    margin-bottom: 40px;
}

.serious-contact-methods {
    margin-top: 40px;
}

.serious-contact-method {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    padding: 10px;
    border-radius: 6px;
}

.serious-contact-method:hover {
    color: #0056b3;
    background: var(--bg-color);
}

.serious-contact-method i {
    width: 20px;
    text-align: center;
}

/* ===========================================
   FORM
   =========================================== */
.serious-form {
    background: var(--bg-color);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid var(--panel-border);
}

.serious-form-group {
    margin-bottom: 25px;
}

.serious-form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-color);
}

.serious-form-group input,
.serious-form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--panel-border);
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    font-family: inherit;
    background: var(--panel-bg);
    color: var(--text-color);
    box-sizing: border-box;
}

.serious-form-group input:focus,
.serious-form-group textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* ===========================================
   RESPONSIVE
   =========================================== */
@media (max-width: 768px) {
    .serious-hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
    }
    
    .serious-avatar {
        width: 200px;
        height: 200px;
    }
    
    .serious-name {
        font-size: 2.5rem;
    }
    
    .serious-cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .serious-timeline-item {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .serious-contact-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .serious-projects-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Inyectar CSS en el documento
if (!document.getElementById('serious-mode-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'serious-mode-styles';
    styleSheet.textContent = seriousCSS;
    document.head.appendChild(styleSheet);
}

export default SeriousModeManager;