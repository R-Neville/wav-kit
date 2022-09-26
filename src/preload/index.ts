import { contextBridge } from "electron";
import * as file from "./file";
import * as fsObserver from "./fsObserver";
import * as dialog from "./dialog";
import * as path from "./path";

const api = {
  file,
  fsObserver,
  dialog,
  path,
};

contextBridge.exposeInMainWorld("api", api);