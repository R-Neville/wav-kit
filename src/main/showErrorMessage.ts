import { dialog } from "electron";

export default function showErrorMessage(message: string) {
  dialog.showMessageBox({
    type: "error",
    message,
    buttons: ["OK"],
  });
}