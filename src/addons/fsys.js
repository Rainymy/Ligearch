import path from "path";
import toTextConvert from "./toTextConvert";

import everything from "./OnlineFs";
const fs = (window.require && window.require("fs")) || new everything().init();

export function isJson(item) {
  item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

  try { item = JSON.parse(item); } 
  catch (e) { return false; }

  return (typeof item === "object" && item !== null);
}

export function getRelativePath(folderPath, filePath) {
  return "./" + path.join(folderPath, filePath);
}

export function checkIfFileExist(location) {
  return new Promise(function(resolve, reject) {
    fs.access(location, fs.constants.F_OK, (err) => resolve(!err));
  });
}

export async function createFile(file) {
  return await new Promise(function(resolve, reject) {
    fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
      if (err) reject(err);
    });
    fs.writeFile(file, "", { flag: 'wx' }, function (err) {
      if (err) reject(err);
      resolve("File created!");
    });
  });
}

export function removeFile(filePath) {
  return new Promise(async function(resolve, reject) {
    await fs.unlink(filePath, (err) => reject(err));
    resolve("Deleted: " + filePath);
  });
}

export function parseData(data, flag) {
  // flag.extension
  if (!flag.fileFormat) {
    if (isJson(data)) { flag.fileFormat = ".json" }
    else { flag.fileFormat = ".txt" }
  }
  
  if (flag.extension === ".json" && flag.fileFormat === ".json") {
    return JSON.stringify(data, null, flag.indent);
  }
  if (flag.extension === ".txt" && flag.fileFormat === ".json") {
    // Convert json to txt format like from the beginning.
    return toTextConvert(data);
  }
  if (flag.extension === ".txt" && flag.fileFormat === ".txt") {
    return data;
  }
  // console.log("what");
  return JSON.stringify(data, null, flag.indent);
}

export async function saveFileSync(filePath, data, indent) {
  
  // console.log("RELATIVE FILE PATH:", filePath);
  
  const tracker = {
    append: (status, indicator) => {
      if (indicator === "success") {
        tracker.success.push(status);
        tracker.isSuccess = true;
      }
      else {
        tracker.error.push(status);
        tracker.isError = true;
        tracker.isSuccess = false;
      }
      tracker.log.push(status);
    },
    log: [],
    isError: false,
    error: [],
    isSuccess: false,
    success: [],
    file: {}
  }
  
  let isFileExist = await fs.existsSync(filePath);
  let extension = path.extname(filePath);
  
  const flag = {
    fileFormat: undefined,
    indent,
    extension
  }
  
  if (!isFileExist) {
    tracker.append("File/Folder doesn't exist", "success");
    await createFile(filePath)
      .then(_ => {
        tracker.append("File successfully created!", "success");
      })
      .catch(e => {
        tracker.append(e, "failed");
        console.error(e);
      });
    tracker.file = {
      basename: path.basename(filePath),
      relative: filePath
    }
  }
  
  try {
    tracker.append("Writing to the File", "success");
    fs.writeFileSync(filePath, parseData(data, flag));
    tracker.append("Finished!", "success");
  } catch (e) {
    console.log(e);
    tracker.append(e, "failed");
  }
  
  return tracker;
}

export function readFolder(folderPath) {
  
  try { return fs.readdirSync(folderPath); } 
  catch (e) { return e; }
}

const exporting = {
  readFolder,
  createFile,
  saveFileSync,
  removeFile,
  checkIfFileExist
}

export default exporting;