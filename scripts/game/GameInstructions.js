function enableKeyListeners() {
  // DIRECTIONAL KEYS
  new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
  new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));
  new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
  new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));
  // ACTION KEYS
  new KeyPressListener("Enter", () => handleActionPress());
  new KeyPressListener("Return", () => handleActionPress());
}

const allHolesRef = firebase.database().ref(`holes`);

function game() {
  allPlayersRef.on("value", (snapshot) => {
    //Fires whenever a change occurs
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      if (playerElements[key] != null) {
        const characterState = players[key];
        let innerHtml = playerElements[key].innerHTML;
        if (!characterState.online || !characterState.alive) {
          innerHtml = innerHtml.replace(
            /character-name-container/,
            "character-name-container disconnected"
          );
          appendElement(
            key,
            "hawk",
            ["hawk-sprite", "grid-cell", "character"],
            -tileSize
          );
        } else {
          innerHtml = innerHtml.replace(/ disconnected/, "");
          removeElement(`${key}-hawk`);
        }
        playerElements[key].innerHTML = innerHtml;
        let el = playerElements[key];
        el.setAttribute("data-color", characterState.color);
        el.setAttribute("data-direction", characterState.direction);
        const left = tileSize * characterState.x + "px";
        const top = tileSize * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      }
    });
  });
  allPlayersRef.on("child_added", (snapshot) => {
    //Fires whenever a new node is added the tree
    const addedPlayer = snapshot.val();
    const characterElement = document.createElement("div");
    characterElement.setAttribute("id", `${addedPlayer.id}`);
    characterElement.classList.add("character", "grid-cell");
    let nameContainer = addedPlayer.online
      ? "character-name-container"
      : "character-name-container disconnected";
    if (addedPlayer.id === playerId) {
      characterElement.classList.add("you");
    }
    characterElement.innerHTML = `
        <div class="character-shadow grid-cell"></div>
        <div class="character-sprite grid-cell"></div>
        <div class="${nameContainer}">
            <span class="character-name"></span>
        </div>
        <div class="character-you-arrow"></div>
    `;
    playerElements[addedPlayer.id] = characterElement;

    //Fill in some initial state
    characterElement.querySelector(".character-name").innerText =
      addedPlayer.name;
    characterElement.setAttribute("data-color", addedPlayer.color);
    characterElement.setAttribute("data-direction", addedPlayer.direction);
    const left = tileSize * addedPlayer.x + "px";
    const top = tileSize * addedPlayer.y - 4 + "px";
    characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    gameScene.appendChild(characterElement);
  });

  //Remove character DOM element after they leave
  allPlayersRef.on("child_removed", (snapshot) => {
    const removedKey = snapshot.val().id;
    removeElement(`${removedKey}-hawk`);
    if (isDefined(gamesetStatus) && gamesetStatus != GAMESET_LOBBY) {
      if (playerId == removedKey) {
        removeElement(`${removedKey}-arrow`);
        dpadElement.classList.add("hide");
        document.querySelector(":root").style += `linear-gradient(
            180deg,
            #F5F5F5 -50%,
            #888888 69.71%,
            #101010 150%
          );`;
        swal({
          title: "Oooouch!",
          icon: "error",
          text: `You were caught by the Hawk, I'm sorry to say you that.\n
        But you can keep whatching from the clouds your buddies hidding.`,
          timer: roundTime * 1000,
        });
        disableControls();
      }
    }
    if (playerElements[removedKey]) {
      gameScene.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    }
  });

  /* HOLES */

  //New - not in the video!
  //This block will remove coins from local state when Firebase `coins` value updates
  allHolesRef.on("value", (snapshot) => {
    holes = snapshot.val() || {};
  });

  allHolesRef.on("child_added", (snapshot) => {
    const hole = snapshot.val();
    const key = getKeyString(hole.x, hole.y);
    // holes[key];

    // Create the DOM Element
    const holeElement = document.createElement("div");
    holeElement.classList.add("hole", "grid-cell");
    let holeComponent = hole.open
      ? `<div id="${key}" class="hole-sprite grid-cell"></div>`
      : `<div id="${key}" class="hole-closed grid-cell"></div>`;
    holeElement.innerHTML = holeComponent;

    // Position the Element
    const left = tileSize * hole.x + "px";
    const top = tileSize * hole.y - 4 + "px";
    holeElement.style.transform = `translate3d(${left}, ${top}, 0)`;

    // Keep a reference for removal later and add to DOM
    holeElements[key] = holeElement;
    gameScene.appendChild(holeElement);
  });

  allHolesRef.on("child_changed", (snapshot) => {
    const hole = snapshot.val();
    const key = getKeyString(hole.x, hole.y);

    const holeElement = document.getElementById(`${key}`);
    holeElement.classList.add("hole", "grid-cell");
    if (hole.open) {
      holeElement.classList.remove("hole-closed");
      holeElement.classList.add("hole-open");
    } else {
      holeElement.classList.remove("hole-open");
      holeElement.classList.add("hole-closed");
    }

    // Position the Element
    const left = tileSize * hole.x + "px";
    const top = tileSize * hole.y - 4 + "px";
    holeElement.style.transform = `translate3d(${left}, ${top}, 0)`;

    // Keep a reference for removal later and add to DOM
    holeElements[key] = holeElement;
    gameScene.appendChild(holeElement);
  });

  allHolesRef.on("child_removed", (snapshot) => {
    const { x, y } = snapshot.val();
    const keyToRemove = getKeyString(x, y);
    gameScene.removeChild(holeElements[keyToRemove]);
    delete holeElements[keyToRemove];
  });

  disableLoader();
}

function sleep(player) {
  darkMode();
  const left = tileSize * player.x - sleepHoleSize / 2 + 8 + "px";
  const top = tileSize * player.y - 5 - sleepHoleSize / 2 + "px";
  seekerElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  seekerElement.style.display = "block";
}

function hideFromSeeker(seekerId) {
  Object.keys(holes).forEach((holeKey) => {
    if (holes[holeKey].hidden) {
      holes[holeKey].hidden.forEach((id) => {
        if (id != seekerId) hide(id);
      });
    }
  });
  lightMode();
  seekerElement.style.display = "none";
}

function kickOut(seekerId) {
  firebase
    .database()
    .ref(`players/${GAMESET_GAMING}/${seekerId}`)
    .get()
    .then((snapshot) => {
      seeker = snapshot.val();
      let key = getKeyString(seeker.x, seeker.y);
      // It is a valid hole
      // Seeker -> hide
      // Kill forall on the hole
      if (holes[key]) {
        if (host)
          firebase.database().ref(`holes/${key}`).update({ open: false });
        hide(seekerId);
        if (holes[key].hidden) {
          holes[key].hidden.forEach((id) => {
            if (seekerId != id) {
              show(id);
              if (host) kill(id);
            }
          });
        }
      } else {
        // Seeker has not able to hide
        if (host) kill(seekerId);
      }
    });
}

function getUncoveredMoles() {
  Object.keys(players).forEach((id) => {
    if (!holes[getKeyString(players[id].x, players[id].y)]) {
      if (players[id].alive) kill(id);
    }
  });
}

function kill(id) {
  let killedPlayerRef = firebase
    .database()
    .ref(`players/${GAMESET_GAMING}/${id}`);

  if (players[id] && players[id].alive)
    killedPlayerRef.update({
      alive: false,
    });

  deadBodiesOnTheField[deadBodiesOnTheField.length || 0] = {
    id: id,
    ref: killedPlayerRef,
  };
  if (players[id]) delete players[id];
}

function cleanDeadBodiesFromTheField() {
  Object.keys(deadBodiesOnTheField).forEach((key) => {
    let killedId = deadBodiesOnTheField[key].id;
    databasePathExchange(
      deadBodiesOnTheField[key].ref,
      killedId,
      GAMESET_WATCHING
    );
    if (playerElements[killedId]) {
      gameScene.removeChild(playerElements[killedId]);
      delete playerElements[killedId];
    }
  });
  deadBodiesOnTheField = {};
}

function unearth() {
  if (holes) {
    Object.keys(holes).forEach((key) => {
      if (holes[key].hidden) {
        holes[key].hidden.forEach((playerId) => {
          if (playerElements[playerId]) show(playerId);
          // else => He gone to the base
        });
      }
    });
  }
}

function darkMode() {
  timerElement.classList.add("arcade-seeker-banner");
  bannerElement.classList.add("arcade-seeker-banner");
}

function lightMode() {
  bannerElement.classList.remove("arcade-seeker-banner");
  timerElement.classList.remove("arcade-seeker-banner");
}

function goBackInsideTheHoleIfDidntMoved(playerId) {
  let player = players[playerId];
  if (player) attemptHole(undefined, undefined, player.x, player.y, playerId);
}

function hide(id) {
  playerElements[id].classList.add("hide");
  if (id == playerId) {
    appendElement(
      id,
      "arrow",
      ["character-you-arrow", "grid-cell", "you", "character"],
      tileSize + tileSize / 2
    );
  }
}

function show(id) {
  playerElements[id].classList.remove("hide");
  if (id == playerId) {
    removeElement(`${id}-arrow`);
  }
}

function removeElement(elementId) {
  const detach = document.getElementById(elementId);
  if (detach) detach.remove();
}
function appendElement(onId, element, classList, yDistance, attributes) {
  const affix = document.createElement("div");
  const transform = playerElements[onId].style.transform;
  const x = transform.replace(/translate3d\(|px, -?(\d+)px, -?(\d+)px\)/g, "");
  const y = transform.replace(/translate3d\(-?(\d+)px, |px, -?(\d+)px\)/g, "");
  affix.style = `
      transform: translate3d(${x}px, ${parseInt(y) + yDistance}px, 0px);
      display: unset;
    `;
  affix.classList.add(...classList);
  affix.setAttribute("id", `${onId}-${element}`);
  if (isDefined(attributes)) {
    Object.keys(attributes).forEach((key) => {
      affix.setAttribute(key, attributes[key]);
    });
  }
  playerElements[onId].parentElement.appendChild(affix);
}
