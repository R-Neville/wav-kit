import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import ScrollView from "../../shared/ScrollView";
import PlaylistsViewItem from "./PlaylistsViewItem";
import Playlist from "../../../../shared/Playlist";
import Modal from "../../shared/Modal";

class PlaylistsView extends HTMLElement {
  private _items: PlaylistsViewItem[];
  private _scrollView: ScrollView;
  private _contentWrapper: HTMLDivElement;
  private _noPlaylists: HTMLDivElement;

  constructor() {
    super();

    this._items = [];
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

    this.addEventListener(
      "item-delete-button-clicked",
      this.onItemDeleteButtonClicked as EventListener
    );
  }

  addItem(playlist: Playlist) {
    if (this._items.length === 0) {
      this._noPlaylists.remove();
    }

    const item = new PlaylistsViewItem(playlist);
    this._items.push(item);
    this._contentWrapper.appendChild(item);
  }

  removeItemAtIndex(index: number) {
    const item = this._items.splice(index, 1)[0];
    item.remove();
    if (this._items.length === 0) {
      this._contentWrapper.appendChild(this._noPlaylists);
    }
  }

  replaceItemAtIndex(index: number, playlist: Playlist) {
    if (this._items.length === 0) {
      this._noPlaylists.remove();
    }

    this._contentWrapper.children[index].remove();

    const item = new PlaylistsViewItem(playlist);
    this._items.splice(index, 0, item);
    if (this.children[index]) {
      this._contentWrapper.insertBefore(item, this._contentWrapper.children[index]);
    } else {
      this._contentWrapper.appendChild(item);
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
    button.addEventListener("click", () => {
      const modal = new Modal("Enter a name for the playlist:");
      const onInput = async () => {
        const value = modal.inputValue;
        if (value.length === 0) {
          modal.lock();
          return;
        }
        const isAvailable = await window.api.config.validatePlaylistName(value);
        if (!isAvailable) {
          modal.lock();
          return;
        }
        modal.unlock();
      };
      modal.addInput(onInput, "");
      modal.addAction("Cancel", () => {
        modal.destroy();
      });
      modal.addAction("Confirm", () => {
        const value = modal.inputValue;
        window.api.config.createPlaylist(value);
        const customEvent = new CustomEvent("new-playlist-created", {
          bubbles: true,
          detail: {
            name: value,
          },
        });
        this.dispatchEvent(customEvent);
        modal.destroy();
      });
      document.body.appendChild(modal);
    });
    noPlaylists.appendChild(button);
    return noPlaylists;
  }

  private onItemDeleteButtonClicked(event: CustomEvent) {
    const { name } = event.detail;
    const modal = new Modal(`Delete '${name}' playlist?`);
    modal.addAction("Cancel", () => {
      modal.destroy();
    });
    modal.addAction("Yes", (event) => {
      const customEvent = new CustomEvent("delete-playlist", {
        bubbles: true,
        detail: {
          name,
        },
      });
      this.dispatchEvent(customEvent);
      modal.destroy();
    });
    document.body.appendChild(modal);
  }
}

customElements.define("playlists-view", PlaylistsView);

export default PlaylistsView;
