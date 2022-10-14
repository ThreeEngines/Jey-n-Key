const header = document.getElementById("playersWaitingListHeader");
const list = document.getElementById("playersWaitingList");
// Need to call this function due to
// start the listeners to watch the database
// (function () {
//   refreshWaitingList();
// })();

let itemClass = "";
let itemCount = 0;

function refreshWaitingList() {
  setTimeout(() => {
    // Listener for any new player
    allPlayersOnLobbyRef.on("child_added", (snapshot) => {
      player = snapshot.val() || {};
      createPlayerRow(player);
    });

    // Listener for any player left
    allPlayersOnLobbyRef.on("child_removed", (snapshot) => {
      player = snapshot.val() || {};
      const removedChild = document.getElementById(player?.id);
      if (isDefined(removedChild)) {
        itemCount--;
        removedChild.innerHTML = "";
        removedChild.remove();
        header.innerText = `Player name (${itemCount})`;
      }
    });

    // Listener for any player change
    allPlayersOnLobbyRef.on("child_changed", (snapshot) => {
      player = snapshot.val() || {};
      updatePlayerRow(player);
    });
  }, 600);
  disableLoader();
}

function createPlayerRow(player) {
  if (isDefined(player)) {
    itemClass = player.id == playerId ? "active-row you" : "list-item";
    itemCount++;
    header.innerText = `Player name (${itemCount})`;
    list.innerHTML += `<tr id='${player.id}' class='${itemClass}'></tr>`;
    updatePlayerRow(player);
  }
}

function updatePlayerRow(player) {
  let online = player.online ? "" : " disconnected";
  const updatedChild = document.getElementById(player.id);
  if (isDefined(updatedChild))
    updatedChild.innerHTML = `
          <td class="character-color-column">
            <div class="character" data-color="${player.color}" >
              <div class="character character-sprite grid-cell"></div>
            </div>
          </td>
          <td class="character-name-column"><div class="character-name${online}">${player.name}</div></td>
        `;
}

// This method was refactored since it refresh all table on each database change;
// It is being keeped here to further consults. Soon will be removed.
//
// allPlayersRef.on("value", (snapshot) => {
//   players = snapshot.val() || {};

//   // <tr class="active-row">
//   //     <td>img</td>
//   //     <td>name</td>
//   // </tr>
//   Object.keys(players).forEach((key) => {
//     itemClass = players[key].id == playerId ? "active-row you" : "list-item";
//     if (players[key].role !== "HOST") {
//       itemCount++;
//       listItems += `
//               <tr id='${key}' class='${itemClass}'>
//                   <td class="character-color-column">
//                     <div class="character" data-color="${players[key].color}" >
//                       <div class="character character-sprite grid-cell"></div>
//                     </div>
//                   </td>
//                   <td class="character-name-column"><div class="character-name">${players[key].name}</div></td>
//               </tr>
//           `;
//     }
//   });

//   header.innerText = `Player name (${itemCount})`;
//   list.innerHTML = listItems;
//   disableLoader();
// });
