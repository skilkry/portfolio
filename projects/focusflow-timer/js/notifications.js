// --- Sound Notification ---

let audioContext;
let notificationSoundBuffer;

// Function to initialize the AudioContext (must be done on user interaction)
function initializeAudio() {
    if (!audioContext && window.AudioContext || window.webkitAudioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        loadNotificationSound(); // Load the sound after context is created
        console.log("AudioContext initialized.");
    }
}

// Function to load the notification sound file
async function loadNotificationSound() {
    if (!audioContext) return;

    // Simple placeholder path - replace with your actual sound file path
    const soundFilePath = 'assets/sounds/notification.wav'; // Or .mp3, .ogg

    try {
        const response = await fetch(soundFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        notificationSoundBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log("Notification sound loaded successfully.");
    } catch (error) {
        console.error('Error loading notification sound:', error);
        // Handle error appropriately - maybe disable sound feature?
        notificationSoundBuffer = null; // Ensure we don't try to play a non-loaded sound
    }
}

// Function to play the loaded notification sound
function playNotificationSound(isSoundEnabled) {
    // Ensure audio context is initialized (might need user interaction first)
    if (!audioContext) {
        initializeAudio();
    }

    // Play sound only if enabled in settings and buffer is loaded
    if (isSoundEnabled && audioContext && notificationSoundBuffer && audioContext.state === 'running') {
        try {
            const source = audioContext.createBufferSource();
            source.buffer = notificationSoundBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    } else if (isSoundEnabled && audioContext && audioContext.state !== 'running') {
        console.warn('AudioContext not running. User interaction might be required to enable sound.');
        // Attempt to resume context - might work depending on browser policy
        audioContext.resume().then(() => {
            console.log('AudioContext resumed.');
            playNotificationSound(isSoundEnabled); // Try playing again after resuming
        }).catch(e => console.error("Failed to resume AudioContext:", e));
    } else if (isSoundEnabled && !notificationSoundBuffer) {
        console.warn('Notification sound not loaded or failed to load. Cannot play sound.');
    }
}

// --- Initialization Listener ---
// Add a one-time listener to initialize audio on the first user interaction (e.g., click)
// This is crucial because browsers block audio playback before user interaction.
document.body.addEventListener('click', initializeAudio, { once: true });
document.body.addEventListener('keydown', initializeAudio, { once: true });

// --- Desktop Notifications (Placeholder for future improvement) ---
/*
function requestNotificationPermission() {
    // ... logic to ask user for permission using Notification.requestPermission()
}

function showDesktopNotification(mode) {
    // ... logic to show notification using `new Notification(...)`
    // Check for permission first: if (Notification.permission === 'granted') { ... }
}
*/
