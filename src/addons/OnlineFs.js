export default function fsys() {
  let storage = {};
  // Someday you're going to fix this, yea I need help. Help ples. 
  // idk what heck i'm supposed to do.
  
  this.storageSaveName = "AnimeList";
  this.init = function () {
    this.setStorage();
    return this;
  }
  
  this.saveStorage = function () {
    window.localStorage.setItem(this.storageSaveName, JSON.stringify(storage));
    this.setStorage();
  }
  
  this.setStorage = function () {
    storage = JSON.parse(window.localStorage.getItem(this.storageSaveName)) ?? {};
    return storage;
  }
  
  this.getStorage = function () {
    return storage;
  }
  
  this.getFolder = function (name) {
    let paths = name.split("/");
    let parent = [];
    
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === ".") { continue; }
      if (!parent.length) {
        if (!storage[paths[i]]) { return []; }
        parent.push(storage[paths[i]]);
      }
      
      while (parent[parent.length - 1].type) {
        if (!parent[parent.length - 1].children[paths[i]]) { break; }
        parent.push(parent[parent.length - 1].children[paths[i]]);
      }
    }
    // console.log(parent);
    return parent;
  }
  
  this.access = function access() {
    return;
  }
  
  this.mkdir = function (pathName, flags, cb) {
    let paths = pathName.split("/");
    let parent = [];
    
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === ".") { continue; }
      if (!parent.length || parent[parent.length - 1].name !== paths[i]) {
        parent.push({
          name: paths[i],
          type: "folder",
          children: {}
        });
      }
    }
    
    let last;
    while (parent.length > 1) {
      last = parent.pop();
      parent[parent.length - 1].children[last.name] = last;
    }
    
    // Storage overwrite!!
    storage[parent[0].name] = parent[0];
    this.saveStorage();
    cb();
  }
  
  this.writeFile = function writeFile(filePath, content, flag, cb) {
    let paths = this.getFolder(filePath);
    let file = filePath.split("/").pop();
    
    paths[paths.length - 1].children[file] = {
      name: file,
      type: "file",
      content: content
    }
    this.saveStorage();
  }
  
  this.unlink = function unlink() {
    this.saveStorage();
    return;
  }
  
  this.existsSync = function existsSync(filePath) {
    // this is wrong 
    // console.log(storage);
    // console.log(filePath);
    for (let name of filePath.split("/")) {
      if (name === ".") { continue; }
      if (!storage[name]) {
        return false
      }
    }
    return true;
  }
  
  this.writeFileSync = function writeFileSync() {
    return;
  }
  
  this.readdirSync = function readdirSync() {
    return [];
  }
  
  this.constants = {
    F_OK: 200,
  }
}


