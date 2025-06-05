document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const elements = {
        '.grid': { depth: 0.2 },
        '.glow-points': { depth: 0.1 },
        '.cyber-text': { depth: 0.05 },
        '.cyber-text-2': { depth: 0.08 }
    };

    Object.entries(elements).forEach(([selector, { depth }]) => {
        const element = document.querySelector(selector);
        if (element) {
            const moveX = (mouseX - 0.5) * depth * 100;
            const moveY = (mouseY - 0.5) * depth * 100;
            
            gsap.to(element, {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power2.out"
            });
        }
    });
});