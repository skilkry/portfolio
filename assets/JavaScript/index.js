// Al inicio de tu index.js

// --- INICIO DE LA SECCIÓN DE ANIMACIÓN DE INTRODUCCIÓN ---

// Función para efecto máquina de escribir mejorada
function typeWriter(element, text, speedPerChar, callback) {
    if (!element) {
        console.error("Elemento para typeWriter no encontrado.");
        if (callback) callback();
        return;
    }
    element.textContent = ''; // Limpiar contenido previo
    element.style.opacity = '1';
    element.style.width = '0'; // Asegurar que la animación de width comience desde 0
    
    // Forzar un reflow para reiniciar la animación si se llama varias veces al mismo elemento
    void element.offsetWidth; 

    const animationDuration = text.length * (speedPerChar / 1000);
    element.style.animation = `typing ${animationDuration}s steps(${text.length}, end) forwards, blink-caret .75s step-end infinite`;
    element.style.width = 'auto'; // Permitir que el contenido determine el ancho final
    element.textContent = text; // Poner el texto completo para que la animación 'steps' lo revele

    // Listener para cuando la animación 'typing' termine
    const onAnimationEnd = () => {
        element.style.borderRight = 'none'; // Ocultar cursor
        element.style.animation = ''; // Limpiar animación para que no siga parpadeando el borde
        // Quitar el listener para que no se ejecute múltiples veces si algo sale mal
        element.removeEventListener('animationend', onAnimationEnd);
        if (callback) callback();
    };
    element.addEventListener('animationend', onAnimationEnd, { once: true });

    // Fallback por si 'animationend' no se dispara (ej. elemento oculto)
    setTimeout(() => {
        // Verificar si el callback ya se ejecutó por animationend
        // Esto es un poco 'hacky', una mejor solución implicaría un estado
        if (element.style.animation !== '') { // Si la animación sigue, el evento no se disparó
           console.warn("Typewriter fallback timeout para:", element.id);
           onAnimationEnd(); // Forzar finalización
        }
    }, animationDuration * 1000 + 500); // Duración + pequeño buffer
}

function playFullIntroSequence(onCompleteCallback) {
    const introScreen = document.querySelector('.intro-animation');
    const bootText1 = document.getElementById('boot-text-1');
    const bootText2 = document.getElementById('boot-text-2');
    const logoContainer = document.querySelector('.intro-animation .logo-container'); // Para animar el logo si es necesario
    const welcomeTitle = document.getElementById('welcome-title');

    if (!introScreen || !bootText1 || !bootText2 || !logoContainer || !welcomeTitle) {
        console.error("Elementos de la intro no encontrados. Saltando animación.");
        if (introScreen) introScreen.classList.add('hidden'); // Ocultar intro si faltan partes
        if (onCompleteCallback) onCompleteCallback();
        return;
    }

    // Asegurar que la intro esté visible al empezar
    introScreen.classList.remove('hidden');
    introScreen.classList.remove('fade-out-final');
    introScreen.style.opacity = '1';
    introScreen.style.visibility = 'visible';

    // Resetear elementos para la animación
    bootText1.textContent = ''; bootText1.style.opacity = '0';
    bootText2.textContent = ''; bootText2.style.opacity = '0';
    welcomeTitle.textContent = ''; welcomeTitle.style.opacity = '0';  welcomeTitle.style.transform = 'translateY(20px)';
    // Si el logo SVG tiene animación CSS activada por una clase, resetearla:
    // logoContainer.classList.remove('animate-logo'); // Ejemplo

    // Secuencia
    setTimeout(() => { // 1. Pequeña pausa inicial
        typeWriter(bootText1, "SKILKRY_OS Booting...", 80, () => { // 2. Primer texto
            setTimeout(() => {
                typeWriter(bootText2, "Loading core modules...", 70, () => { // 3. Segundo texto
                    // 4. Animar el logo SVG
                    // Asumimos que las animaciones CSS para .circle y .letter se activan
                    // cuando .logo-container o .logo se hacen visibles o tienen una clase.
                    // Si no es automático, aquí podrías añadir una clase al logoContainer:
                    // logoContainer.classList.add('animate-logo');
                    // Esperar a que la animación del logo termine (ajusta este tiempo)
                    setTimeout(() => {
                        // 5. Mostrar mensaje de bienvenida
                        welcomeTitle.textContent = "SKILKRY"; // Este es el texto que se ve en tu captura
                        welcomeTitle.style.opacity = '1';
                        welcomeTitle.style.transform = 'translateY(0)';

                        // 6. Desvanecer toda la intro
                        setTimeout(() => {
                            introScreen.classList.add('fade-out-final'); // Usa tu @keyframes scaleFadeOut
                            introScreen.addEventListener('animationend', () => {
                                introScreen.classList.add('hidden'); // Oculta con display: none vía CSS
                                if (onCompleteCallback) onCompleteCallback();
                            }, { once: true });
                        }, 1800); // Tiempo para ver el mensaje de bienvenida antes de desvanecer
                    }, 2000); // Tiempo estimado para la animación del logo (crucial ajustarlo)
                });
            }, 300); // Pausa entre textos
        });
    }, 300); // Pausa antes de empezar
}

// Lógica principal de la intro en el evento 'DOMContentLoaded' o 'load'
// DOMContentLoaded es generalmente mejor para iniciar scripts que manipulan el DOM
// y no dependen de la carga completa de imágenes.
document.addEventListener('DOMContentLoaded', () => {
    // Tu inicialización del tutorial interactivo
    if (typeof initializeInteractiveTutorial === 'function') {
        initializeInteractiveTutorial();
    } else {
        console.warn("La función initializeInteractiveTutorial no está definida en este punto.");
    }
    
    // Lógica de la Animación de Introducción
    const introScreen = document.querySelector('.intro-animation');
    if (introScreen) {
        if (sessionStorage.getItem('introPlayedSkilkry')) {
            introScreen.classList.add('hidden'); // Ocultar inmediatamente si ya se vio
            console.log("Intro ya reproducida en esta sesión.");
        } else {
            console.log("Iniciando animación de intro...");
            playFullIntroSequence(() => {
                sessionStorage.setItem('introPlayedSkilkry', 'true');
                console.log("Intro finalizada y guardada en sessionStorage.");
                // Aquí podrías activar otras animaciones de la página principal si las tienes
            });
        }
    } else {
        console.warn("Elemento .intro-animation no encontrado.");
    }

    // Tus otras funciones que se ejecutan al cargar el DOM, como moveEyesAndSmile si aplica
    // if (typeof moveEyesAndSmile === 'function' && document.getElementById('emoji')) {
    //     moveEyesAndSmile();
    // }
});


// --- FIN DE LA SECCIÓN DE ANIMACIÓN DE INTRODUCCIÓN ---


// Aquí continuaría tu función initializeInteractiveTutorial() y otras funciones de index.js
// ...
// function initializeInteractiveTutorial() { ... }
// ...

// TUTORIAL INTERACTIVO PARA LA TERMINAL (CON PERSISTENCIA Y VERIFICACIONES)
function initializeInteractiveTutorial() {
    // Seleccionar elementos por ID para mayor fiabilidad
    const startButton = document.getElementById('tutorial-start-button');
    const sobreMiButton = document.getElementById('tutorial-sobremi-button');
    const proyectosButton = document.getElementById('tutorial-proyectos-button');
    const contactoButton = document.getElementById('tutorial-contacto-button');
    
    const statsTextContainer = document.querySelector('.stats-text');
    
    // Verificación robusta de la existencia de todos los elementos necesarios
    if (!startButton) { console.error("Tutorial: Botón START (ID: tutorial-start-button) no encontrado."); return; }
    if (!sobreMiButton) { console.error("Tutorial: Botón SOBRE MÍ (ID: tutorial-sobremi-button) no encontrado."); return; }
    if (!proyectosButton) { console.error("Tutorial: Botón PROYECTOS (ID: tutorial-proyectos-button) no encontrado."); return; }
    if (!contactoButton) { console.error("Tutorial: Botón CONTACTO (ID: tutorial-contacto-button) no encontrado."); return; }
    if (!statsTextContainer) { console.error("Tutorial: Contenedor '.stats-text' no encontrado."); return; }

    // Limpiar contenido previo y asegurar 3 párrafos para el tutorial
    statsTextContainer.innerHTML = `
        <p class="tutorial-line-1"></p>
        <p class="tutorial-line-2"></p>
        <p class="tutorial-line-3"></p>
    `;
    const tutorialLine1 = statsTextContainer.querySelector('.tutorial-line-1');
    const tutorialLine2 = statsTextContainer.querySelector('.tutorial-line-2');
    const tutorialLine3 = statsTextContainer.querySelector('.tutorial-line-3');

    if (!tutorialLine1 || !tutorialLine2 || !tutorialLine3) {
        console.error("Tutorial: No se pudieron crear/encontrar los párrafos para el tutorial en .stats-text.");
        return;
    }

    const TUTORIAL_STEP_KEY = 'skilkryTutorialStep';
    let tutorialStep = parseInt(localStorage.getItem(TUTORIAL_STEP_KEY)) || 0;

    const initialTexts = {
        line1: statsTextContainer.dataset.initialLine1 || "> Building worlds,",
        line2: statsTextContainer.dataset.initialLine2 || "  online & offline.",
        line3: statsTextContainer.dataset.initialLine3 || ""
    };
    
    const tutorialStates = [
        { line1: initialTexts.line1, line2: initialTexts.line2, line3: initialTexts.line3, startButtonText: "START", activeButton: null },
        { line1: "> Starting walkthrough...", line2: "> Hey there! Welcome to the guide!", line3: "> 1. Check out [ABOUT ME].", startButtonText: "NEXT", activeButton: sobreMiButton },
        { line1: "> [ABOUT ME] section done.", line2: "> Moving on:", line3: "> 2. Take a look at my [PROJECTS].", startButtonText: "NEXT", activeButton: proyectosButton },
        { line1: "> [PROJECTS] reviewed.", line2: "> Last step:", line3: "> 3. Reach out via [CONTACT].", startButtonText: "NEXT", activeButton: contactoButton },
        { line1: "> [CONTACT] channel open.", line2: "> Walkthrough complete!", line3: "> waiting ur message...", startButtonText: "RESTART", activeButton: null }
        
        
    ];

    function typeWriterEffect(element, text, speed = 35, callback) {
        let i = 0;
        element.innerHTML = ""; 
        const contentSpan = document.createElement('span');
        element.appendChild(contentSpan);
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        cursorSpan.innerHTML = '&#9646;';
        element.appendChild(cursorSpan);
        function type() {
            if (i < text.length) {
                contentSpan.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (cursorSpan.parentNode) cursorSpan.parentNode.removeChild(cursorSpan);
                if (callback) callback();
            }
        }
        type();
    }
    
    if (!document.getElementById('typing-cursor-style')) {
        const style = document.createElement('style');
        style.id = 'typing-cursor-style';
        style.innerHTML = `
            .typing-cursor { animation: blink 0.7s infinite; margin-left: 2px; display: inline-block; }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    function updateTutorialUI() {
        if (tutorialStep < 0 || tutorialStep >= tutorialStates.length) {
            console.warn(`Paso del tutorial (${tutorialStep}) fuera de rango. Reiniciando a 0.`);
            tutorialStep = 0;
        }
        localStorage.setItem(TUTORIAL_STEP_KEY, tutorialStep.toString());

        const currentState = tutorialStates[tutorialStep];
        if (!currentState) {
            console.error(`Estado del tutorial indefinido para el paso: ${tutorialStep}`);
            return;
        }

        [sobreMiButton, proyectosButton, contactoButton].forEach(btn => {
            if (btn) btn.classList.remove('tutorial-active-step');
        });

        typeWriterEffect(tutorialLine1, currentState.line1, 35, () => {
            if (currentState.line2) {
                typeWriterEffect(tutorialLine2, currentState.line2, 35, () => {
                    if (currentState.line3) {
                        typeWriterEffect(tutorialLine3, currentState.line3, 35, () => {
                            if (currentState.activeButton) currentState.activeButton.classList.add('tutorial-active-step');
                        });
                    } else {
                         tutorialLine3.innerHTML = ""; 
                         if (currentState.activeButton) currentState.activeButton.classList.add('tutorial-active-step');
                    }
                });
            } else {
                tutorialLine2.innerHTML = "";
                tutorialLine3.innerHTML = "";
                if (currentState.activeButton) currentState.activeButton.classList.add('tutorial-active-step');
            }
        });
        
        startButton.textContent = currentState.startButtonText;
        startButton.disabled = false; 
    }

    startButton.addEventListener('click', () => {
        tutorialStep++;
        if (tutorialStep >= tutorialStates.length) {
            tutorialStep = 0; 
        }
        updateTutorialUI();
    });

    function setupNavLinkListener(button, expectedTutorialStepForClick) {
        if (!button) return; // No hacer nada si el botón no se encontró
        const linkWrapper = button.closest('a'); 
        const targetElement = linkWrapper || button;

        targetElement.addEventListener('click', (event) => {
            if (tutorialStep === expectedTutorialStepForClick && tutorialStep !== 0) {
                let nextStep = tutorialStep + 1;
                if (nextStep >= tutorialStates.length) { // Si era el último paso antes de finalizar
                    nextStep = tutorialStates.length -1; // Mantenerlo en el último estado (RESTART) o el que corresponda
                }
                localStorage.setItem(TUTORIAL_STEP_KEY, nextStep.toString());
                // Si es un enlace <a>, la navegación ocurrirá.
                // Si es solo un <button> y quieres que la UI se actualice sin recargar página:
                if (!linkWrapper && button !== startButton) { 
                    // tutorialStep = nextStep; // Actualizar el paso global
                    // updateTutorialUI(); // Comentado para que el botón START/NEXT sea el principal motor
                }
            }
        });
    }

    setupNavLinkListener(sobreMiButton, 1);
    setupNavLinkListener(proyectosButton, 2);
    setupNavLinkListener(contactoButton, 3);

    updateTutorialUI(); 
}

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('config-toggle-btn');
    const closeBtn = document.getElementById('config-close-btn');
    const menu = document.getElementById('config-menu');
    const overlay = document.getElementById('config-overlay');

    const toggleMenu = () => {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    openBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu); //
    initializeInteractiveTutorial();

});

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message, subject } = req.body;

  // Validación básica
  if (
    typeof name !== 'string' || name.length < 1 || name.length > 100 ||
    typeof email !== 'string' || email.length < 3 || email.length > 100 ||
    typeof message !== 'string' || message.length < 1 || message.length > 1000
  ) {
    return res.status(400).json({ error: 'Datos inválidos.' });
  }

  const text = `📩 *Nuevo mensaje desde tu portfolio:*\n\n*Asunto:* ${subject || 'Sin asunto'}\n👤 *Nombre:* ${name}\n📧 *Email:* ${email}\n📝 *Mensaje:* ${message}`;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error al enviar a Telegram:', err);
    res.status(500).json({ error: 'Error interno.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});