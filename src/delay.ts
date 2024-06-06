/**
 * Class representing a flexible delay utility.
 */
export class Delay {
    private _timerId: NodeJS.Timeout | null = null;
    private _startTime: number | null = null;
    private _restartTime: number | null = null;
    private _remainingSinceLastStart: number | null = null;
    private _isPaused: boolean = false;
    private _action: (() => void) | null = null;

    /**
     * Gets the timer ID of the current delay.
     */
    get timerId(): NodeJS.Timeout | null {
        return this._timerId;
    }

    /**
     * Gets the start time of the current delay.
     */
    get startTime(): number | null {
        return this._startTime;
    }

    /**
     * Gets the pause status of the current delay.
     */
    get isPaused(): boolean {
        return this._isPaused;
    }

    /**
     * Gets the remaining time of the current delay. return null if the delay is not started or if the delay is completed.
     */
    get remaining(): number | null {
        let result: number | null = null;
        if (!(this._remainingSinceLastStart === null || this._startTime === null)) {
            if (this._isPaused) {
                result = this._remainingSinceLastStart;
            } else if (this._restartTime !== null) {
                result = this._remainingSinceLastStart - (Date.now() - this._restartTime);
            } else {
                result = Date.now() - this._startTime;
            }

        }
        if (result !== null  && result < 0) {
            result = null;
        }
        return result;
    }

    /**
     * Starts a delay for the specified duration.
     * @param duration The duration of the delay in milliseconds or a string (e.g., "1m", "2s", "1h").
     * @param action The action to execute when the delay is complete.
     * @returns A promise that resolves when the delay is complete.
     */
    async start(duration: number | string, action: () => void): Promise<void> {
        const ms = typeof duration === 'string' ? this.durationToMilliseconds(duration) : duration;
        this._remainingSinceLastStart = ms;
        this._startTime = Date.now();
        this._action = action;
        this._isPaused = false;

        return new Promise((resolve) => {
            if (this._remainingSinceLastStart !== null) {
                this._timerId = setTimeout(() => {
                    action();
                    resolve();
                }, this._remainingSinceLastStart);
            }
        });
    }

    /**
     * Pauses the current delay.
     */
    pause(): void {
        if (this._timerId && !this._isPaused) {
            clearTimeout(this._timerId);
            this._remainingSinceLastStart! -= Date.now() - this._startTime!;
            this._isPaused = true;
        }
    }

    /**
     * Resumes a paused delay.
     */
    async resume(): Promise<void> {
        if (this._isPaused && this._action !== null) {
            this._restartTime = Date.now();
            this._isPaused = false;
            return new Promise((resolve) => {
                if (this._remainingSinceLastStart !== null) {
                    this._timerId = setTimeout(() => {
                        this._action!();
                        resolve();
                    }, this._remainingSinceLastStart);
                }
            });
        }
        return Promise.resolve();
    }

    /**
     * Cancels the current delay.
     */
    cancel(): void {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
            this._startTime = null;
            this._restartTime = null;
            this._remainingSinceLastStart = null;
            this._isPaused = false;
            this._action = null;
        }
    }

    // --------------------
    // Private methods
    // --------------------

    /**
     * Converts a duration string to milliseconds.
     * @param duration The duration string (e.g., "1m", "2s", "1h").
     * @returns The duration in milliseconds.
     */
    private durationToMilliseconds(duration: string): number {
        const units = duration.slice(-1);
        const value = Number(duration.slice(0, -1));

        switch (units) {
            case 's':
                return value * 1000;
            case 'm':
                return value * 1000 * 60;
            case 'h':
                return value * 1000 * 60 * 60;
            case 'd':
                return value * 1000 * 60 * 60 * 24;
            default:
                throw new Error(`Unknown time unit: ${units}`);
        }
    }
}
