function startGame() {
  bannerElement.innerText = "Waiting for everyone to join the game";
  // enableGameSetHostListener();
  play();
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
      bannerElement.innerText = "";
      seeker = getRandomPlayer(players);
      setStatusToHide(seeker.id);
      play();
      break;
    case GAMESET_HIDE:
      setStatusToSeek(seeker);
      play();
      break;
    case GAMESET_SEEK:
      seeker = getRandomPlayer(players);
      setStatusToHide(seeker.id);
      play();
      break;
    default:
      break;
  }
}

function play() {
  setTimeout(() => {
    runtime();
  }, roundTime);
}
