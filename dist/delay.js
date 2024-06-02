"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delay = void 0;
/**
 * Class representing a flexible delay utility.
 */
class Delay {
    constructor() {
        this._timerId = null;
        this._startTime = null;
        this._remainingSinceLastStart = null;
        this._isPaused = false;
    }
    /**
     * Gets the timer ID of the current delay.
     */
    get timerId() {
        return this._timerId;
    }
    /**
     * Gets the start time of the current delay.
     */
    get startTime() {
        return this._startTime;
    }
    /**
     * Gets the pause status of the current delay.
     */
    get isPaused() {
        return this._isPaused;
    }
    /**
     * Starts a delay for the specified duration.
     * @param ms The duration of the delay in milliseconds.
     * @param action The action to execute when the delay is complete.
     * @returns A promise that resolves when the delay is complete.
     */
    start(ms, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this._remainingSinceLastStart = ms;
                this._startTime = Date.now();
                this._timerId = setTimeout(() => {
                    this._isPaused = false;
                    action();
                    resolve();
                }, this._remainingSinceLastStart);
            });
        });
    }
    /**
     * Pauses the current delay.
     */
    pause() {
        if (this._timerId && !this._isPaused) {
            clearTimeout(this._timerId);
            this._remainingSinceLastStart -= Date.now() - this._startTime;
            this._isPaused = true;
        }
    }
    /**
     * Resumes a paused delay.
     * @returns A promise that resolves when the delay resumes.
     */
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isPaused) {
                return new Promise((resolve) => {
                    this._timerId = setTimeout(() => {
                        this._isPaused = false;
                        resolve();
                    }, this._remainingSinceLastStart);
                });
            }
            return Promise.resolve();
        });
    }
    /**
     * Cancels the current delay.
     */
    cancel() {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
            this._startTime = null;
            this._remainingSinceLastStart = null;
            this._isPaused = false;
        }
    }
}
exports.Delay = Delay;
