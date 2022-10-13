(function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //You're logged in!
      allPlayersRef = firebase.database().ref(`players`);
      playerId = window.localStorage.getItem("playerId");

      playerRef = firebase.database().ref(`players/${playerId}`);
      gamesetRef = firebase.database().ref(`gameset`);
      gamesetRef.get().then((snapshot) => {
        gamesetStatus = snapshot.val().status
      })
      playerRef.get().then((snapshot) => {
        if (snapshot.exists()) {
          playerRef.update({
            place: GAMESET_GAMING,
            online: true,
            alive: true,
          });

          playerName = snapshot.val().name;
          playerColor = snapshot.val().color;
          if (snapshot.val().role === adminRole) {
            allPlayersListener();
            enableHostControls();
            startGame();
          } else {
            enableDPAD();
            enableKeyListeners();
            window.localStorage.removeItem("playerId");
            window.localStorage.removeItem("playerName");
            //Remove me from Firebase when I diconnect
            playerRef.onDisconnect().remove();
            enableGameSetListener();
          }
        } else {
          swal({
            title: "How can I say that?...",
            icon: "error",
            text: "You can't join this game. It is already started. Please, take a set and relax, the next set will start soon.",
          }).then(function () {
            location.href = `/views/waitingroom`;
          });
        }
      });
      setTimeout(() => {
        game();
      }, 3000);
    } else {
      //You're logged out.
    }
  });
})();
