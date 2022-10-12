(function () {
  const allPlayersRef = firebase.database().ref(`players`);
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
})();
