(function () {
  firebase.auth().onAuthStateChanged((user) => {
    // console.log(user)
    if (user) {
      //You're logged in!
      playerId = window.localStorage.getItem("playerId");
      if (playerId == null) {
        swal({
          title: "How can I say that?...",
          icon: "error",
          text: "You can't join this game. It is already started. Please, take a set and relax, the next set will start soon.",
        });
        location.href = `/views/waitingroom`;
      }

      playerRef = firebase.database().ref(`players/${playerId}`);
      allPlayersRef = firebase.database().ref(`players`);
      allPlayersRef.get().then((snapshot) => {
        players = snapshot.val() || {};
      });

      playerRef.update({
        online: true,
      });

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();
      window.localStorage.removeItem("playerId");

      game();
    } else {
      //You're logged out.
    }
  });
})();
