function startGame() {
  bannerElement.innerText = "Waiting for everyone to join the game";
  gamesetStatus = gamestates[gamestates.length];
  // setTimeout(() => {
  //   startTimer();
  // }, roundTime * 1000);
  setTimeout(() => {
    drillHoles(countPlayers(players));
  }, (roundTime * 1000) / 2);
}

// GAME ORDER COUNT (TOP TO BOTTOM)
const gamestates = [
  GAMESET_LOADING,
  GAMESET_HIDE,
  GAMESET_SEEK,
  GAMESET_HUNT,
  GAMESET_PREPARING,
];

function runtime() {
  // (winner)
  if (countPlayers(players) <= 1) {
    setStatus(GAMESET_LOBBY, undefined);
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

  gamesetStatus = nextGameset(gamesetStatus);
  console.log(`Executing => ${gamesetStatus}`);
  switch (gamesetStatus) {
    case GAMESET_LOADING:
      // This first round will take some few more minutes
      // due to make sure everyone has being abble to join the party
      leaveHoles();
      bannerElement.innerText = "The round is about to start!";
      break;
    case GAMESET_HIDE:
      // goBackInsideTheHoleIfDidntMoved(playerId); -> Client side
      seeker = getRandomPlayer(players);
      bannerElement.innerText = "Oh no! This mole is still sleeping!";
      sleep(seeker);
      break;
    case GAMESET_SEEK:
      bannerElement.innerText = `?! You awake! Run and hide from the Hawk!`;
      hideFromSeeker(seeker.id);
      break;
    case GAMESET_HUNT:
      bannerElement.innerText = "Take care! The Hawk is hunting!";
      kickOut(seeker.id);
      getUncoveredMoles();
      break;
    case GAMESET_PREPARING:
      bannerElement.innerText = "preparing";
      cleanDeadBodiesFromTheField();
      unearth();
      break;
    default:
  }

  // console.log(`Gameset going to => ${gamesetStatus}`);
  setStatus(gamesetStatus, seeker.id);
  // if (!gamesetStatus.toUpperCase().includes("CONTROLS")) startTimer(); else runtime()
}
var interval;
function startTimer() {
  var timer = roundTime;
  interval = setInterval(function () {
    timerElement.textContent = `The  next  stage  starts  in  ${formatTime(
      timer
    )}`;

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
  timerElement.textContent = `The  next  stage  starts  in  ${formatTime(0)}`;
  runtime();
}
