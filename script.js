import { validateBoard } from "./board.js";

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
const xLabel = document.getElementById("x-label");
const oLabel = document.getElementById("o-label");

const modal = document.getElementById("modal");
const modalOutcome = document.getElementById("modal-outcome");
const modalButtons = document.getElementById("modal-buttons");

let original = "O";
let player = "O";
let isSingle = true;
let isPlaying = false;
let isComputer = false;
const boardState = ["", "", "", "", "", "", "", "", ""];
const scores = {
    X: 0,
    O: 0,
    Tie: 0,
};

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
            cell.innerHTML = `
                <img class="board__button--outline" src="${outlineTags[player]}" alt="${player}" />
            `;
        }
    });
};

const removeOutlines = () => {
    boardCells.forEach((cell, index) => {
        if (boardState[index] === "") {
            cell.innerHTML = "";
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

const singleEndStates = {
    X: {
        X: "You won!",
        O: "Oh no, you lost...",
    },
    O: {
        X: "Oh no, you lost...",
        O: "You won!",
    },
};

const multiEndStates = {
    X: {
        X: "Player 1 wins!",
        O: "Player 2 wins!",
    },
    O: {
        X: "Player 2 wins!",
        O: "Player 1 wins!",
    },
};

const renderModal = (outcome) => {
    if (outcome === "In Progress") {
        modalOutcome.innerHTML = `<span class="modal__outcome--restart">Restart Game?</span>`;
        modalButtons.innerHTML = `
            <button class="modal__button silver gray-shadow" onclick="handleCancel()">
                No, cancel
            </button>
            <button class="modal__button light-yellow yellow-shadow-sm" onclick="handleRestart()">
                Yes, restart
            </button>
        `;
    } else {
        if (outcome === "Tie") {
            modalOutcome.innerHTML = `
                <span>Round Tied</span>
            `;
        } else {
            if (isSingle) {
                modalOutcome.innerHTML = `
                    <span>${singleEndStates[original][outcome]}</span>
                    <div>
                    <img src="${filledTags[outcome]}" alt="${outcome}" />
                        <p>Takes the round</p>
                    </div>
                `;
            } else {
                modalOutcome.innerHTML = `
                    <span>${multiEndStates[original][outcome]}</span>
                    <div>
                        <img src="${filledTags[outcome]}" alt="${outcome}" />
                        <p>Takes the round</p>
                    </div>
                `;
            }
        }

        modalButtons.innerHTML = `
            <button class="modal__button silver gray-shadow" onclick="handleQuit()">
                Quit
            </button>
            <button class="modal__button light-yellow yellow-shadow-sm" onclick="handleNextRound()">
                Next round
            </button>
        `;
    }
};

const openModal = () => {
    modal.showModal();
};

const closeModal = () => {
    modal.close();
};

const setOriginal = (o) => {
    original = o;
    if (original === "O") {
        if (isSingle) {
            xLabel.innerHTML = "X (CPU)";
            oLabel.innerHTML = "O (YOU)";
        } else {
            xLabel.innerHTML = "X (P2)";
            oLabel.innerHTML = "O (P1)";
        }
    } else {
        if (isSingle) {
            xLabel.innerHTML = "X (YOU)";
            oLabel.innerHTML = "O (CPU)";
        } else {
            xLabel.innerHTML = "X (P1)";
            oLabel.innerHTML = "O (P2)";
        }
    }
};

const setPlayer = (newPlayer) => {
    player = newPlayer;
    if (player === "O") {
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
    removeOutlines();
    disableBoard();
    if (isComputer) {
        setTimeout(() => {
            computerMove();
        }, 500);
        isComputer = false;
    }
};

const updateScore = (score) => {
    scores[score]++;
    // renderScoreBoard();
};

const handleToggleX = () => {
    setPlayer("X");
    setOriginal("X");
};

const handleToggleO = () => {
    setPlayer("O");
    setOriginal("O");
};

const handleNewGameSingle = () => {
    setSingle(true);
    setOriginal(original);
    setPlaying(true);
    renderBoard();
};

const handleNewGameMulti = () => {
    setSingle(false);
    setOriginal(original);
    setPlaying(true);
    renderBoard();
};

const resetGame = () => {
    boardReset();
    renderBoard();
};

const handleRestartGame = () => {
    renderModal("In Progress");
    openModal();
};

const handleHumanMove = (index) => {
    if (boardState[index] !== "") {
        return;
    }
    boardCells[index].disabled = true;
    boardState[index] = player;
    boardCells[index].dataset.clicked = true;
    const newPlayer = player === "O" ? "X" : "O";
    setPlayer(newPlayer);
    renderBoard();
    const result = validateBoard(boardState);
    console.log(result);
    if (result !== "In Progress") {
        updateScore(result);
        renderModal(result);
        openModal();
    }

    if (isSingle && result === "In Progress") {
        setComputer(true);
    }
};

const computerMove = () => {
    const openIndices = [];
    boardState.forEach((cell, index) => {
        if (cell === "") {
            openIndices.push(index);
        }
    });
    const randomIndex =
        openIndices[Math.floor(Math.random() * openIndices.length)];
    boardState[randomIndex] = player;
    boardCells[randomIndex].dataset.clicked = true;
    const newPlayer = player === "O" ? "X" : "O";
    setPlayer(newPlayer);
    renderBoard();
    enableBoard();
    const result = validateBoard(boardState);
    if (result !== "In Progress") {
        updateScore(result);
        renderModal(result);
        openModal();
    }
};

toggleX.addEventListener("click", handleToggleX);
toggleO.addEventListener("click", handleToggleO);
newGameSingle.addEventListener("click", handleNewGameSingle);
newGameMulti.addEventListener("click", handleNewGameMulti);

restartGame.addEventListener("click", handleRestartGame);

boardCells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleHumanMove(index));
});
