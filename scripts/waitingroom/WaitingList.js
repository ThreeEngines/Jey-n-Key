const header = document.getElementById("playersWaitingListHeader");
const list = document.getElementById("playersWaitingList");
const allPlayersRef = firebase.database().ref(`players`);

(function () {
  refreshWaitingList();
})();

function refreshWaitingList() {
  allPlayersRef.on("value", (snapshot) => {
    players = snapshot.val() || {};

    let listItems = "";
    let itemClass = "";
    let itemCount = 0;

    // <tr class="active-row">
    //     <td>img</td>
    //     <td>name</td>
    // </tr>
    Object.keys(players).forEach((key) => {
      itemClass = players[key].id == playerId ? "active-row you" : "list-item";
      itemCount++;
      listItems += `
                <tr id='${key}' class='${itemClass}'>
                    <td class="character-color-column">
                      <div class="character" data-color="${players[key].color}" >
                        <div class="character character-sprite grid-cell"></div>
                      </div>
                    </td>
                    <td class="character-name-column"><div class="character-name">${players[key].name}</div></td>
                </tr>
            `;
    });

    header.innerText = `Player name (${itemCount})`;
    list.innerHTML = listItems;
  });
}
