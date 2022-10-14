function enableGameSetListener() {
  // Verify the gameset status
  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    let gameset = snapshot.val();
    gamesetStatus = gameset.status;
    switch (gamesetStatus) {
      case GAMESET_LOBBY:
        playerRef = databasePathExchange(playerRef, GAMESET_LOBBY);
        location.href = `/views/waitingroom?playerId=${playerId}`;
        break;
      case GAMESET_LOADING:
        bannerElement.innerText = "Waiting for everyone to join the game";
        break;
      case GAMESET_HIDE:
        unearth();
        if (gameset.seeker == playerId) {
          bannerElement.innerText = "Seems that you're sleepy";
          sleep(players[playerId]);
          disableControls();
        } else {
          bannerElement.innerText = "Run and hide on a hole!";
          enableControls();
        }
        break;
      case GAMESET_SEEK:
        awake();
        bannerElement.innerText =
          "Stay steel. Do not call the atention of the Hawk!";
        if (gameset.seeker == playerId) {
          bannerElement.innerText = `You finally awake,
          Hide before the Hawk catch you!`;
          enableControls();
        } else {
          disableControls();
        }
        break;
      case GAMESET_HUNT:
        disableControls();
        bannerElement.innerText = "HUNTING TIME!";
        kickOut(gameset.seeker);
        break;
      default:
    }
  });
}
