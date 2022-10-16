function enableGameSetListener() {
  // Verify the gameset status
  const gamesetRef = firebase.database().ref(`gameset`);
  gamesetRef.on("value", (snapshot) => {
    let gameset = snapshot.val();
    gamesetStatus = gameset.status;

    console.log(`Currently on ${gamesetStatus}`);
    switch (gamesetStatus) {
      case GAMESET_LOBBY:
        if (players[playerId]) {
          playerRef = databasePathExchange(playerRef, playerId, GAMESET_LOBBY);
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
          if (playerRef)
            playerRef = databasePathExchange(
              playerRef,
              playerId,
              GAMESET_LOBBY
            );
          location.href = `/views/waitingroom?playerId=${playerId}`;
        }
        break;

      case GAMESET_LOADING:
        bannerElement.innerText = "The round is about to start!";
        enableControls();
        break;
      case GAMESET_HIDE:
        goBackInsideTheHoleIfDidntMoved(playerId);
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
        hideFromSeeker(gameset.seeker);
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
        bannerElement.innerText = "Take care! The Hawk is hunting!";
        // getUncoveredMoles(gameset.seeker);
        kickOut(gameset.seeker);
        break;
      case GAMESET_PREPARING:
        unearth();
        break;
      default:
    }
  });
}
