export default interface FSObserverAPI {
  addOnFileAddedHandler: (handler: (path: string) => void) => void;
  addOnDirAddedHandler: (handler: (path: string) => void) => void;
}
