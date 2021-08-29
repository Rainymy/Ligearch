import React from "react";
import Card from "./card";
import AddCard from "./addCard";
import "../CSS/home.css";

export default function Home(props) { 
  
  // console.log(props);
  return (
    <div className="homepage">
      {/* <Card callbackParent={props.callbackParent.changeScene}/> */}
      {
        Object.entries(props["data-inherit"]).map( (values, index) => {
          // console.log(values[1]);
          return <Card key={values[0]} 
                       data-to-child={ {
                         "id": values[0],
                         "data": values[1]
                       } } 
                       callbackParent={props.callbackParent}/>
        })
      }
      
      <AddCard callbackParent={props.callbackParent.addScene}/>
    </div>
  );
}