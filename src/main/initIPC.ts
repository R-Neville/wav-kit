import { ipcMain } from "electron";
import WavKit from "./WavKit";

export default function initIPC(app: WavKit) {
  ipcMain.handle("hello-world", app.onHelloWorld.bind(app));
}