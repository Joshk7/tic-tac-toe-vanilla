const newGameMenu = document.getElementById("new-game-menu");
const toggleX = document.getElementById("toggle-x");
const toggleO = document.getElementById("toggle-o");
const newGameSingle = document.getElementById("new-game-single");
const newGameMulti = document.getElementById("new-game-multi");

const playGame = document.getElementById("play-game");

let isO = true;
let isSingle = true;
let isPlaying = false;

const setO = (o) => {
    isO = o;
    if (isO) {
        toggleX.dataset.selected = false;
        toggleO.dataset.selected = true;
    } else {
        toggleX.dataset.selected = true;
        toggleO.dataset.selected = false;
    }
    console.log(isO);
};

const setSingle = (single) => {
    isSingle = single;
};

const setPlaying = (playing) => {
    isPlaying = playing;
    if (isPlaying) {
        newGameMenu.classList.add("hidden");
        playGame.classList.remove("hidden");
    } else {
        newGameMenu.classList.remove("hidden");
        playGame.classList.add("hidden");
    }
};

const handleToggleX = () => {
    setO(false);
};

const handleToggleO = () => {
    setO(true);
};

const handleNewGameSingle = () => {
    console.log("new game single");
    setSingle(true);
    setPlaying(true);
};

const handleNewGameMulti = () => {
    console.log("new game multi");
    setSingle(false);
    setPlaying(true);
};

toggleX.addEventListener("click", handleToggleX);
toggleO.addEventListener("click", handleToggleO);

newGameSingle.addEventListener("click", handleNewGameSingle);
newGameMulti.addEventListener("click", handleNewGameMulti);
