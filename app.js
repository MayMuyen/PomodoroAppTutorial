// --- Audio Files ---
const bells = new Audio('./sounds/game_unlock_sound.mp3'); 
const breakover = new Audio('./sounds/breakOver.wav');
const breakstart = new Audio('./sounds/breakStart.wav');
// --- End of Audio Files ---

// --- jQuery Selectors ---
const $startBtn = $('.btn-start'); 
const $pauseBtn = $('.btn-pause');
const $resetBtn = $('.btn-reset');
const $minuteInput = $('.minutes'); 
const $secondInput = $('.seconds');
const $message = $('.app-message');
// --- End of jQuery Selectors ---

// --- State Variables ---
let myInterval; 
let isRunning = false;
let totalDuration;
let startTime;
let pausedTime = 0;
let isBreak = false;
const breakDuration = 5 * 60;
const sessionDuration = 25 * 60;

//---Start of appTimer---//
//---Remember to change JS link in index.html after testing with copy---//

function appTimer() {
  if(isRunning) return;
  isRunning = true;
    if (totalDuration === undefined) {
            const minutes = parseInt($minuteInput.val()) || 0;
            const seconds = parseInt($secondInput.val()) || 0;
            totalDuration = minutes * 60 + seconds;
        }

startTime = performance.now() - pausedTime;

myInterval = setInterval(() => {
            const elapsedTime = Math.round((performance.now() - startTime) / 1000);
            const remainingTime = totalDuration - elapsedTime;

            updateDisplay(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(myInterval);
                bells.play();

                if (isBreak) {
                    // Break is over, reset to session
                    breakover.play();
                    $message.text('break over!');
                    resetTimer(sessionDuration);
                } else {
                    // Session is over, start break
                    isBreak = true;
                    breakstart.play();
                    $message.text('time for a break!');
                    resetTimer(breakDuration); // Resets to break duration
                    appTimer(); // Auto-starts the break
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;
        clearInterval(myInterval);
        isRunning = false;
        $startBtn.text('resume');
        // Store how much time has passed since the timer started
        pausedTime = performance.now() - startTime;
    }

    function resetTimer(duration = sessionDuration) {
        clearInterval(myInterval);
        isRunning = false;
        totalDuration = undefined; // Clear duration so it's read from inputs next time
        pausedTime = 0;
        isBreak = (duration === breakDuration); // Update break status
        $startBtn.text('start');
        $message.text('press start to begin');
        updateDisplay(duration);
    }

    function updateDisplay(time) {
        const minutesLeft = Math.floor(time / 60);
        const secondsLeft = time % 60;
        
        $minuteInput.val(String(minutesLeft).padStart(2, '0'));
        $secondInput.val(String(secondsLeft).padStart(2, '0'));
    }

    // --- Event Listeners ---
    $startBtn.on('click', () => {
        $startBtn.text('start'); // Reset button text
        appTimer();
    });
    $pauseBtn.on('click', pauseTimer);
    $resetBtn.on('click', () => resetTimer(sessionDuration));

    // Initialize display
    updateDisplay(sessionDuration);
  
