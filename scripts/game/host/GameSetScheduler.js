function startGame() {
  bannerElement.innerText = "Waiting for everyone to join the game";
  // enableGameSetHostListener();
  startTimer();
}

let seeker;
function runtime() {
  // < 3 (winner and host)
  // if (countPlayers(players) < 3) {
  //   setStatusToWaitingRoom();
  //   const ip = window.localStorage.getItem("IP");
  //   location.href = `/views/lobby?IP=${ip}`;
  // }

  console.log(`Executing set: ${gamesetStatus}`);
  switch (gamesetStatus) {
    case GAMESET_LOADING:
      // This first round will take some few more minutes
      // due to make sure everyone has being abble to join the party
      bannerElement.innerText = "";
      seeker = getRandomPlayer(players);
      setStatusToSeek(seeker.id);
      startTimer();
      break;
    case GAMESET_HIDE:
      console.log(`Seek -> ${seeker.name}`);
      setStatusToSeek(seeker.id);
      startTimer();
      break;
    case GAMESET_SEEK:
      seeker = getRandomPlayer(players);
      console.log(`Hide! Next Seeker -> ${seeker.name}`);
      setStatusToHide(seeker.id);
      startTimer();
      break;
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
