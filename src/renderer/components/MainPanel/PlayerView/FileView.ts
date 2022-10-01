import FileStats from "../../../../shared/FileStats";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import FileViewItem from "./FileViewItem";
import ScrollView from "../../shared/ScrollView";

class FileView extends HTMLElement {
  private _visible: boolean;
  private _items: FileViewItem[];
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;

  constructor() {
    super();

    this._visible = false;
    this._items = [];
    this._scrollView = new ScrollView("100%", "100%");
    this._contentWrapper = this.buildContentWrapper();
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 10);
    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "minmax(0, 1fr)",
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);

    this.addEventListener("clear-item", this.onClearItem as EventListener);
    this.addEventListener("item-dbl-clicked", this.onItemDblClicked as EventListener);
  }

  get visible() {
    return this._visible;
  }

  show() {
    this._visible = true;
    this.style.display = "grid";
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

  private onClearItem(event: CustomEvent) {
    event.stopPropagation();
    const item = event.target as FileViewItem;
    const index = this._items.indexOf(item);
    item.remove();
    this._items.splice(index, 1);
    const customEvent = new CustomEvent("file-cleared", {
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