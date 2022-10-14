function startGame() {
  bannerElement.innerText = "Waiting for everyone to join the game";
  setTimeout(() => {
    startTimer();
  }, roundTime * 1000);
  setTimeout(() => {
    drillHoles(countPlayers(players));
  }, (roundTime * 1000) / 2);
}

function runtime() {
  // (winner)
  if (countPlayers(players) <= 1) {
    setStatusToWaitingRoom();
    swal({
      title: "Game end!",
      icon: "success",
      text: `Redirecting to lobby`,
      timer: swalRedirectTimer * 1000,
    }).then(function () {
      const ip = window.localStorage.getItem("IP");
      location.href = `/views/lobby?IP=${ip}`;
    });
  }

  switch (gamesetStatus) {
    case GAMESET_LOADING:
      // This first round will take some few more minutes
      // due to make sure everyone has being abble to join the party
      bannerElement.innerText = "The round is about to start!";
      setStatusToLoading();
      gamesetStatus = GAMESET_HIDE;
      unearth();
      startTimer();
      break;
    case GAMESET_HIDE:
      leaveHoles();
      seeker = getRandomPlayer(players);
      bannerElement.innerText = "Oh no! This mole is still sleeping!";
      setStatusToHide(seeker.id);
      sleep(seeker);
      gamesetStatus = nextGameset(gamesetStatus);
      startTimer();
      break;
    case GAMESET_SEEK:
      bannerElement.innerText = `?! You awake! Run and hide from the Hawk!`;
      setStatusToSeek(seeker.id);
      seekHide(seeker.id);
      gamesetStatus = nextGameset(gamesetStatus);
      startTimer();
      break;
    case GAMESET_HUNT:
      bannerElement.innerText = "Take care! The Hawk is hunting!";
      setStatusToHunt(seeker.id);
      gamesetStatus = nextGameset(gamesetStatus);
      kickOut(seeker.id);
      getUncoveredMoles();
      startTimer();
    default:
      break;
  }
}
var interval;
function startTimer() {
  var timer = roundTime;
  interval = setInterval(function () {
    timerElement.textContent = `The next stage starts in ${formatTime(timer)}`;

    if (--timer < 0) {
      finishTimer();
    }
  }, 1000);
}

function formatTime(timer) {
  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return `${minutes}:${seconds}`;
}

function finishTimer() {
  if (interval) clearInterval(interval);
  timerElement.textContent = `The next stage starts in ${formatTime(0)}`;
  runtime();
}
