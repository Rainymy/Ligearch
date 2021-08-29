import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import AddToList from "./addToList";
import FileDrop from "./fileDrop";
import Category from "./category";

import "../CSS/textList.css";

export default function Scene(props) {
  
  let [ inputValues, setInputValues ] = useState("");
  let [ header, setHeader ] = useState("");
  // let [ ship, setShip ] = useState(props.export);
  
  let lists = props["data-inherit"].props ?? [];
  let id = props["data-inherit"].id;
  let ship = props.export;
  
  function switchScene() {
    return props.callbackParent.changeScene();
  }
  
  function setCurrentValue(event) {
    return setInputValues(event.target.value.trim());
  }
  
  function setHeaderValue(value) {
    return setHeader(value);
  }
  
  function shipOut() {
    props.callbackParent.addToExports(id);
  }
  
  function removeItemFromExport(event) {
    let element = event.target.getAttribute("data-save");
    let parsed = JSON.parse(element);
    props.callbackParent.removeFromExports(parsed, id);
  }
  
  function removeItemFromHeader(event) {
    let element = event.target;
    let data = JSON.parse(element.getAttribute("data-save"));
    props.callbackParent.removeFromHeader(data, id);
  }
  
  function addToList(item) {
    console.log(item);
    const temp = {
      combinedLength_in_normal_EP: null,
      title_name: item?.title ?? inputValues,
      total_episode: 69420,
      total_movie: null,
      id_key: uuidv4()
    }
    
    props.callbackParent.updateLists(temp, header, id);
  }
  
  function removeTitle(title) {
    props.callbackParent.removeTitle(title, id);
  }
  
  const cb = {
    setHeaderValue,
    setCurrentValue,
    addToList,
    searchCache: props.callbackParent.searchCache,
    apiCall: props.callbackParent.apiCall
  }
  
  return (
    <div className="asd">
      <div className="nav">
        <div>
          <button onClick={switchScene}>Back</button>
        </div>
        <div>
          <button onClick={shipOut}>Export</button>
        </div>
      </div>
      <div>
        Category:
        {
          header.length ? " " + header : (<i> Untitled </i>)
        }
      </div>
      <div>
        Title: 
        {
          inputValues.length ? " " + inputValues : (<i> Untitled</i>)
        }
      </div>
      <AddToList cb={cb} lists={lists}/>
      
      {
        Object.values(lists).map((category, index) => {
          let title = Object.keys(lists)[index];
          return (
            <Category key={uuidv4()} detail={{
              category_title: title.split("_").join(" "),
              category_buttons: [
                {
                  label: "Collapse",
                  event: {
                    onClick: (event) => {
                      let root = event.target.parentNode.parentNode;
                      root.querySelectorAll("li").forEach((item, i) => {
                        if (item.style.display !== "none") {
                          item.style.display = "none";
                        }
                        else { item.style.display = ""; }
                      });
                    }
                  }
                },
                {
                  label: "Delete",
                  event: { onClick: (event) => removeTitle(title) }
                }
              ],
              list: category.slice(0).map(item => ({ title: item.title_name })),
              buttons: [
                {
                  label: "Delete",
                  event: {
                    onClick: (event) => {
                      let parent = event.target.parentNode;
                      let element = parent.querySelector(".list-number");
                      let j = parseInt(element.textContent) - 1;
                      let id_key = category[j].id_key;
                      
                      props.callbackParent.removeItemFromList(id_key, title, id)
                    }
                  }
                }
              ]
            }}/>
          )
        })
      }
      <FileDrop callbackParent={props.callbackParent} category_id={id} />
      <Category detail={{
        category_title: "Exports",
        loop: ship,
        list: ship.slice(0).map(item => ({ title: item.file.basename })),
        buttons: [
          {
            label: "Delete",
            customData: { "data-save": "this" },
            event: { onClick: (event) => removeItemFromExport(event) }
          },
          {
            label: "Open",
            customData: { "data-save": "this" },
            event: { onClick: (event) => console.log("Empty for now") }
          },
          {
            label: "Remove",
            customData: { "data-save": "this" },
            event: { onClick: (event) => removeItemFromHeader(event) }
          }
        ]
      }} />
    </div>
  );
}