// Código original para sonidos de botones
const buttons = document.querySelectorAll('.menu-button');

const hoverSound = new Audio('./assets/sounds/hover.mp3');  
const clickSound = new Audio('./assets/sounds/click.mp3');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });

    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// Agregar funcionalidad de silencio
let isMuted = false;

// Crear el botón de silencio
const muteButton = document.createElement('button');
muteButton.innerHTML = '🔊'; // Icono de sonido activo
muteButton.className = 'mute-button';
muteButton.style.position = 'fixed';
muteButton.style.bottom = '20px';
muteButton.style.right = '20px';
muteButton.style.zIndex = '1000';
muteButton.style.padding = '10px';
muteButton.style.borderRadius = '50%';
muteButton.style.background = '#333';
muteButton.style.color = 'white';
muteButton.style.border = 'none';
muteButton.style.cursor = 'pointer';
muteButton.style.width = '50px';
muteButton.style.height = '50px';
muteButton.style.fontSize = '20px';

// Agregar el botón al DOM
document.body.appendChild(muteButton);

// Crear función para silenciar/activar sonidos
function toggleMute() {
    isMuted = !isMuted;
    
    // Cambiar el icono según el estado
    muteButton.innerHTML = isMuted ? '🔇' : '🔊';
    
    // Silenciar o activar los sonidos
    hoverSound.muted = isMuted;
    clickSound.muted = isMuted;
    
    // Silenciar todos los elementos de audio existentes
    const allAudioElements = document.querySelectorAll('audio, video');
    allAudioElements.forEach(audio => {
        audio.muted = isMuted;
    });
}

// Evento de clic para el botón de silencio
muteButton.addEventListener('click', toggleMute);