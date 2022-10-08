function placeCoin() {
    const { x, y } = getRandomSafeSpot();
    const coinRef = firebase.database().ref(`holes/${getKeyString(x, y)}`);
    coinRef.set({
        x,
        y,
    })

    const coinTimeouts = [2000, 3000, 4000, 5000];
    setTimeout(() => {
        placeCoin();
    }, randomFromArray(coinTimeouts));
}

function drillHole() {
    // const { x, y } = getRandomSpot();
    const x = 11
    const y = 10
    const key = getKeyString(x, y);

    const holeRef = firebase.database().ref(`holes/${key}`)
    holeRef.get().then((snapshot) => {
        if(snapshot.exists()) {
            console.log(snapshot.val())
        } else {
            console.log("Does not exists")
        }
    })
}


function attemptGrabCoin(x, y) {
    const key = getKeyString(x, y);
    if (coins[key]) {
      // Remove this key from data, then uptick Player's coin count
      firebase.database().ref(`holes/${key}`).remove();
      playerRef.update({
        coins: players[playerId].coins + 1,
      })
    }
}