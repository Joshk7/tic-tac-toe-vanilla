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
const boardCells = board.querySelectorAll("button");
const boardIcons = board.querySelectorAll("img");
const xLabel = document.getElementById("x-label");
const oLabel = document.getElementById("o-label");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
const tieScore = document.getElementById("tie-score");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const modalOutcomeRestart = document.getElementById("modal-outcome-restart");
const modalOutcomeTie = document.getElementById("modal-outcome-tie");
const modalOutcomeWinner = document.getElementById("modal-outcome-winner");
const outcomeResult = document.getElementById("outcome-result");
const outcomeIcon = document.getElementById("outcome-icon");
const outcomeColor = document.getElementById("outcome-color");

const modalButtonsRestart = document.getElementById("modal-buttons-restart");
const modalCancel = document.getElementById("modal-cancel");
const modalRestart = document.getElementById("modal-restart");

const modalButtonsOutcome = document.getElementById("modal-buttons-outcome");
const modalQuit = document.getElementById("modal-quit");
const modalNext = document.getElementById("modal-next");

let original = "O";
let player = "O";
let isSingle = true;
let isPlaying = false;
let isComputer = false;
const boardState = ["", "", "", "", "", "", "", "", ""];
let x = 0;
let o = 0;
let tie = 0;

const saveGameState = () => {
    const gameState = {
        boardState: boardState,
        scores: { x, o, tie },
        isSingle: isSingle,
        player: player,
        original: original,
        isPlaying: isPlaying,
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
};

const loadGameState = () => {
    newGameMenu.classList.remove("initial-hidden");
    playGame.classList.remove("initial-hidden");

    const savedState = localStorage.getItem("gameState");

    if (savedState) {
        const gameState = JSON.parse(savedState);

        gameState.boardState.forEach((value, index) => {
            boardState[index] = value;
        });

        setX(gameState.scores.x);
        setO(gameState.scores.o);
        setTie(gameState.scores.tie);

        setSingle(gameState.isSingle);
        setPlayer(gameState.player);
        setOriginal(gameState.original);
        setPlaying(gameState.isPlaying);

        if (gameState.isPlaying) {
            renderBoard();
        }
    }
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
    boardIcons.forEach((cell, index) => {
        cell.classList.remove("hidden");
        if (boardState[index]) {
            cell.classList.remove("board__button--outline");
            cell.src = filledTags[boardState[index]];
            cell.alt = boardState[index];
        } else {
            cell.classList.add("board__button--outline");
            cell.src = outlineTags[player];
            cell.alt = player;
        }
    });
};

const removeOutlines = () => {
    boardIcons.forEach((cell, index) => {
        if (boardState[index] === "") {
            cell.classList.add("hidden");
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

const resetModal = () => {
    [...modalContent.children].forEach((child) => {
        child.classList.add("hidden");
    });
};

const renderModal = (outcome) => {
    resetModal();
    if (outcome === "In Progress") {
        modalOutcomeRestart.classList.remove("hidden");
        modalButtonsRestart.classList.remove("hidden");
    } else {
        modalButtonsOutcome.classList.remove("hidden");
        if (outcome === "Tie") {
            modalOutcomeTie.classList.remove("hidden");
        } else {
            modalOutcomeWinner.classList.remove("hidden");
            if (isSingle) {
                if (original === outcome) {
                    outcomeResult.textContent = "You won!";
                } else {
                    outcomeResult.textContent = "Oh no, you lost...";
                }
            } else {
                if (original === outcome) {
                    outcomeResult.textContent = "Player 1 wins!";
                } else {
                    outcomeResult.textContent = "Player 2 wins!";
                }
            }
            outcomeIcon.src = filledTags[outcome];
            outcomeIcon.alt = outcome;
            if (outcome === "X") {
                outcomeColor.classList.remove("light-yellow-text");
                outcomeColor.classList.add("light-blue-text");
            } else {
                outcomeColor.classList.remove("light-blue-text");
                outcomeColor.classList.add("light-yellow-text");
            }
        }
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
            xLabel.textContent = "(CPU)";
            oLabel.textContent = "(YOU)";
        } else {
            xLabel.textContent = "(P2)";
            oLabel.textContent = "(P1)";
        }
    } else {
        if (isSingle) {
            xLabel.textContent = "(YOU)";
            oLabel.textContent = "(CPU)";
        } else {
            xLabel.textContent = "(P1)";
            oLabel.textContent = "(P2)";
        }
    }

    if (original === "O") {
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

const setX = (score) => {
    x = score;
    xScore.textContent = x;
};

const setO = (score) => {
    o = score;
    oScore.textContent = o;
};

const setTie = (score) => {
    tie = score;
    tieScore.textContent = tie;
};

const updateScore = (result) => {
    if (result === "X") {
        setX(x + 1);
    }

    if (result === "O") {
        setO(o + 1);
    }

    if (result === "Tie") {
        setTie(tie + 1);
    }
    saveGameState();
};

const handleToggleX = () => {
    setOriginal("X");
    setPlayer("X");
};

const handleToggleO = () => {
    setOriginal("O");
    setPlayer("O");
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
    saveGameState();
    const result = validateBoard(boardState);
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
    saveGameState();
    enableBoard();
    const result = validateBoard(boardState);
    if (result !== "In Progress") {
        updateScore(result);
        renderModal(result);
        openModal();
    }
};

const handleModalCancel = () => {
    closeModal();
};

const handleModalRestart = () => {
    resetGame();
    setPlayer(original);
    saveGameState();
    closeModal();
};

const handleModalQuit = () => {
    setPlayer(original);
    resetGame();
    setPlaying(false);
    saveGameState();
    closeModal();
};

const handleModalNext = () => {
    setPlayer(original);
    resetGame();
    saveGameState();
    closeModal();
};

document.addEventListener("DOMContentLoaded", loadGameState);

toggleX.addEventListener("click", handleToggleX);
toggleO.addEventListener("click", handleToggleO);
newGameSingle.addEventListener("click", handleNewGameSingle);
newGameMulti.addEventListener("click", handleNewGameMulti);

restartGame.addEventListener("click", handleRestartGame);

boardCells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleHumanMove(index));
});

modalCancel.addEventListener("click", handleModalCancel);
modalRestart.addEventListener("click", handleModalRestart);

modalQuit.addEventListener("click", handleModalQuit);
modalNext.addEventListener("click", handleModalNext);
