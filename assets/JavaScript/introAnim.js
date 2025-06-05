export function playIntroAnimation() {
    if (sessionStorage.getItem('introPlayed')) {
        document.querySelector('.intro-animation').style.display = 'none';
        return;
    }

    const tl = gsap.timeline({
        onComplete: () => {
            sessionStorage.setItem('introPlayed', 'true');
            
            const closingTl = gsap.timeline({
                onComplete: () => {
                    gsap.to('.intro-animation', {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete: () => {
                            document.querySelector('.intro-animation').style.display = 'none';
                        }
                    });
                }
            });

            closingTl.to(['.dev-name', '.dev-title', '.skill'], {
                opacity: 0,
                y: -20,
                duration: 0.3,
                stagger: 0.05
            })
            .to(['.circle', '.letter'], {
                strokeDashoffset: 565,
                duration: 1,
                ease: "power2.inOut"
            });
        }
    });

    tl.to('.circle', {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut"
    })
    .to('.letter', {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut"
    }, "-=0.8")
    .to('.dev-name', {
        opacity: 1,
        y: 0,
        scale: 1.05, // Agregado el efecto de escala
        duration: 0.7,
        ease: "back.out(1.7)"
    })
    .to('.dev-title', {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out"
    }, "-=0.4")
    .to('.skill', {
        opacity: 1,
        y: 0,
        scale: 1.05, // Agregado el efecto de escala
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.3")
    .to({}, { duration: 1 });

    return tl;
}

gsap.from(".menu-container", {
    opacity: 0,
    y: -50,
    scale: 0.95,  // Agregado un pequeño escalado
    duration: 1,
    ease: "power2.out"
});

gsap.from(".menu-button", {
    y: -50,
    opacity: 0,
    scale: 0.95,  // Agregado un pequeño escalado
    stagger: 0.15,
    duration: 0.8,
    ease: "bounce.out"
});
