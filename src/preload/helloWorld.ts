import { ipcRenderer } from "electron";

function sayHello() {
  ipcRenderer.invoke("hello-world").then((greeting) => {
    console.log(greeting);
  });
}

const helloWorld = {
  sayHello,
};

export default helloWorld;