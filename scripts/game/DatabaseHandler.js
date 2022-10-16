function databasePathExchange(objectRef, id, to) {
  var toRef = firebase.database().ref(`players/${to}/${id}`);
  objectRef.get().then((snapshot) => {
    player = snapshot.val();
    player.place = to;
    toRef.set(player);
    objectRef.remove();
  });

  objectRef.onDisconnect().cancel();
  toRef.onDisconnect().update({
    online: false,
  });

  setTimeout(() => {
    return toRef;
  }, 500);
}
