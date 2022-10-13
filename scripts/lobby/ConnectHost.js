(function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //You're logged in!
      allPlayersRef = firebase.database().ref(`players`);

      playerId = window.localStorage.getItem("playerId");
      if (playerId == null) playerId = user.uid;

      playerRef = firebase.database().ref(`players/${playerId}`);
      gamesetRef = firebase.database().ref(`gameset`);
      createHost();

      window.localStorage.setItem("playerId", playerId);
      scheduleOfflinePlayerRemoval();
      removeOlderHosts();
      setStatusToWaitingRoom();
      refreshWaitingList();
      disableLoader();

      //Remove me from Firebase when I diconnect
      //playerRef.onDisconnect().remove();
      playerRef.onDisconnect().update({
        online: false,
      });
    } else {
      //You're logged out.
    }
  });
})();

function createHost() {
  playerRef.set({
    id: playerId,
    role: adminRole,
    online: true,
  });
}
