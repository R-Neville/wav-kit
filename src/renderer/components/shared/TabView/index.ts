import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import ContextMenu from "../ContextMenu";
import Tab from "./Tab";

class TabView extends HTMLElement {
  private _tabs: Tab[];
  private _tabBar: HTMLDivElement;
  private _content: HTMLElement | null;

  constructor() {
    super();

    this._tabs = [];
    this._tabBar = this.buildTabBar();
    this._content = null;

    this.appendChild(this._tabBar);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "max-content minmax(0, 1fr)",
      margin: "1em",
    } as CSSStyleDeclaration);

    this.addEventListener("tab-clicked", this.onTabClicked as EventListener);
  }

  setContent(element: HTMLElement) {
    if (this._content) {
      this._content.remove();
    }
    this._content = element;
    this.appendChild(this._content);
  }

  addTab(
    text: string,
    onClick: EventListener,
    active: boolean,
    contextMenuOptions?: { text: string; onClick: EventListener }[]
  ) {
    const tab = new Tab(text, onClick);
    this._tabs.push(tab);
    this._tabBar.appendChild(tab);
    if (active) {
      tab.activate();
    }
    if (contextMenuOptions) {
      tab.addEventListener("contextmenu", (event) => {
        if (tab.active) {
          const menu = new ContextMenu();
          for (let option of contextMenuOptions) {
            menu.addOption(option.text, option.onClick);
          }
          document.body.appendChild(menu);
          menu.show(event.pageX, event.pageY);
        }
      })
    }
  }

  private buildTabBar() {
    const tabBar = document.createElement("div");
    applyStyles(tabBar, {
      ...universalStyles,
      display: "flex",
      backgroundColor: window.theme.fgHighlight + "22",
    } as CSSStyleDeclaration);
    return tabBar;
  }

  private onTabClicked(event: CustomEvent) {
    const target = event.target as Tab;
    this._tabs.forEach((tab) => {
      if (tab.active) {
        tab.deactivate();
      }
    });
    target.activate();
  }
}

customElements.define("tab-view", TabView);

export default TabView;
