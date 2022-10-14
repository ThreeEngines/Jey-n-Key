(function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //You're logged in!
      allPlayersOnLobbyRef = firebase
        .database()
        .ref(`players/${GAMESET_LOBBY}`);

      playerId = urlParam("playerId");
      if (!isDefined(playerId)) {
        playerId = user.uid;
        setUrlParams(`playerId=${playerId}`);
      }

      playerRef = firebase.database().ref(`players/${playerId}`);
      gamesetRef = firebase.database().ref(`gameset`);
      createHost();

      scheduleOfflinePlayerRemoval(allPlayersOnLobbyRef);
      cleanDatabaseReferencePath(GAMESET_WATCHING);
      cleanDatabaseReferencePath(GAMESET_GAMING);
      cleanDatabaseHolesRef();
      removeOlderHosts();
      setStatusToWaitingRoom();
      refreshWaitingList();
      disableLoader();

      //Set to offline while changing windows or disconnecting.
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
