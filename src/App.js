import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from "uuid";
import './App.css';

// import Clock from "./components/clock";
import Scene from "./components/scene";
import Weeb from "./components/weeb";
import Home from "./components/homepage";
import Configure from "./components/configure";
import Category from "./components/category";

import {
  readFolder, 
  removeFile, 
  saveFileSync, 
  checkIfFileExist as checkFile,
  getRelativePath
} from "./addons/fsys";

import Api from "./addons/Api";

// TODO: Make an API calls to Netflix, MyAnimeList.
// TODO: Turn fsys to work on the web (LocalStorage).
// TODO: Login system and cload save.

function checkFolder(folderPath, obj) {
  let exists = new Set();
  let subFiles = readFolder(folderPath);
  
  for (let i = 0; i < subFiles.length; i++) {
    if (checkFile(subFiles[i])) { exists.add(subFiles[i]); }
  }
  
  let shorter = Object.keys(obj);
  
  for (let i = 0; i < shorter.length; i++) {
    for (let j = 0; j < obj[shorter[i]].export.length; j++) {
      if (exists.has(obj[shorter[i]].export[j].file.basename)) {
        exists.delete(obj[shorter[i]].export[j].file.basename);
      }
    }
  }
  
  exists = [...exists].map((filePath) => {
    return {
      file: {
        basename: filePath,
        relative: getRelativePath(folderPath, filePath)
      }
    };
  });
  return exists;
}

export default function App(props) {
  const isFirstRender = useRef(true);
  
  const {
    config: config1, 
    cache: bruh,
    category, 
    userFolderPath
  } = props["app-data"];
  
  const { path: defaultConfigPath,  content: configure } = config1;
  const { path: jsonFileName, content: categories } = category;
  const { path: cachePath, content: fileCache } = bruh;
  
  let [ database, setDatabase ] = useState(categories);
  let [ cache, setCache ] = useState(fileCache);
  const test2 = useRef(database);
  
  let [ config, setConfig ] = useState(configure);
  let [ switchScene, setSwitchScene ] = useState(true);
  let [ watchedList, setWatchList ] = useState({});
  let [ shipping, setShipping ] = useState([]);
  let [ orphan, setOrphan ] = useState([]);
  
  function changeScene(props, id) {
    setWatchList({ props, id });
    setShipping(database[id]?.export ?? []);
    setSwitchScene(!switchScene);
    return;
  }
  
  function removeScene(id) {
    const newData = { ...database };
    delete newData[id];
    setDatabase(newData);
    return;
  }
  
  function addScene(props, id) {
    let old = Object.assign(props, database);
    setDatabase(old);
    return;
  }
  
  function removeTitle(category_title, id) {
    let old = Object.assign({}, database);
    delete old[id].data[category_title];
    setDatabase(old);
  }
  
  function updateLists(props, header = "", id) {
    let updated = Object.assign({}, database);
    header = header.trim();
    
    if (!updated[id].data?.[header]) {
      updated[id].data = Object.assign({
        [header]: [
          props
        ]
      }, updated[id].data);
    }
    else { updated[id].data[header].push(props); }
    
    setDatabase(updated);
    setWatchList({ props: updated[id].data, id });
    return;
  }
  
  function removeItemFromList(id, header, category) {
    let old = Object.assign({}, database);
    let filtered = old[category].data[header].filter((item) => {
      return item.id_key !== id;
    });
    old[category].data[header] = filtered;
    setDatabase(old);
  }
  
  function removeFromHeader(prop, id) {
    let old = Object.assign({}, database);
    let pls = old[id].export.reduce((acc, current) => {
      if (current.file.basename === prop.file.basename) {
        return acc;
      }
      acc.push(current);
      return acc;
    }, []);
    old[id].export = pls;
    setShipping(database[id]?.export ?? []);
    setDatabase(old);
    setOrphan(checkFolder(userFolderPath, test2.current));
    return;
  }
  
  async function addToExports(id) {
    let filePath = `./USER/${uuidv4()}.${config.exportFileType.label}`;
    let lists = watchedList?.props ?? [];
    let result = await saveFileSync(filePath, lists, 4);
    
    // console.log("Result:", result);
    
    let old = Object.assign({}, database);
    if (!old[id].export) old[id].export = [];
    
    old[id].export.push(result);
    setDatabase(old);
    return;
  }
  
  function removeFromExports(prop, id) {
    let old = Object.assign({}, database);
    let filtered = old[id].export.filter((item) => {
      if (prop.file.basename === item.file.basename) {
        removeFile(prop.file.relative)
          .then(event => {
            // console.log(event);
          })
          .catch(err => {
            console.log(err);
          });
      }
      return prop.file.basename !== item.file.basename;
    });
    old[id].export = filtered;
    setShipping(filtered);
    setDatabase(old);
    return;
  }
  
  function changeConfig(prop) {
    setConfig(prop);
  }
  
  function apiCall(text, cb) {
    let returnValue = Api(config.ApiCalls.label, text);
    cb(returnValue);
  }
  
  async function searchCache(id, caching) {
    let old = cache;
    
    if (old[id]) { console.log("exists in Cache"); return old[id]; }
    
    console.log("Doesn't exists in Cache");
    // JESSUS SO BAD FIX PLSSSSSSS
    
    // await (async () => {
    //   let got = await fetch(caching.img);
    //   let data = await got.blob();
    // 
    //   return await new Promise(function(resolve, reject) {
    //     let reader = new FileReader();
    //     reader.addEventListener('loadend', (event) => {
    //       caching.img[0] = reader.result;
    //       old[id] = caching;
    //       // setCache({...old});
    //       resolve(caching);
    //     });
    //     reader.readAsDataURL(data);
    //   });
    // })();
    // 
    // console.log(caching);
    
    old[id] = caching;
    setCache(old);
    return caching;
  }
  
  useEffect(() => {
    setOrphan(checkFolder(userFolderPath, test2.current));
    return;
  }, [userFolderPath]);
  
  // Update Cache
  useEffect(() => {
    saveFileSync(cachePath, cache, 4)
    .then(event => {
      // console.log(event);
    })
    .catch(e => { console.log(e); })
    return;
  }, [ cachePath, cache ]);
  
  // Update lists in the file
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    else {
      test2.current = database;
      saveFileSync(jsonFileName, database, 4)
        .then((event) => {
          // console.log(event);
          // console.log("Success");
        })
        .catch(e => {
          console.log(e)
          console.log("Failed");
        });
    }
  }, [ jsonFileName, database ]);
  
  // Updating config
  useEffect(() => {
    saveFileSync(defaultConfigPath, config, 4)
      .then(event => {
        // console.log(event);
      })
      .catch(e => {
        console.log(e);
      });
  }, [ defaultConfigPath, config ]);
  
  const callbacks = {
    changeScene,
    removeScene,
    addScene,
    removeTitle,
    updateLists,
    removeItemFromList,
    removeFromHeader,
    addToExports,
    removeFromExports,
    changeConfig,
    apiCall,
    searchCache 
  }
  
  const propsForElement = {
    callbackParent: callbacks,
    "data-inherit": watchedList,
    config: config,
    export: shipping,
  }
  
  return (
    <div className="App">
      <div className="App-header">
        {/* <Clock/> */}
        <Configure callbackParent={callbacks} data-inherit={config}/>
        {
          switchScene 
            ? <Home callbackParent={callbacks} data-inherit={database}/>
            : {
                normal: <Scene {...propsForElement}/>,
                weeb: <Weeb {...propsForElement}/>
              }[config.mode.label]
        }
        {
          orphan.length ?
          switchScene 
          ? (
            <Category detail={{
            category_title: "Exports without Category",
            loop: orphan.slice(0),
            list: orphan.slice(0).map(item => ({ title: item.file.basename })),
            select: (
              Object.keys(database).map((v, k) => ({ label: database[v].meta.title }))
            ),
            buttons: [
              {
                label: "Add",
                customData: { "data-save": "this" },
                event: {
                  onClick: (event) => {
                    let element = event.target.previousElementSibling.value;
                    let old = Object.assign({}, database);
                    
                    let item = JSON.parse(event.target.getAttribute("data-save"));
                    
                    Object.keys(old).map((v, k) => {
                      if (old[v].meta.title === element) {
                        old[v].export.push(item);
                        let filtered = orphan.filter((current) => {
                           return item.file.basename !== current.file.basename;
                        });
                        setOrphan(filtered);
                      }
                      return "";
                    });
                    setDatabase(old);
                  }
                }
              },
              {
                label: "Delete",
                customData: { "data-save": "this" },
                event: {
                  onClick: (event) => {
                    let item = JSON.parse(event.target.getAttribute("data-save"));
                    
                    let old = orphan.slice(0).reduce((acc, current) => {
                      if (current.file.basename === item.file.basename) return acc;
                      acc.push(current);
                      return acc; 
                    }, []);
                    setOrphan(old);
                    removeFile(item.file.relative);
                  }
                }
              }
            ]
            }}/>
            )
          : ""
          : ""
      }
      </div>
    </div>
  );
}