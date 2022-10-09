function game() {
  new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
  new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));
  new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
  new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));

  // ACTION KEYS
  new KeyPressListener("Enter", () => handleActionPress());
  // new KeyPressListener("Return", () => handleActionPress());

  const allPlayersRef = firebase.database().ref(`players`);
  const allHolesRef = firebase.database().ref(`holes`);

  allPlayersRef.on("value", (snapshot) => {
    //Fires whenever a change occurs
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
      const characterState = players[key];
      let el = playerElements[key];
      // Now update the DOM
      el.querySelector(".Character_name").innerText = characterState.name;
      el.setAttribute("data-color", characterState.color);
      el.setAttribute("data-direction", characterState.direction);
      const left = tileSize * characterState.x + "px";
      const top = tileSize * characterState.y - 4 + "px";
      el.style.transform = `translate3d(${left}, ${top}, 0)`;
    });
  });
  allPlayersRef.on("child_added", (snapshot) => {
    //Fires whenever a new node is added the tree
    const addedPlayer = snapshot.val();
    const characterElement = document.createElement("div");
    characterElement.classList.add("Character", "grid-cell");
    if (addedPlayer.id === playerId) {
      characterElement.classList.add("you");
    }
    characterElement.innerHTML = `
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div class="Character_name-container">
            <span class="Character_name"></span>
        </div>
        <div class="Character_you-arrow"></div>
    `;
    playerElements[addedPlayer.id] = characterElement;

    //Fill in some initial state
    characterElement.querySelector(".Character_name").innerText =
      addedPlayer.name;
    characterElement.setAttribute("data-color", addedPlayer.color);
    characterElement.setAttribute("data-direction", addedPlayer.direction);
    const left = 16 * addedPlayer.x + "px";
    const top = 16 * addedPlayer.y - 4 + "px";
    characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    gameContainer.appendChild(characterElement);
  });

  //Remove character DOM element after they leave
  allPlayersRef.on("child_removed", (snapshot) => {
    const removedKey = snapshot.val().id;
    gameContainer.removeChild(playerElements[removedKey]);
    delete playerElements[removedKey];
  });

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
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
        `;

    // Position the Element
    const left = tileSize * hole.x + "px";
    const top = tileSize * hole.y - 4 + "px";
    holeElement.style.transform = `translate3d(${left}, ${top}, 0)`;

    // Keep a reference for removal later and add to DOM
    holeElements[key] = holeElement;
    gameContainer.appendChild(holeElement);
  });
  allHolesRef.on("child_removed", (snapshot) => {
    const { x, y } = snapshot.val();
    const keyToRemove = getKeyString(x, y);
    gameContainer.removeChild(holeElements[keyToRemove]);
    delete holeElements[keyToRemove];
  });

  //Updates player name with text input
  playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value || createName();
    playerNameInput.value = newName;
    playerRef.update({
      name: newName,
    });
  });

  //Update player color on button click
  playerColorButton.addEventListener("click", () => {
    const mySkinIndex = playerColors.indexOf(players[playerId].color);
    const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
    playerRef.update({
      color: nextColor,
    });
  });

  //
  testButton.addEventListener("click", () => {
    drillHole();
  });
}
