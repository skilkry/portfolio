// Código para botón de silencio global
// Este archivo puede guardarse como assets/JavaScript/muteButton.js

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el icono de volumen existente y el deslizador
    const volumeIcon = document.getElementById('volume-icon');
    const volumeSlider = document.getElementById('sound-volume');
    const allAudioElements = document.querySelectorAll('audio, video'); // Seleccionar una vez

    // Estado inicial
    let isMuted = localStorage.getItem('siteMuted') === 'true';
    let currentVolume = localStorage.getItem('siteVolume') || 0.5; // Default 50%

    // Función para actualizar el estado de silencio y volumen
    function updateMuteState(mute) {
        isMuted = mute;
        volumeIcon.classList.toggle('fa-volume-mute', isMuted);
        volumeIcon.classList.toggle('fa-volume-up', !isMuted);

        const volumeToApply = isMuted ? 0 : currentVolume;
        
        // Actualizar todos los elementos de audio
        allAudioElements.forEach(audio => {
            audio.muted = isMuted; // Asegurarse de que muted está sincronizado
            audio.volume = volumeToApply;
        });
        
        // También actualizar cualquier Audio creado con JavaScript
        if (window.hoverSound) window.hoverSound.volume = volumeToApply;
        if (window.clickSound) window.clickSound.volume = volumeToApply;

        // Actualizar el deslizador
        volumeSlider.value = isMuted ? 0 : currentVolume * 100;

        // Guardar estado
        localStorage.setItem('siteMuted', isMuted);
    }

    // Función para actualizar el nivel de volumen
    function updateVolumeLevel(level) { // level es 0-100
        currentVolume = level / 100;
        const newMutedState = currentVolume === 0;

        // Actualizar estado de silencio si el volumen es 0 o si antes estaba silenciado
        if (newMutedState !== isMuted) {
            updateMuteState(newMutedState);
        } else {
            // Solo actualizar volumen si no estamos cambiando el estado de silencio
            allAudioElements.forEach(audio => {
                audio.volume = currentVolume;
            });
            if (window.hoverSound) window.hoverSound.volume = currentVolume;
            if (window.clickSound) window.clickSound.volume = currentVolume;
        }

        // Guardar volumen (solo si no está silenciado por el botón)
        if (!isMuted || currentVolume > 0) {
             localStorage.setItem('siteVolume', currentVolume);
        }
    }

    // --- Event Listeners ---

    // Evento de clic para el icono de volumen (Mute Toggle)
    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            updateMuteState(!isMuted); // Invierte el estado actual
        });
    }

    // Evento de cambio para el deslizador de volumen
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            updateVolumeLevel(this.value);
        });

        // Establecer el estado inicial del deslizador y volumen
        volumeSlider.value = isMuted ? 0 : currentVolume * 100;
        // Aplicar estado inicial al cargar
        updateMuteState(isMuted); 
        // Aplicar volumen inicial (necesario si no estaba muteado)
        if (!isMuted) {
             updateVolumeLevel(volumeSlider.value);
        }
    }

    // Aplicar estado inicial al cargar la página (redundante con lo anterior, pero seguro)
    // updateMuteState(isMuted); 
});