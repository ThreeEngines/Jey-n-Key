function scheduleOfflinePlayerRemoval(reference) {
  reference.get().then((snapshot) => {
    let players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      secondChange(players[key], key);
    });
  });

  reference.on("child_changed", (player) => {
    secondChange(player.val(), player.val().id);
  });
}

function secondChange(player, key) {
  if (player.online == false) {
    const childRef = firebase.database().ref(`players/${GAMESET_LOBBY}/${key}`);
    setTimeout(() => {
      childRef.get().then((snapshot) => {
        if (!snapshot.val()?.online) childRef.remove();
      });
    }, garbageCollectorTime * 1000);
  } else if (!isDefined(player?.id)) {
    const removedChild = document.getElementById("undefined");
    if (isDefined(removedChild)) {
      itemCount--;
      removedChild.innerHTML = "";
      removedChild.remove();
      header.innerText = `Player name (${itemCount})`;
    }
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

function cleanDatabaseReferencePath(referencePath) {
  let reference = firebase.database().ref(`players/${referencePath}`);
  reference.get().then((snapshot) => {
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      firebase.database().ref(`players/${referencePath}/${key}`).remove();
    });
  });
}

function cleanDatabaseHolesRef() {
  let reference = firebase.database().ref(`holes`);
  reference.get().then((snapshot) => {
    holes = snapshot.val() || {};
    Object.keys(holes).forEach((key) => {
      firebase.database().ref(`holes/${key}`).remove();
    });
  });
}
