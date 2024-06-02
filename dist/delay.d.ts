/// <reference types="node" />
/**
 * Class representing a flexible delay utility.
 */
export declare class Delay {
    private _timerId;
    private _startTime;
    private _remainingSinceLastStart;
    private _isPaused;
    /**
     * Gets the timer ID of the current delay.
     */
    get timerId(): NodeJS.Timeout | null;
    /**
     * Gets the start time of the current delay.
     */
    get startTime(): number | null;
    /**
     * Gets the pause status of the current delay.
     */
    get isPaused(): boolean;
    /**
     * Starts a delay for the specified duration.
     * @param ms The duration of the delay in milliseconds.
     * @param action The action to execute when the delay is complete.
     * @returns A promise that resolves when the delay is complete.
     */
    start(ms: number, action: () => void): Promise<void>;
    /**
     * Pauses the current delay.
     */
    pause(): void;
    /**
     * Resumes a paused delay.
     * @returns A promise that resolves when the delay resumes.
     */
    resume(): Promise<void>;
    /**
     * Cancels the current delay.
     */
    cancel(): void;
}
