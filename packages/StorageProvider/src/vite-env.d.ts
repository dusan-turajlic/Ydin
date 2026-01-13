/// <reference types="vite/client" />

// Declare WASM file imports with ?url suffix
declare module '*.wasm?url' {
  const url: string;
  export default url;
}
