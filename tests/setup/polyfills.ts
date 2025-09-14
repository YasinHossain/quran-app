// Ensure Web Streams APIs exist before any other setup runs (needed by MSW interceptors)
// Node 18+ provides these in 'stream/web'
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';

// @ts-ignore - define if missing
if (typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = ReadableStream as any;
}
// @ts-ignore - define if missing
if (typeof globalThis.WritableStream === 'undefined') {
  globalThis.WritableStream = WritableStream as any;
}
// @ts-ignore - define if missing
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream as any;
}

// Provide BroadcastChannel stub for MSW in Node
// @ts-ignore - define if missing
if (typeof globalThis.BroadcastChannel === 'undefined') {
  // @ts-ignore
  globalThis.BroadcastChannel = class {
    constructor() {}

    postMessage() {}

    close() {}

    addEventListener() {}

    removeEventListener() {}
    onmessage: any = null;
  } as any;
}
