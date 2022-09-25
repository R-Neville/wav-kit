import FileAPI from "./api-interfaces/FileAPI";
import FSObserverAPI from "./api-interfaces/FSObserverAPI";
import DialogAPI from "./api-interfaces/DialogAPI";

export default interface ElectronAPI {
  file: FileAPI;
  fsObserver: FSObserverAPI;
  dialog: DialogAPI;
}