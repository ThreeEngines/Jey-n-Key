// S-px
const tileSize = 16;
const height = 208;
const width = 240;
const QRCodeHeight = 300;
const QRCodeWidth = 300;

const mapData = {
  minX: 0,
  maxX: width / tileSize,
  minY: 0,
  maxY: height / tileSize,
  blockedSpaces: {},
};

// Options for Player Colors... these are in the same order as our sprite sheet
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];
const prefixName = randomFromArray(["COOL", "SUPER", "SOFT", "BUFF", "DOPE"]);

let playerId;
let playerRef;
let players = {};

let playerElements = {};
let holeElements = {};
let holes = {};

const gameContainer = document.querySelector(".game-container");
const playerNameInput = document.querySelector("#player-name");
const playerColorButton = document.querySelector("#player-color");
const testButton = document.querySelector("#player-test");
