import React, { useState } from "react";
import "../CSS/fileDrop.css";

import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

import convert from "../addons/convert";

export default function FileDrop(props) {
  let file;
  let [ preview, setPreview ] = useState({});
  let [ wrongFile, setWrongFile ] = useState(false);
  
  function diffFileType(fileType) {
    let acceptedFiles = [
      "text/plain",
      "application/json"
    ]
    
    for (let acceptedFile of acceptedFiles) {
      if (acceptedFile === fileType) return acceptedFile;
    }
    return "";
  }
  
  async function readObjFile(fileObject, flags) {
    return new Promise(function(resolve, reject) {
      let reader = new FileReader();
      reader.readAsText(fileObject, ["utf-8"]);
    
      reader.onerror = function () {
        console.error(reader.error);
        reject(reader.error);
      };
      
      reader.onload = function () {
        if (flags.type === "text" || flags.type === "json") {
          resolve(convert(reader.result));
        }
      };
    });
  }
  
  function isLists(lists) {
    for (let list of lists) { if (uuidValidate(list)) return true; }
    return false;
  }
  
  async function validateFile(remove) {
    if (!file?.type || !diffFileType(file?.type) || remove) {
      setPreview({});
      return false;
    }
    let result = await readObjFile(file, { type: "text" });
    
    if (diffFileType(file.type) === "application/json" ) {
      // check for parseable data by checking key value with uuid.
      // if key value is not uuid then exit.
      if (isLists(Object.keys(result))) {
        setPreview({});
        return false;
      }
    }
    setPreview(result);
    return true;
  }
  
  function inputChange(event) {
    file = event.target.files[0];
    validateFile(file ? false: true)
      .then((event) => {
        // console.log("Event Value:", event);
        if (!event) {
          setWrongFile(!wrongFile);
          return;
        }
        setWrongFile(false);
      })
      .catch(e => {
        setWrongFile(e);
    });
    // console.log(isValid);
  }
  
  function removeItomFromTheList(index, category) {
    let old = Object.assign({}, preview);
    delete old[Object.keys(old)[category]][index];
    setPreview(old);
  }
  
  function apply(isCancel) {
    if (isCancel) {
      setPreview({});
      return;
    }
    Object.keys(preview).map((v, k) => {
      return preview[v].map((item, index) => {
        if (!item.hasOwnProperty("id_key")) {
          item["id_key"] = uuidv4();
        };
        props.callbackParent.updateLists(item, v, props.category_id);
        // console.log(props.callbackParent.updateLists);
        return "";
      });
    });
    setPreview({});
  }
  
  function onSubmit(event) {
    event.preventDefault();
    setWrongFile(false);
    event.target.reset();
  }
  
  function clickViaId(event) {
    let id = event.target.getAttribute("for");
    let element = document.querySelector("#" + id);
    element.click();
  }
  
  return (
    <div className="fileDropZone">
      <div>
        <div>
          Import
          <form onSubmit={onSubmit}>
            <input onChange={inputChange} accept=".json,.txt" type="file"/>
            <input id="test123" type="submit" style={{ opacity: "50%" }}/>
          </form>
          
          <button onClick={(event) => {
            clickViaId(event);
            apply();
          }} htmlFor="test123">Apply</button>
          
          <button onClick={(event) => {
            clickViaId(event);
            apply(true);
          }} htmlFor="test123">Cancel</button>
          
        </div>
        {
          wrongFile
            ? <div>
                Wrong file type/not parseable.
                {
                  typeof wrongFile !== "boolean"
                    ? wrongFile
                    : ""
                }
              </div>
            : ""
        }
        {
          Object.values(preview).map((category, i) => {
            return category.map((item, index) => {
              return (
                <div key={uuidv4()}>
                  { item.title_name }
                  <button onClick={() => {
                    removeItomFromTheList(index, i);
                  }}>Delete</button>
                </div>
              );
            });
          })
        }
      </div>
    </div>
  )
}