(function () {
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //You're logged in!
        // playerId = window.localStorage.getItem("playerId");
        // playerName = window.localStorage.getItem("playerName");
        // playerColor = window.localStorage.getItem("playerColor");
        allPlayersOnLobbyRef = firebase
          .database()
          .ref(`players/${GAMESET_LOBBY}`);

        playerId = urlParam("playerId");
        if (!isDefined(playerId)) {
          playerId = `${user.uid + Date.now()}`;
          setUrlParams(`playerId=${playerId}`);
        }
        playerRef = firebase
          .database()
          .ref(`players/${GAMESET_LOBBY}/${playerId}`);

        const { x, y } = getRandomSafeSpot();
        playerRef
          .get()
          .then((snapshot) => {
            if (isDefined(snapshot.val()?.id)) {
              let player = snapshot.val();
              playerName = player.name;
              playerColor = player.color;
              playerRef.update({
                online: true,
                x,
                y,
              });
            } else {
              if (!isDefined(playerName)) playerName = createName();
              if (!isDefined(playerColor))
                playerColor = randomFromArray(playerColors);
              playerRef.set({
                id: playerId,
                online: true,
                role: "HIDE",
                name: playerName,
                direction: "right",
                color: playerColor,
                place: GAMESET_LOBBY,
                x,
                y,
              });
            }
          })
          .then(() => {
            playerNameInput.value = playerName;
            refreshWaitingList();
            disableLoader();
          });

        //Set to offline while changing windows or disconnecting.
        playerRef.onDisconnect().remove();
      } else {
        //You're logged out.
      }
    });
  } catch (error) {
    console.log("error");
  }
})();
