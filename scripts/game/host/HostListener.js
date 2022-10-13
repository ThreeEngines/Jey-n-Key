function allPlayersListener() {
  allPlayersRef.on("value", (snapshot) => {
    players = snapshot.val() || {};
  });
}
