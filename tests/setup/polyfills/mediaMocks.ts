// HTMLMediaElement stubs
if (typeof window !== 'undefined') {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'probably');

  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
    get() {
      // @ts-expect-error - test shim
      return this._currentTime || 0;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._currentTime = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
    get() {
      // @ts-expect-error - test shim
      return this._duration || 0;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._duration = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
    get() {
      // @ts-expect-error - test shim
      return this._volume !== undefined ? this._volume : 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._volume = Math.max(0, Math.min(1, value));
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get() {
      // @ts-expect-error - test shim
      return this._playbackRate || 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._playbackRate = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    get() {
      // @ts-expect-error - test shim
      return this._paused !== undefined ? this._paused : true;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._paused = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
    get() {
      // @ts-expect-error - test shim
      return this._ended || false;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._ended = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
    get() {
      // @ts-expect-error - test shim
      return this._readyState || 4;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._readyState = value;
    },
    configurable: true,
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'networkState', {
    get() {
      // @ts-expect-error - test shim
      return this._networkState || 1;
    },
    set(value) {
      // @ts-expect-error - test shim
      this._networkState = value;
    },
    configurable: true,
  });

  HTMLMediaElement.prototype.simulateEvent = function (eventType: string): void {
    const event = new Event(eventType);
    this.dispatchEvent(event);
  };

  HTMLMediaElement.prototype.simulateTimeUpdate = function (time: number): void {
    // @ts-expect-error - test shim
    this._currentTime = time;
    // @ts-expect-error - test shim
    this.simulateEvent('timeupdate');
  };

  HTMLMediaElement.prototype.simulateLoadedData = function (duration = 60): void {
    // @ts-expect-error - test shim
    this._duration = duration;
    // @ts-expect-error - test shim
    this._readyState = 4;
    // @ts-expect-error - test shim
    this.simulateEvent('loadeddata');
    // @ts-expect-error - test shim
    this.simulateEvent('canplay');
    // @ts-expect-error - test shim
    this.simulateEvent('canplaythrough');
  };

  HTMLMediaElement.prototype.simulatePlay = function (): void {
    // @ts-expect-error - test shim
    this._paused = false;
    // @ts-expect-error - test shim
    this.simulateEvent('play');
    // @ts-expect-error - test shim
    this.simulateEvent('playing');
  };

  HTMLMediaElement.prototype.simulatePause = function (): void {
    // @ts-expect-error - test shim
    this._paused = true;
    // @ts-expect-error - test shim
    this.simulateEvent('pause');
  };

  HTMLMediaElement.prototype.simulateEnd = function (): void {
    // @ts-expect-error - test shim
    this._ended = true;
    // @ts-expect-error - test shim
    this._paused = true;
    // @ts-expect-error - test shim
    this.simulateEvent('ended');
  };
}
