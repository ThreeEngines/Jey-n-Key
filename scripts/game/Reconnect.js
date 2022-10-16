const hostElement = document.getElementById("hostcontrols-component");
const dpadElement = document.getElementById("dpad-component");
const timerElement = document.getElementById("timer");

(function () {
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //You're logged in!
        allPlayersRef = firebase.database().ref(`players/${GAMESET_GAMING}`);
        triggerRef = firebase.database().ref(`gameset/trigger`);
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
          if (isDefined(snapshot.val()?.id)) {
            pulse(playerRef);
            hostElement.classList.add("hide");
            host = false;
            playerName = snapshot.val().name;
            playerColor = snapshot.val().color;
            enableKeyListeners();
            playerRef.onDisconnect().update({
              online: false,
            });
            enableGameSetListener();
          } else {
            // Or is it the host?
            playerRef = firebase.database().ref(`players/${playerId}`);
            playerRef.get().then((snapshot) => {
              if (isDefined(snapshot.val()?.id)) {
                pulse(playerRef);
                dpadElement.classList.add("hide");
                host = true;
                scheduleOfflinePlayerRemoval(allPlayersRef);
                allPlayersListener();
                triggerListener();
                drillHoles();
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
    console.log(error);
  }
})();

function pulse(ref) {
  ref.update({
    online: true,
    alive: true,
  });
}
