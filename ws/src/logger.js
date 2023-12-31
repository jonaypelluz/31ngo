const NO_OP = () => {};

const COLOR_CYAN = 36;
const COLOR_BLUE = 34;
const COLOR_DEBUG = 30;
const BG_COLOR_DEBUG = 43;

class ConsoleLogger {
    constructor(options = {}) {
        const level = options.level || process.env.LOG_LEVEL || 'debug';

        const bindConsoleWithColor = (consoleMethod, fontColor, backgroundColor) => {
            let colorCode = `\x1b[${fontColor}m`;
            if (backgroundColor) {
                colorCode = `\x1b[${fontColor};${backgroundColor}m`;
            }
            return consoleMethod.bind(console, `${colorCode}%s\x1b[0m`);
        };

        this.error = console.error.bind(console); // eslint-disable-line
        this.warn = console.warn.bind(console); // eslint-disable-line
        this.info = bindConsoleWithColor(console.log, COLOR_CYAN); // eslint-disable-line
        this.log = bindConsoleWithColor(console.log, COLOR_BLUE); // eslint-disable-line
        this.debug = bindConsoleWithColor(console.log, COLOR_DEBUG, BG_COLOR_DEBUG); // eslint-disable-line

        if (level === 'prod') {
            this.warn = NO_OP;
            this.log = NO_OP;
            this.info = NO_OP;
            this.debug = NO_OP;
            return;
        }

        if (level === 'test') {
            this.warn = NO_OP;
            this.log = NO_OP;
            this.info = NO_OP;
            return;
        }

        if (level === 'staging') {
            this.log = NO_OP;
            this.info = NO_OP;
            this.debug = NO_OP;
        }
    }
}

const logger = new ConsoleLogger({ level: process.env.LOG_LEVEL });

export default logger;
