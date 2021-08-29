import React from "react"; 
import { v4 as uuidv4 } from "uuid";

export default function Category(props) {
  
  if (!props?.detail) { return ""; }
  
  let {
    buttons, category_title, list, loop, category_buttons, 
    select, selectEvent
  } = props.detail;
  
  return (
    <div className="category">
      <div>
        <div className="category-title">
          <span>
            {
              category_title.length 
                ? category_title
                : (
                    <i>Untiteled</i>
                  )
            }
          </span>
          {
            category_buttons?.map((item) => {
              return (
                <button {...item.event} key={uuidv4()}>
                  {
                    item.label
                  }
                </button>
              )
            })
          }
        </div>
        {
          list?.map((v, k) => {
            return (
              <li className="theList" key={uuidv4()}>  
                <span className="list-number">{ k + 1 }</span>
                <span className="textMargin">
                  {
                    v.title ?? "Title" 
                  }
                </span>
                {
                  select?.length
                  ? (
                      <select {...selectEvent} key={uuidv4()}>
                        {
                          select?.map((item, k) => {
                            return (
                              <option key={uuidv4()} value={item.value}>
                                { item.label }
                              </option>
                            )
                          })
                        }
                      </select>
                    )
                  : ""
                }
                {
                  buttons?.map((button, index) => {
                    let custom;
                    
                    for (let item in button?.customData) {
                      if (button?.customData[item] === "this") {
                        custom = {
                          [item]: JSON.stringify(loop[k])
                        }
                      }
                    }
                    
                    return (
                      <button {...custom} {...button.event} key={uuidv4()}>
                        {
                          button.label
                        }
                      </button>
                    )
                  })
                }
                
              </li>
            )
          }) ?? "Empty"
        }
      </div>
    </div>
  )
}