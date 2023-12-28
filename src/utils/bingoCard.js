class BingoCard {
    #COLS;
    #ROWS;
    #NUMS_IN_ROW;
    #NUMS_IN_COLS;
    #SERIES;

    constructor(params) {
        this.#COLS = params.cols;
        if (this.#COLS === '') {
            throw new Error(`Bingo card cols field cannot be empty`);
        }
        this.#ROWS = params.rows;
        if (this.#ROWS === '') {
            throw new Error(`Bingo card rows field cannot be empty`);
        }
        this.#NUMS_IN_ROW = params.numsInRow;
        if (this.#NUMS_IN_ROW === '') {
            throw new Error(`Quantity of num in row cannot be empty`);
        }
        this.#NUMS_IN_COLS = params.numsInCol;
        if (this.#NUMS_IN_COLS === '') {
            throw new Error(`Quantity of num in a col cannot be empty`);
        }
        this.#SERIES = params.series;
        if (this.#SERIES === '') {
            throw new Error(`Bingo card series of numbers cannot be empty`);
        }
    }

    /**
     * Returns a bingo card in a matrix and the numbers in it
     *
     * @return {object}
     */
    generateCard() {
        let matrix = this.generateMatrix();

        let colsNum = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //Two arrays to secure numbers in all columns
        let colsOddNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let cols = [];
        let stop = 0; //Avoid eternal loop
        for (let x = 0; x < this.#ROWS; x++) {
            let loop = true;
            let count = 0;

            while (loop) {
                let pos = x === 1 && colsOddNum.length > 0 ? colsOddNum[0] : colsNum[0];

                if (count >= this.#NUMS_IN_ROW) {
                    break;
                }

                if (cols[pos] >= this.#NUMS_IN_COLS && colsNum.includes(pos)) {
                    const index = colsNum.indexOf(pos);
                    if (index > -1) {
                        colsNum.splice(index, 1);
                    }
                }

                colsNum.sort(() => {
                    return 0.5 - Math.random();
                });

                colsOddNum.sort(() => {
                    return 0.5 - Math.random();
                });

                if (!cols[pos]) {
                    cols[pos] = 0;
                }

                if (
                    matrix[x][pos] === 0 &&
                    count < this.#NUMS_IN_ROW &&
                    cols[pos] < this.#NUMS_IN_COLS
                ) {
                    count++;
                    cols[pos]++;
                    matrix[x][pos] = 1;

                    if (x < 2) {
                        // Row num in loop
                        const index = colsOddNum.indexOf(pos);
                        if (index > -1) {
                            colsOddNum.splice(index, 1);
                        }
                    }
                }

                if (stop > 500) {
                    console.error('break point');
                    //Avoid eternal loop
                    break;
                }
                stop++;
            }
        }

        let numbers = this.generateRandBingoNums(matrix);
        numbers.sort((a, b) => {
            return a - b;
        });

        matrix = this.setNumsInMatrix(matrix, numbers);

        return {
            matrix: matrix,
            numbers: numbers,
        };
    }

    /**
     * Generate a matrix for the bingo card
     *
     * @return {array}
     */
    generateMatrix() {
        let matrix = [];
        for (let i = 0; i < this.#ROWS; i++) {
            matrix.push(Array(this.#COLS).fill(0));
        }

        return matrix;
    }

    /**
     * Set the numbers in the matrix
     *
     * @param {array} numbers - Bingo card numbers
     * @param {array} matrix - Bingo card matrix
     *
     * @return {array}
     */
    setNumsInMatrix(matrix, numbers) {
        let count = 0;
        for (let h = 0; h < this.#COLS; h++) {
            for (let j = 0; j < this.#ROWS; j++) {
                if (matrix[j][h] === 1) {
                    matrix[j][h] = numbers[count];
                    count++;
                }
            }
        }

        return matrix;
    }

    /**
     * For a given matrix I get the numbers for the bingo card
     *
     * @param {array} matrix - Bingo card matrix
     *
     * @return {array}
     */
    generateRandBingoNums(matrix) {
        let numbers = [];
        for (let h = 0; h < matrix.length; h++) {
            const row = matrix[h];
            for (let j = 0; j < row.length; j++) {
                const position = row[j];
                if (position === 1) {
                    let num = this.getRandNumInASerie(numbers, this.#SERIES[j]);
                    numbers.push(num);
                }
            }
        }

        return numbers;
    }

    /**
     * For given series of numbers we get random numbers until the total given
     *
     * @param {array} numbers - Numbers store
     * @param {string} serie - serie given with a max and a min number but in string format with "-" separator
     *
     * @return {array}
     */
    getRandNumInASerie(numbers, serie) {
        const maxMinSerieNum = serie.split('-');

        //loop to get random numbers in the serie
        let randNum = null;
        let loop = true;
        while (loop) {
            randNum = this.getRandNumInARange(maxMinSerieNum[1], maxMinSerieNum[0]);
            if (!numbers.includes(randNum)) {
                break;
            }
        }

        return randNum;
    }

    /**
     * Returns a random number in range
     *
     * @param {number} max - maximum number in the range
     * @param {number} min - minimum number in the range
     *
     * @return {number}
     */
    getRandNumInARange(max, min) {
        let numbers = [];
        for (let i = parseInt(min); i < parseInt(max) + 1; i++) {
            numbers.push(i);
        }
        numbers.sort(() => Math.random() - 0.5);
        return numbers[0];
    }
}

export default BingoCard;
