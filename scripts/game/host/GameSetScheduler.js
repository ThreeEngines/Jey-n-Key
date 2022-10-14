function startGame() {
  bannerElement.innerText = "Waiting for everyone to join the game";
  // enableGameSetHostListener();
  // startTimer();
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

  console.log(`Executing set: ${gamesetStatus}`);
  switch (gamesetStatus) {
    case GAMESET_LOADING:
      // This first round will take some few more minutes
      // due to make sure everyone has being abble to join the party
      bannerElement.innerText = "The round is about to start!";
      gamesetStatus = GAMESET_HIDE;
      unearth();
      // startTimer();
      break;
    case GAMESET_HIDE:
      leaveHoles();
      seeker = getRandomPlayer(players);
      bannerElement.innerText = "Oh no! This mole is still sleeping!";
      setStatusToHide(seeker.id);
      sleep(seeker);
      gamesetStatus = nextGameset(gamesetStatus);
      // startTimer();
      break;
    case GAMESET_SEEK:
      bannerElement.innerText = `?! You awake! Run and hide from the Hawk!`;
      setStatusToSeek(seeker.id);
      seekHide(seeker.id);
      gamesetStatus = nextGameset(gamesetStatus);
      // startTimer();
      break;
    case GAMESET_HUNT:
      bannerElement.innerText = "Take care! The Hawk is hunting!";
      setStatusToHunt(seeker.id);
      gamesetStatus = nextGameset(gamesetStatus);
      kickOut(seeker.id);
      getUncoveredMoles();
    default:
      break;
  }
}

function startTimer() {
  var timer = roundTime,
    minutes,
    seconds;
  var interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById(
      "timer"
    ).textContent = `The next stage starts in: ${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(interval);
      runtime();
    }
  }, 1000);
}
