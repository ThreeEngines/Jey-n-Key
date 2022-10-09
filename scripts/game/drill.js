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
      console.log(snapshot.val());
    } else {
      holeRef.set({
        isOpen: true,
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
  if (holes[key]) {
    firebase.database().ref(`holes/${key}`).remove();
  }
}

function attemptHole(x, y) {
  const key = getKeyString(x, y);
  if (holes[key]) {
    // Remove this key from data, then uptick Player's coin count
    // playerRef.update({
    //   coins: players[playerId].coins + 1,
    // });
  }
}
