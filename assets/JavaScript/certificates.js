document.addEventListener('DOMContentLoaded', () => {
    // Get all filter buttons and certificate cards
    const filterButtons = document.querySelectorAll('.filter-button');
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    // Asegurarse de que las tarjetas tengan el estilo correcto inicialmente
    certificateCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
    });
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter certificates
            filterCertificates(filterValue);
        });
    });
    
    // Filter certificates function
    function filterCertificates(category) {
        // Primero, ocultar todas las tarjetas con una transición suave
        gsap.to(certificateCards, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            onComplete: () => {
                // Después de ocultar, aplicar el filtro
                certificateCards.forEach(card => {
                    if (category === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
                
                // Mostrar las tarjetas visibles con una transición suave
                gsap.to(certificateCards, {
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    delay: 0.1
                });
            }
        });
    }
    
    // Add cyberpunk scan effect to certificates
    function createScanEffect() {
        certificateCards.forEach(card => {
            if (Math.random() > 0.7 && card.style.display !== 'none') {
                const scanLine = document.createElement('div');
                scanLine.classList.add('scan-effect');
                card.querySelector('.certificate-front').appendChild(scanLine);
                
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
        
        // Schedule next scan effect
        setTimeout(createScanEffect, Math.random() * 3000 + 1000);
    }
    
    // Add scan effect styles
    const style = document.createElement('style');
    style.textContent = `
        .scan-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent);
            z-index: 10;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Start scan effect after a delay
    setTimeout(createScanEffect, 2000);
    
    // Add glitch effect to page title
    const pageTitle = document.querySelector('.page-title');
    
    function glitchTitle() {
        if (Math.random() > 0.9) {
            pageTitle.classList.add('glitch-text');
            setTimeout(() => {
                pageTitle.classList.remove('glitch-text');
            }, 200);
        }
        setTimeout(glitchTitle, Math.random() * 5000 + 1000);
    }
    
    // Add glitch text styles for title
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
    `;
    document.head.appendChild(glitchStyle);
    
    // Start title glitch effect
    setTimeout(glitchTitle, 3000);
    
    // Add hover sound effect to filter buttons
    const filterButtonsAll = document.querySelectorAll('.filter-button');
    let audioContext;
    
    filterButtonsAll.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playHoverSound();
        });
        
        button.addEventListener('click', () => {
            playClickSound();
        });
    });
    
    // Create hover sound
    function playHoverSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.error('Error playing hover sound:', error);
        }
    }
    
    // Create click sound
    function playClickSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.error('Error playing click sound:', error);
        }
    }

    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 15px 30px rgba(147, 51, 255, 0.3)',
                duration: 0.3
            });

            const front = card.querySelector('.certificate-front');
            gsap.to(front, {
                boxShadow: '0 0 20px rgba(147, 51, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.2)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 0 20px rgba(147, 51, 255, 0.2)',
                duration: 0.3
            });
            
            // Remove glow effect
            const front = card.querySelector('.certificate-front');
            gsap.to(front, {
                boxShadow: '0 0 20px rgba(147, 51, 255, 0.2)',
                duration: 0.3
            });
        });
    });

    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.classList.add('cert-particles');
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('cert-particle');
            
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;

            const size = Math.random() * 4 + 1;

            const colors = ['#9333ff', '#ff00ff', '#00ffff', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Set styles
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            
            particlesContainer.appendChild(particle);
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
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        .cert-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .cert-particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.5;
            filter: blur(1px);
        }
    `;
    document.head.appendChild(particleStyle);
    
    // Create particles
    createParticles();
});