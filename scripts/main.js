(function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //You're logged in!
      playerId = window.localStorage.getItem("playerId");
      playerName = window.localStorage.getItem("playerName");
      playerColor = window.localStorage.getItem("playerColor");
      allPlayersRef = firebase.database().ref(`players`);

      if (isDefined(playerId)) playerId = user.uid;
      if (isDefined(playerName)) playerName = createName();
      if (isDefined(playerColor)) playerColor = randomFromArray(playerColors);

      playerRef = firebase.database().ref(`players/${playerId}`);
      playerNameInput.value = playerName;

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        online: true,
        alive: false,
        role: "HIDE",
        place: GAMESET_LOBBY,
        name: playerName,
        direction: "right",
        color: playerColor,
        x,
        y,
      });

      window.localStorage.setItem("playerId", playerId);

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

function isDefined(param) {
  return (
    param == "" ||
    param == "null" ||
    param == "undefined" ||
    param == null ||
    param == undefined
  );
}
