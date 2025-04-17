const newGameMenu = document.getElementById("new-game-menu");
const toggleX = document.getElementById("toggle-x");
const toggleO = document.getElementById("toggle-o");
const chooseX = document.getElementById("choose-x");
const chooseO = document.getElementById("choose-o");
const newGameSingle = document.getElementById("new-game-single");
const newGameMulti = document.getElementById("new-game-multi");

const playGame = document.getElementById("play-game");
const turnX = document.getElementById("turn-x");
const turnO = document.getElementById("turn-o");
const restartGame = document.getElementById("restart-game");
const board = document.getElementById("board");
const boardCells = [...board.children];

// content

let isO = true;
let isSingle = true;
let isPlaying = false;
let isComputer = false;
const boardState = ["", "", "", "", "", "", "", "", ""];

const filledTags = {
    X: "/assets/icon-x.svg",
    O: "/assets/icon-o.svg",
};

const outlineTags = {
    X: "/assets/icon-x-outline.svg",
    O: "/assets/icon-o-outline.svg",
};

const renderBoard = () => {
    boardCells.forEach((cell, index) => {
        if (boardState[index]) {
            cell.innerHTML = `<img src="${
                filledTags[boardState[index]]
            }" alt="${boardState[index]}" />`;
        } else {
            const symbol = isO ? "O" : "X";
            cell.innerHTML = `<img class="board__button--outline" src="${outlineTags[symbol]}" alt="${symbol}" />`;
        }
    });
};

const boardReset = () => {
    boardState.forEach((_, index) => {
        boardState[index] = "";
        boardCells[index].disabled = false;
        boardCells[index].dataset.clicked = false;
    });
};

const disableBoard = () => {
    boardCells.forEach((cell) => {
        cell.disabled = true;
    });
};

const enableBoard = () => {
    boardCells.forEach((cell, index) => {
        if (boardState[index] === "") {
            cell.disabled = false;
        }
    });
};

const setO = (o) => {
    isO = o;
    if (isO) {
        toggleX.dataset.selected = false;
        toggleO.dataset.selected = true;
        chooseX.classList.add("hidden");
        chooseO.classList.remove("hidden");
        turnX.classList.add("hidden");
        turnO.classList.remove("hidden");
    } else {
        toggleX.dataset.selected = true;
        toggleO.dataset.selected = false;
        chooseX.classList.remove("hidden");
        chooseO.classList.add("hidden");
        turnX.classList.remove("hidden");
        turnO.classList.add("hidden");
    }
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

const setComputer = (computer) => {
    isComputer = computer;
    if (isComputer) {
        disableBoard();
        setTimeout(() => {
            // computer move
            const openIndices = [];
            boardState.forEach((cell, index) => {
                if (cell === "") {
                    openIndices.push(index);
                }
            });
            const randomIndex =
                openIndices[Math.floor(Math.random() * openIndices.length)];
            boardState[randomIndex] = isO ? "O" : "X";
            boardCells[randomIndex].dataset.clicked = true;
            setO(!isO);
            renderBoard();
            enableBoard();
            // computer move
        }, 500);
        isComputer = false;
    }
};

const handleToggleX = () => {
    setO(false);
};

const handleToggleO = () => {
    setO(true);
};

const handleNewGameSingle = () => {
    setSingle(true);
    setPlaying(true);
    renderBoard();
};

const handleNewGameMulti = () => {
    setSingle(false);
    setPlaying(true);
    renderBoard();
};

const handleRestartGame = () => {
    setPlaying(false);
    boardReset();
    renderBoard();
};

const handleCellClick = (index) => {
    if (boardState[index] !== "") {
        return;
    }
    boardCells[index].disabled = true;
    boardState[index] = isO ? "O" : "X";
    boardCells[index].dataset.clicked = true;
    setO(!isO);
    renderBoard();
    if (isSingle) {
        setComputer(true);
    }
};

toggleX.addEventListener("click", handleToggleX);
toggleO.addEventListener("click", handleToggleO);
newGameSingle.addEventListener("click", handleNewGameSingle);
newGameMulti.addEventListener("click", handleNewGameMulti);

restartGame.addEventListener("click", handleRestartGame);

boardCells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
});
