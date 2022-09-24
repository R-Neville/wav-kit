import HelloWorld from "./HelloWorld"

export interface ElectronAPI {
  helloWorld: HelloWorld;
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}