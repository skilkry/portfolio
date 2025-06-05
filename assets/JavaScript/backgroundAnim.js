document.addEventListener('DOMContentLoaded', () => {
    const beforeElement = document.querySelector('body::before');
    const afterElement = document.querySelector('body::after');
    let x = 0, y = 0;
    let directionX = 1, directionY = 1;

    function animateBackground() {
        x += 0.1 * directionX;
        y += 0.1 * directionY;

        if (x > 10 || x < -10) directionX *= -1;
        if (y > 10 || y < -10) directionY *= -1;

        beforeElement.style.transform = `translate(${x}px, ${y}px)`;
        afterElement.style.transform = `translate(${x}px, ${y}px)`;

        requestAnimationFrame(animateBackground);
    }

    animateBackground();
});