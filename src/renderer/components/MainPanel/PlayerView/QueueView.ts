import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import QueueViewItem from "./QueueViewItem";
import ScrollView from "../../shared/ScrollView";
import FileStats from "../../../../shared/FileStats";

class QueueView extends HTMLElement {
  private _items: QueueViewItem[];
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

    this.addEventListener(
      "item-close-button-clicked",
      this.onItemCloseButtonClicked as EventListener
    );
  }

  addItem(stats: FileStats) {
    if (this._items.length === 0) {
      this._noFiles.remove();
    }
    const item = new QueueViewItem(stats);
    this._items.push(item);
    this._contentWrapper.appendChild(item);
  }

  removeFirstItem() {
    const item = this._items.shift();
    if (item) {
      item.remove();
      if (this._items.length === 0) {
        this._contentWrapper.appendChild(this._noFiles);
      }
    }
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
    noFiles.textContent = "You haven't queued any files.";
    applyStyles(noFiles, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    return noFiles;
  }

  private onItemCloseButtonClicked(event: CustomEvent) {
    event.stopPropagation();
    const item = event.target as QueueViewItem;
    const index = this._items.indexOf(item);
    item.remove();
    this._items.splice(index, 1);
    if (this._items.length === 0) {
      this._contentWrapper.appendChild(this._noFiles);
    }
    const customEvent = new CustomEvent("queue-item-cleared", {
      bubbles: true,
      detail: {
        index,
      },
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("queue-view", QueueView);

export default QueueView;
