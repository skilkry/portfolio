// Función para añadir efectos de escaneo a las tarjetas
export function addScanEffects() {
    const cards = document.querySelectorAll('.profile-card, .about-section');
    
    function addScanEffect() {
        cards.forEach(card => {
            if (Math.random() > 0.7) {
                const scanLine = document.createElement('div');
                scanLine.classList.add('scan-effect');
                card.appendChild(scanLine);
                
                gsap.to(scanLine, {
                    top: '100%',
                    duration: 1,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        scanLine.remove();
                    }
                });
            }
        });
        
        setTimeout(addScanEffect, Math.random() * 3000 + 1000);
    }
    
    setTimeout(addScanEffect, 2000);
}