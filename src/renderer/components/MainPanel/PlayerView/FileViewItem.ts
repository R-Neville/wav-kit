import FileStats from "../../../../shared/FileStats";
import FileListItem from "./FileListItem";

class FileViewItem extends FileListItem {

  constructor(stats: FileStats) {
    super(stats);
  }
}

customElements.define("file-view-item", FileViewItem);

export default FileViewItem;