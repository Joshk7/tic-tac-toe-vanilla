export const validateBoard = (board) => {
    const rows = [0, 0, 0];
    const columns = [0, 0, 0];

    const diagonals = [0, 0];

    let filled = 0;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            let cell = 0;
            if (board[index] === "X") {
                cell = 1;
            }

            if (board[index] === "O") {
                cell = -1;
            }

            if (cell !== 0) {
                filled++;
            }

            rows[row] += cell;
            if (rows[row] === 3) {
                return "X";
            }

            if (rows[row] === -3) {
                return "O";
            }

            columns[col] += cell;
            if (columns[col] === 3) {
                return "X";
            }

            if (columns[col] === -3) {
                return "O";
            }

            if (row === col) {
                diagonals[0] += cell;
                if (diagonals[0] === 3) {
                    return "X";
                }

                if (diagonals[0] === -3) {
                    return "O";
                }
            }
            if (row + col === 2) {
                diagonals[1] += cell;
                if (diagonals[1] === 3) {
                    return "X";
                }

                if (diagonals[1] === -3) {
                    return "O";
                }
            }
        }
    }

    if (filled === 9) {
        return "Tie";
    } else {
        return "In Progress";
    }
};
