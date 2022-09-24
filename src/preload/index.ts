import { contextBridge } from "electron";
import helloWorld from "./helloWorld";

const api = {
  helloWorld,
};

contextBridge.exposeInMainWorld("api", api);