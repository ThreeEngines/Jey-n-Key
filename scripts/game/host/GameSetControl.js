let round = 0;
function setStatusToWaitingRoom() {
  gamesetRef.set({
    status: GAMESET_LOBBY,
    seeker: "null",
    timer: "",
    rounds: round,
  });
}

function setStatusToLoading() {
  gamesetRef.set({
    status: GAMESET_LOADING,
    seeker: "null",
    timer: "",
    rounds: round,
  });
}

//nextSeekerId = player.id
function setStatusToHide(nextSeekerId) {
  gamesetRef.set({
    status: GAMESET_HIDE,
    seeker: nextSeekerId,
    timer: "",
    rounds: round++,
  });
}

//seekerId = player.id
function setStatusToSeek(seekerId) {
  gamesetRef.set({
    status: GAMESET_SEEK,
    seeker: seekerId,
    timer: "",
    rounds: round++,
  });
}

function setStatusToHunt(seekerId) {
  gamesetRef.set({
    status: GAMESET_HUNT,
    seeker: seekerId,
    timer: "",
    rounds: round++,
  });
}
