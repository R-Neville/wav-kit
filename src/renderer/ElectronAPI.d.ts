import ConfigAPI from "./api-interfaces/ConfigAPI";
import FileAPI from "./api-interfaces/FileAPI";
import FSObserverAPI from "./api-interfaces/FSObserverAPI";
import DialogAPI from "./api-interfaces/DialogAPI";
import PathAPI from "./api-interfaces/PathAPI";

export default interface ElectronAPI {
  config: ConfigAPI;
  file: FileAPI;
  fsObserver: FSObserverAPI;
  dialog: DialogAPI;
  path: PathAPI;
}