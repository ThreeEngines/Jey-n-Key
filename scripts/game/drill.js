function drillHoles(playerCount) {
  let drill = 1 + playerCount * Math.round((2 * playerCount) / 3);
  for (; drill > 0; drill--) {
    drillHole();
  }
}

function drillHole() {
  const { x, y } = getRandomSpot();
  const key = getKeyString(x, y);

  const holeRef = firebase.database().ref(`holes/${key}`);
  holeRef.get().then((snapshot) => {
    if (snapshot.exists()) {
    } else {
      holeRef.set({
        open: true,
        hidden: [],
        x,
        y,
      });
    }
  });
}

function entryHole(player) {
  const key = getKeyString(player.x, player.y);
  if (holes[key] && holes[key].hidden.includes(player.id)) {
    triggerRef.update({
      triggered: true,
      by: player.id,
    });
  }
}

function leaveHoles() {
  if (holes) {
    Object.keys(holes).forEach((key) => {
      firebase.database().ref(`holes/${key}`).update({ hidden: [] });
    });
  }
}

function attemptHole(x, y, newX, newY, id) {
  const leftKey = getKeyString(x, y);
  const joinKey = getKeyString(newX, newY);
  if (holes[leftKey]) {
    const holeRef = firebase.database().ref(`holes/${leftKey}`);
    holeRef.get().then((snapshot) => {
      let hole = snapshot.val();
      if (hole?.hidden?.includes(id)) {
        hole.hidden.splice(hole.hidden.indexOf(id), 1);
        holeRef.update({
          hidden: hole.hidden,
        });
        firebase.database().ref(`players/${GAMESET_GAMING}/${id}`).update({
          hole: "",
        });
      }
    });
  } else if (holes[joinKey] && holes[joinKey].open) {
    const holeRef = firebase.database().ref(`holes/${joinKey}`);
    holeRef.get().then((snapshot) => {
      let hole = snapshot.val();
      if (hole.hidden && !hole.hidden.includes(id)) {
        hole.hidden[hole.hidden?.length || 0] = id;
      } else {
        hole.hidden = [];
        hole.hidden[0] = id;
      }
      holeRef.update({
        hidden: hole.hidden,
      });

      firebase.database().ref(`players/${GAMESET_GAMING}/${id}`).update({
        hole: joinKey,
      });
    });
  }
}
