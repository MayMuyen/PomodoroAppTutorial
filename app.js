const bells = new Audio('./sounds/game_unlock_sound.mp3'); 
const breakover = new Audio('./sounds/breakOver.wav');
const breakstart = new Audio('./sounds/breakStart.wav');
const $startBtn = $('.btn-start'); 
const $pauseBtn = $('.btn-pause');
const $resetBtn = $('.btn-reset');
const $session = $('.minutes'); 
let myInterval; 
let isRunning = false;
let totalSeconds;
let startTime;
let pausedTime = 0;
let isBreak = false;
const breakDuration = 5 * 60;

//---Start of appTimer---//
//---Remember to change JS link in index.html after testing with copy---//

const appTimer = () => {

  if(!isRunning) {
    isRunning = true;
    if (totalSeconds === undefined) {
      if (isBreak){
        totalSeconds = breakDuration;
      } else {
    const sessionAmount = Number.parseInt($session.text())
    totalSeconds = sessionAmount * 60;
  }
}

startTime = performance.now() - pausedTime;

const updateSeconds = () => {
    const $minuteDiv = $('.minutes');
    const $secondDiv = $('.seconds');
    const elapsedTime = Math.floor((performance.now() - startTime) / 1000);
    const remainingTime = totalSeconds - elapsedTime;

  if (remainingTime <= 0) {
    bells.play();
    clearInterval(myInterval);
    isRunning = false;
    totalSeconds = undefined;
    pausedTime = 0;
    if (isBreak) {
      isBreak = false;
      $minuteDiv.text('20');
      $secondDiv.text('00');
      $('.btn-start').text('start');
      breakover.play();
    } else {
      isBreak = true;
      breakstart.play();
      appTimer();
    }
    return;
  }

  let minutesLeft = Math.floor(remainingTime / 60);
  let secondsLeft = remainingTime % 60;

  if(secondsLeft < 10) {
    $secondDiv.text('0' + secondsLeft);
  } else {
    $secondDiv.text(secondsLeft);
  }
  $minuteDiv.text(`${minutesLeft}`);
    }
    myInterval = setInterval(updateSeconds, 1000);
  } else {
    alert('Session has already started.');
  }


}

//---end of appTimer---//

const pauseTimer = () => {
  if (isRunning) {
    clearInterval(myInterval);
    isRunning = false;
    $('.btn-start').text('resume');
    pausedTime = performance.now() - startTime;
  } else {
    alert('Timer is not running.');
  }
}

const resetTimer = () => {
    clearInterval(myInterval);
    isRunning = false;
    totalSeconds = undefined;
    pausedTime = 0;
    $('.minutes').text('20');
    $('.seconds').text('00');
    $('.btn-start').text('start');
}

$startBtn.on('click', () => {
  if ($startBtn.text() === 'resume') {
    $('.btn-start').text('start');
    appTimer();
  } else {
    appTimer();
  }
});
$pauseBtn.on('click', pauseTimer);
$resetBtn.on('click', resetTimer);