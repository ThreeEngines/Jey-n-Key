function enableKeyListeners() {
  // DIRECTIONAL KEYS
  new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
  new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));
  new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
  new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));
  // ACTION KEYS
  new KeyPressListener("Enter", () => handleActionPress());
  // new KeyPressListener("Return", () => handleActionPress());
}

const allHolesRef = firebase.database().ref(`holes`);
let hide = false;

function game() {
  allPlayersRef.on("value", (snapshot) => {
    //Fires whenever a change occurs
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      if (playerElements[key] != null) {
        const characterState = players[key];
        if (!characterState.online || !characterState.alive) {
          playerElements[key].classList.add("disconnected");
        } else {
          let innerHtml = playerElements[key].innerHTML;
          playerElements[key].innerHTML = innerHtml.replace(
            / disconnected/,
            ""
          );
        }
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
    if (playerId == removedKey) {
      swal({
        title: "Oooouch!",
        icon: "error",
        text: `You were caught by the Hawk, I'm sorry to say you that.\n
        But you can keep whatching from the clouds your buddies hidding.`,
        timer: roundTime * 1000,
      });
    }
    if (removedKey == playerId) disableControls();
    gameScene.removeChild(playerElements[removedKey]);
    delete playerElements[removedKey];
    disableControls();
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
    holes[key] = true;

    // Create the DOM Element
    const holeElement = document.createElement("div");
    holeElement.classList.add("Coin", "grid-cell");
    holeElement.innerHTML = `
      <div class="coin-shadow grid-cell"></div>
      <div class="coin-sprite grid-cell"></div>
    `;

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
  bannerElement.classList.add("arcade-seeker-banner");
  const left = tileSize * player.x - sleepHoleSize / 2 + 8 + "px";
  const top = tileSize * player.y - 5 - sleepHoleSize / 2 + "px";
  seekerElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  seekerElement.style.display = "block";
}

function awake() {
  Object.keys(holes).forEach((holeKey) => {
    if (holes[holeKey].hidden) {
      holes[holeKey].hidden.forEach((id) => {
        playerElements[id].classList.add("hide");
      });
    }
  });
  bannerElement.classList.remove("arcade-seeker-banner");
  seekerElement.style.display = "none";
}

function kickOut(seekerId) {
  playerElements[seekerId].classList.add("hide");

  firebase
    .database()
    .ref(`players/${GAMESET_GAMING}/${seekerId}`)
    .get()
    .then((snapshot) => {
      seeker = snapshot.val();
      let key = getKeyString(seeker.x, seeker.y);
      if (holes[key]) {
        holes[key].hidden.forEach((id) => {
          if (seekerId != id) {
            playerElements[id].classList.remove("hide");
            playerElements[id].classList.add("z-top");
            kill(id);
          }
        });
      } else {
        kill(seekerId);
      }
    })
    .then(() => {
      if (host) console.log("HOST ALERT");
    });
}

function kill(playerId) {
  let playerKilledRef = firebase
    .database()
    .ref(`players/${GAMESET_GAMING}/${playerId}`);
  playerKilledRef.update({
    alive: false,
  });
  databasePathExchange(playerKilledRef, GAMESET_WATCHING);
  delete players[playerId];
}

function unearth() {
  if (holes) {
    Object.keys(holes).forEach((key) => {
      if (holes[key].hidden) {
        holes[key].hidden.forEach((playerId) => {
          if (playerElements[playerId])
            playerElements[playerId].classList.remove("hide");
          // else => He gone to the base
        });
      }
    });
  }
}
