// Default settings configuration
const DEFAULT_SETTINGS = {
    focusDuration: 25,       // minutes
    shortBreakDuration: 5,   // minutes
    longBreakDuration: 15,  // minutes
    cyclesBeforeLongBreak: 4,
    enableSound: true,
    // New Color Settings Structure
    colorMode: 'simple', // 'simple' or 'advanced'
    simplePrimaryColor: '#4a90e2', // Default for simple mode
    advPrimaryColor: '#4a90e2',    // Default for advanced mode
    advBackgroundColor: '#f8f9fa', // Default for advanced mode
    advTextColor: '#343a40',       // Default for advanced mode
};

// Function to get settings from localStorage or defaults
function getSettings() {
    const savedSettings = localStorage.getItem('focusFlowSettings');
    if (savedSettings) {
        // Merge saved settings with defaults to ensure all keys exist
        const parsedSettings = JSON.parse(savedSettings);
        // Ensure numeric values are numbers, not strings from older saves
        parsedSettings.focusDuration = parseInt(parsedSettings.focusDuration, 10) || DEFAULT_SETTINGS.focusDuration;
        parsedSettings.shortBreakDuration = parseInt(parsedSettings.shortBreakDuration, 10) || DEFAULT_SETTINGS.shortBreakDuration;
        parsedSettings.longBreakDuration = parseInt(parsedSettings.longBreakDuration, 10) || DEFAULT_SETTINGS.longBreakDuration;
        parsedSettings.cyclesBeforeLongBreak = parseInt(parsedSettings.cyclesBeforeLongBreak, 10) || DEFAULT_SETTINGS.cyclesBeforeLongBreak;
        // Ensure boolean
        parsedSettings.enableSound = typeof parsedSettings.enableSound === 'boolean' ? parsedSettings.enableSound : DEFAULT_SETTINGS.enableSound;

        return { ...DEFAULT_SETTINGS, ...parsedSettings };
    } else {
        return { ...DEFAULT_SETTINGS }; // Return a copy of defaults
    }
}

// Function to save settings to localStorage
function saveSettings(settings) {
    try {
        localStorage.setItem('focusFlowSettings', JSON.stringify(settings));
        console.log("Settings saved:", settings);
        // Apply the saved colors immediately after saving
        applyCustomColors(settings);
    } catch (error) {
        console.error("Error saving settings to localStorage:", error);
        // Optionally: Notify the user that settings could not be saved
    }
}

// Function to apply current settings TO the form fields in the modal
function applySettingsToForm(settings, elements) {
    elements.focusDurationInput.value = settings.focusDuration;
    elements.shortBreakInput.value = settings.shortBreakDuration;
    elements.longBreakInput.value = settings.longBreakDuration;
    elements.cyclesInput.value = settings.cyclesBeforeLongBreak;
    elements.soundCheckbox.checked = settings.enableSound;

    // Apply color mode radio button state
    const currentMode = settings.colorMode || 'simple'; // Default to simple if missing
    if (elements.colorModeRadios) { // Check if radios exist
        elements.colorModeRadios.forEach(radio => {
            radio.checked = radio.value === currentMode;
        });
    }

    // Apply color picker values
    if(elements.simplePrimaryColorPicker) elements.simplePrimaryColorPicker.value = settings.simplePrimaryColor;
    if(elements.advPrimaryColorPicker) elements.advPrimaryColorPicker.value = settings.advPrimaryColor;
    if(elements.advBackgroundColorPicker) elements.advBackgroundColorPicker.value = settings.advBackgroundColor;
    if(elements.advTextColorPicker) elements.advTextColorPicker.value = settings.advTextColor;

    // Show/hide the correct color settings section based on the mode
    if (elements.simpleColorSettings && elements.advancedColorSettings) {
        if (currentMode === 'simple') {
            elements.simpleColorSettings.removeAttribute('hidden');
            elements.advancedColorSettings.setAttribute('hidden', '');
        } else {
            elements.simpleColorSettings.setAttribute('hidden', '');
            elements.advancedColorSettings.removeAttribute('hidden');
        }
    }
}

// Function to read current settings FROM the form fields in the modal
function readSettingsFromForm(elements) {
    const settings = {
        focusDuration: parseInt(elements.focusDurationInput.value, 10) || DEFAULT_SETTINGS.focusDuration,
        shortBreakDuration: parseInt(elements.shortBreakInput.value, 10) || DEFAULT_SETTINGS.shortBreakDuration,
        longBreakDuration: parseInt(elements.longBreakInput.value, 10) || DEFAULT_SETTINGS.longBreakDuration,
        cyclesBeforeLongBreak: parseInt(elements.cyclesInput.value, 10) || DEFAULT_SETTINGS.cyclesBeforeLongBreak,
        enableSound: elements.soundCheckbox.checked,
    };

    // Read color mode
    settings.colorMode = 'simple'; // Default
    if (elements.colorModeRadios) {
        const checkedRadio = Array.from(elements.colorModeRadios).find(radio => radio.checked);
        if (checkedRadio) {
            settings.colorMode = checkedRadio.value;
        }
    }

    // Read color values based on the selected mode
    if (settings.colorMode === 'simple') {
        settings.simplePrimaryColor = elements.simplePrimaryColorPicker.value;
        // Keep advanced settings from previous state or defaults when saving in simple mode
        const previousSettings = getSettings();
        settings.advPrimaryColor = previousSettings.advPrimaryColor;
        settings.advBackgroundColor = previousSettings.advBackgroundColor;
        settings.advTextColor = previousSettings.advTextColor;
    } else {
        settings.advPrimaryColor = elements.advPrimaryColorPicker.value;
        settings.advBackgroundColor = elements.advBackgroundColorPicker.value;
        settings.advTextColor = elements.advTextColorPicker.value;
        // Keep simple setting from previous state or defaults
        const previousSettings = getSettings();
        settings.simplePrimaryColor = previousSettings.simplePrimaryColor;
    }

    return settings;
}

// Function to calculate luminance (basic)
// Returns a value between 0 (black) and 1 (white)
function getLuminance(hexColor) {
    const rgb = parseInt(hexColor.slice(1), 16); // Convert hex to integer
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    // Formula from WCAG perceptive luminance
    const lr = r / 255;
    const lg = g / 255;
    const lb = b / 255;

    const rsrgb = lr <= 0.03928 ? lr / 12.92 : Math.pow(((lr + 0.055) / 1.055), 2.4);
    const gsrgb = lg <= 0.03928 ? lg / 12.92 : Math.pow(((lg + 0.055) / 1.055), 2.4);
    const bsrgb = lb <= 0.03928 ? lb / 12.92 : Math.pow(((lb + 0.055) / 1.055), 2.4);

    return 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
}

// Function to apply custom colors as CSS variables
function applyCustomColors(settings) {
    const root = document.documentElement;
    let primary, background, text, primaryText;

    const lightColor = '#f8f9fa'; // Consistent light color
    const darkColor = '#212529';  // Consistent dark color

    if (settings.colorMode === 'simple') {
        primary = settings.simplePrimaryColor;
        const primaryLuminance = getLuminance(primary);

        // Determine Background & General Text based on Primary Luminance
        if (primaryLuminance > 0.5) { // Primary is light
            background = darkColor; // Use dark background
            text = lightColor;      // Use light general text
        } else { // Primary is dark
            background = lightColor; // Use light background
            text = darkColor;        // Use dark general text
        }

        // Determine Text ON Primary element (e.g., button text)
        // If primary is very light (e.g., > 0.7), use dark text on it.
        // If primary is very dark (e.g., < 0.3), use light text on it.
        // Otherwise, use the opposite of the general text color for contrast.
        if (primaryLuminance > 0.6) { // Heuristic threshold for light colors needing dark text
             primaryText = darkColor;
        } else if (primaryLuminance < 0.4) { // Heuristic threshold for dark colors needing light text
             primaryText = lightColor;
        } else {
             // For mid-range primary colors, use the opposite of the main text color
             primaryText = (text === lightColor) ? darkColor : lightColor;
        }

        console.log(`Simple Mode: P Lum: ${primaryLuminance.toFixed(2)} -> BG: ${background}, Text: ${text}, PrimaryText: ${primaryText}`);

    } else { // Advanced mode
        primary = settings.advPrimaryColor;
        background = settings.advBackgroundColor;
        text = settings.advTextColor;
        // In advanced mode, determine primaryText based on chosen primary vs chosen text
        // Basic check: if primary and text have similar luminance, flip primaryText?
        // Or simply let the user choose this too in advanced? For now, derive simply.
        const advPrimaryLuminance = getLuminance(primary);
        primaryText = (advPrimaryLuminance > 0.5) ? darkColor : lightColor;
        console.log(`Advanced Mode: P: ${primary}, BG: ${background}, T: ${text} -> PrimaryText: ${primaryText}`);
    }

    // Apply the determined colors
    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--background-color', background);
    root.style.setProperty('--text-color', text);
    root.style.setProperty('--primary-text-color', primaryText);

    // We are now calculating derived colors directly, no need for CSS color-mix reliance here
    // root.style.setProperty('--primary-light', calculateLighterShade(primary));
    // root.style.setProperty('--primary-dark', calculateDarkerShade(primary));
}
