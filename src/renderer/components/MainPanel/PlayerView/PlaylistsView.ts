import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import ScrollView from "../../shared/ScrollView";

class PlaylistsView extends HTMLElement {
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _noPlaylists: HTMLDivElement;

  constructor() {
    super();

    this._scrollView = new ScrollView("100%", "100%");
    this._contentWrapper = this.buildContentWrapper();
    this._noPlaylists = this.buildNoPlaylists();
    this._scrollView.addVerticalScrollBar(this._contentWrapper, 10);
    this._scrollView.setContent(this._contentWrapper);

    this.appendChild(this._scrollView);
    this._contentWrapper.appendChild(this._noPlaylists);

    applyStyles(this, {
      ...universalStyles,
      display: "grid",
      gridTemplateRows: "minmax(0, 1fr)",
      overflow: "hidden",
      maxHeight: "100%",
    } as CSSStyleDeclaration);
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

  private buildNoPlaylists() {
    const noPlaylists = document.createElement("div");
    noPlaylists.textContent = "You haven't created any playlists yet.";
    applyStyles(noPlaylists, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    const button = document.createElement("button");
    button.textContent = "Create One";
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
    noPlaylists.appendChild(button);
    return noPlaylists;
  }
}

customElements.define("playlists-view", PlaylistsView);

export default PlaylistsView;