# Delay actions

A flexible delay utility for Node.js.

## Installation

You can install Delay actions via npm:

```bash
npm install delay-actions
```

## Usage

```javascript
const { Delay } = require('delay-actions');

// Create a new Delay instance
const delay = new Delay();

// Start a delay for 1000 milliseconds
delay.start(1000, () => {
    console.log('Delay completed');
});

// Pause the delay
delay.pause();

// Resume the delay
delay.resume();

// Cancel the delay
delay.cancel();
```

## API

### `Delay`

Class representing a flexible delay utility.

#### Properties

- `timerId`: `NodeJS.Timeout | null` - Gets the timer ID of the current delay.
- `startTime`: `number | null` - Gets the start time of the current delay.
- `isPaused`: `boolean` - Gets the pause status of the current delay.

#### Methods

- `start(ms: number, action: () => void): Promise<void>` - Starts a delay for the specified duration.
- `pause(): void` - Pauses the current delay.
- `resume(): Promise<void>` - Resumes a paused delay.
- `cancel(): void` - Cancels the current delay.

## License

Delay Actions is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.