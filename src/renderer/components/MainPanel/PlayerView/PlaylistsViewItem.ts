import Playlist from "../../../../shared/Playlist";
import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import Icon from "../../shared/Icon";
import { close } from "../../../icons";

class PlaylistsViewItem extends HTMLElement {
  private _name: string;
  private _files: string[];
  private _nameLabel: HTMLLabelElement;
  private _songCountLabel: HTMLLabelElement;
  private _deleteButton: HTMLButtonElement;

  constructor(playlist: Playlist) {
    super();

    this._name = playlist.name;
    this._files = playlist.files;
    this._nameLabel = this.buildNameLabel(this._name);
    this._songCountLabel = this.buildSongCountLabel(this._files.length);
    this._deleteButton = this.buildDeleteButton();

    this.appendChild(this._nameLabel);
    this.appendChild(this._songCountLabel);
    this.appendChild(this._deleteButton);

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
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
      marginRight: "auto",
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

  private buildDeleteButton() {
    const button = document.createElement("button");
    const icon = new Icon(close(), "100%", true);
    icon.setColor(window.theme.fgHighlight);
    button.appendChild(icon);
    applyStyles(button, {
      ...universalStyles,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "20px",
      height: "20px",
      border: "none",
      borderRadius: "3px",
      outline: "none",
      marginLeft: "5px",
      backgroundColor: "inherit",
      cursor: "pointer",
    } as CSSStyleDeclaration);
    button.addEventListener("click", () => {
      const customEvent = new CustomEvent("item-delete-button-clicked", {
        bubbles: true,
        detail: {
          name: this._name,
        },
      });
      this.dispatchEvent(customEvent);
    });
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = window.theme.bgAccent;
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "inherit";
    });
    return button;
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
