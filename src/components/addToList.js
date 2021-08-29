import React, { useState } from "react";
import Creatable from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";

export default function AddToList(props) {
  
  let [ titleList, setTitleList ] = useState({ show: false, data: [] });
  
  function setHeaderValue(event) {
    let value = event?.value ?? "";
    props.cb.setHeaderValue(value);
  }
  
  function setCurrentValue(event) {
    let text = event.target.value.trim();
    // Code below must send.
    props.cb.setCurrentValue(event);
    
    if (!text.length) {
      titleList.show = titleList.show ? !titleList.show: false;
      setTitleList(titleList);
      return;
    }
    // Code below must NOT send.
    props.cb.apiCall(text, async (event) => {
      // Callback for API call. Then add element to selectable title.
      let lists = await event;
      // console.log(lists);
      if (!lists) { return; }
      
      for (let i = 0; i < lists.length; i++) {
        lists[i] = await props.cb.searchCache(lists[i].link, lists[i]);
      }
      
      setTitleList({ show: true, data: lists });
    });
  }
  
  function addToList(content) {
    // This function is hard defined. Make it dynamic.
    props.cb.addToList(content);
  }
  
  let newObj = Object.keys(props.lists).reduce((v, k) => {
    if (k.length) {
      v.push({
        value: k,
        label: k.split("_").join(" ") 
      });
    }
    return v;
  }, []);
  
  const customStyles = {
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? 'white' : 'blue',
        boxShadow: "0 0 5px -1px black",
      }
    },
    control: (_, { selectProps: { width }}) => {
      return {
        width: width ?? 300,
        display: "flex",
        backgroundColor: "white",
        color: "black"
      }
    },
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 1000ms';
      return { ...provided, opacity, transition };
    }
  }
  // console.log(ref.current);
  // console.log(document.activeElement);
  return (
    <div className="addToList">
      <div>
        <div style={{ width: "100%" }}>
          <Creatable styles={customStyles} 
            isClearable
            onChange={setHeaderValue}
            width="100%" options={newObj}
          />
        </div>
        
        <input onChange={setCurrentValue}
          onFocus={ (event) => {
            if (!event.target.value.length) {
              return;
            }
            setTitleList({ show: true, data: titleList.data });
          } }
          placeholder="Title..." type="text"/>
        <button onClick={() => addToList()}>Add</button>
      </div>
      {
        titleList.show
        ? (
          <div className="search-overlay">
            <button onClick={ () => {
              setTitleList({ show: false, data: titleList.data });
            } }>X</button>
            {
              titleList.data.map(item => {
                return (
                  <div key={uuidv4()}>
                    <span style={{ backgroundImage: `url(${item.img[0]})` }}>
                      {/* <img src={item.img} /> */}
                    </span>
                    <div style={{ width: "100%" }}>
                      <div>
                        {
                          item.title
                        }
                      </div>
                      <div>
                        <i>
                          {
                            item.releaseDate
                          }
                        </i>
                      </div>
                    </div>
                    <div style={{ margin: "auto" }}>
                      <button onClick={() => addToList(item)}>Add</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
        : ""
      }
    </div>
  )
}