import Playlist from "../../../../shared/Playlist";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class PlaylistsViewItem extends HTMLElement {
  private _name: string;
  private _files: string[];
  private _nameLabel: HTMLLabelElement;
  private _songCountLabel: HTMLLabelElement;
  
  constructor(playlist: Playlist) {
    super();

    this._name = playlist.name;
    this._files = playlist.files;
    this._nameLabel = this.buildNameLabel(this._name);
    this._songCountLabel = this.buildSongCountLabel(this._files.length);

    this.appendChild(this._nameLabel);
    this.appendChild(this._songCountLabel);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
    } as CSSStyleDeclaration);

    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
  }

  private buildNameLabel(name: string) {
    const label = document.createElement("label");
    label.textContent = name;
    applyStyles(label, {
      ...universalStyles,
      overflow: "hidden",
      wordWrap: "nowrap",
      textOverflow: "ellipsis",
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    return label;
  }

  private buildSongCountLabel(count: number) {
    const label = document.createElement("label");
    const s = count === 1 ? "" : "s";
    label.textContent = `${count} file${s}`;
    applyStyles(label, {
      ...universalStyles,
      color: window.theme.fgHighlight,
    } as CSSStyleDeclaration);
    return label;
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgAccent + "55";
  }

  private onMouseLeave() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }
}

customElements.define("playlists-view-item", PlaylistsViewItem);

export default PlaylistsViewItem;