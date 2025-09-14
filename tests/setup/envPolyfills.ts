import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { TextEncoder, TextDecoder } from 'util';

// Web Streams and BroadcastChannel polyfills
if (typeof globalThis.ReadableStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.WritableStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.WritableStream = WritableStream;
}
if (typeof globalThis.TransformStream === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.TransformStream = TransformStream;
}
if (typeof globalThis.BroadcastChannel === 'undefined') {
  // @ts-expect-error - define if missing
  globalThis.BroadcastChannel = class {
    constructor() {}
    postMessage(): void {}
    close(): void {}
    addEventListener(): void {}
    removeEventListener(): void {}
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => void) | null = null;
  };
}

// TextEncoder/TextDecoder for MSW in JSDOM
Object.assign(global, { TextDecoder, TextEncoder });
