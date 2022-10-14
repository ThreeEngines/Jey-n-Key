let isEnabled = true;

class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keydownFunction = function (event) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyupFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };
    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}

function handleArrowPress(xChange = 0, yChange = 0) {
  if (isEnabled) {
    const x = players[playerId].x;
    const y = players[playerId].y;
    const newX = x + xChange;
    const newY = y + yChange;
    if (!isSolid(newX, newY)) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
        players[playerId].direction = "right";
      } else if (xChange === -1) {
        players[playerId].direction = "left";
      }
      playerRef.set(players[playerId]);
      attemptHole(x, y, newX, newY, playerId);
    }
  }
}

function handleActionPress() {
  console.log("ACTION PRESS");
  entryHole(players[playerId]);
}

function disableControls() {
  isEnabled = false;
}

function enableControls() {
  isEnabled = true;
}
