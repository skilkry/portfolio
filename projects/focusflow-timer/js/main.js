  class FocusFlowTimer {
            constructor() {
                this.state = {
                    isRunning: false,
                    timeLeft: 25 * 60,
                    currentMode: 'focus',
                    cycleCount: 0,
                    totalFocusTime: 0,
                    streakCount: 0,
                    sessionData: [],
                    settings: {
                        focusDuration: 25,
                        shortBreakDuration: 5,
                        longBreakDuration: 15,
                        cyclesBeforeLongBreak: 4,
                        autoStartBreaks: false,
                        notificationSound: 'bell',
                        enableNotifications: false,
                        enableVibration: false
                    }
                };

                this.intervalId = null;
                this.startTime = null;
                this.progressRing = document.getElementById('progress-ring');
                this.timerTime = document.getElementById('timer-time');
                this.timerMode = document.getElementById('timer-mode');
                this.timerCircle = document.getElementById('timer-circle');

                this.loadSettings();
                this.initializeElements();
                this.setupEventListeners();
                this.updateDisplay();
                this.updateStats();
                this.requestNotificationPermission();
            }

            initializeElements() {
                this.elements = {
                    startPauseButton: document.getElementById('start-pause-button'),
                    resetButton: document.getElementById('reset-button'),
                    skipButton: document.getElementById('skip-button'),
                    settingsButton: document.getElementById('settings-button'),
                    themeToggle: document.getElementById('theme-toggle'),
                    settingsModal: document.getElementById('settings-modal'),
                    closeSettingsButton: document.getElementById('close-settings-button'),
                    settingsForm: document.getElementById('settings-form'),
                    cycleCountDisplay: document.getElementById('cycle-count'),
                    focusTimeDisplay: document.getElementById('focus-time'),
                    productivityScoreDisplay: document.getElementById('productivity-score'),
                    streakCountDisplay: document.getElementById('streak-count'),
                    toastContainer: document.getElementById('toast-container')
                };
            }

            setupEventListeners() {
                this.elements.startPauseButton.addEventListener('click', () => this.toggleTimer());
                this.elements.resetButton.addEventListener('click', () => this.resetTimer());
                this.elements.skipButton.addEventListener('click', () => this.skipSession());
                this.elements.settingsButton.addEventListener('click', () => this.openSettings());
                this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
                this.elements.closeSettingsButton.addEventListener('click', () => this.closeSettings());
                this.elements.settingsModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.settingsModal) this.closeSettings();
                });
                this.elements.settingsForm.addEventListener('submit', (e) => this.saveSettings(e));

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.target.tagName === 'INPUT') return;
                    
                    switch(e.code) {
                        case 'Space':
                            e.preventDefault();
                            this.toggleTimer();
                            break;
                        case 'KeyR':
                            e.preventDefault();
                            this.resetTimer();
                            break;
                        case 'KeyS':
                            e.preventDefault();
                            this.skipSession();
                            break;
                        case 'Escape':
                            this.closeSettings();
                            break;
                    }
                });

                // Page visibility API
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible' && this.state.isRunning) {
                        this.showToast('¡Bienvenido de vuelta! El timer sigue corriendo.', 'success');
                    }
                });
            }

            toggleTimer() {
                if (this.state.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            }

            startTimer() {
                this.state.isRunning = true;
                this.startTime = Date.now();
                this.timerCircle.classList.add('active', 'pulse');
                this.elements.startPauseButton.innerHTML = '⏸ Pause';
                this.elements.startPauseButton.classList.remove('start-button');

                this.intervalId = setInterval(() => {
                    this.state.timeLeft--;
                    this.updateDisplay();

                    if (this.state.timeLeft <= 0) {
                        this.completeSession();
                    }
                }, 1000);

                this.showToast(`${this.getModeDisplayName()} iniciado!`, 'success');
            }

            pauseTimer() {
                this.state.isRunning = false;
                this.timerCircle.classList.remove('active', 'pulse');
                this.elements.startPauseButton.innerHTML = '▶ Start';
                this.elements.startPauseButton.classList.add('start-button');
                clearInterval(this.intervalId);
                this.showToast('Timer pausado', 'warning');
            }

            resetTimer() {
                this.state.isRunning = false;
                this.timerCircle.classList.remove('active', 'pulse');
                this.elements.startPauseButton.innerHTML = '▶ Start';
                this.elements.startPauseButton.classList.add('start-button');
                clearInterval(this.intervalId);
                
                this.state.timeLeft = this.getCurrentModeDuration() * 60;
                this.updateDisplay();
                this.showToast('Timer reiniciado', 'success');
            }

            skipSession() {
                if (this.state.isRunning) {
                    clearInterval(this.intervalId);
                }
                this.completeSession(true);
                this.showToast('Sesión saltada', 'warning');
            }

            completeSession(skipped = false) {
                this.state.isRunning = false;
                this.timerCircle.classList.remove('active', 'pulse');
                clearInterval(this.intervalId);

                // Record session data
                const sessionDuration = this.getCurrentModeDuration();
                const actualTime = skipped ? 0 : sessionDuration;
                
                this.state.sessionData.push({
                    mode: this.state.currentMode,
                    duration: sessionDuration,
                    actualTime: actualTime,
                    timestamp: Date.now(),
                    completed: !skipped
                });

                if (this.state.currentMode === 'focus' && !skipped) {
                    this.state.cycleCount++;
                    this.state.totalFocusTime += sessionDuration;
                    this.state.streakCount++;
                } else if (skipped && this.state.currentMode === 'focus') {
                    this.state.streakCount = 0;
                }

                // Play notification sound
                this.playNotificationSound();
                
                // Show notification
                this.showNotification();
                
                // Vibrate if enabled
                this.vibrate();

                // Switch to next mode
                this.switchToNextMode();
                
                // Auto-start if enabled
                if (this.state.settings.autoStartBreaks && this.state.currentMode !== 'focus') {
                    setTimeout(() => this.startTimer(), 1000);
                }

                this.updateStats();
                this.saveState();
            }

            switchToNextMode() {
                if (this.state.currentMode === 'focus') {
                    if (this.state.cycleCount % this.state.settings.cyclesBeforeLongBreak === 0) {
                        this.state.currentMode = 'long-break';
                    } else {
                        this.state.currentMode = 'short-break';
                    }
                } else {
                    this.state.currentMode = 'focus';
                }

                this.state.timeLeft = this.getCurrentModeDuration() * 60;
                this.updateDisplay();
                this.elements.startPauseButton.innerHTML = '▶ Start';
                this.elements.startPauseButton.classList.add('start-button');
            }

            getCurrentModeDuration() {
                switch (this.state.currentMode) {
                    case 'focus': return this.state.settings.focusDuration;
                    case 'short-break': return this.state.settings.shortBreakDuration;
                    case 'long-break': return this.state.settings.longBreakDuration;
                    default: return 25;
                }
            }

            getModeDisplayName() {
                switch (this.state.currentMode) {
                    case 'focus': return 'Focus';
                    case 'short-break': return 'Descanso Corto';
                    case 'long-break': return 'Descanso Largo';
                    default: return 'Focus';
                }
            }

            updateDisplay() {
                const minutes = Math.floor(this.state.timeLeft / 60);
                const seconds = this.state.timeLeft % 60;
                this.timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // Update mode display
                this.timerMode.textContent = this.getModeDisplayName();
                this.timerMode.className = `timer-mode ${this.state.currentMode}`;

                // Update progress ring
                const totalTime = this.getCurrentModeDuration() * 60;
                const progress = 1 - (this.state.timeLeft / totalTime);
                const circumference = 2 * Math.PI * 152;
                const strokeDashoffset = circumference * (1 - progress);
                this.progressRing.style.strokeDashoffset = strokeDashoffset;

                // Update document title
                document.title = `${this.timerTime.textContent} - ${this.getModeDisplayName()} | FocusFlow Pro`;
            }

            updateStats() {
                this.elements.cycleCountDisplay.textContent = this.state.cycleCount;
                
                const hours = Math.floor(this.state.totalFocusTime / 60);
                const minutes = this.state.totalFocusTime % 60;
                this.elements.focusTimeDisplay.textContent = `${hours}h ${minutes}m`;
                
                const productivityScore = this.calculateProductivityScore();
                this.elements.productivityScoreDisplay.textContent = `${productivityScore}%`;
                
                this.elements.streakCountDisplay.textContent = this.state.streakCount;
            }

            calculateProductivityScore() {
                if (this.state.sessionData.length === 0) return 0;
                
                const last7Sessions = this.state.sessionData.slice(-7);
                const completedSessions = last7Sessions.filter(s => s.completed && s.mode === 'focus').length;
                const focusSessions = last7Sessions.filter(s => s.mode === 'focus').length;
                
                if (focusSessions === 0) return 0;
                return Math.round((completedSessions / focusSessions) * 100);
            }

            playNotificationSound() {
                if (this.state.settings.notificationSound === 'none') return;
                
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                let frequency;
                switch (this.state.settings.notificationSound) {
                    case 'bell': frequency = 800; break;
                    case 'chime': frequency = 1000; break;
                    case 'notification': frequency = 600; break;
                    default: frequency = 800;
                }
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }

            showNotification() {
                if (!this.state.settings.enableNotifications || Notification.permission !== 'granted') return;
                
                const title = `${this.getModeDisplayName()} completado!`;
                const body = this.state.currentMode === 'focus' 
                    ? 'Tiempo de tomar un descanso 🎉'
                    : 'Hora de volver al trabajo 💪';
                
                new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
                    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>'
                });
            }

            vibrate() {
                if (this.state.settings.enableVibration && 'vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                }
            }

            async requestNotificationPermission() {
                if ('Notification' in window && Notification.permission === 'default') {
                    await Notification.requestPermission();
                }
            }

            openSettings() {
                this.loadSettingsToForm();
                this.elements.settingsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeSettings() {
                this.elements.settingsModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            loadSettingsToForm() {
                document.getElementById('focus-duration').value = this.state.settings.focusDuration;
                document.getElementById('short-break-duration').value = this.state.settings.shortBreakDuration;
                document.getElementById('long-break-duration').value = this.state.settings.longBreakDuration;
                document.getElementById('cycles-before-long-break').value = this.state.settings.cyclesBeforeLongBreak;
                document.getElementById('auto-start-breaks').value = this.state.settings.autoStartBreaks;
                document.getElementById('notification-sound').value = this.state.settings.notificationSound;
                document.getElementById('enable-notifications').checked = this.state.settings.enableNotifications;
                document.getElementById('enable-vibration').checked = this.state.settings.enableVibration;
            }

            saveSettings(e) {
                e.preventDefault();
                
                this.state.settings = {
                    focusDuration: parseInt(document.getElementById('focus-duration').value),
                    shortBreakDuration: parseInt(document.getElementById('short-break-duration').value),
                    longBreakDuration: parseInt(document.getElementById('long-break-duration').value),
                    cyclesBeforeLongBreak: parseInt(document.getElementById('cycles-before-long-break').value),
                    autoStartBreaks: document.getElementById('auto-start-breaks').value === 'true',
                    notificationSound: document.getElementById('notification-sound').value,
                    enableNotifications: document.getElementById('enable-notifications').checked,
                    enableVibration: document.getElementById('enable-vibration').checked
                };

                // Reset timer with new settings if not running
                if (!this.state.isRunning) {
                    this.state.timeLeft = this.getCurrentModeDuration() * 60;
                    this.updateDisplay();
                }

                this.saveState();
                this.closeSettings();
                this.showToast('Configuración guardada exitosamente!', 'success');
            }

            toggleTheme() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                this.elements.themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
                
                // Save theme preference
                localStorage.setItem('focusflow-theme', newTheme);
                
                this.showToast(`Tema ${newTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'success');
            }

            showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                
                this.elements.toastContainer.appendChild(toast);
                
                // Trigger animation
                setTimeout(() => toast.classList.add('show'), 100);
                
                // Remove toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            saveState() {
                try {
                    const stateToSave = {
                        settings: this.state.settings,
                        cycleCount: this.state.cycleCount,
                        totalFocusTime: this.state.totalFocusTime,
                        streakCount: this.state.streakCount,
                        sessionData: this.state.sessionData.slice(-50) // Keep last 50 sessions
                    };
                    localStorage.setItem('focusflow-state', JSON.stringify(stateToSave));
                } catch (error) {
                    console.warn('Could not save state to localStorage:', error);
                }
            }

            loadSettings() {
                try {
                    const savedState = localStorage.getItem('focusflow-state');
                    if (savedState) {
                        const parsed = JSON.parse(savedState);
                        this.state.settings = { ...this.state.settings, ...parsed.settings };
                        this.state.cycleCount = parsed.cycleCount || 0;
                        this.state.totalFocusTime = parsed.totalFocusTime || 0;
                        this.state.streakCount = parsed.streakCount || 0;
                        this.state.sessionData = parsed.sessionData || [];
                    }

                    // Load theme
                    const savedTheme = localStorage.getItem('focusflow-theme');
                    if (savedTheme) {
                        document.documentElement.setAttribute('data-theme', savedTheme);
                        if (this.elements?.themeToggle) {
                            this.elements.themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
                        }
                    } else {
                        // Set default based on system preference
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        const defaultTheme = prefersDark ? 'dark' : 'light';
                        document.documentElement.setAttribute('data-theme', defaultTheme);
                        if (this.elements?.themeToggle) {
                            this.elements.themeToggle.textContent = defaultTheme === 'light' ? '☀️' : '🌙';
                        }
                    }
                } catch (error) {
                    console.warn('Could not load settings from localStorage:', error);
                }
            }
        }

        // Initialize the timer when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.focusFlowTimer = new FocusFlowTimer();
            
            // Add some nice loading animation
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        // Service Worker registration for PWA capabilities (optional)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker not available, continue without it
            });
        }