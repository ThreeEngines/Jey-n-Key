(function () {
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //You're logged in!
        allPlayersRef = firebase.database().ref(`players/${GAMESET_GAMING}`);
        gamesetRef = firebase.database().ref(`gameset`);
        gamesetRef.get().then((snapshot) => {
          gamesetStatus = snapshot.val().status;
          seeker = snapshot.val().seeker;
        });

        playerId = urlParam("playerId");
        playerRef = firebase
          .database()
          .ref(`players/${GAMESET_GAMING}/${playerId}`);
        // The player exists?
        playerRef.get().then((snapshot) => {
          if (snapshot.exists()) {
            pulse(playerRef);
            host = false;
            playerName = snapshot.val().name;
            playerColor = snapshot.val().color;
            enableDPAD();
            enableKeyListeners();
            playerRef.onDisconnect().update({
              online: false,
            });
            enableGameSetListener();
          } else {
            // Or is it the host?
            playerRef = firebase.database().ref(`players/${playerId}`);
            playerRef.get().then((snapshot) => {
              if (snapshot.exists()) {
                pulse(playerRef);
                host = true;
                scheduleOfflinePlayerRemoval(allPlayersRef);
                allPlayersListener();
                enableHostControls();
                startGame();
              } else {
                // If it is not a player or the host, go back to the lobby.
                swal({
                  title: "How can I say that?...",
                  icon: "error",
                  text: `You can't join this game. It is already started. Please, take a set and relax, the next set will start soon.
                      \nYou'll be redirected in ${swalRedirectTimer} seconds.`,
                  timer: swalRedirectTimer * 1000,
                }).then(function () {
                  location.href = `/views/waitingroom`;
                });
              }
            });
          }
        });

        allPlayersRef.get().then((snapshot) => {
          players = snapshot.val() || {};
        });

        //Load timeout before start the game board
        setTimeout(() => {
          game();
        }, 3000);
      } else {
        //You're logged out.
      }
    });
  } catch (error) {
    console.log("Eu vou te achar, erro maldito.");
    console.log(error);
  }
})();

function pulse(ref) {
  ref.update({
    online: true,
    alive: true,
  });
}
