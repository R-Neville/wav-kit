import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import FileViewItem from "./FileViewItem";
import ScrollView from "../../shared/ScrollView";
import ContextMenu from "../../shared/ContextMenu";

class FileView extends HTMLElement {
  private _items: FileViewItem[];
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _noFiles: HTMLDivElement;

  constructor() {
    super();

    this._items = [];
    this._scrollView = new ScrollView("100%", "100%");
    this._contentWrapper = this.buildContentWrapper();
    this._noFiles = this.buildNoFiles();
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 10);
    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);
    this._contentWrapper.appendChild(this._noFiles);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "minmax(0, 1fr)",
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);

    this.addEventListener("item-dbl-clicked", this.onItemDblClicked as EventListener);
    this.addEventListener("item-close-button-clicked", this.onItemCloseButtonClicked as EventListener);
  }

  addItem(stats: FileStats) {
    if (this._items.length === 0) {
      this._noFiles.remove();
    }
    const item = new FileViewItem(stats);
    this._items.push(item);
    this._contentWrapper.appendChild(item);
    item.addEventListener("contextmenu", (event) => {
      const menu = new ContextMenu();
      menu.addOption("Add To Queue", () => {
        const customEvent = new CustomEvent("add-file-to-queue", {
          bubbles: true,
          detail: {
            index: this._items.indexOf(item),
          },
        });
        this.dispatchEvent(customEvent);
      });
      menu.addOption("Add To Playlist", () => {
        const customEvent = new CustomEvent("add-file-to-playlist", {
          bubbles: true,
          detail: {
            index: this._items.indexOf(item),
          }
        });
        this.dispatchEvent(customEvent);
      });
      document.body.appendChild(menu);
      menu.show(event.pageX, event.pageY);
    });
  }

  clear() {
    this._items.forEach((item) => {
      item.remove();
    });
    this._items = [];
    this._contentWrapper.appendChild(this._noFiles);
    const customEvent = new CustomEvent("all-files-cleared", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      ...universalStyles,
      overflow: "hidden",
      maxHeight: "100%",
      backgroundColor: window.theme.bgHighlight,
    } as CSSStyleDeclaration);
    return wrapper;
  }

  private buildNoFiles() {
    const noFiles = document.createElement("div");
    noFiles.textContent = "You haven't imported any files yet.";
    applyStyles(noFiles, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    const button = document.createElement("button");
    button.textContent = "Import";
    applyStyles(button, {
      ...universalStyles,
      padding: "0.5em 1em",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      marginTop: "1em",
      backgroundColor: window.theme.bgAccent,
      fontSize: "1em",
      color: window.theme.fgAccent,
      cursor: "pointer",
    } as CSSStyleDeclaration);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("import-file-requested", {
        bubbles: true,
      });
      this.dispatchEvent(customEvent);
    });
    noFiles.appendChild(button);
    return noFiles;
  }

  private onItemCloseButtonClicked(event: CustomEvent) {
    event.stopPropagation();
    const item = event.target as FileViewItem;
    const index = this._items.indexOf(item);
    item.remove();
    this._items.splice(index, 1);
    if (this._items.length === 0) {
      this._contentWrapper.appendChild(this._noFiles);
    }
    const customEvent = new CustomEvent("file-item-cleared", {
      bubbles: true,
      detail: {
        index,
      },
    });
    this.dispatchEvent(customEvent);
  }

  private onItemDblClicked(event: CustomEvent) {
    event.stopPropagation();
    const item = event.target as FileViewItem;
    const path = item.path;
    const customEvent = new CustomEvent("play-file-requested", {
      bubbles: true,
      detail: {
        path,
      }
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("file-view", FileView);

export default FileView;