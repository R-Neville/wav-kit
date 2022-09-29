import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import FileViewItem from "./FileViewItem";
import ScrollView from "../../shared/ScrollView";
import DropZone from "./DropZone";

class FileView extends HTMLElement {
  private _visible: boolean;
  private _items: FileViewItem[];
  private _header: HTMLDivElement;
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;

  constructor() {
    super();

    this._visible = false;
    this._items = [];
    this._header = this.buildHeader();
    this._scrollView = new ScrollView();
    this._contentWrapper = this.buildContentWrapper();
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 20);
    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._header);
    this.appendChild(this._scrollView);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      maxHeight: "100%",
      marginLeft: "1em",
      marginRight: "1em",
      marginBottom: "1em",
      backgroundColor: window.theme.bgHighlight,
    } as CSSStyleDeclaration);

    this.addEventListener("clear-item", this.onClearItem as EventListener);
    this.addEventListener("item-dbl-clicked", this.onItemDblClicked as EventListener);
  }

  get visible() {
    return this._visible;
  }

  show() {
    this._visible = true;
    this.style.display = "flex";
  }

  hide() {
    this._visible = false;
    this.style.display = "none";
  }

  addItem(stats: FileStats) {
    const item = new FileViewItem(stats);
    this._items.push(item);
    this._contentWrapper.appendChild(item);
  }

  clear() {
    this._items.forEach((item) => {
      item.remove();
    });
    this._items = [];
  }

  private buildHeader() {
    const header = document.createElement("div");
    header.textContent = "Files";
    applyStyles(header, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      padding: "5px",
      backgroundColor: window.theme.fgPrimary + "22",
      fontSize: "1em",
      color: window.theme.fgAccent,
    } as CSSStyleDeclaration);
    return header;
  }

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      ...universalStyles,
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);
    return wrapper;
  }

  private onClearItem(event: CustomEvent) {
    const item = event.target as FileViewItem;
    const index = this._items.indexOf(item);
    item.remove();
    this._items.splice(index, 1);
  }

  private onItemDblClicked(event: CustomEvent) {
    event.stopPropagation();
    const item = event.target as FileViewItem;
    const path = item.path;
    const customEvent = new CustomEvent("load-file-requested", {
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