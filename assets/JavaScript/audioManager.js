// Clase para gestionar el audio en toda la aplicación
class AudioManager {
    constructor() {
        this.hoverSound = new Audio('./assets/sounds/hover.mp3');
        this.clickSound = new Audio('./assets/sounds/click.mp3');
        this.isMuted = localStorage.getItem('siteMuted') === 'true';
        this.volume = parseFloat(localStorage.getItem('siteVolume')) || 0.5; // Default 50%
        this.audioElements = [];
    }

    initialize() {
        // Inicializar con el volumen guardado
        this.setVolume(this.volume);
        
        // Aplicar estado de silencio si estaba guardado
        if (this.isMuted) {
            this.toggleSound();
        }
        
        // Hacer que los sonidos estén disponibles globalmente
        window.hoverSound = this.hoverSound;
        window.clickSound = this.clickSound;
        
        // Registrar todos los elementos de audio existentes
        this.updateAudioElements();
        
        console.log('AudioManager initialized with volume:', this.volume, 'muted:', this.isMuted);
    }
    
    updateAudioElements() {
        // Obtener todos los elementos de audio en la página
        this.audioElements = document.querySelectorAll('audio, video');
        return this.audioElements;
    }
    
    playHoverSound() {
        if (!this.isMuted) {
            this.hoverSound.currentTime = 0;
            this.hoverSound.play().catch(err => console.log('Audio play failed:', err));
        }
    }
    
    playClickSound() {
        if (!this.isMuted) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(err => console.log('Audio play failed:', err));
        }
    }
    
    toggleSound() {
        this.isMuted = !this.isMuted;
        
        // Aplicar estado de silencio a todos los elementos de audio
        this.updateAudioElements().forEach(audio => {
            audio.muted = this.isMuted;
        });
        
        // También aplicar a nuestros sonidos específicos
        this.hoverSound.muted = this.isMuted;
        this.clickSound.muted = this.isMuted;
        
        // Guardar preferencia
        localStorage.setItem('siteMuted', this.isMuted);
        
        // Actualizar el volumen real (0 si está silenciado, volumen guardado si no)
        this.applyVolumeToAll();
        
        console.log('Sound toggled. Muted:', this.isMuted);
        
        // Devolver el estado actual para que la UI pueda actualizarse
        return !this.isMuted;
    }
    
    setVolume(value) {
        // Asegurarse de que el valor está entre 0 y 1
        this.volume = Math.max(0, Math.min(1, value));
        
        // Si el volumen es 0, silenciar; si no, quitar silencio
        const shouldBeMuted = this.volume === 0;
        if (shouldBeMuted !== this.isMuted) {
            this.isMuted = shouldBeMuted;
            localStorage.setItem('siteMuted', this.isMuted);
        }
        
        // Aplicar el volumen a todos los elementos
        this.applyVolumeToAll();
        
        // Guardar preferencia
        localStorage.setItem('siteVolume', this.volume);
        
        console.log('Volume set to:', this.volume, 'muted:', this.isMuted);
    }
    
    applyVolumeToAll() {
        const effectiveVolume = this.isMuted ? 0 : this.volume;
        
        // Aplicar a todos los elementos de audio
        this.updateAudioElements().forEach(audio => {
            audio.volume = effectiveVolume;
        });
        
        // También aplicar a nuestros sonidos específicos
        this.hoverSound.volume = effectiveVolume;
        this.clickSound.volume = effectiveVolume;
    }
}

// Exportar una instancia única
export const audioManager = new AudioManager();