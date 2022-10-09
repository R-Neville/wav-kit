import fs from "fs";
import path from "path";
import { app } from "electron";
import Config from "./Config";
import { isEmpty, deepCopy } from "../../shared/utils";
import validateConfig from "./validateConfig";
import showErrorMessage from "../showErrorMessage";

const userDataPath = app.getPath("userData");

const CONFIG_FILENAME = path.join(userDataPath, "wav-kit.config.json");
const ENCODING = "utf-8";

export default class ConfigManager {
  private _defaultConfig: Config;
  private _userConfig: Config | null;

  constructor(defaults: Config) {
    this._defaultConfig = defaults;
    this._userConfig = null;
    this.initConfig();
  }

  private initConfig() {
    if (!fs.existsSync(CONFIG_FILENAME)) {
      this.restoreDefaultConfig();
    } else {
      const config = this.loadConfigSync();
      if (isEmpty(config)) {
        this.restoreDefaultConfig();
      } else {
        this._userConfig = config;
        validateConfig(this._userConfig, this._defaultConfig);
      }
    }
    this.saveConfig();
  }

  get importedFiles() {
    return this._userConfig?.importedFiles;
  }

  restoreDefaultConfig() {
    this._userConfig = deepCopy(this._defaultConfig) as Config;
  }

  loadConfigSync() {
    const json = fs.readFileSync(CONFIG_FILENAME, { encoding: ENCODING });
    return JSON.parse(json) as Config;
  }

  saveConfig() {
    const json = JSON.stringify(this._userConfig, null, 2);
    fs.writeFile(CONFIG_FILENAME, json, (error) => {
      if (error) {
        const message = `There was a problem saving the app's configuration.`;
        showErrorMessage(message);
      };
    });
  }

  addImportedFile(path: string) {
    this._userConfig?.importedFiles.push(path);
    this.saveConfig();
  }

  removeImportedFileAtIndex(index: number) {
    this._userConfig?.importedFiles.splice(index, 1);
    this.saveConfig();
  }

  resetImportedFiles() {
    if (this._userConfig) {
      this._userConfig.importedFiles = []
      this.saveConfig();
    }
  }
}