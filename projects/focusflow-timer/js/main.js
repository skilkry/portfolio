// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const elements = {
        // Timer display
        modeDisplay: document.getElementById('timer-mode'),
        timeDisplay: document.getElementById('timer-time'),
        // Timer controls
        startPauseButton: document.getElementById('start-pause-button'),
        resetButton: document.getElementById('reset-button'),
        skipButton: document.getElementById('skip-button'),
        // Cycle tracker
        cycleCountDisplay: document.getElementById('cycle-count'),
        // Settings modal
        settingsButton: document.getElementById('settings-button'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettingsButton: document.getElementById('close-settings-button'),
        settingsForm: document.getElementById('settings-form'),
        // Settings form inputs
        focusDurationInput: document.getElementById('focus-duration'),
        shortBreakInput: document.getElementById('short-break-duration'),
        longBreakInput: document.getElementById('long-break-duration'),
        cyclesInput: document.getElementById('cycles-before-long-break'),
        soundCheckbox: document.getElementById('enable-sound'),
        // Color Mode and Settings Elements
        colorModeRadios: document.querySelectorAll('input[name="color-mode"]'),
        simpleColorSettings: document.getElementById('simple-color-settings'),
        advancedColorSettings: document.getElementById('advanced-color-settings'),
        simplePrimaryColorPicker: document.getElementById('simple-primary-color-picker'),
        advPrimaryColorPicker: document.getElementById('adv-primary-color-picker'),
        advBackgroundColorPicker: document.getElementById('adv-background-color-picker'),
        advTextColorPicker: document.getElementById('adv-text-color-picker'),
    };

    // --- State Variables ---
    let currentSettings = getSettings(); // Load initial settings
    let timerState = initializeTimerState(currentSettings); // Get initial state from timer.js

    // --- Initialization ---
    function initializeApp() {
        // Apply loaded settings to the form
        applySettingsToForm(currentSettings, elements);
        // Update UI with initial timer state
        updateTimerDisplay(elements, timerState.mode, timerState.timeRemaining);
        updateCycleCount(elements.cycleCountDisplay, timerState.cyclesCompleted);
        updateStartPauseButton(elements.startPauseButton, timerState.isRunning);
        updatePageTitle(timerState.mode, timerState.timeRemaining);
        updateBackgroundIndicator(timerState.mode);
        applyCustomColors(currentSettings); // Apply saved custom colors on load
        updateColorSettingsVisibility(currentSettings.colorMode, elements);
    }

    // --- Event Listeners ---

    // Settings Modal
    elements.settingsButton.addEventListener('click', () => {
        applySettingsToForm(currentSettings, elements); // Ensure form shows current settings
        updateColorSettingsVisibility(currentSettings.colorMode, elements);
        toggleSettingsModal(elements.settingsModal, true);
    });

    elements.closeSettingsButton.addEventListener('click', () => {
        toggleSettingsModal(elements.settingsModal, false);
        closeSettingsModal();
    });

    elements.settingsModal.addEventListener('click', (event) => {
        if (event.target === elements.settingsModal) {
            toggleSettingsModal(elements.settingsModal, false);
            closeSettingsModal();
        }
    });

    // Save Settings Form Submission
    elements.settingsForm.addEventListener('submit', (event) => {
        console.log("Form submit event triggered."); // <-- Log 1
        event.preventDefault(); // Prevent default form submission
        console.log("Default form submission prevented."); // <-- Log 2

        let newSettings;
        try {
            newSettings = readSettingsFromForm(elements); // Read all settings from form
            console.log("Settings read from form:", newSettings); // <-- Log 3
        } catch (error) {
            console.error("Error reading settings from form:", error); // <-- Log Error Reading
            return; // Stop if reading fails
        }

        try {
            console.log("Attempting to save settings..."); // <-- Log 4
            saveSettings(newSettings); // Saves AND applies colors via applyCustomColors
            console.log("saveSettings function called successfully."); // <-- Log 5
            currentSettings = newSettings; // Update global settings object
            console.log("Global currentSettings updated."); // <-- Log 6
        } catch (error) {
            console.error("Error saving or applying settings:", error); // <-- Log Error Saving
            return; // Stop if saving fails
        }

        // If timer is NOT running, update its state based on new settings
        if (!timerState.isRunning) {
            console.log("Timer not running, re-initializing state and UI."); // <-- Log 7
            timerState = initializeTimerState(currentSettings);
            initializeApp(); // Re-initialize UI with new settings/state
        } else {
            console.log("Timer is running, settings saved but timer state not reset."); // <-- Log 8
        }

        console.log("Closing settings modal."); // <-- Log 9
        elements.settingsModal.setAttribute('hidden', ''); // Close modal after saving
    });

    // Timer Controls (Connecting to timer.js functions)
    elements.startPauseButton.addEventListener('click', () => {
        if (timerState.isRunning) {
            timerState = pauseTimer(timerState);
        } else {
            timerState = startTimer(timerState, currentSettings, elements);
        }
        updateStartPauseButton(elements.startPauseButton, timerState.isRunning);
    });

    elements.resetButton.addEventListener('click', () => {
        timerState = resetTimer(currentSettings, timerState);
        // Update UI after reset
        updateTimerDisplay(elements, timerState.mode, timerState.timeRemaining);
        updateStartPauseButton(elements.startPauseButton, timerState.isRunning);
        updatePageTitle(timerState.mode, timerState.timeRemaining);
        updateBackgroundIndicator(timerState.mode);
        // Cycle count might also reset depending on desired logic, handled in resetTimer
        updateCycleCount(elements.cycleCountDisplay, timerState.cyclesCompleted);

    });

    elements.skipButton.addEventListener('click', () => {
        timerState = skipInterval(timerState, currentSettings, elements);
        // UI updates are handled within skipInterval/startNextInterval
    });

    // Live Preview and Mode Switching Logic

    // Listen to changes in Color Mode Radios
    elements.colorModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedMode = event.target.value;
            console.log("Color mode changed to:", selectedMode);
            updateColorSettingsVisibility(selectedMode, elements);
            // Apply a preview based on the *current* values in the newly shown section
            applyLiveColorPreview(elements);
        });
    });

    // Function to show/hide color settings based on mode
    function updateColorSettingsVisibility(mode, elements) {
        if (mode === 'simple') {
            elements.simpleColorSettings?.removeAttribute('hidden');
            elements.advancedColorSettings?.setAttribute('hidden', '');
        } else { // advanced
            elements.simpleColorSettings?.setAttribute('hidden', '');
            elements.advancedColorSettings?.removeAttribute('hidden');
        }
    }

    // Listen for changes in color pickers for live preview
    const allColorPickers = [
        elements.simplePrimaryColorPicker,
        elements.advPrimaryColorPicker,
        elements.advBackgroundColorPicker,
        elements.advTextColorPicker
    ];

    allColorPickers.forEach(picker => {
        if (picker) {
            picker.addEventListener('input', () => {
                applyLiveColorPreview(elements);
            });
        }
    });

    // Function to apply live preview based on current form state
    function applyLiveColorPreview(elements) {
        // Read the *current* state of the form, not the saved settings
        const previewSettings = readSettingsFromForm(elements);
        console.log("Applying live preview with:", previewSettings);
        applyCustomColors(previewSettings);
    }

    // Function to close settings and revert previews
    function closeSettingsModal() {
        elements.settingsModal.setAttribute('hidden', '');
        // Revert color previews by applying the last *saved* settings
        applyCustomColors(currentSettings);
    }

    // --- Start the app ---
    initializeApp();
});
