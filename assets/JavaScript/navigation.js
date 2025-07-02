console.log("✅ navigation.js se ha cargado y se está ejecutando.");

document.addEventListener('DOMContentLoaded', () => {
    // --- SELECCIÓN DE ELEMENTOS ---
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const sideNav = document.getElementById('side-nav');
    const navLinks = document.querySelectorAll('.side-nav-link');
    const sections = document.querySelectorAll('section[id]');

    // --- MANEJO DEL MENÚ LATERAL (ASIDE) ---

    // Función para abrir/cerrar el menú
    const toggleNav = () => {
        // La clase 'is-active' controlará la visibilidad y animación en CSS
        sideNav.classList.toggle('is-active');
        navToggleBtn.classList.toggle('is-active');

        // Cambia el icono del botón
        const icon = navToggleBtn.querySelector('i');
        if (sideNav.classList.contains('is-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            // Opcional: añade un listener para cerrar el menú al hacer clic fuera
            document.addEventListener('click', closeNavOnClickOutside);
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.removeEventListener('click', closeNavOnClickOutside);
        }
    };

    // Abre/cierra el menú al hacer clic en el botón flotante
   if (navToggleBtn) {
    navToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        console.log("--- INICIO PRUEBA DE CLICK ---");
        console.log("1. ✅ ¡Botón clickeado! El evento funciona.");
        
        if (sideNav) {
            console.log("2. 🧐 El 'aside' ANTES del cambio:", sideNav.classList);
            sideNav.classList.toggle('is-active');
            console.log("3. ✅ El 'aside' DESPUÉS del cambio:", sideNav.classList);
        } else {
            console.error("❌ ERROR: El elemento 'sideNav' no se encontró.");
        }
        
        console.log("--- FIN PRUEBA DE CLICK ---");
    });
} else {
    console.error("❌ ERROR CRÍTICO: El botón con id 'nav-toggle-btn' no se encontró.");
}

    // Función para cerrar el menú si se hace clic fuera de él
    const closeNavOnClickOutside = (e) => {
        if (!sideNav.contains(e.target) && sideNav.classList.contains('is-active')) {
            toggleNav();
        }
    };


    // --- SCROLL SUAVE Y CIERRE DEL MENÚ ---

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene el comportamiento de ancla por defecto

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Alinea la sección en la parte superior
                });
            }

            // Cierra el menú después de hacer clic en un enlace
            if (sideNav.classList.contains('is-active')) {
                toggleNav();
            }
        });
    });


    // --- RESALTADO DE SECCIÓN ACTIVA CON INTERSECTION OBSERVER ---

    const observerOptions = {
        root: null, // El viewport es el área de observación
        rootMargin: '0px',
        threshold: 0.6 // La sección debe estar visible en un 60% para ser considerada activa
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si la sección está intersectando el viewport con el umbral definido
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Primero, quitar la clase activa de todos los enlaces
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                });
                
                // Luego, añadir la clase activa al enlace correspondiente
                const activeLink = document.querySelector(`.side-nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-link');
                }
            }
        });
    }, observerOptions);

    // Observar cada una de las secciones
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});