import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

function join(event, arg, defaultValue) {
  return window.ipcRenderer.sendSync(event, arg, defaultValue);
}

function requireJSON(arg, defaultValue={}) {
  try {
    let data = window.require(arg);
    if (!Object.keys(data).length) {
      throw new Error(`JSON file has empty object: ${ JSON.stringify(data) }`);
    }
    return window.require(arg);
  } 
  catch (e) { console.warn("Custom ERROR:", e); return defaultValue; }
}

let configureDefault = {
  mode: {
    label: "normal",
    options: [
      "normal",
      "weeb"
    ]
  },
  exportFileType: {
    label: "json",
    options: [
      "json",
      "txt"
    ]
  },
  supportedFileTypes: [
    "txt", 
    "json"
  ],
  "ApiCalls": {
    "label": "Imdb",
    "options": [
      "Imdb",
      "None",
      "MyAnimeList",
      "Netflix"
    ]
  }
};

// if file or folder doesn't exist. Create the file or folder.
// Then the contents of the file defaults to the last argument. 
const cachePath =         join("filePath", "./data/cache.json", {});
const defaultConfigPath = join("filePath", "./data/config.json", configureDefault);
const jsonFileName =      join("filePath", "./data/category.json", {});
const userFolderPath =    join("filePath", "./USER");

// console.log(cachePath);
// console.log(defaultConfigPath);
// console.log(jsonFileName);
// console.log(userFolderPath);

// if try to read the file with the absolute path. 
// If error occurs then default the last argument.
let fileCache =  requireJSON(cachePath);
let configure =  requireJSON(defaultConfigPath, configureDefault);
let categories = requireJSON(jsonFileName);

const appData = {
  userFolderPath,
  cache: {
    path: cachePath,
    content: fileCache
  },
  config: {
    path: defaultConfigPath,
    content: configure
  },
  category: {
    path: jsonFileName,
    content: categories
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App app-data={ appData } />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
