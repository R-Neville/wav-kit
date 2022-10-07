import { applyStyles } from "../../../helpers";
import universalStyles from "../../../universalStyles";

class DropZone extends HTMLElement {
  private _message: HTMLSpanElement;

  constructor() {
    super();

    this._message = document.createElement("span");
    this._message.textContent = "Drop files here or click to import.";
    this.appendChild(this._message);
    this.textContent = "+";
    
    applyStyles(this, {
      ...universalStyles,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px",
      height: "100px",
      border: `1px dashed ${window.theme.fgAccent}`,
      borderRadius: "3px",
      margin: "16px",
      backgroundColor: window.theme.bgHighlight,
      fontSize: "4em",
      color: window.theme.fgAccent,
      cursor: "pointer",
    } as CSSStyleDeclaration);

    applyStyles(this._message, {
      ...universalStyles,

    } as CSSStyleDeclaration);

    this.addEventListener("drop", this.onDrop as EventListener);
    this.addEventListener("dragover", this.onDragOver as EventListener);
    this.addEventListener("dragenter", this.onDragEnter);
    this.addEventListener("dragleave", this.onDragLeave);
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("click", this.onClick);
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.style.backgroundColor = window.theme.bgHighlight;

    if (event.dataTransfer) {
      [...event.dataTransfer.files].forEach((file) => {
        if (file.type.includes("audio")) {
          const customEvent = new CustomEvent("file-dropped", {
            bubbles: true,
            detail: {
              path: file.path,
            }
          });
          this.dispatchEvent(customEvent);
        }
      });
    }
  }

  private onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private onDragEnter() {
    this.style.backgroundColor = window.theme.bgAccent;
  }

  private onDragLeave() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }

  private onMouseEnter() {
    this.style.backgroundColor = window.theme.bgAccent;
  }

  private onMouseLeave() {
    this.style.backgroundColor = window.theme.bgHighlight;
  }

  private onClick() {
    const customEvent = new CustomEvent("drop-zone-clicked", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define("drop-zone", DropZone);

export default DropZone;