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
    this._scrollView = new ScrollView();
    this._contentWrapper = this.buildContentWrapper();
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 10);
    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);
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

  private buildContentWrapper() {
    const wrapper = document.createElement("div");
    applyStyles(wrapper, {
      ...universalStyles,
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);
    return wrapper;
  }
}

customElements.define("file-view", FileView);

export default FileView;