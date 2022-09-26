import { applyStyles, sortDirItems, sortFileItems } from '../../helpers';
import universalStyles from '../../universalStyles';
import DropdownExpander from './DropdownExpander';
import FileItem from './FileItem';

class DirItem extends HTMLElement {
  private _rendererd: boolean;
  private _expanded: boolean;
  private _path: string;
  private _expander: DropdownExpander;
  private _itemList: HTMLDivElement;
  private _dirItems: DirItem[];
  private _fileItems: FileItem[];

  constructor(path: string) {
    super();

    this._rendererd = false;
    this._expanded = false;
    this._path = path;
    this._expander = new DropdownExpander(window.api.path.basename(this._path));
    this._itemList = this.buildItemList();
    this._dirItems = [];
    this._fileItems = [];

    this.appendChild(this._expander);
    this.appendChild(this._itemList);

    this.addEventListener('expander-clicked', this.onExpanderClicked as EventListener);
  }

  get expanded() {
    return this._expanded;
  }

  get path() {
    return this._path;
  }

  set path(newValue: string) {
    this._path = newValue;
  }

  get itemList() {
    return this._itemList;
  }

  get dirItems() {
    return this._dirItems;
  }

  set dirItems(newItems: DirItem[]) {
    this._dirItems = newItems;
  }

  get fileItems() {
    return this._fileItems;
  }

  set fileItems(newItems: FileItem[]) {
    this._fileItems = newItems;
  }

  expand() {
    if (!this._expanded) {
      if (!this._rendererd) {
        this._rendererd = true;
        this.renderContents();
      }
      this._expander.expand();
      this._itemList.style.display = 'flex';
      this._expanded = true;
    }
  }

  collapse() {
    if (this._expanded) {
      this._expander.close();
      this._itemList.style.display = 'none';
      this._expanded = false;
    }
  }

  organise() {
    this._dirItems.forEach(d => d.remove());
    this._fileItems.forEach(f => f.remove());
    sortDirItems(this._dirItems);
    sortFileItems(this._fileItems);
    this._dirItems.forEach(d => this._itemList.appendChild(d));
    this._fileItems.forEach(f => this._itemList.appendChild(f));
  }

  private buildItemList() {
    const itemList = document.createElement("div");
    applyStyles(itemList, {
      display: "flex",
      flexDirection: "column",
      borderLeft: `0.5px solid ${window.theme.fgPrimary}`,
      marginLeft: "10px",
    } as CSSStyleDeclaration);
    return itemList;
  }

  private renderContents() {
    this._dirItems.forEach(di => {
      this._itemList.appendChild(di);
    });
    this._fileItems.forEach(fi => {
      this._itemList.appendChild(fi);
    });
  }

  private onExpanderClicked(event: CustomEvent) {
    if (this !== (event.target as HTMLElement).parentElement) {
      return;
    }

    if (this._expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private getFileItemIndexFromName(filename: string) {
    const found = this._fileItems.filter(f => f.path === filename);
    return found.length > 0 ? this._fileItems.indexOf(found[0]) : -1;
  }

  private getDirItemIndexFromPath(path: string) {
    const found = this._dirItems.filter(d => d.path === path);
    return found.length > 0 ? this._dirItems.indexOf(found[0]) : -1;
  }
}

customElements.define('dir-item', DirItem);

export default DirItem;