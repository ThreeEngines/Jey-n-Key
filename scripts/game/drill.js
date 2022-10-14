function placeCoin() {
  const { x, y } = getRandomSafeSpot();
  const holesRef = firebase.database().ref(`holes/${getKeyString(x, y)}`);
  holesRef.set({
    x,
    y,
  });

  const holesTimeouts = [2000, 3000, 4000, 5000];
  setTimeout(() => {
    placeCoin();
  }, randomFromArray(holesTimeouts));
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

function closeHole(x, y) {
  const key = getKeyString(x, y);
  const holeRef = firebase.database().ref(`holes/${key}`);
  holeRef.update({
    isOpen: false,
  });
}

function deleteHole(x, y) {
  const key = getKeyString(x, y);
  if (holes[key].open) {
    firebase.database().ref(`holes/${key}`).remove();
  }
}

function attemptHole(x, y, newX, newY, playerId) {
  const leftKey = getKeyString(x, y);
  const joinKey = getKeyString(newX, newY);
  if (holes[leftKey]) {
    const holeRef = firebase.database().ref(`holes/${leftKey}`);
    holeRef.get().then((snapshot) => {
      let hole = snapshot.val();
      if (hole?.hidden?.includes(playerId)) {
        hole.hidden.splice(hole.hidden.indexOf(playerId), 1);
        holeRef.update({
          hidden: hole.hidden,
        });
      }
    });
  } else if (holes[joinKey] && holes[joinKey].open) {
    const holeRef = firebase.database().ref(`holes/${joinKey}`);
    holeRef.get().then((snapshot) => {
      let hole = snapshot.val();
      if (hole.hidden) {
        hole.hidden[hole.hidden?.length || 0] = playerId;
      } else {
        hole.hidden = [];
        hole.hidden[0] = playerId;
      }
      holeRef.update({
        hidden: hole.hidden,
      });
    });
  }
}
