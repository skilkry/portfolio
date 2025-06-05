// --- Constants ---
const MODES = {
    FOCUS: 'Focus',
    SHORT_BREAK: 'Short Break',
    LONG_BREAK: 'Long Break'
};

// --- Timer State Management ---
let intervalId = null; // Holds the interval ID for the timer

// Initializes the timer state object
function initializeTimerState(settings) {
    return {
        mode: MODES.FOCUS,
        timeRemaining: settings.focusDuration * 60, // Time in seconds
        isRunning: false,
        cyclesCompleted: 0,
        focusPeriodsCompleted: 0, // Track focus periods within a cycle for long break
    };
}

// --- Timer Core Logic ---

// Starts the timer interval
function startTimer(state, settings, elements) {
    if (state.isRunning) return state; // Already running

    state.isRunning = true;
    // Clear any existing interval before starting a new one
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        state.timeRemaining--;

        // Update UI every second
        updateTimerDisplay(elements, state.mode, state.timeRemaining);
        updatePageTitle(state.mode, state.timeRemaining); // Update title dynamically

        if (state.timeRemaining <= 0) {
            clearInterval(intervalId); // Stop the current interval
            intervalId = null;
            state.isRunning = false;

            // Play notification sound if enabled
            playNotificationSound(settings.enableSound);

            // Transition to the next state
            state = startNextInterval(state, settings, elements);
            // Update button state after transition
            updateStartPauseButton(elements.startPauseButton, state.isRunning);
        }
    }, 1000); // Run every second

    return state;
}

// Pauses the timer
function pauseTimer(state) {
    if (!state.isRunning) return state;

    state.isRunning = false;
    clearInterval(intervalId);
    intervalId = null;
    return state;
}

// Resets the timer to the beginning of the current mode or initial state
function resetTimer(settings, currentState) {
    // Pause first if running
    if (currentState.isRunning) {
        currentState = pauseTimer(currentState);
    }

    // Reset to the start of the *current* mode's duration
    let resetDuration;
    switch (currentState.mode) {
        case MODES.SHORT_BREAK:
            resetDuration = settings.shortBreakDuration * 60;
            break;
        case MODES.LONG_BREAK:
            resetDuration = settings.longBreakDuration * 60;
            break;
        case MODES.FOCUS:
        default:
            resetDuration = settings.focusDuration * 60;
            break;
    }

    currentState.timeRemaining = resetDuration;
    currentState.isRunning = false; // Ensure it's paused after reset

    // Optionally reset cycle count on focus reset? Decision: No, reset only skips/completes.
    // currentState.cyclesCompleted = 0;
    // currentState.focusPeriodsCompleted = 0;

    return currentState;
}

// Determines and starts the next interval in the sequence
function startNextInterval(state, settings, elements) {
    let nextMode = MODES.FOCUS; // Default next mode
    let nextDuration = settings.focusDuration * 60;

    if (state.mode === MODES.FOCUS) {
        // Focus period just finished
        state.focusPeriodsCompleted++;
        state.cyclesCompleted++; // Increment completed cycles (can be defined differently)
        updateCycleCount(elements.cycleCountDisplay, state.cyclesCompleted); // Update UI

        if (state.focusPeriodsCompleted >= settings.cyclesBeforeLongBreak) {
            // Time for a long break
            nextMode = MODES.LONG_BREAK;
            nextDuration = settings.longBreakDuration * 60;
            state.focusPeriodsCompleted = 0; // Reset focus period counter
        } else {
            // Time for a short break
            nextMode = MODES.SHORT_BREAK;
            nextDuration = settings.shortBreakDuration * 60;
        }
    } else {
        // A break (short or long) just finished, always return to Focus
        nextMode = MODES.FOCUS;
        nextDuration = settings.focusDuration * 60;
    }

    // Update state for the new interval
    state.mode = nextMode;
    state.timeRemaining = nextDuration;
    state.isRunning = false; // Start in paused state, user must click Start

    // Update UI immediately for the new interval
    updateTimerDisplay(elements, state.mode, state.timeRemaining);
    updatePageTitle(state.mode, state.timeRemaining);
    updateBackgroundIndicator(state.mode);

    // Automatically start the next timer? Pomodoro usually requires manual start
    // If auto-start is desired, call startTimer here:
    // state = startTimer(state, settings, elements);

    return state;
}

// Skips the rest of the current interval and moves to the next one
function skipInterval(state, settings, elements) {
    // Pause first if running
    if (state.isRunning) {
        state = pauseTimer(state);
    }

    // Immediately transition to the next interval
    state = startNextInterval(state, settings, elements);

    // Update the start/pause button state as the new interval starts paused
    updateStartPauseButton(elements.startPauseButton, state.isRunning);

    return state;
}
