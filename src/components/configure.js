import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "../CSS/config.css";

export default function Configure(props) {
  
  let data = props["data-inherit"];
  let temp = { ...data };
  let [ overlay, setOverlay ] = useState(false);
  
  function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  
  function onChange(event, category) {
    // console.log(event.target.value, category);
    if (Array.isArray(temp[category])) {
      return;
    }
    temp[category].label = event.target.value;
    
    if (Array.isArray(temp[category])) {
      return;
    }
    temp[category].options.splice(0, 0, temp[category].label);
    let index = temp[category].options.lastIndexOf(temp[category].label);
    temp[category].options.splice(index, 1);
  }
  
  function htmlSelect(prop, category) {
    
    return (
      <select onChange={(event) => onChange(event, category)}>
        {
          prop.map((item, index) => {
            return (
              <option value={item} key={uuidv4()}>
                {
                  capitalize(item).toUpperCase()
                }
              </option>
            );
          })
        }
      </select>
    )
  }
  
  function keyValues(data, v, category) {
    if (Array.isArray(data[v])) { return htmlSelect(data[v], category); }
    if (data[v]?.options) { return htmlSelect(data[v].options, category); }
    return (
      <div>
        {
          capitalize(data[v].label) 
        }
      </div>
    );
  }
  
  function submitConfig() {
    let old = Object.assign({}, data);
    props.callbackParent.changeConfig(old);
  }
  
  function changeToOverlay() {
    setOverlay(!overlay);
  }
  
  function overlayUI() {
    return (
      <div className="overlay">
        Settings
        <div className="overlay-back" onClick={changeToOverlay}/>
        <div className="inner-overlay">
          {
            Object.keys(data).map((v, k) => {
              let currentTitle = capitalize(v);
              let letters = currentTitle.match(/[A-Z]/g);
              
              for (let i = 0; i < letters.length; i++) {
                currentTitle = currentTitle.replace(letters[i], " " + letters[i]);
              }
              
              return (
                <div key={uuidv4()}>
                  <div className="text-right">
                    {
                      currentTitle + ": "
                    }
                  </div>
                  <div className="text-left">
                    {
                      keyValues(data, v, Object.keys(data)[k])
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <button onClick={changeToOverlay}>
          Back
        </button>
        <button onClick={submitConfig}>
          Apply
        </button>
      </div>
    )
  }
  
  return (
    <div className="homepage">
      {
        overlay 
          ? overlayUI()
          : (
            <button onClick={changeToOverlay}>
              Settings
            </button>
          )
      }
    </div>
  );
} 