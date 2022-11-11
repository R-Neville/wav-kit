import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import HomeView from "./HomeView";
import MainPanelView from "./MainPanelView";
import PlayerView from "./PlayerView";
import MenuBar from "./MenuBar";
import Icon from "../shared/Icon";
import { editor, home, player } from "../../icons";
import EditorView from "./EditorView";

class MainPanel extends HTMLElement {
  private _menuBar: MenuBar;
  private _currentView: MainPanelView;
  private _home: HomeView;
  private _player: PlayerView;
  private _editor: EditorView;

  constructor() {
    super();

    this._menuBar = this.buildMenuBar();
    this._home = new HomeView();
    this._player = new PlayerView();
    this._editor = new EditorView();

    this._currentView = this._home;

    this.appendChild(this._currentView);
    this.appendChild(this._menuBar);

    applyStyles(this, {
      ...universalStyles,
      gridColumn: "3",
      display: "grid",
      gridTemplateColumns: "1fr max-content",
      gridTemplateRows: "1fr",
      width: "100%",
      maxHeight: "100vh",
      backgroundColor: window.theme.bgSecondary,
    } as CSSStyleDeclaration);

    this.addEventListener("show-home", this.showHome);
    this.addEventListener("show-player", this.showPlayer);
    this.addEventListener("show-editor", this.showEditor);
  }

  addFileToPlayerView(path: string) {
    this._player.addFile(path);
  }

  playFileWithAudioPlayer(path: string) {
    this._player.playFile(path);
  }

  async addDirContentsToPlayerView(path: string) {
    const files = await window.api.file.readDir(path);
    if (files) {
      files.forEach((filename) => {
        this._player.addFile(window.api.path.resolve(path, filename));
      });
    }
  }

  private buildMenuBar() {
    const menuBar = new MenuBar();
    const homeIcon = new Icon(home(), "30px", true);
    homeIcon.setColor(window.theme.bgSecondary);
    menuBar.addAction(
      homeIcon,
      () => {
        const customEvent = new CustomEvent("show-home", {
          bubbles: true,
        });
        this.dispatchEvent(customEvent);
      },
      true
    );
    const playerIcon = new Icon(player(), "30px", true);
    playerIcon.setColor(window.theme.bgSecondary);
    menuBar.addAction(
      playerIcon,
      () => {
        const customEvent = new CustomEvent("show-player", {
          bubbles: true,
        });
        this.dispatchEvent(customEvent);
      },
      false
    );
    const editorIcon = new Icon(editor(), "30px", true);
    editorIcon.setColor(window.theme.bgSecondary);
    menuBar.addAction(
      editorIcon,
      () => {
        const customEvent = new CustomEvent("show-editor", {
          bubbles: true,
        });
        this.dispatchEvent(customEvent);
      },
      false
    );
    return menuBar;
  }

  private showHome() {
    this._currentView?.remove();
    this._currentView = this._home;
    this.appendChild(this._currentView);
  }

  private showPlayer() {
    this._currentView?.remove();
    this._currentView = this._player;
    this.appendChild(this._currentView);
  }

  private showEditor() {
    this._currentView?.remove();
    this._currentView = this._editor;
    this.appendChild(this._currentView);
  }
}

customElements.define("main-panel", MainPanel);

export default MainPanel;
