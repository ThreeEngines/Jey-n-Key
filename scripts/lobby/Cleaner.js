function scheduleOfflinePlayerRemoval() {
  allPlayersOnLobbyRef.get().then((snapshot) => {
    let players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      secondChange(players[key], key);
    });
  });

  allPlayersOnLobbyRef.on("child_changed", (player) => {
    secondChange(player.val(), player.val().id);
  });
}
function secondChange(player, key) {
  if (player.online == false) {
    setTimeout(function () {
      const childRef = firebase
        .database()
        .ref(`players/${GAMESET_LOBBY}/${key}`);
      childRef.get().then((snapshot) => {
        !snapshot.val()?.online ? childRef.remove() : null;
      });
    }, garbageCollectorTime * 1000);
  }
}

function removeOlderHosts() {
  let playersRef = firebase.database().ref(`players`);
  playersRef.get().then((snapshot) => {
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      if (players[key].role == adminRole && players[key].id != playerId) {
        firebase.database().ref(`players/${key}`).remove();
        delete players[key];
      } else if (players[key].online == false) {
        setTimeout(function () {
          const childRef = firebase.database().ref(`players/${key}`);
          childRef.get().then((snapshot) => {
            snapshot.val().online == false ? childRef.remove() : null;
          });
        }, 2000);
      }
    });
  });
}
