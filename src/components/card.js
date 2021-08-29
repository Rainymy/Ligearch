import React from "react";
import "../CSS/card.css";

export default function Card(props) {
  
  let { id: key , data } = props["data-to-child"];
  
  function removeScene() {
    props.callbackParent.removeScene(key);
    return;
  }
  
  function openScene() {
    if (data.isLink) {
      if (data.path.relative) {
        console.log("Get it from the relative path");
        return;
      }
      if (data.path.absolute) {
        console.log("Get it from the absolute path");
        return;
      }
    }
    
    if (typeof data.data !== "object" && !Array.isArray(data.data)) {
      props.callbackParent.changeScene(JSON.parse(data.data), key);
    }
    props.callbackParent.changeScene(data.data, key);
    return;
  }
  
  function rand() {
    return Math.floor(Math.random() * 10e5).toString();
  }
  
  let totals = 0;
  for (let category in data.data) {
    totals += data.data[category].length;
  };
  
  return (
    <div key={rand()} className="card">
      <h3>{ data.meta.title }</h3>
      <div>
        categories:
        {
          " " + Object.keys(data.data ?? []).length
        }
        <br/>
        totals:
        {
          " " + totals
        }
      </div>
      <div>
        <button onClick={openScene}>Open</button>
        <button onClick={removeScene}>Remove</button>
      </div>
    </div>
  );
}