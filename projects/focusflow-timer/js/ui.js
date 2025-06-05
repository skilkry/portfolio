// Function to format time (seconds) into MM:SS format
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to update the timer display (time and mode)
function updateTimerDisplay(elements, mode, timeSeconds) {
    elements.modeDisplay.textContent = mode;
    elements.timeDisplay.textContent = formatTime(timeSeconds);
}

// Function to update the text and state of the Start/Pause button
function updateStartPauseButton(buttonElement, isRunning) {
    buttonElement.textContent = isRunning ? 'Pause' : 'Start';
    // Optional: Add a class for styling if needed
    // buttonElement.classList.toggle('running', isRunning);
}

// Function to update the cycle count display
function updateCycleCount(element, count) {
    element.textContent = count;
}

// Function to show or hide the settings modal
function toggleSettingsModal(modalElement, show) {
    if (show) {
        modalElement.removeAttribute('hidden');
        // Optional: focus the first input when opening
        modalElement.querySelector('input, button')?.focus();
    } else {
        modalElement.setAttribute('hidden', '');
    }
}

// Function to update the page title with the current time
function updatePageTitle(mode, timeSeconds) {
    document.title = `${formatTime(timeSeconds)} - ${mode} | FocusFlow Timer`;
}

// Function to visually indicate the current mode (e.g., by changing background)
function updateBackgroundIndicator(mode) {
    // Remove previous mode classes
    document.body.classList.remove('focus-mode', 'short-break-mode', 'long-break-mode');

    // Add current mode class
    switch (mode.toLowerCase().replace(' ', '-')) {
        case 'focus':
            document.body.classList.add('focus-mode');
            break;
        case 'short-break':
            document.body.classList.add('short-break-mode');
            break;
        case 'long-break':
            document.body.classList.add('long-break-mode');
            break;
    }
    // You'll need to add corresponding styles in main.scss for these classes
    // e.g., body.focus-mode { background-color: #eef; }
}
