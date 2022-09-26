import App from "./App";
import defaultTheme from "../shared/defaultTheme";

window.theme = defaultTheme;

const app = new App();

window.api.fsObserver.addOnFileAddedHandler(app.onObserverFileAdded.bind(app));
window.api.fsObserver.addOnDirAddedHandler(app.onObserverDirAdded.bind(app));