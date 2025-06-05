import { animateText } from './textAnim.js';
import { moveEyesAndSmile } from './register.js';
import { playIntroAnimation } from './introAnim.js';
import { audioManager } from './audioManager.js';

window.addEventListener('load', () => {
    // Aplicar efectos de fondo cyberpunk a todas las páginas
    createCyberpunkBackground();
    
    // Solo ejecutamos moveEyesAndSmile en la página de registro
    if (document.getElementById('emoji')) {
        moveEyesAndSmile();
    }
    
    // Verificar si estamos en la página principal
    if (document.getElementById('text-container-anim')) {
        animateText();
    }
    
    // Añadir efectos de hover a todos los botones
    addHoverEffects();
    
    // Añadir efectos de sonido a elementos interactivos
    addSoundEffects();
});

// Añadir efecto de glitch a los títulos principales
function addGlitchEffect() {
    const mainTitles = document.querySelectorAll('h1, .page-title, .projects-title, .cyber-title');
    
    mainTitles.forEach(title => {
        // Añadir clase para estilizar
        title.classList.add('cyber-title');
        
        // Crear función de glitch aleatorio
        function randomGlitch() {
            if (Math.random() > 0.9) {
                title.classList.add('glitch-text');
                setTimeout(() => {
                    title.classList.remove('glitch-text');
                }, 200);
            }
            setTimeout(randomGlitch, Math.random() * 5000 + 2000);
        }
        
        // Iniciar efecto de glitch
        setTimeout(randomGlitch, Math.random() * 3000);
    });
    
    // Añadir estilos para el efecto de glitch
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        .glitch-text {
            position: relative;
            text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
            animation: glitch-skew 0.2s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-skew {
            0% { transform: skew(1deg); }
            50% { transform: skew(-1deg); }
            100% { transform: skew(1deg); }
        }
        
        .cyber-title {
            position: relative;
            margin-bottom: 2rem;
        }
        
        .cyber-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #9333ff, #ff00ff, transparent);
        }
    `;
    document.head.appendChild(glitchStyle);
}

// Configurar el menú de navegación con efectos
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav a, .nav-links a');
    
    navLinks.forEach(link => {
        // Añadir clase para estilizar
        link.classList.add('cyber-link');
        
        // Añadir efecto de hover
        link.addEventListener('mouseenter', () => {
            if (window.gsap) {
                gsap.to(link, {
                    textShadow: '0 0 8px #ff00ff, 0 0 12px #9333ff',
                    color: '#ffffff',
                    duration: 0.3
                });
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(link, {
                    textShadow: 'none',
                    color: '',
                    duration: 0.3
                });
            }
        });
    });
    
    // Añadir estilos para los enlaces
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .cyber-link {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .cyber-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: linear-gradient(90deg, #9333ff, #ff00ff);
            transition: width 0.3s ease;
        }
        
        .cyber-link:hover::after {
            width: 100%;
        }
    `;
    document.head.appendChild(navStyle);
}

// Inicializar el menú de configuración
function initConfigMenu() {
    const configButton = document.querySelector('.config-button');
    const configMenu = document.querySelector('.config-menu');
    
    if (configButton && configMenu) {
        // Añadir efecto de hover al botón de configuración
        configButton.addEventListener('mouseenter', () => {
            if (window.gsap) {
                gsap.to(configButton, {
                    rotation: 90,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
        
        configButton.addEventListener('mouseleave', () => {
            if (!configMenu.classList.contains('active')) {
                if (window.gsap) {
                    gsap.to(configButton, {
                        rotation: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            }
        });
        
        // Añadir efecto de clic al botón de configuración
        configButton.addEventListener('click', () => {
            configMenu.classList.toggle('active');
            
            if (configMenu.classList.contains('active')) {
                if (window.gsap) {
                    gsap.to(configMenu, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            } else {
                if (window.gsap) {
                    gsap.to(configMenu, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!configButton.contains(e.target) && !configMenu.contains(e.target)) {
                configMenu.classList.remove('active');
                
                if (window.gsap) {
                    gsap.to(configButton, {
                        rotation: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(configMenu, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            }
        });
    }
}

// Crear fondo cyberpunk consistente para todas las páginas
function createCyberpunkBackground() {
    // Verificar si ya existe el fondo
    if (!document.querySelector('.background-system')) {
        const backgroundSystem = document.createElement('div');
        backgroundSystem.classList.add('background-system');
        
        // Añadir elementos de fondo
        backgroundSystem.innerHTML = `
            <div class="grid"></div>
            <div class="vignette"></div>
            <div class="glow-points"></div>
            <div class="scan-lines"></div>
        `;
        
        // Insertar al inicio del body
        document.body.insertBefore(backgroundSystem, document.body.firstChild);
    }
    
    // Añadir partículas flotantes
    createParticles();
}

// Crear partículas flotantes
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('cyber-particles');
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cyber-particle');
        
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const size = Math.random() * 4 + 1;
        
        const colors = ['#9333ff', '#ff00ff', '#00ffff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        
        particlesContainer.appendChild(particle);
        
        // Animar partículas si GSAP está disponible
        if (window.gsap) {
            gsap.to(particle, {
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 5 + 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    // Añadir estilos para partículas
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        .cyber-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .cyber-particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.5;
            filter: blur(1px);
        }
    `;
    document.head.appendChild(particleStyle);
}

// Añadir efectos de hover a todos los botones
function addHoverEffects() {
    const buttons = document.querySelectorAll('button, .menu-button, .filter-button, .back-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (window.gsap) {
                gsap.to(button, {
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(147, 51, 255, 0.5)',
                    duration: 0.3
                });
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(button, {
                    scale: 1,
                    boxShadow: '0 0 5px rgba(147, 51, 255, 0.3)',
                    duration: 0.3
                });
            }
        });
    });
}

// Añadir efectos de sonido a elementos interactivos
function addSoundEffects() {
    // Initialize audio manager
    audioManager.initialize();
    
    const interactiveElements = document.querySelectorAll('button, a, .menu-button, .filter-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            audioManager.playHoverSound();
        });
        
        element.addEventListener('click', () => {
            audioManager.playClickSound();
        });
    });
}

// Consider debouncing animation functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply to glitch effects
const debouncedGlitch = debounce(randomGlitch, 200);

