function databasePathExchange(objectRef, to) {
  var toRef = firebase.database().ref(`players/${to}/${playerId}`);
  objectRef.get().then((snapshot) => {
    toRef.set(snapshot.val());
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
