function enableGameSetListener() {
  // Verify the gameset status
  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    let gameset = snapshot.val();
    gamesetStatus = gameset.status;
    switch (gamesetStatus) {
      case GAMESET_LOBBY:
        window.localStorage.setItem("playerId", playerId);
        window.localStorage.setItem("playerName", playerName);
        window.localStorage.setItem("playerColor", playerColor);
        location.href = `/views/waitingroom`;
        break;
      case GAMESET_LOADING:
        bannerElement.innerText = "Waiting for everyone to join the game";
        break;
      case GAMESET_HIDE:
        bannerElement.innerText = "Run and hide on a hole!";
        setTimeout(() => {
          bannerElement.innerText = "";
        }, 5000);
        if (gameset.seeker == playerId) {
          const left =
            tileSize * players[playerId].x - sleepHoleSize / 2 + 8 + "px";
          const top =
            tileSize * players[playerId].y - 5 - sleepHoleSize / 2 + "px";
          seekerElement.style.transform = `translate3d(${left}, ${top}, 0)`;
          seekerElement.style.display = "block";
          disableControls();
        } else {
          enableControls();
        }
        break;
      case GAMESET_SEEK:
        if (gameset.seeker == playerId) {
          seekerElement.style.display = "none";
          enableControls();
        } else {
          disableControls();
        }
        break;
      default:
    }
  });
}
