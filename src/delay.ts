/**
 * Class representing a flexible delay utility.
 */
export class Delay {
    private _timerId: NodeJS.Timeout | null = null;
    private _startTime: number | null = null;
    private _remainingSinceLastStart: number | null = null;
    private _isPaused: boolean = false;

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
     * Starts a delay for the specified duration.
     * @param duration The duration of the delay in milliseconds or a string (e.g., "1m", "2s", "1h").
     * @param action The action to execute when the delay is complete.
     * @returns A promise that resolves when the delay is complete.
     */
    async start(duration: number | string, action: () => void): Promise<void> {
        const ms = typeof duration === 'string' ? this.durationToMilliseconds(duration) : duration;

        return new Promise((resolve) => {
            this._remainingSinceLastStart = ms;
            this._startTime = Date.now();
            this._timerId = setTimeout(() => {
                this._isPaused = false;
                action();
                resolve();
            }, this._remainingSinceLastStart);
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
     * @returns A promise that resolves when the delay resumes.
     */
    async resume(): Promise<void> {
        if (this._isPaused) {
            return new Promise((resolve) => {
                this._timerId = setTimeout(() => {
                    this._isPaused = false;
                    resolve();
                }, this._remainingSinceLastStart!);
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
            this._remainingSinceLastStart = null;
            this._isPaused = false;
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
