function scheduleOfflinePlayerRemoval() {
  allPlayersRef.on("child_changed", (player) => {
    if (player.val().online == false) {
      setTimeout(function () {
        const childRef = firebase.database().ref(`players/${player.val().id}`);
        childRef.get().then((snapshot) => {
          snapshot.val().online == false ? childRef.remove() : null;
        });
      }, 5000);
    }
  });
}

function removeOlderHosts() {
  allPlayersRef.get().then((snapshot) => {
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
