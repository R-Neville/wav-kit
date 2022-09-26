import { applyStyles } from "./helpers";
import universalStyles from "./universalStyles";
import { fileExplorer, samples } from "./icons";
import SideBar from "./components/SideBar";
import SidePanel, { FileInfo } from "./components/SidePanel";
import MainPanel from "./components/MainPanel";
import Icon from "./components/shared/Icon";

class App {
  private _sideBar: SideBar;
  private _sidePanel: SidePanel;
  private _mainPanel: MainPanel;
  private _sidePanelVisible: boolean;

  constructor() {
    this._sideBar = this.buildSideBar();
    this._sidePanel = new SidePanel();
    this._mainPanel = new MainPanel();
    this._sidePanelVisible = false;

    document.body.appendChild(this._sideBar);
    document.body.appendChild(this._sidePanel);
    document.body.appendChild(this._mainPanel);

    applyStyles(document.body, {
      ...universalStyles,
      display: "grid",
      gridTemplateColumns: "max-content max-content 1fr",
      padding: "0",
      width: "100%",
      height: "100vh",
      margin: "0",
    } as CSSStyleDeclaration);

    applyStyles(this._mainPanel, {
      gridColumn: "3",
    } as CSSStyleDeclaration);

    document.addEventListener(
      "close-side-panel",
      this.onCloseSidePanel.bind(this)
    );
  }

  onObserverFileAdded(path: string) {
    const fileInfo = {
      path,
      dir: false,
    };
    this._sidePanel.addFileToDirTree(fileInfo);
  }

  onObserverDirAdded(path: string) {
    const fileInfo = {
      path,
      dir: true,
    };
    this._sidePanel.addFileToDirTree(fileInfo);
  }

  private buildSideBar() {
    const sideBar = new SideBar();
    const fileExplorerIcon = new Icon(fileExplorer(), "35px", true);
    fileExplorerIcon.setColor(window.theme.fgPrimary);
    sideBar.addAction(fileExplorerIcon, () => {
      this._sidePanel.showFileExplorer();
      if (!this._sidePanelVisible) {
        this._sidePanel.show();
      }
    });
    const samplesIcon = new Icon(samples(), "35px", true);
    samplesIcon.setColor(window.theme.fgPrimary);
    sideBar.addAction(samplesIcon, () => {
      this._sidePanel.showSamplesView();
      if (!this._sidePanelVisible) {
        this._sidePanel.show();
      }
    });
    return sideBar;
  }

  private onCloseSidePanel() {
    this._sidePanelVisible = false;
    this._sidePanel.hide();
  }
}

export default App;
