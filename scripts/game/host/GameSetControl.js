let round = 0;
function setStatusToWaitingRoom() {
  gamesetStatus = GAMESET_LOBBY;
  gamesetRef.set({
    status: gamesetStatus,
    seeker: "null",
    timer: "",
    rounds: round,
  });
}

function setStatusToLoading() {
  gamesetStatus = GAMESET_LOADING;
  gamesetRef.set({
    status: gamesetStatus,
    seeker: "null",
    timer: "",
    rounds: round,
  });
}

//nextSeeker = player.id
function setStatusToHide(nextSeeker) {
  gamesetStatus = GAMESET_HIDE;
  gamesetRef.set({
    status: gamesetStatus,
    seeker: nextSeeker,
    timer: "",
    rounds: round++,
  });
}

//seeker = player.id
function setStatusToSeek(seeker) {
  gamesetStatus = GAMESET_SEEK;
  gamesetRef.set({
    status: gamesetStatus,
    seeker: seeker,
    timer: "",
    rounds: round++,
  });
}
