import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";
import MainPanelView from "../MainPanelView";

class EditorView extends MainPanelView {
  constructor() {
    super("Audio Editor");

    applyStyles(this, {
      ...universalStyles,
    } as CSSStyleDeclaration);
  }
}

customElements.define("editor-view", EditorView);

export default EditorView;