import { contextBridge } from "electron";
import defaultTheme from "../shared/defaultTheme";

const api = {
  theme: defaultTheme,
};

contextBridge.exposeInMainWorld("api", api);