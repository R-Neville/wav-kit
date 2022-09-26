import { applyStyles } from "../../helpers";
import universalStyles from "../../universalStyles";
import ResizeHandle from "./ResizeHandle";
import FileExplorer from "./FileExplorer";
import SamplesView from "./SamplesView";

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export interface FileInfo {
  path: string;
  dir: boolean;
}

class SidePanel extends HTMLElement {
  private _contentWrapper: HTMLDivElement;
  private _resizeHandle: ResizeHandle;
  private _fileExplorer: FileExplorer;
  private _samplesView: SamplesView;

  constructor() {
    super();

    this._contentWrapper = this.buildContentWrapper();
    this._resizeHandle = new ResizeHandle();
    this._fileExplorer = new FileExplorer();
    this._samplesView = new SamplesView();

    this.appendChild(this._contentWrapper);
    this.appendChild(this._resizeHandle);
    this._contentWrapper.appendChild(this._fileExplorer);
    this._contentWrapper.appendChild(this._samplesView);

    applyStyles(this, {
      ...universalStyles,
      display: "none",
      gridTemplateColumns: "1fr max-content",
      width: "200px",
      backgroundColor: window.theme.bgPrimary,
    } as CSSStyleDeclaration);

    this.addEventListener(
      "resize-handle-used",
      this.onResizeHandleUsed as EventListener
    );
  }

  get fileExplorerVisible() {
    return this._fileExplorer.visible;
  }

  get samplesViewVisible() {
    return this._samplesView.visible;
  }

  show() {
    this.style.display = "grid";
  }

  hide() {
    this.style.display = "none";
  }

  showFileExplorer() {
    this._samplesView.hide()
    this._fileExplorer.show();
  
  }

  showSamplesView() {
    this._fileExplorer.hide();
    this._samplesView.show();
  }

  addFileToDirTree(fileInfo: FileInfo) {
    this._fileExplorer.addFile(fileInfo);
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      
    } as CSSStyleDeclaration);
    return wrapper;
  }

  private onResizeHandleUsed(event: CustomEvent) {
    const { deltaX } = event.detail;
    const newWidth = this.getBoundingClientRect().width + deltaX;
    if (newWidth > MIN_WIDTH && newWidth < MAX_WIDTH) {
      this.style.width = newWidth + "px";
    }
  }
}

customElements.define("side-panel", SidePanel);

export default SidePanel;