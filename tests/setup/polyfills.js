// Ensure Web Streams APIs exist before any other setup runs (needed by MSW interceptors)
// Node 18+ provides these in 'stream/web'
const { ReadableStream, WritableStream, TransformStream } = require('stream/web');

// Define if missing
if (typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = ReadableStream;
}
// Define if missing
if (typeof globalThis.WritableStream === 'undefined') {
  globalThis.WritableStream = WritableStream;
}
// Define if missing
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

// Provide BroadcastChannel stub for MSW in Node
if (typeof globalThis.BroadcastChannel === 'undefined') {
  globalThis.BroadcastChannel = class {
    constructor() {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    onmessage = null;
  };
}
