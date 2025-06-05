document.addEventListener('DOMContentLoaded', function() {
    // Botón para descargar el CV como PDF
    const downloadButton = document.getElementById('downloadCV');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // Elemento que contiene el CV
            const cvElement = document.querySelector('.cv-document');
            
            // Opciones para html2pdf
            const options = {
                margin: 10,
                filename: 'Skilkry_CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Crear una copia del CV para eliminar botones y elementos interactivos
            const cvClone = cvElement.cloneNode(true);
            
            // Añadir estilos específicos para la versión PDF
            const style = document.createElement('style');
            style.textContent = `
                .cv-document {
                    background-color: white;
                    color: black;
                }
                .cv-header, .cv-section {
                    border-color: #333;
                }
                .section-header i, h3, h4, h5 {
                    color: #333;
                }
                .timeline-dot {
                    background-color: #333;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
            `;
            cvClone.appendChild(style);
            
            // Generar y descargar el PDF
            html2pdf().from(cvClone).set(options).save();
            
            // Efecto visual para el botón
            downloadButton.classList.add('active');
            setTimeout(() => {
                downloadButton.classList.remove('active');
            }, 500);
        });
    }
    
    // Botón para imprimir el CV
    const printButton = document.getElementById('printCV');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
            
            // Efecto visual para el botón
            printButton.classList.add('active');
            setTimeout(() => {
                printButton.classList.remove('active');
            }, 500);
        });
    }
    
    // Animación para las barras de habilidades
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const level = item.getAttribute('data-level') || '80';
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'skill-progress-fill';
        progressFill.style.width = '0%';
        
        progressBar.appendChild(progressFill);
        item.appendChild(progressBar);
        
        // Animación con GSAP
        gsap.to(progressFill, {
            width: `${level}%`,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Añadir efectos de hover a los elementos del timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.timeline-dot'), {
                scale: 1.5,
                backgroundColor: '#9333ff',
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.timeline-dot'), {
                scale: 1,
                backgroundColor: '#fff',
                duration: 0.3
            });
        });
    });
});