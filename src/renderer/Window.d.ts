import ElectronAPI from "./ElectronAPI";
import Theme from "../shared/Theme";

declare global {
  interface Window {
    api: ElectronAPI;
    theme: Theme;
  }
}