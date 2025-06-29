function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const colors = ['#ff073a', '#f5d905', '#00ff41'];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';

            particlesContainer.appendChild(particle);
            setTimeout(() => {
                if (particlesContainer.contains(particle)) {
                    particlesContainer.removeChild(particle);
                }
            }, 10000);
        }, i * 500);
    }
}

setInterval(createParticles, 8000);
createParticles();
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const messageContainer = document.getElementById('message-container');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.classList.add('loading');

    document.querySelector('.form-card').style.animation = 'none';
    document.querySelector('.form-card').style.transform = 'translateY(-10px) scale(1.02)';

    try {
        await new Promise(resolve => setTimeout(resolve, 2500));

        showMessage('Mensaje enviado con éxito. Espere su respuesta', 'success');
        form.reset();

        // Reset form animation
        setTimeout(() => {
            document.querySelector('.form-card').style.transform = '';
        }, 1000);

    } catch (error) {
        showMessage('Ups! No pude enviar el mensaje, por favor intenta de nuevo más tarde.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
});

function showMessage(text, type) {
    messageContainer.innerHTML = '';

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = text;

    messageContainer.appendChild(messageEl);

    setTimeout(() => {
        messageEl.classList.add('show');
    }, 100);

    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            if (messageContainer.contains(messageEl)) {
                messageContainer.removeChild(messageEl);
            }
        }, 500);
    }, 6000);
}

const inputs = document.querySelectorAll('.input, .textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-5px)';
        this.parentElement.querySelector('.label').style.color = '#ff073a';
        this.parentElement.querySelector('.label').style.textShadow = '0 0 10px #ff073a';

        this.addEventListener('input', function () {
            this.style.boxShadow = '0 0 40px rgba(57, 208, 216, 0.8), inset 0 0 30px rgba(57, 208, 216, 0.2)';
            setTimeout(() => {
                this.style.boxShadow = '0 0 30px rgba(57, 208, 216, 0.5), inset 0 0 20px rgba(57, 208, 216, 0.1)';
            }, 100);
        });
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
        this.parentElement.querySelector('.label').style.color = '#39d0d8';
        this.parentElement.querySelector('.label').style.textShadow = 'none';
    });
});

const formCard = document.querySelector('.form-card');
formCard.addEventListener('mouseenter', function () {
    const scanner = this.querySelector('.scanner');
    scanner.style.animationPlayState = 'running';
});

if (window.innerWidth <= 768) {
    const style = document.createElement('style');
    style.textContent = '.particle { display: none; }';
    document.head.appendChild(style);
}