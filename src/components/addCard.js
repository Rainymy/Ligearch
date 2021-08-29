import React from "react";
import "../CSS/card.css";

import { v4 as uuidv4 } from 'uuid';

export default function addCard(props) {
  
  function parse(event) {
    let element = event.target.parentNode.querySelector("input[name='title']");
    
    if (element.value.length === 0) { return; }
    
    const randomId = uuidv4(); 
    
    props.callbackParent({
      [randomId]: {
        path: {
          relative: null,
          absolute: null
        },
        export: [],
        meta: {
          img: null,
          title: element.value,
          background: null
        },
        isLink: false,
        data: null
      }
    }, randomId);
  }
  
  return (
    <div className="card">
      <label>
        Title
        <input name="title" type="text"/>
      </label>
      <button onClick={parse}>Add</button>
    </div>
  );
}