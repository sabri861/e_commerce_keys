import {LogLevel} from "../../../core/domain/ValueObject/LogLevel";
import {injectable} from "inversify";

@injectable()
export class Logger {
    logLevel: LogLevel;
    constructor(
        logLevel: string
    ) {
        this.logLevel = LogLevel[logLevel];
    }

    info(...args: any[]) {
        if (this.logLevel >= LogLevel.info) {
        }
    }

    warn(...args: any[]) {
        if (this.logLevel >= LogLevel.warn) {
            console.log(args);
        }
    }

    debug(...args: any[]) {
        if (this.logLevel >= LogLevel.debug) {
            console.log(args);
        }
    }

    trace(...args: any[]) {
        if (this.logLevel >= LogLevel.trace) {
            console.log(args);
        }
    }
}