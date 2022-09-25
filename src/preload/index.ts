import { contextBridge } from "electron";
import * as file from "./file";
import * as fsObserver from "./fsObserver";
import * as dialog from "./dialog";

const api = {
  file,
  fsObserver,
  dialog,
};

contextBridge.exposeInMainWorld("api", api);