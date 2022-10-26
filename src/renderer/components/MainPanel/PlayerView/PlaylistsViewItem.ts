import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class PlaylistsViewItem extends HTMLElement {
  constructor() {
    super();

    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      
    } as CSSStyleDeclaration);
  }
}

customElements.define("playlists-view-item", PlaylistsViewItem);

export default PlaylistsViewItem;