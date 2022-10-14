function enableGameSetListener() {
  // Verify the gameset status
  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    let gameset = snapshot.val();
    gamesetStatus = gameset.status;
    switch (gamesetStatus) {
      case GAMESET_LOBBY:
        if (players[playerId]) {
          playerRef = databasePathExchange(playerRef, GAMESET_LOBBY);
          swal({
            title: "CONGRATULATION!",
            icon: "success",
            text: `YOU SURVIVED THIS CRUEL HAWK FOR ${gameset.rounds} ROUNDS.\n
          But at which coast?\n\n
          Relax, you are going back to the waiting room again.`,
            timer: swalRedirectTimer * 1000,
          }).then(function () {
            location.href = `/views/waitingroom?playerId=${playerId}`;
          });
        } else {
          playerRef = databasePathExchange(playerRef, GAMESET_LOBBY);
          location.href = `/views/waitingroom?playerId=${playerId}`;
        }
        break;
      case GAMESET_LOADING:
        bannerElement.innerText = "The round is about to start!";
        enableControls();
        unearth();
        break;
      case GAMESET_HIDE:
        leaveHoles();
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
        seekHide(gameset.seeker);
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
        getUncoveredMoles(gameset.seeker);
        kickOut(gameset.seeker);
        break;
      default:
    }
  });
}
