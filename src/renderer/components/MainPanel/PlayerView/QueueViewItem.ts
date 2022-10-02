import FileStats from "../../../../shared/FileStats";
import FileListItem from "./FileListItem";

class QueueViewItem extends FileListItem {

  constructor(stats: FileStats) {
    super(stats);
  }
}

customElements.define("file-list-item", QueueViewItem);

export default QueueViewItem;