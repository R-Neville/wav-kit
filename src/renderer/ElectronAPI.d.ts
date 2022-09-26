import FileAPI from "./api-interfaces/FileAPI";
import FSObserverAPI from "./api-interfaces/FSObserverAPI";
import DialogAPI from "./api-interfaces/DialogAPI";
import PathAPI from "./api-interfaces/PathAPI";

export default interface ElectronAPI {
  file: FileAPI;
  fsObserver: FSObserverAPI;
  dialog: DialogAPI;
  path: PathAPI;
}