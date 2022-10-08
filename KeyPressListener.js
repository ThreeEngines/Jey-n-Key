class KeyPressListener {
   constructor(keyCode, callback) {
      let keySafe = true;
      this.keydownFunction = function(event) {
         if (event.code === keyCode) {
            if (keySafe) {
               keySafe = false;
               callback();
            }  
         }
      };
      this.keyupFunction = function(event) {
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

function handleArrowPress(xChange=0, yChange=0) {
   const newX = players[playerId].x + xChange;
   const newY = players[playerId].y + yChange;
   if (!isSolid(newX, newY)) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
         players[playerId].direction = "right";
      }
      if (xChange === -1) {
         players[playerId].direction = "left";
      }
      playerRef.set(players[playerId]);
     attemptGrabCoin(newX, newY);
   }
}