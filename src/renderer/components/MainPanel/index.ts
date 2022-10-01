import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import HomeView from "./HomeView";
import MainPanelView from "./MainPanelView";
import PlayerView from "./PlayerView";
import MenuBar from "./MenuBar";
import Icon from "../shared/Icon";
import { home, player } from "../../icons";

class MainPanel extends HTMLElement {
  private _menuBar: MenuBar;
  private _currentView: MainPanelView;
  private _home: HomeView;
  private _player: PlayerView;

  constructor() {
    super();

    this._menuBar = this.buildMenuBar();
    this._home = new HomeView();
    this._player = new PlayerView();

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
  }

  addFileToPlayerView(path: string) {
    this._player.addFile(path);
  }

  playFileWithAudioPlayer(path: string) {
    this._player.playFile(path);
  }

  private buildMenuBar() {
    const menuBar = new MenuBar();
    const homeIcon = new Icon(home(), "30px", true);
    homeIcon.setColor(window.theme.bgSecondary);
    menuBar.addAction(homeIcon, () => {
      const customEvent = new CustomEvent("show-home", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    }, true);
    const playerIcon = new Icon(player(), "30px", true);
    playerIcon.setColor(window.theme.bgSecondary);
    menuBar.addAction(playerIcon, () => {
      const customEvent = new CustomEvent("show-player", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    }, false);
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
}

customElements.define("main-panel", MainPanel);

export default MainPanel;