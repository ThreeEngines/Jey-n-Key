(function () {
  firebase.auth().onAuthStateChanged((user) => {
    // console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        online: true,
        name,
        direction: "right",
        color: randomFromArray(playerColors),
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
