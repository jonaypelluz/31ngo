export const getDefaultState = () => {
    return {
        game: {
            hash: null,
            host: null,
            mode: 'public',
            codes: [],
            usedCodes: [],
            hasStarted: false,
            hasFinished: false,
            drawnNumbers: [],
            winners: [],
            players: [],
            maxPlayers: null,
        },
        yell: {
            type: null,
            uuid: null,
        },
    };
};

export const getDefaultYellState = () => {
    return {
        type: null,
        uuid: null,
    };
};

export const state = getDefaultState();
