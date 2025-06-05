document.addEventListener('mousemove', (e) => {
    const buttons = document.querySelectorAll('.menu-button');
    buttons.forEach(button => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        button.style.transform = `translate(${x}px, ${y}px)`;
    });
});
