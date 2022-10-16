let round = 0;

function setStatus(gamesetStatus, seekerId) {
  if (
    ((gamesetStatus == GAMESET_LOBBY || gamesetStatus == GAMESET_LOADING) &&
      !gamesetStatus.toUpperCase().includes("CONTROLS")) ||
    seekerId === undefined
  ) {
    seekerId = "null";
  } else {
    round++;
  }

  gamesetRef.set({
    status: gamesetStatus,
    seeker: seekerId,
    timer: "",
    rounds: round,
  });
}
