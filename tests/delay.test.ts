import { Delay } from '../src/delay';

describe('Delay', () => {
    let delay: Delay;

    beforeEach(() => {
        delay = new Delay();
    });

    afterEach(() => {
        delay.cancel(); // Annuler le délai pour éviter les fuites mémoire
    });

    it('should start and resolve after specified time', async () => {
        const ms = 3000; // 3 seconde
        const startTime = Date.now();
        await delay.start(ms, () => {});
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        expect(elapsedTime).toBeGreaterThanOrEqual(ms);
    });

    it('should start and resolve after specified time (with time in string)', async () => {
        const startTime = Date.now();
        await delay.start('3s', () => {});
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        expect(elapsedTime).toBeGreaterThanOrEqual(3000);
    });

    it('should pause and resume correctly', async () => {
        const ms = 2000; // 2 secondes
        delay.start(ms, () => {});
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 seconde
        const pausedTime = Date.now();
        delay.pause();
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 seconde
        delay.resume();
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 secondes
        const resumedTime = Date.now();
        const elapsedPausedTime = pausedTime - delay.startTime!;
        const elapsedResumedTime = resumedTime - delay.startTime!;
        expect(elapsedPausedTime).toBeGreaterThanOrEqual(0); // Au moins 0 secondes après la pause
        expect(elapsedResumedTime).toBeGreaterThanOrEqual(1000); // Au moins 1 secondes après la reprise
        // Essayer un deuxième pause
        delay.pause();
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 1 seconde
        delay.resume();
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 2 secondes
        const secondResumedTime = Date.now();
        const elapsedSecondResumedTime = secondResumedTime - delay.startTime!;
        expect(elapsedSecondResumedTime).toBeGreaterThanOrEqual(1500); // Au moins 3 secondes après la reprise
    });

    it('should cancel correctly', async () => {
        const ms = 3000; // 3 secondes
        delay.start(ms, () => {});
        delay.cancel();
        expect(delay.isPaused).toBeFalsy(); // Assurez-vous que le délai n'est pas en pause
        expect(delay.timerId).toBeNull(); // Assurez-vous que timerId est null
        expect(delay.startTime).toBeNull(); // Assurez-vous que startTime est null
    });

    it('should correctly get remaining time', async () => {
        const ms = 2000; // 2 secondes
        delay.start(ms, () => {});
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 seconde
        delay.pause();
        let remaining = delay.remaining;
        expect(remaining).toBeGreaterThanOrEqual(1490); // Au moins 1.5 secondes restantes
        expect(remaining).toBeLessThanOrEqual(1510); // Pas plus de 1.51 secondes restantes
        delay.resume();
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 seconde
        remaining = delay.remaining;
        expect(remaining).toBeGreaterThanOrEqual(990); // Au moins 1 seconde restante
        expect(remaining).toBeLessThanOrEqual(1010); // Pas plus de 1.01 secondes restantes

        await new Promise(resolve => setTimeout(resolve, 1010)); // Attendre 1 seconde
        expect(delay.remaining).toBeNull(); // Aucun temps restant après l'expiration
        delay.cancel();
        remaining = delay.remaining;
        expect(remaining).toBeNull(); // Aucun temps restant après l'annulation
    });
});
