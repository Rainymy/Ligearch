const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

async function createFile(file, isFile, contentValue="") {
  return await new Promise(function(resolve, reject) {
    fs.mkdirSync(isFile ? path.dirname(file): file, { recursive: true });
    if (!isFile) { resolve("Folder has been created!"); }
    try {
      fs.writeFileSync(file, contentValue, { flag: 'wx' });
      resolve("File has been created!");
    } catch (e) { reject(e); }
  });
}

let mainWindow;

const appName = app.name;
const saveFolderPath = process.env.LOCALAPPDATA;

ipcMain.on("getSaveFolder", (event, arg) => {
  event.returnValue = path.join(saveFolderPath, appName);
});

ipcMain.on("filePath", async (event, arg, defaultValue={}) => {
  try {
    const absolutePath = path.join(saveFolderPath, appName, arg);
    const isFileExist = fs.existsSync(absolutePath);
    const ext = path.extname(absolutePath);
    if (!isFileExist) {
      // Create file or Folder, if ext is true (file), or false (folder).
      await createFile(absolutePath, !!ext, JSON.stringify(defaultValue));
    }
    
    event.returnValue = absolutePath;
  } catch (e) {
    console.log(e);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, 
    height: 600,
    title: appName,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      preload: __dirname + '/preload.js',
      // preload: "MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY",
      allowRunningInsecureContent: false
    }
  });
  
  // When window oppens.
  mainWindow.loadURL(
    app.isPackaged 
      ? `file://${path.join(__dirname, '../build/index.html')}`
      : 'http://localhost:3000'
  );
  // When you close the window.
  mainWindow.on('closed', () => mainWindow = null);
  
  if (!app.isPackaged) { mainWindow.webContents.openDevTools(); }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) { createWindow(); }
});